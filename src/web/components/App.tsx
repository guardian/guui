import React, { useState, useEffect, Suspense } from 'react';
import loadable from '@loadable/component';
import { useAB } from '@guardian/ab-react';
import { tests } from '@frontend/web/experiments/ab-tests';
import { ShareCount } from '@frontend/web/components/ShareCount';
import { MostViewedFooter } from '@frontend/web/components/MostViewed/MostViewedFooter/MostViewedFooter';
import { ReaderRevenueLinks } from '@frontend/web/components/ReaderRevenueLinks';
import { SlotBodyEnd } from '@root/src/web/components/SlotBodyEnd/SlotBodyEnd';
import { Links } from '@frontend/web/components/Links';
import { SubNav } from '@frontend/web/components/SubNav/SubNav';
import { GetMatchNav } from '@frontend/web/components/GetMatchNav';
import { Discussion } from '@frontend/web/components/Discussion';
import { StickyBottomBanner } from '@root/src/web/components/StickyBottomBanner/StickyBottomBanner';
import { SignInGateSelector } from '@root/src/web/components/SignInGate/SignInGateSelector';

import { incrementWeeklyArticleCount } from '@guardian/automat-client';
import {
	QandaAtom,
	GuideAtom,
	ProfileAtom,
	TimelineAtom,
	ChartAtom,
	PersonalityQuizAtom,
	KnowledgeQuizAtom,
} from '@guardian/atoms-rendering';

import { AudioAtomWrapper } from '@frontend/web/components/AudioAtomWrapper';

import { Portal } from '@frontend/web/components/Portal';
import { HydrateOnce } from '@frontend/web/components/HydrateOnce';
import { Lazy } from '@frontend/web/components/Lazy';
import { Placeholder } from '@root/src/web/components/Placeholder';

import { decideTheme } from '@root/src/web/lib/decideTheme';
import { decideDisplay } from '@root/src/web/lib/decideDisplay';
import { decideDesign } from '@root/src/web/lib/decideDesign';
import { loadScript } from '@root/src/web/lib/loadScript';
import { useOnce } from '@root/src/web/lib/useOnce';
import { initPerf } from '@root/src/web/browser/initPerf';
import { getCookie, addCookie } from '@root/src/web/browser/cookie';
import { getLocaleCode } from '@frontend/web/lib/getCountryCode';
import { getUser } from '@root/src/web/lib/getUser';

import { FocusStyleManager } from '@guardian/src-foundations/utils';
import { Display, Design } from '@guardian/types';
import type { Format, CountryCode } from '@guardian/types';
import { incrementAlreadyVisited } from '@root/src/web/lib/alreadyVisited';
import { incrementDailyArticleCount } from '@frontend/web/lib/dailyArticleCount';
import { hasOptedOutOfArticleCount } from '@frontend/web/lib/contributions';
import { ReaderRevenueDevUtils } from '@root/src/web/lib/readerRevenueDevUtils';
import { buildAdTargeting } from '@root/src/lib/ad-targeting';
import { getSharingUrls } from '@root/src/lib/sharing-urls';

import {
	cmp,
	onConsentChange,
	getConsentFor,
} from '@guardian/consent-management-platform';
import { injectPrivacySettingsLink } from '@root/src/web/lib/injectPrivacySettingsLink';
import { updateIframeHeight } from '@root/src/web/browser/updateIframeHeight';
import { ClickToView } from '@root/src/web/components/ClickToView';
import { LabsHeader } from '@root/src/web/components/LabsHeader';

import type { BrazeMessagesInterface } from '@guardian/braze-components/logic';
import { OphanRecordFunction } from '@guardian/ab-core/dist/types';
import { ConsentState } from '@guardian/consent-management-platform/dist/types';
import {
	submitComponentEvent,
	OphanComponentEvent,
} from '../browser/ophan/ophan';
import { trackPerformance } from '../browser/ga/ga';
import { decidePalette } from '../lib/decidePalette';
import { buildBrazeMessages } from '../lib/braze/buildBrazeMessages';
import { CommercialMetrics } from './CommercialMetrics';

// *******************************
// ****** Dynamic imports ********
// *******************************

const EditionDropdown = loadable(
	() => import('@frontend/web/components/EditionDropdown'),
	{
		resolveComponent: (module) => module.EditionDropdown,
	},
);

const MostViewedRightWrapper = React.lazy(() => {
	const { start, end } = initPerf('MostViewedRightWrapper');
	start();
	return import(
		/* webpackChunkName: "MostViewedRightWrapper" */ '@frontend/web/components/MostViewed/MostViewedRight/MostViewedRightWrapper'
	).then((module) => {
		end();
		return { default: module.MostViewedRightWrapper };
	});
});
const OnwardsUpper = React.lazy(() => {
	const { start, end } = initPerf('OnwardsUpper');
	start();
	return import(
		/* webpackChunkName: "OnwardsUpper" */ '@frontend/web/components/Onwards/OnwardsUpper'
	).then((module) => {
		end();
		return { default: module.OnwardsUpper };
	});
});
const OnwardsLower = React.lazy(() => {
	const { start, end } = initPerf('OnwardsLower');
	start();
	return import(
		/* webpackChunkName: "OnwardsLower" */ '@frontend/web/components/Onwards/OnwardsLower'
	).then((module) => {
		end();
		return { default: module.OnwardsLower };
	});
});
const GetMatchStats = React.lazy(() => {
	const { start, end } = initPerf('GetMatchStats');
	start();
	return import(
		/* webpackChunkName: "GetMatchStats" */ '@frontend/web/components/GetMatchStats'
	).then((module) => {
		end();
		return { default: module.GetMatchStats };
	});
});

type Props = {
	CAPI: CAPIBrowserType;
	NAV: BrowserNavType;
	ophanRecord: OphanRecordFunction;
};

export const App = ({ CAPI, NAV, ophanRecord }: Props) => {
	const [isSignedIn, setIsSignedIn] = useState<boolean>();
	const [user, setUser] = useState<UserProfile | null>();
	const [countryCode, setCountryCode] = useState<string>();
	// This is an async version of the countryCode state value defined above.
	// This can be used where you've got logic which depends on countryCode but
	// don't want to block on it becoming available, as you would with the
	// non-async version (this is the case in the banner picker where some
	// banners need countryCode but we don't want to block all banners from
	// executing their canShow logic until countryCode is available):
	const [asyncCountryCode, setAsyncCountryCode] = useState<
		Promise<CountryCode | null>
	>();

	const [brazeMessages, setBrazeMessages] = useState<
		Promise<BrazeMessagesInterface>
	>();

	const pageViewId = window.guardian?.config?.ophan?.pageViewId;
	const [browserId, setBrowserId] = useState<string | undefined>(undefined);
	useOnce(() => {
		// TODO: can the browserId actually be null?
		setBrowserId(getCookie('bwid') ?? undefined);
	}, []);

	const componentEventHandler = (
		componentType: any,
		id: any,
		action: any,
	) => () => {
		const componentEvent: OphanComponentEvent = {
			component: {
				componentType,
				id,
				products: [],
				labels: [],
			},
			action,
		};
		submitComponentEvent(componentEvent, ophanRecord);
	};

	// *******************************
	// ** Setup AB Test Tracking *****
	// *******************************
	const ABTestAPI = useAB();
	useEffect(() => {
		const allRunnableTests = ABTestAPI.allRunnableTests(tests);
		ABTestAPI.trackABTests(allRunnableTests);
		ABTestAPI.registerImpressionEvents(allRunnableTests);
		ABTestAPI.registerCompleteEvents(allRunnableTests);
	}, [ABTestAPI]);

	useEffect(() => {
		setIsSignedIn(!!getCookie('GU_U'));
	}, []);

	useOnce(() => {
		// useOnce means this code will only run once isSignedIn is defined, and only
		// run one time
		if (isSignedIn) {
			getUser(CAPI.config.discussionApiUrl)
				.then((theUser) => {
					if (theUser) setUser(theUser);
				})
				.catch((e) => console.error(`getUser - error: ${e}`));
		} else {
			setUser(null);
		}
	}, [isSignedIn, CAPI.config.discussionApiUrl]);

	useEffect(() => {
		const callFetch = () => {
			const countryCodePromise = getLocaleCode();
			setAsyncCountryCode(countryCodePromise);
			countryCodePromise
				.then((cc) => setCountryCode(cc || ''))
				.catch((e) =>
					console.error(`countryCodePromise - error: ${e}`),
				);
		};
		callFetch();
	}, []);

	useEffect(() => {
		incrementAlreadyVisited();
	}, []);

	// Log an article view using the Slot Machine client lib
	// This function must be called once per article serving.
	// We should monitor this function call to ensure it only happens within an
	// article pages when other pages are supported by DCR.
	useEffect(() => {
		const incrementArticleCountsIfConsented = async () => {
			const hasOptedOut = await hasOptedOutOfArticleCount();
			if (!hasOptedOut) {
				incrementDailyArticleCount();
				incrementWeeklyArticleCount();
			}
		};
		incrementArticleCountsIfConsented().catch((e) =>
			console.error(`incrementArticleCountsIfConsented - error: ${e}`),
		);
	}, []);

	// AnniversaryAtom
	// Add a cookie for the serverside A/B test that is checked to see if we should
	// show the anniversary atom. This means that this user will not see the atom
	// on the next and following page views.
	useEffect(() => {
		if (CAPI.config.switches.anniversaryArticleHeader) {
			addCookie('X-GU-Experiment-0perc-D', 'true', 2); // 2 days to live means that the atom will show when the switch is on Wednesday AND Saturday
		}
	});

	// Ensure the focus state of any buttons/inputs in any of the Source
	// components are only applied when navigating via keyboard.
	// READ: https://www.theguardian.design/2a1e5182b/p/6691bb-accessibility/t/32e9fb
	useEffect(() => {
		FocusStyleManager.onlyShowFocusOnTabs();
	}, []);

	useEffect(() => {
		// Used internally only, so only import each function on demand
		const loadAndRun = <K extends keyof ReaderRevenueDevUtils>(key: K) => (
			asExistingSupporter: boolean,
		) =>
			import(
				/* webpackChunkName: "readerRevenueDevUtils" */ '@frontend/web/lib/readerRevenueDevUtils'
			)
				.then((utils) =>
					utils[key](
						asExistingSupporter,
						CAPI.shouldHideReaderRevenue,
					),
				)
				/* eslint-disable no-console */
				.catch((error) =>
					console.log('Error loading readerRevenueDevUtils', error),
				);
		/* eslint-enable no-console */

		if (window && window.guardian) {
			window.guardian.readerRevenue = {
				changeGeolocation: loadAndRun('changeGeolocation'),
				showMeTheEpic: loadAndRun('showMeTheEpic'),
				showMeTheBanner: loadAndRun('showMeTheBanner'),
				showNextVariant: loadAndRun('showNextVariant'),
				showPreviousVariant: loadAndRun('showPreviousVariant'),
			};
		}
	}, [CAPI.shouldHideReaderRevenue]);

	// kick off the CMP...
	useEffect(() => {
		// the UI is injected automatically into the page,
		// and is not a react component, so it's
		// handled in here.
		if (CAPI.config.switches.consentManagement && countryCode) {
			const pubData = {
				platform: 'next-gen',
				browserId,
				pageViewId,
			};
			injectPrivacySettingsLink(); // manually updates the footer DOM because it's not hydrated

			// keep this in sync with CONSENT_TIMING in static/src/javascripts/boot.js in frontend
			// mark: CONSENT_TIMING
			let recordedConsentTime = false;
			onConsentChange(() => {
				if (!recordedConsentTime) {
					recordedConsentTime = true;
					cmp.willShowPrivacyMessage()
						.then((willShow) => {
							trackPerformance(
								'consent',
								'acquired',
								willShow ? 'new' : 'existing',
							);
						})
						.catch((e) =>
							console.error(
								`CMP willShowPrivacyMessage - error: ${e}`,
							),
						);
				}
			});

			cmp.init({
				country: countryCode,
				pubData,
			});
		}
	}, [
		countryCode,
		CAPI.config.switches.consentManagement,
		pageViewId,
		browserId,
	]);

	// ************************
	// *   Google Analytics   *
	// ************************
	useEffect(() => {
		onConsentChange((state: ConsentState) => {
			const consentGiven = getConsentFor('google-analytics', state);
			if (consentGiven) {
				Promise.all([
					loadScript('https://www.google-analytics.com/analytics.js'),
					loadScript(window.guardian.gaPath),
				]).catch((e) => console.error(`GA - error: ${e}`));
			} else {
				// We should never be able to directly set things to the global window object.
				// But in this case we want to stub things for testing, so it's ok to ignore this rule
				// @ts-ignore
				window.ga = null;
			}
		});
	}, []);

	const display: Display = decideDisplay(CAPI.format);
	const design: Design = decideDesign(CAPI.format);
	const pillar: Theme = decideTheme(CAPI.format);

	useOnce(() => {
		setBrazeMessages(
			buildBrazeMessages(isSignedIn as boolean, CAPI.config.idApiUrl),
		);
	}, [isSignedIn, CAPI.config.idApiUrl]);

	const format: Format = {
		display,
		design,
		theme: pillar,
	};
	const palette = decidePalette(format);

	const adTargeting: AdTargeting = buildAdTargeting(CAPI.config);

	// There are docs on loadable in ./docs/loadable-components.md
	const YoutubeBlockComponent = loadable(
		() => {
			if (
				CAPI.elementsToHydrate.filter(
					(element) =>
						element._type ===
						'model.dotcomrendering.pageElements.YoutubeBlockElement',
				).length > 0
			) {
				return import(
					'@frontend/web/components/elements/YoutubeBlockComponent'
				);
			}
			return Promise.reject();
		},
		{
			resolveComponent: (module) => module.YoutubeBlockComponent,
		},
	);

	const RichLinkComponent = loadable(
		() => {
			if (
				CAPI.elementsToHydrate.filter(
					(element) =>
						element._type ===
						'model.dotcomrendering.pageElements.RichLinkBlockElement',
				).length > 0
			) {
				return import(
					'@frontend/web/components/elements/RichLinkComponent'
				);
			}
			return Promise.reject();
		},
		{
			resolveComponent: (module) => module.RichLinkComponent,
		},
	);

	const InteractiveBlockComponent = loadable(
		() => {
			if (
				CAPI.elementsToHydrate.filter(
					(element) =>
						element._type ===
						'model.dotcomrendering.pageElements.InteractiveBlockElement',
				).length > 0
			) {
				return import(
					'@frontend/web/components/elements/InteractiveBlockComponent'
				);
			}
			return Promise.reject();
		},
		{
			resolveComponent: (module) => module.InteractiveBlockComponent,
		},
	);

	const InteractiveContentsBlockElement = loadable(
		() => {
			if (
				CAPI.elementsToHydrate.filter(
					(element) =>
						element._type ===
						'model.dotcomrendering.pageElements.InteractiveContentsBlockElement',
				).length > 0
			) {
				return import(
					'@frontend/web/components/elements/InteractiveContentsBlockElement'
				);
			}
			return Promise.reject();
		},
		{
			resolveComponent: (module) =>
				module.InteractiveContentsBlockElement,
		},
	);

	const CalloutBlockComponent = loadable(
		() => {
			if (
				CAPI.elementsToHydrate.filter(
					(element) =>
						element._type ===
						'model.dotcomrendering.pageElements.CalloutBlockElement',
				).length > 0
			) {
				return import(
					'@frontend/web/components/elements/CalloutBlockComponent'
				);
			}
			return Promise.reject();
		},
		{
			resolveComponent: (module) => module.CalloutBlockComponent,
		},
	);

	const DocumentBlockComponent = loadable(
		() => {
			if (
				CAPI.elementsToHydrate.filter(
					(element) =>
						element._type ===
						'model.dotcomrendering.pageElements.DocumentBlockElement',
				).length > 0
			) {
				return import(
					'@frontend/web/components/elements/DocumentBlockComponent'
				);
			}
			return Promise.reject();
		},
		{
			resolveComponent: (module) => module.DocumentBlockComponent,
		},
	);

	const EmbedBlockComponent = loadable(
		() => {
			if (
				CAPI.elementsToHydrate.filter(
					(element) =>
						element._type ===
						'model.dotcomrendering.pageElements.EmbedBlockElement',
				).length > 0
			) {
				return import(
					'@frontend/web/components/elements/EmbedBlockComponent'
				);
			}
			return Promise.reject();
		},
		{
			resolveComponent: (module) => module.EmbedBlockComponent,
		},
	);

	const UnsafeEmbedBlockComponent = loadable(
		() => {
			if (
				CAPI.elementsToHydrate.filter(
					(element) =>
						element._type ===
						'model.dotcomrendering.pageElements.EmbedBlockElement',
				).length > 0
			) {
				return import(
					'@frontend/web/components/elements/UnsafeEmbedBlockComponent'
				);
			}
			return Promise.reject();
		},
		{
			resolveComponent: (module) => module.UnsafeEmbedBlockComponent,
		},
	);

	const InstagramBlockComponent = loadable(
		() => {
			if (
				CAPI.elementsToHydrate.filter(
					(element) =>
						element._type ===
						'model.dotcomrendering.pageElements.InstagramBlockElement',
				).length > 0
			) {
				return import(
					'@frontend/web/components/elements/InstagramBlockComponent'
				);
			}
			return Promise.reject();
		},
		{
			resolveComponent: (module) => module.InstagramBlockComponent,
		},
	);

	const MapEmbedBlockComponent = loadable(
		() => {
			if (
				CAPI.elementsToHydrate.filter(
					(element) =>
						element._type ===
						'model.dotcomrendering.pageElements.MapBlockElement',
				).length > 0
			) {
				return import(
					'@frontend/web/components/elements/MapEmbedBlockComponent'
				);
			}
			return Promise.reject();
		},
		{
			resolveComponent: (module) => module.MapEmbedBlockComponent,
		},
	);

	const SpotifyBlockComponent = loadable(
		() => {
			if (
				CAPI.elementsToHydrate.filter(
					(element) =>
						element._type ===
						'model.dotcomrendering.pageElements.SpotifyBlockElement',
				).length > 0
			) {
				return import(
					'@frontend/web/components/elements/SpotifyBlockComponent'
				);
			}
			return Promise.reject();
		},
		{
			resolveComponent: (module) => module.SpotifyBlockComponent,
		},
	);

	const VideoFacebookBlockComponent = loadable(
		() => {
			if (
				CAPI.elementsToHydrate.filter(
					(element) =>
						element._type ===
						'model.dotcomrendering.pageElements.VideoFacebookBlockElement',
				).length > 0
			) {
				return import(
					'@frontend/web/components/elements/VideoFacebookBlockComponent'
				);
			}
			return Promise.reject();
		},
		{
			resolveComponent: (module) => module.VideoFacebookBlockComponent,
		},
	);

	const VineBlockComponent = loadable(
		() => {
			if (
				CAPI.elementsToHydrate.filter(
					(element) =>
						element._type ===
						'model.dotcomrendering.pageElements.VineBlockElement',
				).length > 0
			) {
				return import(
					'@frontend/web/components/elements/VineBlockComponent'
				);
			}
			return Promise.reject();
		},
		{
			resolveComponent: (module) => module.VineBlockComponent,
		},
	);

	// We use this function to filter the elementsToHydrate array by a particular
	// type so that we can hydrate them. We use T to force the type and keep TS
	// content because *we* know that if _type equals a thing then the type is
	// guaranteed but TS isn't so sure and needs assurance
	const elementsByType = <T extends CAPIElement>(
		elements: CAPIElement[],
		type: string,
	): T[] => elements.filter((element) => element._type === type) as T[];

	const youTubeAtoms = elementsByType<YoutubeBlockElement>(
		CAPI.elementsToHydrate,
		'model.dotcomrendering.pageElements.YoutubeBlockElement',
	);
	const quizAtoms = elementsByType<QuizAtomBlockElement>(
		CAPI.elementsToHydrate,
		'model.dotcomrendering.pageElements.QuizAtomBlockElement',
	);
	const callouts = elementsByType<CalloutBlockElement>(
		CAPI.elementsToHydrate,
		'model.dotcomrendering.pageElements.CalloutBlockElement',
	);
	const chartAtoms = elementsByType<ChartAtomBlockElement>(
		CAPI.elementsToHydrate,
		'model.dotcomrendering.pageElements.ChartAtomBlockElement',
	);
	const audioAtoms = elementsByType<AudioAtomBlockElement>(
		CAPI.elementsToHydrate,
		'model.dotcomrendering.pageElements.AudioAtomBlockElement',
	);
	const qandaAtoms = elementsByType<QABlockElement>(
		CAPI.elementsToHydrate,
		'model.dotcomrendering.pageElements.QABlockElement',
	);
	const guideAtoms = elementsByType<GuideAtomBlockElement>(
		CAPI.elementsToHydrate,
		'model.dotcomrendering.pageElements.GuideAtomBlockElement',
	);
	const profileAtoms = elementsByType<ProfileAtomBlockElement>(
		CAPI.elementsToHydrate,
		'model.dotcomrendering.pageElements.ProfileAtomBlockElement',
	);
	const timelineAtoms = elementsByType<TimelineBlockElement>(
		CAPI.elementsToHydrate,
		'model.dotcomrendering.pageElements.TimelineBlockElement',
	);
	const documents = elementsByType<DocumentBlockElement>(
		CAPI.elementsToHydrate,
		'model.dotcomrendering.pageElements.DocumentBlockElement',
	);
	const embeds = elementsByType<EmbedBlockElement>(
		CAPI.elementsToHydrate,
		'model.dotcomrendering.pageElements.EmbedBlockElement',
	);
	const instas = elementsByType<InstagramBlockElement>(
		CAPI.elementsToHydrate,
		'model.dotcomrendering.pageElements.InstagramBlockElement',
	);
	const maps = elementsByType<MapBlockElement>(
		CAPI.elementsToHydrate,
		'model.dotcomrendering.pageElements.MapBlockElement',
	);
	const spotifies = elementsByType<SpotifyBlockElement>(
		CAPI.elementsToHydrate,
		'model.dotcomrendering.pageElements.SpotifyBlockElement',
	);
	const facebookVideos = elementsByType<VideoFacebookBlockElement>(
		CAPI.elementsToHydrate,
		'model.dotcomrendering.pageElements.VideoFacebookBlockElement',
	);
	const vines = elementsByType<VineBlockElement>(
		CAPI.elementsToHydrate,
		'model.dotcomrendering.pageElements.VineBlockElement',
	);
	const richLinks = elementsByType<RichLinkBlockElement>(
		CAPI.elementsToHydrate,
		'model.dotcomrendering.pageElements.RichLinkBlockElement',
	);
	const interactiveElements = elementsByType<InteractiveBlockElement>(
		CAPI.elementsToHydrate,
		'model.dotcomrendering.pageElements.InteractiveBlockElement',
	);
	const interactiveContentsElement = elementsByType<InteractiveContentsBlockElement>(
		CAPI.elementsToHydrate,
		'model.dotcomrendering.pageElements.InteractiveContentsBlockElement',
	);

	return (
		// Do you need to HydrateOnce or do you want a Portal?
		//
		// HydrateOnce: If your component is server rendered and you're hydrating it with
		// more data or making it interactive on the client and you do not need to access
		// global application state.
		//
		// Portal: If your component is not server rendered but a pure client-side component
		// and/or you want to access global application state, you want to use a Portal.
		//
		// Note: Both require a 'root' element that needs to be server rendered.
		<React.StrictMode>
			{[
				CAPI.config.switches.commercialMetrics,
				window.guardian.config?.ophan !== undefined,
			].every(Boolean) && (
				<CommercialMetrics
					browserId={browserId}
					pageViewId={pageViewId}
				/>
			)}
			<Portal rootId="reader-revenue-links-header">
				<ReaderRevenueLinks
					urls={CAPI.nav.readerRevenueLinks.header}
					edition={CAPI.editionId}
					countryCode={countryCode}
					dataLinkNamePrefix="nav2 : "
					inHeader={true}
					remoteHeaderEnabled={CAPI.config.remoteHeader}
					pageViewId={pageViewId}
					contributionsServiceUrl={CAPI.contributionsServiceUrl}
					ophanRecord={ophanRecord}
				/>
			</Portal>
			<HydrateOnce rootId="links-root" waitFor={[user]}>
				<Links
					supporterCTA={CAPI.nav.readerRevenueLinks.header.supporter}
					userId={user ? user.userId : undefined}
					idUrl={CAPI.config.idUrl}
					mmaUrl={CAPI.config.mmaUrl}
				/>
			</HydrateOnce>
			<HydrateOnce rootId="edition-root">
				<EditionDropdown
					edition={CAPI.editionId}
					dataLinkName="nav2 : topbar : edition-picker: toggle"
				/>
			</HydrateOnce>
			<HydrateOnce rootId="labs-header">
				<LabsHeader />
			</HydrateOnce>
			{CAPI.config.switches.serverShareCounts && (
				<Portal rootId="share-count-root">
					<ShareCount
						ajaxUrl={CAPI.config.ajaxUrl}
						pageId={CAPI.pageId}
					/>
				</Portal>
			)}
			{youTubeAtoms.map((youTubeAtom) => (
				<HydrateOnce rootId={youTubeAtom.elementId}>
					<YoutubeBlockComponent
						format={format}
						palette={palette}
						hideCaption={false}
						// eslint-disable-next-line jsx-a11y/aria-role
						role="inline"
						adTargeting={adTargeting}
						isMainMedia={false}
						id={youTubeAtom.id}
						assetId={youTubeAtom.assetId}
						expired={youTubeAtom.expired}
						overrideImage={youTubeAtom.overrideImage}
						posterImage={youTubeAtom.posterImage}
						duration={youTubeAtom.duration}
						mediaTitle={youTubeAtom.mediaTitle}
						altText={youTubeAtom.altText}
					/>
				</HydrateOnce>
			))}
			{interactiveElements.map((interactiveBlock) => (
				<HydrateOnce rootId={interactiveBlock.elementId}>
					<InteractiveBlockComponent
						url={interactiveBlock.url}
						scriptUrl={interactiveBlock.scriptUrl}
						alt={interactiveBlock.alt}
						role={interactiveBlock.role}
						caption={interactiveBlock.caption}
						format={format}
						palette={palette}
					/>
				</HydrateOnce>
			))}
			{interactiveContentsElement.map((interactiveBlock) => (
				<HydrateOnce rootId={interactiveBlock.elementId}>
					<InteractiveContentsBlockElement
						subheadingLinks={interactiveBlock.subheadingLinks}
						endDocumentElementId={
							interactiveBlock.endDocumentElementId
						}
					/>
				</HydrateOnce>
			))}
			{quizAtoms.map((quizAtom) => (
				<HydrateOnce rootId={quizAtom.elementId}>
					<>
						{quizAtom.quizType === 'personality' && (
							<PersonalityQuizAtom
								id={quizAtom.id}
								questions={quizAtom.questions}
								resultBuckets={quizAtom.resultBuckets}
								sharingUrls={getSharingUrls(
									CAPI.pageId,
									CAPI.webTitle,
								)}
								theme={format.theme}
							/>
						)}
						{quizAtom.quizType === 'knowledge' && (
							<KnowledgeQuizAtom
								id={quizAtom.id}
								questions={quizAtom.questions}
								resultGroups={quizAtom.resultGroups}
								sharingUrls={getSharingUrls(
									CAPI.pageId,
									CAPI.webTitle,
								)}
								theme={format.theme}
							/>
						)}
					</>
				</HydrateOnce>
			))}

			{NAV.subNavSections && (
				<HydrateOnce rootId="sub-nav-root">
					<>
						<SubNav
							subNavSections={NAV.subNavSections}
							currentNavLink={NAV.currentNavLink}
							palette={palette}
						/>
					</>
				</HydrateOnce>
			)}
			{CAPI.matchUrl && (
				<Portal rootId="match-nav">
					<GetMatchNav matchUrl={CAPI.matchUrl} />
				</Portal>
			)}
			{richLinks.map((richLink, index) => (
				<Portal rootId={richLink.elementId}>
					<RichLinkComponent
						element={richLink}
						ajaxEndpoint={CAPI.config.ajaxUrl}
						richLinkIndex={index}
					/>
				</Portal>
			))}
			{callouts.map((callout) => (
				<HydrateOnce rootId={callout.elementId}>
					<CalloutBlockComponent
						callout={callout}
						palette={palette}
					/>
				</HydrateOnce>
			))}
			{chartAtoms.map((chartAtom) => (
				<HydrateOnce rootId={chartAtom.elementId}>
					<ChartAtom id={chartAtom.id} html={chartAtom.html} />
				</HydrateOnce>
			))}
			{audioAtoms.map((audioAtom) => (
				<HydrateOnce rootId={audioAtom.elementId}>
					<AudioAtomWrapper
						id={audioAtom.id}
						trackUrl={audioAtom.trackUrl}
						kicker={audioAtom.kicker}
						title={audioAtom.title}
						duration={audioAtom.duration}
						pillar={pillar}
						contentIsNotSensitive={!CAPI.config.isSensitive}
						aCastisEnabled={CAPI.config.switches.acast}
						readerCanBeShownAds={!CAPI.isAdFreeUser}
					/>
				</HydrateOnce>
			))}
			{qandaAtoms.map((qandaAtom) => (
				<HydrateOnce rootId={qandaAtom.elementId}>
					<QandaAtom
						id={qandaAtom.id}
						title={qandaAtom.title}
						html={qandaAtom.html}
						image={qandaAtom.img}
						credit={qandaAtom.credit}
						pillar={pillar}
						likeHandler={componentEventHandler(
							'QANDA_ATOM',
							qandaAtom.id,
							'LIKE',
						)}
						dislikeHandler={componentEventHandler(
							'QANDA_ATOM',
							qandaAtom.id,
							'DISLIKE',
						)}
						expandCallback={componentEventHandler(
							'QANDA_ATOM',
							qandaAtom.id,
							'EXPAND',
						)}
					/>
				</HydrateOnce>
			))}
			{guideAtoms.map((guideAtom) => (
				<HydrateOnce rootId={guideAtom.elementId}>
					<GuideAtom
						id={guideAtom.id}
						title={guideAtom.title}
						html={guideAtom.html}
						image={guideAtom.img}
						credit={guideAtom.credit}
						pillar={pillar}
						likeHandler={componentEventHandler(
							'GUIDE_ATOM',
							guideAtom.id,
							'LIKE',
						)}
						dislikeHandler={componentEventHandler(
							'GUIDE_ATOM',
							guideAtom.id,
							'DISLIKE',
						)}
						expandCallback={componentEventHandler(
							'GUIDE_ATOM',
							guideAtom.id,
							'EXPAND',
						)}
					/>
				</HydrateOnce>
			))}
			{profileAtoms.map((profileAtom) => (
				<HydrateOnce rootId={profileAtom.elementId}>
					<ProfileAtom
						id={profileAtom.id}
						title={profileAtom.title}
						html={profileAtom.html}
						image={profileAtom.img}
						credit={profileAtom.credit}
						pillar={pillar}
						likeHandler={componentEventHandler(
							'PROFILE_ATOM',
							profileAtom.id,
							'LIKE',
						)}
						dislikeHandler={componentEventHandler(
							'PROFILE_ATOM',
							profileAtom.id,
							'DISLIKE',
						)}
						expandCallback={componentEventHandler(
							'PROFILE_ATOM',
							profileAtom.id,
							'EXPAND',
						)}
					/>
				</HydrateOnce>
			))}
			{timelineAtoms.map((timelineAtom) => (
				<HydrateOnce rootId={timelineAtom.elementId}>
					<TimelineAtom
						id={timelineAtom.id}
						title={timelineAtom.title}
						events={timelineAtom.events}
						description={timelineAtom.description}
						pillar={pillar}
						likeHandler={componentEventHandler(
							'TIMELINE_ATOM',
							timelineAtom.id,
							'LIKE',
						)}
						dislikeHandler={componentEventHandler(
							'TIMELINE_ATOM',
							timelineAtom.id,
							'DISLIKE',
						)}
						expandCallback={componentEventHandler(
							'TIMELINE_ATOM',
							timelineAtom.id,
							'EXPAND',
						)}
					/>
				</HydrateOnce>
			))}
			{documents.map((document) => (
				<HydrateOnce rootId={document.elementId}>
					<ClickToView
						role={document.role}
						isTracking={document.isThirdPartyTracking}
						source={document.source}
						sourceDomain={document.sourceDomain}
					>
						<DocumentBlockComponent
							embedUrl={document.embedUrl}
							height={document.height}
							width={document.width}
							title={document.title}
							source={document.source}
						/>
					</ClickToView>
				</HydrateOnce>
			))}
			{embeds.map((embed, index) => (
				<HydrateOnce rootId={embed.elementId}>
					{embed.safe ? (
						<ClickToView
							role={embed.role}
							isTracking={embed.isThirdPartyTracking}
							source={embed.source}
							sourceDomain={embed.sourceDomain}
						>
							<EmbedBlockComponent
								html={embed.html}
								alt={embed.alt}
							/>
						</ClickToView>
					) : (
						<ClickToView
							role={embed.role}
							isTracking={embed.isThirdPartyTracking}
							source={embed.source}
							sourceDomain={embed.sourceDomain}
							onAccept={() =>
								updateIframeHeight(
									`iframe[name="unsafe-embed-${index}"]`,
								)
							}
						>
							<UnsafeEmbedBlockComponent
								key={embed.elementId}
								html={embed.html}
								alt={embed.alt || ''}
								index={index}
							/>
						</ClickToView>
					)}
				</HydrateOnce>
			))}
			{instas.map((insta, index) => (
				<HydrateOnce rootId={insta.elementId}>
					<ClickToView
						role={insta.role}
						isTracking={insta.isThirdPartyTracking}
						source={insta.source}
						sourceDomain={insta.sourceDomain}
						onAccept={() =>
							updateIframeHeight(
								`iframe[name="instagram-embed-${index}"]`,
							)
						}
					>
						<InstagramBlockComponent
							element={insta}
							index={index}
						/>
					</ClickToView>
				</HydrateOnce>
			))}
			{maps.map((map) => (
				<HydrateOnce rootId={map.elementId}>
					<ClickToView
						role={map.role}
						isTracking={map.isThirdPartyTracking}
						source={map.source}
						sourceDomain={map.sourceDomain}
					>
						<MapEmbedBlockComponent
							format={format}
							palette={palette}
							embedUrl={map.embedUrl}
							height={map.height}
							width={map.width}
							caption={map.caption}
							credit={map.source}
							title={map.title}
						/>
					</ClickToView>
				</HydrateOnce>
			))}
			{spotifies.map((spotify) => (
				<HydrateOnce rootId={spotify.elementId}>
					<ClickToView
						role={spotify.role}
						isTracking={spotify.isThirdPartyTracking}
						source={spotify.source}
						sourceDomain={spotify.sourceDomain}
					>
						<SpotifyBlockComponent
							embedUrl={spotify.embedUrl}
							height={spotify.height}
							width={spotify.width}
							title={spotify.title}
							format={format}
							palette={palette}
							caption={spotify.caption}
							credit="Spotify"
						/>
					</ClickToView>
				</HydrateOnce>
			))}
			{facebookVideos.map((facebookVideo) => (
				<HydrateOnce rootId={facebookVideo.elementId}>
					<ClickToView
						role={facebookVideo.role}
						isTracking={facebookVideo.isThirdPartyTracking}
						source={facebookVideo.source}
						sourceDomain={facebookVideo.sourceDomain}
					>
						<VideoFacebookBlockComponent
							format={format}
							palette={palette}
							embedUrl={facebookVideo.embedUrl}
							height={facebookVideo.height}
							width={facebookVideo.width}
							caption={facebookVideo.caption}
							credit={facebookVideo.caption}
							title={facebookVideo.caption}
						/>
					</ClickToView>
				</HydrateOnce>
			))}
			{vines.map((vine) => (
				<HydrateOnce rootId={vine.elementId}>
					<ClickToView
						// No role given by CAPI
						// eslint-disable-next-line jsx-a11y/aria-role
						role="inline"
						isTracking={vine.isThirdPartyTracking}
						source={vine.source}
						sourceDomain={vine.sourceDomain}
					>
						<VineBlockComponent element={vine} />
					</ClickToView>
				</HydrateOnce>
			))}
			<Portal rootId="most-viewed-right">
				<Lazy margin={100}>
					<Suspense fallback={<></>}>
						<MostViewedRightWrapper />
					</Suspense>
				</Lazy>
			</Portal>
			{CAPI.matchUrl && (
				<Portal rootId="match-stats">
					<Lazy margin={300}>
						<Suspense fallback={<Placeholder height={800} />}>
							<GetMatchStats matchUrl={CAPI.matchUrl} />
						</Suspense>
					</Lazy>
				</Portal>
			)}
			<Portal rootId="slot-body-end">
				<SlotBodyEnd
					isSignedIn={isSignedIn}
					countryCode={countryCode}
					contentType={CAPI.contentType}
					sectionName={CAPI.sectionName}
					shouldHideReaderRevenue={CAPI.shouldHideReaderRevenue}
					isMinuteArticle={CAPI.pageType.isMinuteArticle}
					isPaidContent={CAPI.pageType.isPaidContent}
					tags={CAPI.tags}
					contributionsServiceUrl={CAPI.contributionsServiceUrl}
					brazeMessages={brazeMessages}
					idApiUrl={CAPI.config.idApiUrl}
					stage={CAPI.stage}
				/>
			</Portal>
			<Portal
				rootId={
					isSignedIn
						? 'onwards-upper-whensignedin'
						: 'onwards-upper-whensignedout'
				}
			>
				<Lazy margin={300}>
					<Suspense fallback={<></>}>
						<OnwardsUpper
							ajaxUrl={CAPI.config.ajaxUrl}
							hasRelated={CAPI.hasRelated}
							hasStoryPackage={CAPI.hasStoryPackage}
							isAdFreeUser={CAPI.isAdFreeUser}
							pageId={CAPI.pageId}
							isPaidContent={CAPI.config.isPaidContent || false}
							showRelatedContent={CAPI.config.showRelatedContent}
							keywordIds={CAPI.config.keywordIds}
							contentType={CAPI.contentType}
							tags={CAPI.tags}
							format={format}
							pillar={pillar}
							edition={CAPI.editionId}
						/>
					</Suspense>
				</Lazy>
			</Portal>
			<Portal
				rootId={
					isSignedIn
						? 'onwards-lower-whensignedin'
						: 'onwards-lower-whensignedout'
				}
			>
				<Lazy margin={300}>
					<Suspense fallback={<></>}>
						<OnwardsLower
							ajaxUrl={CAPI.config.ajaxUrl}
							hasStoryPackage={CAPI.hasStoryPackage}
							tags={CAPI.tags}
							format={format}
						/>
					</Suspense>
				</Lazy>
			</Portal>
			<Portal rootId="sign-in-gate">
				<SignInGateSelector isSignedIn={isSignedIn} CAPI={CAPI} />
			</Portal>
			<HydrateOnce rootId="comments" waitFor={[user]}>
				<Discussion
					discussionApiUrl={CAPI.config.discussionApiUrl}
					shortUrlId={CAPI.config.shortUrlId}
					isCommentable={CAPI.isCommentable}
					pillar={pillar}
					palette={palette}
					user={user || undefined}
					discussionD2Uid={CAPI.config.discussionD2Uid}
					discussionApiClientHeader={
						CAPI.config.discussionApiClientHeader
					}
					enableDiscussionSwitch={CAPI.config.enableDiscussionSwitch}
					isAdFreeUser={CAPI.isAdFreeUser}
					shouldHideAds={CAPI.shouldHideAds}
					beingHydrated={true}
					display={display}
				/>
			</HydrateOnce>
			<Portal rootId="most-viewed-footer">
				<MostViewedFooter
					palette={palette}
					sectionName={CAPI.sectionName}
					ajaxUrl={CAPI.config.ajaxUrl}
					display={display}
				/>
			</Portal>
			<Portal rootId="reader-revenue-links-footer">
				<Lazy margin={300}>
					<ReaderRevenueLinks
						urls={CAPI.nav.readerRevenueLinks.footer}
						edition={CAPI.editionId}
						countryCode={countryCode}
						dataLinkNamePrefix="footer : "
						inHeader={false}
						remoteHeaderEnabled={false}
						pageViewId={pageViewId}
						contributionsServiceUrl={CAPI.contributionsServiceUrl}
						ophanRecord={ophanRecord}
					/>
				</Lazy>
			</Portal>
			<Portal rootId="bottom-banner">
				<StickyBottomBanner
					isSignedIn={isSignedIn}
					asyncCountryCode={asyncCountryCode}
					CAPI={CAPI}
					brazeMessages={brazeMessages}
					isPreview={!!CAPI.isPreview}
				/>
			</Portal>
		</React.StrictMode>
	);
};
