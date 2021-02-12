import React from 'react';
import { extractCritical } from 'emotion-server';
import { renderToString } from 'react-dom/server';
import { cache } from 'emotion';
import { CacheProvider } from '@emotion/core';

import { escapeData } from '@root/src/lib/escapeData';
import {
	getScriptArrayFromFilename,
	getByChunkName,
	loadableManifestJson,
} from '@root/src/lib/assets';

import { makeWindowGuardian } from '@root/src/model/window-guardian';
import { ChunkExtractor } from '@loadable/server';
import { DecideLayout } from '../layouts/DecideLayout';
import { htmlTemplate } from './htmlTemplate';

interface RenderToStringResult {
	html: string;
	css: string;
	ids: string[];
}

const generateScriptTags = (
	scripts: Array<{ src: string; legacy?: boolean }>,
) =>
	scripts.reduce((scriptTags, script) => {
		let attrs = 'defer';

		if (Object.prototype.hasOwnProperty.call(script, 'legacy')) {
			attrs = script.legacy ? 'defer nomodule' : 'type="module"';
		}

		return [
			...scriptTags,
			`<script ${attrs} src="${script.src}"></script>`,
		];
	}, [] as string[]);

interface Props {
	data: DCRServerDocumentData;
}

export const document = ({ data }: Props): string => {
	const { CAPI, NAV, linkedData } = data;
	const title = `${CAPI.headline} | ${CAPI.sectionLabel} | The Guardian`;
	const { html, css, ids: cssIDs }: RenderToStringResult = extractCritical(
		renderToString(
			// TODO: CacheProvider can be removed when we've moved over to using @emotion/core
			<CacheProvider value={cache}>
				<React.StrictMode>
					<DecideLayout CAPI={CAPI} NAV={NAV} />
				</React.StrictMode>
			</CacheProvider>,
		),
	);

	// There are docs on loadable in ./docs/loadable-components.md
	const loadableExtractor = new ChunkExtractor({
		stats: loadableManifestJson,
		entrypoints: ['react'],
	});

	// The lodable-components docs want us to use extractor.collectChunks() but
	// we don't have the traditional same <App /> rendered on server and client.
	// Our data structure is vastly different (CAPIType vs CAPIBrowserType) and
	// our architecture expects src/web/App to be client-side only, therefore
	// it is difficult for us to use collectChunks to automatically extract the
	// component splits that we want.
	// However, this does actually suit our architecture as we can use the CAPI
	// component reference.
	const allChunks: LoadableComponents = [
		{ chunkName: 'EditionDropdown', addWhen: 'always' },
		{
			chunkName: 'elements-YoutubeBlockComponent',
			addWhen: 'model.dotcomrendering.pageElements.YoutubeBlockElement',
		},
		{
			chunkName: 'elements-RichLinkComponent',
			addWhen: 'model.dotcomrendering.pageElements.RichLinkBlockElement',
		},
	];
	// We want to only insert script tags for the elements or main media elements on this page view
	// so we need to check what elements we have and use the mapping to the the chunk name
	const CAPIElements: CAPIElement[] = CAPI.blocks[0]
		? CAPI.blocks[0].elements
		: [];
	const { mainMediaElements } = CAPI;
	// Filter the chunks defined above by whether
	// the 'addWhen' value is 'always' or matches
	// any elements in the body or main media element
	// arrays for the page request.
	const chunksForPage = allChunks.filter((chunk) =>
		[...CAPIElements, ...mainMediaElements].some(
			(block) =>
				chunk.addWhen === 'always' || block._type === chunk.addWhen,
		),
	);
	// Once we have the chunks for the page, we can add them directly to the loadableExtractor
	chunksForPage.forEach((chunk) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		loadableExtractor.addChunk(chunk.chunkName); // addChunk is *undocumented* and not in TS types. It allows manually adding chunks to extractor.
	});
	// Pass the array of extracted (read: built with addChunk) scripts to
	// generatedScriptTags so that we can build a script tag array of
	// modern and legacy scripts.
	const arrayOfLoadableScriptObjects: {
		src: string;
		module: boolean;
	}[] = loadableExtractor
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		.getPreAssets() // PreAssets is *undocumented* and not in TS types. It returns the webpack asset for each script.
		// Pre assets returns an array of objects structured as:
		// {
		//     filename: 'elements-RichLinkComponent.js',
		//     scriptType: 'script',
		//     chunk: 'elements-RichLinkComponent',
		//     url: '/elements-RichLinkComponent.js',
		//     path: '/Users/gareth_trufitt/code/dotcom-rendering/dist/elements-RichLinkComponent.js',
		//     type: 'mainAsset',
		//     linkType: 'preload'
		// }
		.reduce(
			(scriptArr: [], script: { filename: string }) => [
				...scriptArr,
				...getScriptArrayFromFilename(script.filename),
			],
			[],
		);

	// Loadable generates configuration script elements as the first two items
	// of the script element array. We need to generate the react component version
	// and then build an array of them, rendering them to string and grabbing
	// the first two items. The alternative getScriptTags just returns a string
	// of scripts tags already concatenated, so is not useful in this scenario.
	const loadableConfigScripts = loadableExtractor
		.getScriptElements()
		.map((script) => renderToString(script))
		.slice(0, 2);

	/**
	 * Preload the following woff2 font files
	 * TODO: Identify critical fonts to preload
	 */
	const fontFiles = [
		// 'https://assets.guim.co.uk/static/frontend/fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Light.woff2',
		// 'https://assets.guim.co.uk/static/frontend/fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-LightItalic.woff2',
		'https://assets.guim.co.uk/static/frontend/fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Medium.woff2',
		'https://assets.guim.co.uk/static/frontend/fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-MediumItalic.woff2',
		'https://assets.guim.co.uk/static/frontend/fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Bold.woff2',
		'https://assets.guim.co.uk/static/frontend/fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Regular.woff2',
		// 'https://assets.guim.co.uk/static/frontend/fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-RegularItalic.woff2',
		'https://assets.guim.co.uk/static/frontend/fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Bold.woff2',
		'https://assets.guim.co.uk/static/frontend/fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-Regular.woff2',
		// 'http://assets.guim.co.uk/static/frontend/fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-RegularItalic.woff2',
		'https://assets.guim.co.uk/static/frontend/fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-Bold.woff2',
	];

	const polyfillIO =
		'https://assets.guim.co.uk/polyfill.io/v3/polyfill.min.js?rum=0&features=es6,es7,es2017,es2018,es2019,default-3.6,HTMLPictureElement,IntersectionObserver,IntersectionObserverEntry,fetch,NodeList.prototype.forEach&flags=gated&callback=guardianPolyfilled&unknown=polyfill&cacheClear=1';

	/**
	 * The highest priority scripts.
	 * These scripts have a considerable impact on site performance.
	 * Only scripts critical to application execution may go in here.
	 * Please talk to the dotcom platform team before adding more.
	 * Scripts will be executed in the order they appear in this array
	 */
	const priorityScriptTags = generateScriptTags(
		[
			{ src: polyfillIO },
			...getByChunkName('ophan'),
			CAPI.config && { src: CAPI.config.commercialBundleUrl },
			...getByChunkName('sentryLoader'),
			...getByChunkName('dynamicImport'),
			...getByChunkName('coreVitals'),
			...arrayOfLoadableScriptObjects, // This includes the 'react' entry point
		].filter(Boolean),
	);

	/**
	 * Low priority scripts. These scripts will be requested
	 * asynchronously after the main HTML has been parsed. Execution
	 * order is not guaranteed. It is even possible that these execute
	 * *before* the high priority scripts, although this is very
	 * unlikely.
	 */
	const lowPriorityScriptTags = generateScriptTags([
		...getByChunkName('lotame'),
		...getByChunkName('atomIframe'),
		...getByChunkName('embedIframe'),
		...getByChunkName('newsletterEmbedIframe'),
	]);

	const gaChunk = getByChunkName('ga');
	const gaPath = {
		modern: gaChunk.filter((script) => script.legacy === false)[0].src,
		legacy: gaChunk.filter((script) => script.legacy === true)[0].src,
	};

	/**
	 * We escape windowGuardian here to prevent errors when the data
	 * is placed in a script tag on the page
	 */
	const windowGuardian = escapeData(
		JSON.stringify(makeWindowGuardian(data, cssIDs)),
	);

	const ampLink = `https://amp.theguardian.com/${data.CAPI.pageId}`;

	const { openGraphData } = CAPI;
	const { twitterData } = CAPI;
	const keywords =
		typeof CAPI.config.keywords === 'undefined' ||
		CAPI.config.keywords === 'Network Front'
			? ''
			: CAPI.config.keywords;

	return htmlTemplate({
		linkedData,
		loadableConfigScripts,
		priorityScriptTags,
		lowPriorityScriptTags,
		css,
		html,
		fontFiles,
		title,
		description: CAPI.trailText,
		windowGuardian,
		gaPath,
		ampLink,
		openGraphData,
		twitterData,
		keywords,
	});
};
