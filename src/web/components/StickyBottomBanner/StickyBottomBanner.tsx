import React, { useState } from 'react';
import { cmp } from '@guardian/consent-management-platform';

import {
	canShow as canShowRRBanner,
	ReaderRevenueBanner,
} from '@root/src/web/components/StickyBottomBanner/ReaderRevenueBanner';
import { getAlreadyVisitedCount } from '@root/src/web/lib/alreadyVisited';
import { useOnce } from '@root/src/web/lib/useOnce';
import {
	pickMessage,
	SlotConfig,
	MaybeFC,
	CandidateConfig,
} from '@root/src/web/lib/messagePicker';
import type { BrazeMessagesInterface } from '@guardian/braze-components/logic';
import { BrazeBanner, canShow as canShowBrazeBanner } from './BrazeBanner';

type Props = {
	isSignedIn?: boolean;
	asyncCountryCode?: Promise<string | void>;
	CAPI: CAPIBrowserType;
	brazeMessages?: Promise<BrazeMessagesInterface>;
};

const getBannerLastClosedAt = (key: string): string | undefined => {
	const item = localStorage.getItem(`gu.prefs.${key}`) as undefined | string;

	if (item) {
		const parsedItem = JSON.parse(item) as { [key: string]: any };
		return parsedItem.value;
	}
};

const DEFAULT_BANNER_TIMEOUT_MILLIS = 2000;

const buildCmpBannerConfig = (): CandidateConfig => ({
	candidate: {
		id: 'cmpUi',
		canShow: () =>
			cmp
				.willShowPrivacyMessage()
				.then((result) => ({ result: !!result })),
		show: () => {
			// New CMP is not a react component and is shown outside of react's world
			// so render nothing if it will show
			return null;
		},
	},
	timeoutMillis: null,
});

const buildReaderRevenueBannerConfig = (
	CAPI: CAPIBrowserType,
	isSignedIn: boolean,
	asyncCountryCode: Promise<string>,
): CandidateConfig => {
	return {
		candidate: {
			id: 'reader-revenue-banner',
			canShow: () =>
				canShowRRBanner({
					remoteBannerConfig: CAPI.config.remoteBanner,
					isSignedIn,
					asyncCountryCode,
					contentType: CAPI.contentType,
					sectionName: CAPI.sectionName,
					shouldHideReaderRevenue: CAPI.shouldHideReaderRevenue,
					isMinuteArticle: CAPI.pageType.isMinuteArticle,
					isPaidContent: CAPI.pageType.isPaidContent,
					isSensitive: CAPI.config.isSensitive,
					tags: CAPI.tags,
					contributionsServiceUrl: CAPI.contributionsServiceUrl,
					alreadyVisitedCount: getAlreadyVisitedCount(),
					engagementBannerLastClosedAt: getBannerLastClosedAt(
						'engagementBannerLastClosedAt',
					),
					subscriptionBannerLastClosedAt: getBannerLastClosedAt(
						'subscriptionBannerLastClosedAt',
					),
				}),
			/* eslint-disable-next-line react/jsx-props-no-spreading */
			show: (meta: any) => () => <ReaderRevenueBanner {...meta} />,
		},
		timeoutMillis: DEFAULT_BANNER_TIMEOUT_MILLIS,
	};
};

const buildBrazeBanner = (
	brazeMessages: Promise<BrazeMessagesInterface>,
): CandidateConfig => ({
	candidate: {
		id: 'braze-banner',
		canShow: () => canShowBrazeBanner(brazeMessages),
		show: (meta: any) => () => <BrazeBanner meta={meta} />,
	},
	timeoutMillis: DEFAULT_BANNER_TIMEOUT_MILLIS,
});

export const StickyBottomBanner = ({
	isSignedIn,
	asyncCountryCode,
	CAPI,
	brazeMessages,
}: Props) => {
	const [SelectedBanner, setSelectedBanner] = useState<React.FC | null>(null);

	useOnce(() => {
		const CMP = buildCmpBannerConfig();
		const readerRevenue = buildReaderRevenueBannerConfig(
			CAPI,
			isSignedIn as boolean,
			asyncCountryCode as Promise<string>,
		);
		const brazeBanner = buildBrazeBanner(
			brazeMessages as Promise<BrazeMessagesInterface>,
		);
		const bannerConfig: SlotConfig = {
			candidates: [CMP, readerRevenue, brazeBanner],
			name: 'banner',
		};

		pickMessage(bannerConfig)
			.then((PickedBanner: () => MaybeFC) =>
				setSelectedBanner(PickedBanner),
			)
			.catch((e) =>
				console.error(`StickyBottomBanner pickMessage - error: ${e}`),
			);
	}, [isSignedIn, asyncCountryCode, CAPI, brazeMessages]);

	if (SelectedBanner) {
		return <SelectedBanner />;
	}

	return null;
};
