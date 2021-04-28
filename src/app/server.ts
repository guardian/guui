import * as path from 'path';
import express, { Request, Response } from 'express';
import fetch from 'node-fetch';
import responseTime from 'response-time';

import compression from 'compression';

import { port, siteName, statik } from '@root/scripts/frontend/config';
import { log, warn } from '@root/scripts/env/log';
import {
	render as renderAMPArticle,
	renderPerfTest as renderAMPArticlePerfTest,
} from '@root/src/amp/server/render';
import {
	render as renderArticle,
	renderPerfTest as renderArticlePerfTest,
} from '@root/src/web/server/render';

import {
	getGuardianConfiguration,
	GuardianConfiguration,
} from './aws/aws-parameters';
import { recordBaselineCloudWatchMetrics } from './aws/metrics-baseline';
import { logger } from './logging';

// this export is the function used by webpackHotServerMiddleware in /scripts/frontend-dev-server
export default (options: any) => {
	if ('amp' in options) {
		return renderAMPArticle;
	}

	return renderArticle;
};

const buildUrlFromQueryParam = (req: Request) => {
	// Supports urls such as:
	// http://localhost:9000/Article?url=https://www.theguardian.com/commentisfree/2020/feb/08/hungary-now-for-the-new-right-what-venezuela-once-was-for-the-left
	// Note. This is the same as how dev-server.js works
	const DEFAULT_URL =
		'https://www.theguardian.com/money/2017/mar/10/ministers-to-criminalise-use-of-ticket-tout-harvesting-software';
	const query = req.query as { url?: string } | undefined;
	const url = new URL((query && query.url) || DEFAULT_URL);
	// searchParams will only work for the first set of query params because 'url' is already a query param itself
	const searchparams = url.searchParams && url.searchParams.toString();
	// Reconstruct the parsed url adding .json?dcr which we need to force dcr to return json
	return `${url.origin}${url.pathname}.json?dcr=true&${searchparams}`;
};

// Middleware to track route performance using 'response-time' lib
// Usage: app.post('/Article', logRenderTime, renderArticle);
const logRenderTime = responseTime(
	(req: Request, _: Response, time: number) => {
		// eslint-disable-next-line prefer-destructuring
		const body: CAPIType = req.body;
		logger.info({
			pageId: body.pageId,
			renderTime: time,
		});
	},
);

// this is the actual production server
if (process.env.NODE_ENV === 'production') {
	logger.info('dotcom-rendering is GO.');

	if (process.env.DISABLE_LOGGING_AND_METRICS !== 'true') {
		getGuardianConfiguration('prod')
			.then((config: GuardianConfiguration) => {
				log(`loaded ${config.size()} configuration parameters`);
			})
			.catch((err: any) => {
				warn('Failed to get configuration. Bad AWS credentials?');
				warn(err);
			});
	}

	const app = express();

	app.use(express.json({ limit: '50mb' }));
	app.use(compression());

	app.get('/_healthcheck', (req: Request, res: Response) => {
		res.status(200).send('OKAY');
	});

	// if running prod server locally, serve local assets
	if (!process.env.GU_PUBLIC) {
		app.use(
			`/static/${siteName}`,
			express.static(path.relative(__dirname, statik)),
		);
		app.use('/assets', express.static(__dirname));
	}

	app.post('/Article', logRenderTime, renderArticle);
	app.post('/AMPArticle', logRenderTime, renderAMPArticle);

	app.get('/Article', logRenderTime, async (req: Request, res: Response) => {
		// Eg. http://localhost:9000/Article?url=https://www.theguardian.com/commentisfree/...
		try {
			const url = buildUrlFromQueryParam(req);
			const { html, ...config } = await fetch(url).then((article) =>
				article.json(),
			);

			req.body = config;
			return renderArticle(req, res);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
		}
	});

	app.get(
		'/AMPArticle',
		logRenderTime,
		async (req: Request, res: Response) => {
			// Eg. http://localhost:9000/AMPArticle?url=https://www.theguardian.com/commentisfree/...
			try {
				const url = buildUrlFromQueryParam(req);
				const { html, ...config } = await fetch(url).then((article) =>
					article.json(),
				);

				req.body = config;
				return renderAMPArticle(req, res);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error);
			}
		},
	);

	app.use('/ArticlePerfTest', renderArticlePerfTest);
	app.use('/AMPArticlePerfTest', renderAMPArticlePerfTest);

	app.get('/', (req: Request, res: Response) => {
		try {
			res.send(`
                <!DOCTYPE html>
                <html>
                <body>
                    <ul>
                        <li><a href="/Article">Article</a></li>
                        <li><a href="/AMPArticle">⚡️Article</a></li>
                        <li><a href="/ArticlePerfTest">⚡Article (perf test example)</a></li>
                        <li><a href="/AMPArticlePerfTest">⚡️Article (perf test example)</a></li>
                    </ul>
                    <ul>
                        <li><a href="/ArticlePerfTest">⚡Article (perf test example)</a></li>
                        <li><a href="/AMPArticlePerfTest">⚡️Article (perf test example)</a></li>
                    </ul>
                </body>
                </html>
            `);
		} catch (e) {
			const error = e as Error;
			res.status(500).send(`<pre>${error.stack}</pre>`);
		}
	});

	// express requires all 4 args here:
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	app.use((e: any, req: any, res: Response, next: any) => {
		const error = e as Error;
		res.status(500).send(`<pre>${error.stack}</pre>`);
	});

	if (process.env.DISABLE_LOGGING_AND_METRICS !== 'true') {
		setInterval(() => {
			recordBaselineCloudWatchMetrics();
		}, 10 * 1000);
	}

	app.listen(port);
	// eslint-disable-next-line no-console
	console.log(`Started production server on port ${port}\nready`);
}
