import React from 'react';

import { CacheProvider } from '@emotion/react';
import { renderToString } from 'react-dom/server';
import createEmotionServer from '@emotion/server/create-instance';
import createCache from '@emotion/cache';

import { escapeData } from '@root/src/lib/escapeData';
import {
	CDN,
	getScriptArrayFromFilename,
	getScriptArrayFromChunkName,
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

const key = 'custom';
const cache = createCache({ key });
// eslint-disable-next-line @typescript-eslint/unbound-method
const { extractCritical } = createEmotionServer(cache);

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
		{
			chunkName: 'elements-InteractiveBlockComponent',
			addWhen:
				'model.dotcomrendering.pageElements.InteractiveBlockElement',
		},
	];
	// We want to only insert script tags for the elements or main media elements on this page view
	// so we need to check what elements we have and use the mapping to the the chunk name
	const CAPIElements: CAPIElement[] = CAPI.blocks
		.map((block) => block.elements)
		.flat();
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

	let arrayOfLoadableScriptObjects: {
		src: string;
		legacy: boolean;
	}[] = [];

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
	//

	const preAssets: {
		filename: string;
		scriptType: string;
		chunk: string;
		url: string;
		path: string;
		type: string;
		linkType: string;
	}[] =
		// PreAssets is *undocumented* and not in TS types. It returns the webpack asset for each script.
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		loadableExtractor.getPreAssets();

	preAssets.forEach((script) => {
		arrayOfLoadableScriptObjects = [
			...arrayOfLoadableScriptObjects,
			...getScriptArrayFromFilename(script.filename),
		];
	});

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

	const pageHasNonBootInteractiveElements = CAPIElements.some(
		(element) =>
			element._type ===
				'model.dotcomrendering.pageElements.InteractiveBlockElement' &&
			element.scriptUrl !==
				'https://interactive.guim.co.uk/embed/iframe-wrapper/0.1/boot.js', // We have rewritten this standard behaviour into Dotcom Rendering
	);

	function isDefined<T>(argument: T | boolean): argument is T {
		return argument !== false;
	}
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
			...getScriptArrayFromChunkName('ophan'),
			CAPI.config && { src: CAPI.config.commercialBundleUrl },
			...getScriptArrayFromChunkName('sentryLoader'),
			...getScriptArrayFromChunkName('coreVitals'),
			...getScriptArrayFromChunkName('dynamicImport'),
			pageHasNonBootInteractiveElements && {
				src: `${CDN}static/frontend/js/curl-with-js-and-domReady.js`,
			},
			...arrayOfLoadableScriptObjects, // This includes the 'react' entry point
		].filter(isDefined), // We use the TypeGuard to keep TS happy
	);

	/**
	 * Low priority scripts. These scripts will be requested
	 * asynchronously after the main HTML has been parsed. Execution
	 * order is not guaranteed. It is even possible that these execute
	 * *before* the high priority scripts, although this is very
	 * unlikely.
	 */
	const lowPriorityScriptTags = generateScriptTags([
		...getScriptArrayFromChunkName('lotame'),
		...getScriptArrayFromChunkName('atomIframe'),
		...getScriptArrayFromChunkName('embedIframe'),
		...getScriptArrayFromChunkName('newsletterEmbedIframe'),
	]);

	const gaChunk = getScriptArrayFromChunkName('ga');
	const modernScript = gaChunk.filter(
		(script) => script && script.legacy === false,
	)[0];
	const legacyScript = gaChunk.filter(
		(script) => script && script.legacy === true,
	)[0];
	const gaPath = {
		modern: modernScript.src,
		legacy: legacyScript.src,
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
