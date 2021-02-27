import { getCLS, getFID, getLCP } from 'web-vitals';
import { getCookie } from './cookie';

interface TrackerConfig {
	name: string;
	id: string;
	sampleRate: number;
	siteSpeedSampleRate: number;
}

const tracker: TrackerConfig = {
	name: 'allEditorialPropertyTracker',
	id: 'UA-78705427-1',
	sampleRate: 100,
	siteSpeedSampleRate: 1, // TODO Should be set to 0.1 when rolling out to wider audience
};
const set = `${tracker.name}.set`;
const send = `${tracker.name}.send`;

const getQueryParam = (
	key: string,
	queryString: string,
): string | undefined => {
	const params = queryString.substring(1).split('&');
	const pairs = params.map((x) => x.split('='));

	return pairs
		.filter((xs) => xs.length === 2 && xs[0] === key)
		.map((xs) => xs[1])[0];
};

export const init = (): void => {
	const coldQueue = (...args: any[]) => {
		(window.ga.q = window.ga.q || []).push(args);
	};

	window.ga = window.ga || (coldQueue as UniversalAnalytics.ga);

	window.GoogleAnalyticsObject = 'ga';
	window.ga.l = +new Date();

	window.ga('create', tracker.id, 'auto', tracker.name, {
		sampleRate: tracker.sampleRate,
		siteSpeedSampleRate: tracker.siteSpeedSampleRate,
	});
};

type CoreVitalsArgsType = {
	name: string;
	delta: number;
	id: string;
};

// https://www.npmjs.com/package/web-vitals#using-analyticsjs
const sendCoreVital = ({ name, delta, id }: CoreVitalsArgsType): void => {
	const { ga } = window;

	if (!ga) {
		return;
	}

	ga(send, 'event', {
		eventCategory: 'Web Vitals',
		eventAction: name,
		// Google Analytics metrics must be integers, so the value is rounded.
		// For CLS the value is first multiplied by 1000 for greater precision
		// (note: increase the multiplier for greater precision if needed).
		eventValue: Math.round(name === 'CLS' ? delta * 1000 : delta),
		// The `id` value will be unique to the current page load. When sending
		// multiple values from the same page (e.g. for CLS), Google Analytics can
		// compute a total by grouping on this ID (note: requires `eventLabel` to
		// be a dimension in your report).
		eventLabel: id,
		// Use a non-interaction event to avoid affecting bounce rate.
		nonInteraction: true,
	});
};

export const sendPageView = (): void => {
	const { GA } = window.guardian.app.data;
	const userCookie = getCookie('GU_U');
	const { ga } = window;

	ga(set, 'forceSSL', true);
	ga(set, 'title', GA.webTitle);
	ga(set, 'anonymizeIp', true);
	/** *************************************************************************************
	 * Custom dimensions common to all platforms across the whole Guardian estate          *
	 ************************************************************************************** */
	ga(set, 'dimension3', 'theguardian.com'); /* Platform */
	/** *************************************************************************************
	 * Custom dimensions for 'editorial' platforms (this site, the mobile apps, etc.)      *
	 * Some of these will be undefined for non-content pages, but that's fine.             *
	 ************************************************************************************** */
	ga(set, 'dimension4', GA.section);
	ga(set, 'dimension5', GA.contentType);
	ga(set, 'dimension6', GA.commissioningDesks);
	ga(set, 'dimension7', GA.contentId);
	ga(set, 'dimension8', GA.authorIds);
	ga(set, 'dimension9', GA.keywordIds);
	ga(set, 'dimension10', GA.toneIds);
	ga(set, 'dimension11', GA.seriesId);
	ga(set, 'dimension16', (userCookie && 'true') || 'false');
	ga(set, 'dimension21', getQueryParam('INTCMP', window.location.search)); // internal campaign code
	ga(set, 'dimension22', getQueryParam('CMP_BUNIT', window.location.search)); // campaign business unit
	ga(set, 'dimension23', getQueryParam('CMP_TU', window.location.search)); // campaign team
	ga(set, 'dimension26', GA.isHosted);
	ga(set, 'dimension27', navigator.userAgent); // I bet you a pint
	ga(set, 'dimension29', window.location.href); // That both of these are already tracked.
	ga(set, 'dimension30', GA.edition);

	// TODO: sponsor logos
	// ga(set, 'dimension31', GA.sponsorLogos);

	// TODO: commercial branding
	// ga(set, 'dimension42', 'GA.brandingType');

	ga(set, 'dimension43', 'dotcom-rendering');
	ga(set, 'dimension50', GA.pillar);

	if (window.location.hash === '#fbLogin') {
		ga(set, 'referrer', null);
		window.location.hash = '';
	}

	try {
		const NG_STORAGE_KEY = 'gu.analytics.referrerVars';
		const referrerVarsData = window.sessionStorage.getItem(NG_STORAGE_KEY);
		const referrerVars: { [key: string]: any } = JSON.parse(
			referrerVarsData || '{}',
		);
		if (referrerVars.value) {
			const value = referrerVars.value as {
				time: number;
				tag: string;
				path: string;
			};
			const d = new Date().getTime();
			if (d - value.time < 60 * 1000) {
				// One minute
				ga(send, 'event', 'Click', 'Internal', value.tag, {
					nonInteraction: true, // to avoid affecting bounce rate
					dimension12: value.path,
				});
			}
			window.sessionStorage.removeItem(NG_STORAGE_KEY);
		}
	} catch (e) {
		// do nothing
	}

	ga(send, 'pageview', {
		hitCallback() {
			const image = new Image();
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			image.src = `${GA.beaconUrl}/count/pvg.gif`;
		},
	});

	// //////////////////////
	// Core Vitals Reporting
	// Supported only in Chromium but npm module tested in all our supported browsers
	// https://www.npmjs.com/package/web-vitals#browser-support

	// Only send for roughly 5% of users
	// We want all or nothing on the corevitals so that they can be easily compared for a single pageview
	// so we do this here rather than in the sendCoreVital function
	const randomPerc = Math.random() * 100;
	const coreVitalsSampleRate = 5;

	if (coreVitalsSampleRate >= randomPerc) {
		// CLS and LCP are captured when the page lifecycle changes to 'hidden'.
		// https://developers.google.com/web/updates/2018/07/page-lifecycle-api#advice-hidden
		getCLS(sendCoreVital); // https://github.com/GoogleChrome/web-vitals#getcls (This is actually DCLS, as doesn't track CLS in iframes, see https://github.com/WICG/layout-instability#cumulative-scores)
		getLCP(sendCoreVital); // https://github.com/GoogleChrome/web-vitals#getlcp

		// FID is captured when a user interacts with the page
		getFID(sendCoreVital); // https://github.com/GoogleChrome/web-vitals#getfid
	}
};

export const trackNonClickInteraction = (actionName: string): void => {
	const { ga } = window;

	if (ga) {
		ga(send, 'event', 'Interaction', actionName, {
			/**
			 * set nonInteraction to avoid affecting bounce rate
			 * https://support.google.com/analytics/answer/1033068#NonInteractionEvents
			 */
			nonInteraction: true,
		});
	} else {
		const error = new Error("window.ga doesn't exist");
		window.guardian.modules.sentry.reportError(
			error,
			'trackNonClickInteraction',
		);
	}
};

export const trackPerformance = (
	timingCategory: string,
	timingVar: any,
	timingLabel: string,
): void => {
	const { ga } = window;

	if (!ga) {
		return;
	}

	if (window.performance && window.performance.now) {
		ga(
			send,
			'timing',
			timingCategory,
			timingVar,
			Math.round(window.performance.now()),
			timingLabel,
		);
	}
};

export const trackVideoInteraction = ({
	trackingEvent,
	elementId,
}: {
	trackingEvent: string;
	elementId: string;
}) => {
	const { ga } = window;

	if (!ga) {
		return;
	}

	ga(send, 'event', {
		eventCategory: 'media',
		eventAction: 'video content',
		eventLabel: `${trackingEvent}:${elementId}`,
		dimension19: elementId,
	});
};
