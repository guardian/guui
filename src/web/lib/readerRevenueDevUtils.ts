import {
	setCountryCode,
	getCountryCode,
} from '@root/src/web/lib/getCountryCode';
import {
	HIDE_SUPPORT_MESSAGING_COOKIE,
	RECURRING_CONTRIBUTOR_COOKIE,
	SUPPORT_ONE_OFF_CONTRIBUTION_COOKIE,
	SUPPORT_RECURRING_CONTRIBUTOR_ANNUAL_COOKIE,
	SUPPORT_RECURRING_CONTRIBUTOR_MONTHLY_COOKIE,
} from '@root/src/web/lib/contributions';
import {
	addCookie,
	getCookie,
	removeCookie,
} from '@root/src/web/browser/cookie';
import { setAlreadyVisited } from '@root/src/web/lib/alreadyVisited';

const readerRevenueCookies = [
	HIDE_SUPPORT_MESSAGING_COOKIE,
	RECURRING_CONTRIBUTOR_COOKIE,
	SUPPORT_RECURRING_CONTRIBUTOR_MONTHLY_COOKIE,
	SUPPORT_RECURRING_CONTRIBUTOR_ANNUAL_COOKIE,
	SUPPORT_ONE_OFF_CONTRIBUTION_COOKIE,
];

const clearEpicViewLog = (): void =>
	localStorage.removeItem('gu.contributions.views');
const clearBannerLastClosedAt = (): void =>
	localStorage.removeItem('engagementBannerLastClosedAt');

const fakeOneOffContributor = (): void =>
	addCookie(SUPPORT_ONE_OFF_CONTRIBUTION_COOKIE, Date.now().toString());

const MULTIVARIATE_ID_COOKIE = 'GU_mvt_id';
const MAX_CLIENT_MVT_ID = 1000000;
const incrementMvtCookie = (): void => {
	const mvtId = parseInt(getCookie(MULTIVARIATE_ID_COOKIE) || '1', 10);
	if (mvtId) {
		if (mvtId === MAX_CLIENT_MVT_ID) {
			// Wrap back to 1 if it would exceed the max
			addCookie(MULTIVARIATE_ID_COOKIE, '1');
		} else {
			addCookie(MULTIVARIATE_ID_COOKIE, `${mvtId + 1}`);
		}
	}
};
const decrementMvtCookie = (): void => {
	const mvtId = parseInt(getCookie(MULTIVARIATE_ID_COOKIE) || '1', 10);
	if (mvtId) {
		if (mvtId === 0) {
			// Wrap back to max if it would be less than 0
			addCookie(MULTIVARIATE_ID_COOKIE, MAX_CLIENT_MVT_ID.toString());
		} else {
			addCookie(MULTIVARIATE_ID_COOKIE, `${mvtId - 1}`);
		}
	}
};

const clearCommonReaderRevenueStateAndReload = (
	asExistingSupporter: boolean,
	shouldHideReaderRevenue: boolean,
): void => {
	if (shouldHideReaderRevenue) {
		/* eslint-disable no-alert */
		alert(
			'This page has "Prevent membership/contribution appeals" ticked in Composer. Please try a different page',
		);
		/* eslint-enable no-alert */
		return;
	}

	readerRevenueCookies.forEach((cookie) => removeCookie(cookie));
	clearEpicViewLog();

	if (asExistingSupporter) {
		fakeOneOffContributor();
	}

	window.location.reload();
};

const showMeTheEpic = (
	asExistingSupporter: boolean = false,
	shouldHideReaderRevenue: boolean,
): void => {
	clearCommonReaderRevenueStateAndReload(
		asExistingSupporter,
		shouldHideReaderRevenue,
	);
};

const showMeTheBanner = (
	asExistingSupporter: boolean = false,
	shouldHideReaderRevenue: boolean,
): void => {
	clearBannerLastClosedAt();
	setAlreadyVisited(2);
	clearCommonReaderRevenueStateAndReload(
		asExistingSupporter,
		shouldHideReaderRevenue,
	);
};

const showNextVariant = (
	asExistingSupporter: boolean = false,
	shouldHideReaderRevenue: boolean,
): void => {
	incrementMvtCookie();
	clearCommonReaderRevenueStateAndReload(
		asExistingSupporter,
		shouldHideReaderRevenue,
	);
};

const showPreviousVariant = (
	asExistingSupporter: boolean = false,
	shouldHideReaderRevenue: boolean,
): void => {
	decrementMvtCookie();
	clearCommonReaderRevenueStateAndReload(
		asExistingSupporter,
		shouldHideReaderRevenue,
	);
};

const changeGeolocation = (
	asExistingSupporter: boolean = false,
	shouldHideReaderRevenue: boolean,
): void => {
	getCountryCode()
		.then((current) => {
			/* eslint-disable no-alert */
			const geo = window.prompt(
				`Enter two-letter geolocation code (e.g. GB, US, AU). Current is ${
					current || 'undefined'
				}.`,
			);
			if (geo === 'UK') {
				alert(
					`'UK' is not a valid geolocation - please use 'GB' instead!`,
				);
			} else if (geo) {
				setCountryCode(geo);
				clearCommonReaderRevenueStateAndReload(
					asExistingSupporter,
					shouldHideReaderRevenue,
				);
			}
			/* eslint-enable no-alert */
		})
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		.catch((e) => console.error(`changeGeolocation - error: ${e}`));
};

type ReaderRevenueDevUtil = (
	asExistingSupporter: boolean,
	shouldHideReaderRevenue: boolean,
) => void;
export interface ReaderRevenueDevUtils {
	changeGeolocation: ReaderRevenueDevUtil;
	showMeTheEpic: ReaderRevenueDevUtil;
	showMeTheBanner: ReaderRevenueDevUtil;
	showNextVariant: ReaderRevenueDevUtil;
	showPreviousVariant: ReaderRevenueDevUtil;
}

const getForcedVariant = (type: 'epic' | 'banner'): string | null => {
	if (URLSearchParams) {
		const params = new URLSearchParams(window.location.search);
		const value = params.get(`force-${type}`);
		if (value) {
			return value;
		}
	}

	return null;
};

export {
	changeGeolocation,
	showMeTheEpic,
	showMeTheBanner,
	showNextVariant,
	showPreviousVariant,
	getForcedVariant,
};
