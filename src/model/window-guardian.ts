type StageType = 'DEV' | 'CODE' | 'PROD';

export interface WindowGuardianConfig {
	isDotcomRendering: boolean;
	stage: StageType;
	frontendAssetsFullURL: string;
	page: {
		dcrCouldRender: boolean;
		contentType: string;
		edition: Edition;
		revisionNumber: string;
		dcrSentryDsn: string;
		sentryHost: string;
		sentryPublicApiKey: string;
		keywordIds: string;
		dfpAccountId: string;
		adUnit: string;
		showRelatedContent: boolean;
		ajaxUrl: string;
		shouldHideReaderRevenue: boolean;
	} & ConfigType;
	libs: {
		googletag: string;
	};
	switches: { [key: string]: boolean };
	tests?: { [key: string]: string };
	ophan: {
		pageViewId: string;
		browserId: string;
	};
}

const makeWindowGuardianConfig = (
	dcrDocumentData: DCRServerDocumentData,
): WindowGuardianConfig => {
	const { config } = dcrDocumentData.CAPI;
	return {
		// This indicates to the client side code that we are running a dotcom-rendering rendered page.
		isDotcomRendering: true,
		stage: config.stage,
		frontendAssetsFullURL: config.frontendAssetsFullURL,
		page: Object.assign(config, {
			dcrCouldRender: true,
			contentType: dcrDocumentData.CAPI.contentType,
			edition: dcrDocumentData.CAPI.editionId,
			revisionNumber: config.revisionNumber,
			dcrSentryDsn:
				'https://1937ab71c8804b2b8438178dfdd6468f@sentry.io/1377847',
			sentryPublicApiKey: config.sentryPublicApiKey,
			sentryHost: config.sentryHost,
			keywordIds: config.keywordIds,
			dfpAccountId: config.dfpAccountId,
			adUnit: config.adUnit,
			showRelatedContent: true,
			ajaxUrl: config.ajaxUrl,
		}),
		libs: {
			googletag: config.googletagUrl,
		},
		switches: config.switches,
		ophan: {
			pageViewId: '',
			browserId: '',
		},
	} as WindowGuardianConfig;
};

export const makeGuardianBrowserCAPI = (CAPI: CAPIType): CAPIBrowserType => {
	// We hydrate these elements if they appear on the page
	const typesThatNeedHydrating: string[] = [
		'model.dotcomrendering.pageElements.RichLinkBlockElement',
		'model.dotcomrendering.pageElements.AudioAtomBlockElement',
		'model.dotcomrendering.pageElements.CalloutBlockElement',
		'model.dotcomrendering.pageElements.ChartAtomBlockElement',
		'model.dotcomrendering.pageElements.GuideAtomBlockElement',
		'model.dotcomrendering.pageElements.InteractiveBlockElement',
		'model.dotcomrendering.pageElements.ProfileAtomBlockElement',
		'model.dotcomrendering.pageElements.QABlockElement',
		'model.dotcomrendering.pageElements.QuizAtomBlockElement',
		'model.dotcomrendering.pageElements.TimelineBlockElement',
		'model.dotcomrendering.pageElements.YoutubeBlockElement',
	];

	const typesThatTrack: string[] = [
		'model.dotcomrendering.pageElements.DocumentBlockElement',
		'model.dotcomrendering.pageElements.InstagramBlockElement',
		'model.dotcomrendering.pageElements.MapBlockElement',
		'model.dotcomrendering.pageElements.SoundcloudBlockElement',
		'model.dotcomrendering.pageElements.SpotifyBlockElement',
		'model.dotcomrendering.pageElements.TweetBlockElement',
		'model.dotcomrendering.pageElements.VideoBlockElement',
		'model.dotcomrendering.pageElements.VideoFacebookBlockElement',
		'model.dotcomrendering.pageElements.VideoVimeoBlockElement',
		'model.dotcomrendering.pageElements.VideoYoutubeBlockElement',
		'model.dotcomrendering.pageElements.VineBlockElement',
		'model.dotcomrendering.pageElements.WitnessBlockElement',
	];

	const typesThatMightTrack: string[] = [
		'model.dotcomrendering.pageElements.EmbedBlockElement',
	];

	const isTracking = (element: CAPIElement): boolean => {
		const trackingElement = element as ThirdPartyEmbeddedContent;
		return trackingElement.isThirdPartyTracking;
	};

	const needsHydrating = (element: CAPIElement): boolean => {
		// Always hydrate some elements
		if (typesThatNeedHydrating.includes(element._type)) {
			return true;
		}
		// We know these elements track so we must hydrate them
		if (typesThatTrack.includes(element._type)) {
			return true;
		}
		// Only hydrate some tracking elements if they are indeed tracking
		if (
			typesThatMightTrack.includes(element._type) &&
			isTracking(element)
		) {
			return true;
		}
		return false;
	};

	const contributionsServiceUrl =
		process?.env?.SDC_URL ?? CAPI.contributionsServiceUrl;

	return {
		format: CAPI.format,
		config: {
			frontendAssetsFullURL: CAPI.config.frontendAssetsFullURL,
			isDev: process.env.NODE_ENV !== 'production',
			ajaxUrl: CAPI.config.ajaxUrl,
			shortUrlId: CAPI.config.shortUrlId,
			pageId: CAPI.config.pageId,
			isPaidContent: !!CAPI.config.isPaidContent,
			showRelatedContent: CAPI.config.showRelatedContent,
			keywordIds: CAPI.config.keywordIds,
			ampIframeUrl: CAPI.config.ampIframeUrl,

			// switches
			switches: CAPI.config.switches,
			abTests: CAPI.config.abTests,
			slotBodyEnd: CAPI.config.switches.slotBodyEnd,
			ampPrebid: CAPI.config.switches.ampPrebid,
			permutive: CAPI.config.switches.permutive,
			enableSentryReporting: CAPI.config.switches.enableSentryReporting,
			enableDiscussionSwitch: CAPI.config.switches.enableDiscussionSwitch,
			remoteBanner: CAPI.config.switches.remoteBanner,
			remoteHeader: CAPI.config.switches.remoteHeader,
			puzzlesBanner: CAPI.config.switches.puzzlesBanner,
			ausMoment2020Header: CAPI.config.switches.ausMoment2020Header,

			// used by lib/ad-targeting.ts
			isSensitive: CAPI.config.isSensitive,
			videoDuration: CAPI.config.videoDuration || 0,
			edition: CAPI.config.edition,
			section: CAPI.config.section,
			sharedAdTargeting: CAPI.config.sharedAdTargeting, // missing type definition
			adUnit: CAPI.config.adUnit,
			discussionApiUrl: CAPI.config.discussionApiUrl,
			discussionD2Uid: CAPI.config.discussionD2Uid,
			discussionApiClientHeader: CAPI.config.discussionApiClientHeader,
			idApiUrl: CAPI.config.idApiUrl,

			dcrSentryDsn: CAPI.config.dcrSentryDsn,

			// used by sign in gate
			host: CAPI.config.host,
			idUrl: CAPI.config.idUrl,
		},
		editionId: CAPI.editionId,
		editionLongForm: CAPI.editionLongForm,
		contentType: CAPI.contentType,
		sectionName: CAPI.sectionName,
		shouldHideReaderRevenue: CAPI.shouldHideReaderRevenue,
		pageType: {
			isMinuteArticle: CAPI.pageType.isMinuteArticle,
			isPaidContent: CAPI.pageType.isPaidContent,
			hasShowcaseMainElement: CAPI.pageType.hasShowcaseMainElement,
		},
		hasRelated: CAPI.hasRelated,
		hasStoryPackage: CAPI.hasStoryPackage,
		shouldHideAds: CAPI.shouldHideAds,
		isAdFreeUser: CAPI.isAdFreeUser,
		pageId: CAPI.pageId,
		webTitle: CAPI.webTitle,
		tags: CAPI.tags,
		isCommentable: CAPI.isCommentable,
		nav: {
			readerRevenueLinks: {
				footer: CAPI.nav.readerRevenueLinks.footer,
				header: CAPI.nav.readerRevenueLinks.header,
			},
		},
		contributionsServiceUrl,
		isImmersive: CAPI.isImmersive,
		isPhotoEssay: CAPI.config.isPhotoEssay || false,
		isSpecialReport: CAPI.isSpecialReport,
		isLiveBlog: CAPI.config.isLiveBlog || false,
		isLive: CAPI.config.isLive || false,
		isPreview: CAPI.config.isPreview,
		stage: CAPI.config.stage,
		matchUrl: CAPI.matchUrl,
		elementsToHydrate: CAPI.blocks
			// Get all elements arrays from all blocks -> [[h][h][x]]
			.map((block) => block.elements)
			// Flatten them -> [h,h,x]
			.flat()
			// Merge in main media elements -> [h,h,x,x]
			.concat(CAPI.mainMediaElements)
			// Filter for elements that need hydrating -> [h,h]
			.filter((element) => needsHydrating(element)),
	};
};

export interface WindowGuardian {
	// The app contains only data that we require for app hydration
	// NOTE: there is a divergence between DCRBrowserDocumentData and DCRServerDocumentData
	// for performance reasons
	app: {
		data: DCRBrowserDocumentData;
		cssIDs: string[];
	};

	// The 'config' attribute is derived from DCRServerDocumentData and contains
	// all the data that, for legacy reasons, for instance compatibility
	// with the frontend commercial stack, or other scripts, we want to find
	// at window.guardian.config
	config: WindowGuardianConfig;
	polyfilled: boolean;
	adBlockers: any;
	modules: {
		sentry: {
			reportError: (error: Error, feature: string) => void;
		};
	};
}

export const makeGuardianBrowserNav = (nav: NavType): BrowserNavType => {
	return {
		currentNavLink: nav.currentNavLink,
		subNavSections: nav.subNavSections,
	};
};

export const makeWindowGuardian = (
	dcrDocumentData: DCRServerDocumentData,
	cssIDs: string[],
): WindowGuardian => {
	return {
		app: {
			cssIDs,
			data: {
				...dcrDocumentData,
				NAV: makeGuardianBrowserNav(dcrDocumentData.NAV),
				CAPI: makeGuardianBrowserCAPI(dcrDocumentData.CAPI),
			},
		},
		config: makeWindowGuardianConfig(dcrDocumentData),
		polyfilled: false,
		adBlockers: {
			active: undefined,
			onDetect: [],
		},
		modules: {
			sentry: {
				reportError: () => null,
			},
		},
	};
};
