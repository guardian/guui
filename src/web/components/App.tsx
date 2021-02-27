import React, { useState, useEffect, Suspense } from 'react';
import loadable from '@loadable/component';
import { useAB } from '@guardian/ab-react';
import { tests } from '@frontend/web/experiments/ab-tests';
import { ShareCount } from '@frontend/web/components/ShareCount';
import { MostViewedFooter } from '@frontend/web/components/MostViewed/MostViewedFooter/MostViewedFooter';
import { CalloutBlockComponent } from '@root/src/web/components/elements/CalloutBlockComponent';
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
import { getCookie } from '@root/src/web/browser/cookie';
import { getCountryCode } from '@frontend/web/lib/getCountryCode';
import { getUser } from '@root/src/web/lib/getUser';

import { FocusStyleManager } from '@guardian/src-foundations/utils';
import { Display, Design } from '@guardian/types';
import type { Format } from '@guardian/types';
import { incrementAlreadyVisited } from '@root/src/web/lib/alreadyVisited';
import { incrementDailyArticleCount } from '@frontend/web/lib/dailyArticleCount';
import { getArticleCountConsent } from '@frontend/web/lib/contributions';
import { ReaderRevenueDevUtils } from '@root/src/web/lib/readerRevenueDevUtils';
import { buildAdTargeting } from '@root/src/lib/ad-targeting';

import {
	cmp,
	onConsentChange,
	getConsentFor,
} from '@guardian/consent-management-platform';
import { injectPrivacySettingsLink } from '@root/src/web/lib/injectPrivacySettingsLink';
import { updateIframeHeight } from '@root/src/web/browser/updateIframeHeight';
import { ClickToView } from '@root/src/web/components/ClickToView';
import { DocumentBlockComponent } from '@root/src/web/components/elements/DocumentBlockComponent';
import { EmbedBlockComponent } from '@root/src/web/components/elements/EmbedBlockComponent';
import { UnsafeEmbedBlockComponent } from '@root/src/web/components/elements/UnsafeEmbedBlockComponent';
import { InstagramBlockComponent } from '@root/src/web/components/elements/InstagramBlockComponent';
import { MapEmbedBlockComponent } from '@root/src/web/components/elements/MapEmbedBlockComponent';
import { SpotifyBlockComponent } from '@root/src/web/components/elements/SpotifyBlockComponent';
import { VideoFacebookBlockComponent } from '@root/src/web/components/elements/VideoFacebookBlockComponent';
import { VineBlockComponent } from '@root/src/web/components/elements/VineBlockComponent';
import {
	StickyNavSimple,
	StickyNavBackscroll,
} from '@root/src/web/components/Nav/StickNavTest/StickyNav';
import {
	submitComponentEvent,
	OphanComponentEvent,
} from '../browser/ophan/ophan';
import { trackPerformance } from '../browser/ga/ga';
import { decidePalette } from '../lib/decidePalette';

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
};

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
	submitComponentEvent(componentEvent);
};

export const App = ({ CAPI, NAV }: Props) => {
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
		Promise<string | void>
	>();

	const pageViewId = window.guardian?.config?.ophan?.pageViewId;

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
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				.catch((e) => console.error(`getUser - error: ${e}`));
		} else {
			setUser(null);
		}
	}, [isSignedIn, CAPI.config.discussionApiUrl]);

	useEffect(() => {
		const callFetch = () => {
			const countryCodePromise = getCountryCode();
			setAsyncCountryCode(countryCodePromise);
			countryCodePromise
				.then((cc) => setCountryCode(cc || ''))
				.catch((e) =>
					// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
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
			if (await getArticleCountConsent()) {
				incrementDailyArticleCount();
				incrementWeeklyArticleCount();
			}
		};
		incrementArticleCountsIfConsented().catch((e) =>
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			console.error(`incrementArticleCountsIfConsented - error: ${e}`),
		);
	}, []);

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
				browserId: getCookie('bwid') || undefined,
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
								// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
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
	}, [countryCode, CAPI.config.switches.consentManagement, pageViewId]);

	// ************************
	// *   Google Analytics   *
	// ************************
	useEffect(() => {
		onConsentChange((state: any) => {
			const consentGiven = getConsentFor('google-analytics', state);
			if (consentGiven) {
				Promise.all([
					loadScript('https://www.google-analytics.com/analytics.js'),
					loadScript(window.guardian.gaPath),
					// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				]).catch((e) => console.error(`GA - error: ${e}`));
			} else {
				// We should never be able to directly set things to the global window object.
				// But in this case we want to stub things for testing, so it's ok to ignore this rule
				// @ts-ignore
				window.ga = null;
			}
		});
	}, []);

	const display: Display = decideDisplay(CAPI);
	const design: Design = decideDesign(
		CAPI.designType,
		CAPI.tags,
		CAPI.isLiveBlog,
	);
	const pillar = decideTheme({
		pillar: CAPI.pillar,
		design,
		isSpecialReport: CAPI.isSpecialReport,
	});
	const format: Format = {
		display,
		design,
		theme: pillar,
	};
	const palette = decidePalette(format);

	const adTargeting: AdTargeting = buildAdTargeting(CAPI.config);

	// sticky nav test status
	const inStickyNavBackscroll = ABTestAPI.isUserInVariant(
		'stickyNavTest',
		'sticky-nav-backscroll',
	);
	const inStickyNavSimple = ABTestAPI.isUserInVariant(
		'stickyNavTest',
		'sticky-nav-simple',
	);

	// There are docs on loadable in ./docs/loadable-components.md
	const YoutubeBlockComponent = loadable(
		() => {
			if (
				CAPI.youtubeBlockElement.length > 0 ||
				CAPI.youtubeMainMediaBlockElement.length > 0
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
			if (CAPI.richLinks.length > 0) {
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
			<Portal root="reader-revenue-links-header">
				<ReaderRevenueLinks
					urls={CAPI.nav.readerRevenueLinks.header}
					edition={CAPI.editionId}
					dataLinkNamePrefix="nav2 : "
					inHeader={true}
				/>
			</Portal>
			<HydrateOnce root="links-root" waitFor={[user]}>
				<Links
					giftingURL={CAPI.nav.readerRevenueLinks.header.gifting}
					userId={user ? user.userId : undefined}
					idUrl={CAPI.config.idUrl}
					mmaUrl={CAPI.config.mmaUrl}
				/>
			</HydrateOnce>
			<HydrateOnce root="edition-root">
				<EditionDropdown
					edition={CAPI.editionId}
					dataLinkName="nav2 : topbar : edition-picker: toggle"
				/>
			</HydrateOnce>
			<Portal root="share-count-root">
				<ShareCount
					ajaxUrl={CAPI.config.ajaxUrl}
					pageId={CAPI.pageId}
				/>
			</Portal>
			{CAPI.youtubeMainMediaBlockElement.map((youtubeBlock, index) => (
				<HydrateOnce
					key={index}
					root="youtube-block-main-media"
					index={youtubeBlock.youtubeIndex}
				>
					<YoutubeBlockComponent
						format={format}
						palette={palette}
						hideCaption={false}
						// eslint-disable-next-line jsx-a11y/aria-role
						role="inline"
						adTargeting={adTargeting}
						isMainMedia={false}
						id={youtubeBlock.id}
						assetId={youtubeBlock.assetId}
						channelId={youtubeBlock.channelId}
						expired={youtubeBlock.expired}
						overrideImage={youtubeBlock.overrideImage}
						posterImage={youtubeBlock.posterImage}
						duration={youtubeBlock.duration}
						mediaTitle={youtubeBlock.mediaTitle}
						altText={youtubeBlock.altText}
					/>
				</HydrateOnce>
			))}
			{CAPI.youtubeBlockElement.map((youtubeBlock, index) => (
				<HydrateOnce
					key={index}
					root="youtube-block"
					index={youtubeBlock.youtubeIndex}
				>
					<YoutubeBlockComponent
						format={format}
						palette={palette}
						hideCaption={false}
						// eslint-disable-next-line jsx-a11y/aria-role
						role="inline"
						adTargeting={adTargeting}
						isMainMedia={false}
						id={youtubeBlock.id}
						assetId={youtubeBlock.assetId}
						channelId={youtubeBlock.channelId}
						expired={youtubeBlock.expired}
						overrideImage={youtubeBlock.overrideImage}
						posterImage={youtubeBlock.posterImage}
						duration={youtubeBlock.duration}
						mediaTitle={youtubeBlock.mediaTitle}
						altText={youtubeBlock.altText}
					/>
				</HydrateOnce>
			))}
			{CAPI.quizAtoms.map((quizAtoms, index) => (
				<HydrateOnce
					key={index}
					root="quiz-atom"
					index={quizAtoms.quizIndex}
				>
					<>
						{quizAtoms.quizType === 'personality' && (
							<PersonalityQuizAtom
								id={quizAtoms.id}
								questions={quizAtoms.questions}
								resultBuckets={quizAtoms.resultBuckets}
							/>
						)}
						{quizAtoms.quizType === 'knowledge' && (
							<KnowledgeQuizAtom
								id={quizAtoms.id}
								questions={quizAtoms.questions}
							/>
						)}
					</>
				</HydrateOnce>
			))}

			{inStickyNavBackscroll && (
				<Portal root="sticky-nav-root">
					<StickyNavBackscroll
						capiData={CAPI}
						navData={NAV}
						format={format}
						palette={palette}
					/>
				</Portal>
			)}

			{inStickyNavSimple && (
				<Portal root="sticky-nav-root">
					<StickyNavSimple
						capiData={CAPI}
						navData={NAV}
						format={format}
						palette={palette}
					/>
				</Portal>
			)}

			{NAV.subNavSections && (
				<HydrateOnce root="sub-nav-root">
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
				<Portal root="match-nav">
					<GetMatchNav matchUrl={CAPI.matchUrl} />
				</Portal>
			)}
			{CAPI.richLinks.map((link, index) => (
				<Portal
					key={index}
					root="rich-link"
					richLinkIndex={link.richLinkIndex}
				>
					<RichLinkComponent
						element={link}
						pillar={pillar}
						ajaxEndpoint={CAPI.config.ajaxUrl}
						richLinkIndex={index}
					/>
				</Portal>
			))}
			{CAPI.callouts.map((callout) => (
				<HydrateOnce root="callout" index={callout.calloutIndex}>
					<CalloutBlockComponent callout={callout} pillar={pillar} />
				</HydrateOnce>
			))}
			{CAPI.chartAtoms.map((chart) => (
				<HydrateOnce root="chart-atom" index={chart.chartIndex}>
					<ChartAtom id={chart.id} html={chart.html} />
				</HydrateOnce>
			))}
			{CAPI.audioAtoms.map((audioAtom) => (
				<HydrateOnce root="audio-atom" index={audioAtom.audioIndex}>
					<AudioAtomWrapper
						id={audioAtom.id}
						trackUrl={audioAtom.trackUrl}
						kicker={audioAtom.kicker}
						title={audioAtom.title}
						pillar={pillar}
						contentIsNotSensitive={!CAPI.config.isSensitive}
						aCastisEnabled={CAPI.config.switches.acast}
						readerCanBeShownAds={!CAPI.isAdFreeUser}
					/>
				</HydrateOnce>
			))}
			{CAPI.qandaAtoms.map((qandaAtom) => (
				<HydrateOnce root="qanda-atom" index={qandaAtom.qandaIndex}>
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
			{CAPI.guideAtoms.map((guideAtom) => (
				<HydrateOnce root="guide-atom" index={guideAtom.guideIndex}>
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
			{CAPI.profileAtoms.map((profileAtom) => (
				<HydrateOnce
					root="profile-atom"
					index={profileAtom.profileIndex}
				>
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
			{CAPI.timelineAtoms.map((timelineAtom) => (
				<HydrateOnce
					root="timeline-atom"
					index={timelineAtom.timelineIndex}
				>
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
			{CAPI.documentBlockElements.map((element) => (
				<HydrateOnce
					root="document-block-element"
					index={element.documentIndex}
				>
					<ClickToView
						role={element.role}
						isTracking={element.isThirdPartyTracking}
						source={element.source}
						sourceDomain={element.sourceDomain}
						abTests={CAPI.config.abTests}
					>
						<DocumentBlockComponent
							embedUrl={element.embedUrl}
							height={element.height}
							width={element.width}
							title={element.title}
						/>
					</ClickToView>
				</HydrateOnce>
			))}
			{CAPI.embedBlockElements.map((element) => (
				<HydrateOnce
					root="embed-block-element"
					index={element.embedIndex}
				>
					{element.safe ? (
						<ClickToView
							role={element.role}
							isTracking={element.isThirdPartyTracking}
							source={element.source}
							sourceDomain={element.sourceDomain}
							abTests={CAPI.config.abTests}
						>
							<EmbedBlockComponent
								key={element.embedIndex}
								html={element.html}
								alt={element.alt}
							/>
						</ClickToView>
					) : (
						<ClickToView
							role={element.role}
							isTracking={element.isThirdPartyTracking}
							source={element.source}
							sourceDomain={element.sourceDomain}
							abTests={CAPI.config.abTests}
							onAccept={() =>
								updateIframeHeight(
									`iframe[name="unsafe-embed-${
										element.embedIndex || 0
									}"]`,
								)
							}
						>
							<UnsafeEmbedBlockComponent
								key={element.embedIndex}
								html={element.html}
								alt={element.alt || ''}
								index={element.embedIndex || 0}
							/>
						</ClickToView>
					)}
				</HydrateOnce>
			))}
			{CAPI.instagramBlockElements.map((element) => (
				<HydrateOnce
					root="instagram-block-element"
					index={element.instagramIndex}
				>
					<ClickToView
						role={element.role}
						isTracking={element.isThirdPartyTracking}
						source={element.source}
						sourceDomain={element.sourceDomain}
						abTests={CAPI.config.abTests}
						onAccept={() =>
							updateIframeHeight(
								`iframe[name="instagram-embed-${
									element.instagramIndex || 0
								}"]`,
							)
						}
					>
						<InstagramBlockComponent
							key={element.instagramIndex}
							element={element}
							index={element.instagramIndex || 0}
						/>
					</ClickToView>
				</HydrateOnce>
			))}
			{CAPI.mapBlockElements.map((element) => (
				<HydrateOnce root="map-block-element" index={element.mapIndex}>
					<ClickToView
						role={element.role}
						isTracking={element.isThirdPartyTracking}
						source={element.source}
						sourceDomain={element.sourceDomain}
						abTests={CAPI.config.abTests}
					>
						<MapEmbedBlockComponent
							format={format}
							palette={palette}
							embedUrl={element.embedUrl}
							height={element.height}
							width={element.width}
							caption={element.caption}
							credit={element.source}
							title={element.title}
						/>
					</ClickToView>
				</HydrateOnce>
			))}
			{CAPI.spotifyBlockElements.map((element) => (
				<HydrateOnce
					root="spotify-block-element"
					index={element.spotifyIndex}
				>
					<ClickToView
						role={element.role}
						isTracking={element.isThirdPartyTracking}
						source={element.source}
						sourceDomain={element.sourceDomain}
						abTests={CAPI.config.abTests}
					>
						<SpotifyBlockComponent
							embedUrl={element.embedUrl}
							height={element.height}
							width={element.width}
							title={element.title}
							format={format}
							palette={palette}
							caption={element.caption}
							credit="Spotify"
						/>
					</ClickToView>
				</HydrateOnce>
			))}
			{CAPI.videoFacebookBlockElements.map((element) => (
				<HydrateOnce
					root="video-facebook-block-element"
					index={element.videoFacebookIndex}
				>
					<ClickToView
						role={element.role}
						isTracking={element.isThirdPartyTracking}
						source={element.source}
						sourceDomain={element.sourceDomain}
						abTests={CAPI.config.abTests}
					>
						<VideoFacebookBlockComponent
							format={format}
							palette={palette}
							embedUrl={element.embedUrl}
							height={element.height}
							width={element.width}
							caption={element.caption}
							credit={element.caption}
							title={element.caption}
						/>
					</ClickToView>
				</HydrateOnce>
			))}
			{CAPI.vineBlockElements.map((element) => (
				<HydrateOnce
					root="vine-block-element"
					index={element.vineBlockIndex}
				>
					<ClickToView
						// No role given by CAPI
						// eslint-disable-next-line jsx-a11y/aria-role
						role="inline"
						isTracking={element.isThirdPartyTracking}
						source={element.source}
						sourceDomain={element.sourceDomain}
						abTests={CAPI.config.abTests}
					>
						<VineBlockComponent element={element} />
					</ClickToView>
				</HydrateOnce>
			))}
			<Portal root="most-viewed-right">
				<Lazy margin={100}>
					<Suspense fallback={<></>}>
						<MostViewedRightWrapper pillar={pillar} />
					</Suspense>
				</Lazy>
			</Portal>
			{CAPI.matchUrl && (
				<Portal root="match-stats">
					<Lazy margin={300}>
						<Suspense fallback={<Placeholder height={800} />}>
							<GetMatchStats matchUrl={CAPI.matchUrl} />
						</Suspense>
					</Lazy>
				</Portal>
			)}
			<Portal root="slot-body-end">
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
				/>
			</Portal>
			<Portal
				root={
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
							edition={CAPI.editionId}
							pillar={pillar}
						/>
					</Suspense>
				</Lazy>
			</Portal>
			<Portal
				root={
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
							pillar={pillar}
						/>
					</Suspense>
				</Lazy>
			</Portal>
			<Portal root="sign-in-gate">
				<SignInGateSelector isSignedIn={isSignedIn} CAPI={CAPI} />
			</Portal>
			<HydrateOnce root="comments" waitFor={[user]}>
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
			<Portal root="most-viewed-footer">
				<MostViewedFooter
					pillar={pillar}
					sectionName={CAPI.sectionName}
					ajaxUrl={CAPI.config.ajaxUrl}
					display={display}
				/>
			</Portal>
			<Portal root="reader-revenue-links-footer">
				<Lazy margin={300}>
					<ReaderRevenueLinks
						urls={CAPI.nav.readerRevenueLinks.footer}
						edition={CAPI.editionId}
						dataLinkNamePrefix="footer : "
						inHeader={false}
					/>
				</Lazy>
			</Portal>
			<Portal root="bottom-banner">
				<StickyBottomBanner
					isSignedIn={isSignedIn}
					asyncCountryCode={asyncCountryCode}
					CAPI={CAPI}
					idApiUrl={CAPI.config.idApiUrl}
				/>
			</Portal>
		</React.StrictMode>
	);
};
