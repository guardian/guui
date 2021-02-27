import express from 'express';
import { extractNAV } from '@root/src/model/extract-nav';

import { document } from '@root/src/web/server/document';
import { validateAsCAPIType } from '@root/src/model/validate';
import { addDividers } from '@root/src/model/add-dividers';
import { setIsDev } from '@root/src/model/set-is-dev';
import { enhancePhotoEssay } from '@root/src/model/enhance-photoessay';
import { enhanceBlockquotes } from '@root/src/model/enhance-blockquotes';
import { extract as extractGA } from '@root/src/model/extract-ga';
import { bodyJSON } from '@root/src/model/exampleBodyJSON';

class CAPIEnhancer {
	capi: CAPIType;

	constructor(capi: CAPIType) {
		this.capi = capi;
	}

	addDividers() {
		this.capi = addDividers(this.capi);
		return this;
	}

	enhancePhotoEssay() {
		this.capi = enhancePhotoEssay(this.capi);
		return this;
	}

	enhanceBlockquotes() {
		this.capi = enhanceBlockquotes(this.capi);
		return this;
	}

	validateAsCAPIType() {
		this.capi = validateAsCAPIType(this.capi);
		return this;
	}

	setIsDev() {
		this.capi = setIsDev(this.capi);
		return this;
	}
}

export const render = (
	{ body }: express.Request,
	res: express.Response,
): void => {
	try {
		const CAPI = new CAPIEnhancer(body)
			.validateAsCAPIType()
			.addDividers()
			.enhanceBlockquotes()
			.enhancePhotoEssay().capi;

		const resp = document({
			data: {
				CAPI,
				site: 'frontend',
				page: 'Article',
				NAV: extractNAV(CAPI.nav),
				GA: extractGA(CAPI),
				linkedData: CAPI.linkedData,
			},
		});

		res.status(200).send(resp);
	} catch (e) {
		const error = e as Error;
		res.status(500).send(
			`<pre>${error.stack || `Unknown error: ${error.message}`}</pre>`,
		);
	}
};

export const renderPerfTest = (
	req: express.Request,
	res: express.Response,
): void => {
	req.body = JSON.parse(bodyJSON);
	render(req, res);
};
