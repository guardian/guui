import validator from 'amphtml-validator';
import React from 'react';
import { Article as CAPI } from '@root/fixtures/articles/Article';
import { Article } from '@root/src/amp/pages/Article';
import { extractNAV } from '@root/src/model/extract-nav';
import { AnalyticsModel } from '@root/src/amp/components/Analytics';
import { document } from './document';

test('rejects invalid AMP doc (to test validator)', async () => {
	const v = await validator.getInstance();
	const linkedData = [{}];
	const metadata = { description: '', canonicalURL: '' };
	const result = v.validateString(
		document({
			linkedData,
			metadata,
			title: 'foo',
			scripts: [''],
			body: <img alt="foo" />,
		}),
	);
	expect(result.errors.length > 0).toBe(true);
});

// TODO failing because fixture still models blocks as nested array of elements
// rather than a list of Block(s) - that are objects with 'id' and 'elements'
// fields. This then errors in Elements.tsx.
test('produces valid AMP doc', async () => {
	const v = await validator.getInstance();
	const { config } = CAPI;
	const nav = extractNAV(CAPI.nav);
	const { linkedData } = CAPI;

	const metadata = {
		description: CAPI.trailText,
		canonicalURL: CAPI.webURL,
	};

	const analytics: AnalyticsModel = {
		gaTracker: 'UA-XXXXXXX-X',
		title: 'Foo',
		fbPixelaccount: 'XXXXXXXXXX',
		comscoreID: 'XXXXXXX',
		section: CAPI.sectionName,
		contentType: CAPI.contentType,
		id: CAPI.pageId,
		beacon: `${CAPI.beaconURL}/count/pv.gif`,
		neilsenAPIID: 'XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXX',
		domain: 'amp.theguardian.com',
		permutive: {
			namespace: 'guardian',
			apiKey: '42-2020',
			payload: {
				'properties.content.title': 'article title',
			},
		},
		ipsosSectionName: 'section',
	};

	const body = (
		<Article
			experimentsData={{}}
			nav={nav}
			articleData={{
				...CAPI,
				shouldHideReaderRevenue: false,
			}}
			config={config}
			analytics={analytics}
		/>
	);

	const result = v.validateString(
		document({
			body,
			linkedData,
			metadata,
			title: 'foo',
			scripts: [],
		}),
	);

	if (result.errors.length > 0) {
		// eslint-disable-next-line no-console
		console.log(result.errors);
	}
	expect(result.errors.length).toBe(0);
});
