// ------------------------  //
// CAPIType and its subtypes //
// ------------------------- //


// Pillars are used for styling
// RealPillars have pillar palette colours
// FakePillars allow us to make modifications to style based on rules outside of the pillar of an article
// These are partialy kept for Google Analytics purposes
type RealPillars = 'news' | 'opinion' | 'sport' | 'culture' | 'lifestyle';
type FakePillars = 'labs';
type LegacyPillar = RealPillars | FakePillars;

// Themes are used for styling
// RealPillars have pillar palette colours and have a `Pillar` type in Scala
// FakePillars allow us to make modifications to style based on rules outside of the pillar of an article and have a `Special` type in Scala
// https://github.com/guardian/content-api-scala-client/blob/master/client/src/main/scala/com.gu.contentapi.client/utils/format/Theme.scala
type ThemePillar = 'NewsPillar' | 'OpinionPillar' | 'SportPillar' | 'CulturePillar' | 'LifestylePillar';
type ThemeSpecial = 'SpecialReportTheme' | 'Labs';
type CAPITheme = ThemePillar | ThemeSpecial;

// CAPIDesign is what CAPI gives us on the Format field
// https://github.com/guardian/content-api-scala-client/blob/master/client/src/main/scala/com.gu.contentapi.client/utils/format/Design.scala
type CAPIDesign =
	| 'ArticleDesign'
	| 'MediaDesign'
	| 'ReviewDesign'
	| 'AnalysisDesign'
	| 'CommentDesign'
	| 'LetterDesign'
	| 'FeatureDesign'
	| 'LiveBlogDesign'
	| 'DeadBlogDesign'
	| 'RecipeDesign'
	| 'MatchReportDesign'
	| 'InterviewDesign'
	| 'EditorialDesign'
	| 'QuizDesign'
	| 'InteractiveDesign'
	| 'PhotoEssayDesign'
	| 'PrintShopDesign';

// CAPIDisplay is the display information passed through from CAPI and dictates the displaystyle of the content e.g. Immersive
// https://github.com/guardian/content-api-scala-client/blob/master/client/src/main/scala/com.gu.contentapi.client/utils/format/Display.scala
type CAPIDisplay = 'StandardDisplay' | 'ImmersiveDisplay' | 'ShowcaseDisplay' | 'NumberedListDisplay';

// CAPIFormat is the stringified version of Format passed through from CAPI.
// It gets converted to the @guardian/types format on platform

type CAPIFormat = {
	design: CAPIDesign;
	theme: CAPITheme;
	display: CAPIDisplay;
}

type Display = import('@guardian/types').Display;
type Design = import('@guardian/types').Design;
type Theme = import('@guardian/types').Theme;
type Format = import('@guardian/types').Format;
type Pillar = Theme;

// This is an object that allows you Type defaults of the designTypes.
// The return type looks like: { Feature: any, Live: any, ...}
// and can be used to add TypeSafety when needing to override a style in a designType
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DesignTypesObj = { [key in Design]: any };

type Colour = string;

type Palette = {
	text: {
		headline: Colour;
		seriesTitle: Colour;
		sectionTitle: Colour;
		byline: Colour;
		twitterHandle: Colour;
		caption: Colour;
		captionLink: Colour;
		subMeta: Colour;
		subMetaLabel: Colour;
		subMetaLink: Colour;
		syndicationButton: Colour;
		articleLink: Colour;
		articleLinkHover: Colour;
		cardHeadline: Colour;
		cardKicker: Colour;
		linkKicker: Colour;
		cardStandfirst: Colour;
		cardFooter: Colour;
		headlineByline: Colour;
		standfirst: Colour;
		standfirstLink: Colour;
		branding: Colour;
		disclaimerLink: Colour;
		signInLink: Colour;
		richLink: Colour;
		witnessIcon: Colour;
		witnessAuthor: Colour;
		witnessTitle: Colour;
		carouselTitle: Colour;
		calloutHeading: Colour;
		pullQuote: Colour;
		pullQuoteAttribution: Colour;
		dropCap: Colour;
		blockquote: Colour;
		numberedTitle: Colour;
		numberedPosition: Colour;
	},
	background: {
		article: Colour;
		seriesTitle: Colour;
		sectionTitle: Colour;
		avatar: Colour;
		card: Colour;
		headline: Colour;
		headlineByline: Colour;
		bullet: Colour;
		header: Colour;
		standfirst: Colour;
		richLink: Colour;
		imageTitle: Colour;
		speechBubble: Colour;
		carouselDot: Colour;
		carouselDotFocus: Colour;
		headlineTag: Colour;
		mostViewedTab: Colour;
	},
	fill: {
		commentCount: Colour;
		shareIcon: Colour;
		captionTriangle: Colour;
		cardIcon: Colour;
		richLink: Colour;
		quoteIcon: Colour;
		blockquoteIcon: Colour;
	},
	border: {
		syndicationButton: Colour;
		subNav: Colour;
		articleLink: Colour;
		articleLinkHover: Colour;
		liveBlock: Colour;
		standfirstLink: Colour;
		headline: Colour;
		standfirst: Colour;
		richLink: Colour;
		navPillar: Colour;
		article: Colour;
		lines: Colour;
	},
	topBar: {
		card: Colour;
	},
	hover: {
		headlineByline: Colour;
	}
};

type Edition = 'UK' | 'US' | 'INT' | 'AU';

type SharePlatform =
	| 'facebook'
	| 'twitter'
	| 'email'
	| 'whatsApp'
	| 'linkedIn'
	| 'messenger';

// shared type declarations
interface SimpleLinkType {
	url: string;
	title: string;
}

interface AdTargetParam {
	name: string;
	value: string | string[];
}

interface AdTargeting {
	adUnit: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	customParams: { [key: string]: any };
}

interface SectionNielsenAPI {
	name: string;
	apiID: string;
}

interface EditionCommercialProperties {
	adTargeting: AdTargetParam[];
	branding?: Branding;
}

type CommercialProperties = { [E in Edition]: EditionCommercialProperties };

type BrandingLogo = {
	src: string;
	link: string;
	label: string;
	dimensions: { width: number; height: number };
}

interface Branding {
	brandingType?: { name: string };
	sponsorName: string;
	logo: BrandingLogo;
	aboutThisLink: string;
	logoForDarkBackground?: BrandingLogo;
}

interface LinkType extends SimpleLinkType {
	longTitle: string;
	children?: LinkType[];
	mobileOnly?: boolean;
	pillar?: Pillar;
	more?: boolean;
}

interface PillarType extends LinkType {
	pillar: Pillar;
}

interface MoreType extends LinkType {
	more: true;
}

interface ReaderRevenueCategories {
	contribute: string;
	subscribe: string;
	support: string;
	supporter: string;
	gifting?: string;
}

type ReaderRevenueCategory = 'contribute' | 'subscribe' | 'support';
interface ReaderRevenuePositions {
	header: ReaderRevenueCategories;
	footer: ReaderRevenueCategories;
	sideMenu: ReaderRevenueCategories;
	ampHeader: ReaderRevenueCategories;
	ampFooter: ReaderRevenueCategories;
}

type ReaderRevenuePosition =
	| 'header'
	| 'footer'
	| 'sideMenu'
	| 'ampHeader'
	| 'ampFooter';

interface BaseNavType {
	otherLinks: MoreType;
	brandExtensions: LinkType[];
	currentNavLink: string;
	subNavSections?: SubNavType;
	readerRevenueLinks: ReaderRevenuePositions;
}

// TODO rename
interface SimpleNavType {
	pillars: PillarType[];
	otherLinks: MoreType;
	brandExtensions: LinkType[];
	readerRevenueLinks: ReaderRevenuePositions;
}

interface NavType extends BaseNavType {
	pillars: PillarType[];
}

interface SubNavBrowserType {
	currentNavLink: string;
	subNavSections?: SubNavType;
}

interface SubNavType {
	parent?: LinkType;
	links: LinkType[];
}

interface AuthorType {
	byline?: string;
	twitterHandle?: string;
	email?: string;
}

interface Block {
	id: string;
	elements: CAPIElement[];
	blockCreatedOn?: number;
	blockCreatedOnDisplay?: string;
	blockLastUpdated?: number;
	blockLastUpdatedDisplay?: string;
	title?: string;
	blockFirstPublished?: number;
	blockFirstPublishedDisplay?: string;
	primaryDateLine: string;
	secondaryDateLine: string;
	createdOn?: number;
	createdOnDisplay?: string;
	lastUpdated?: number;
	lastUpdatedDisplay?: string;
	firstPublished?: number;
	firstPublishedDisplay?: string;
}

interface Pagination {
	currentPage: number;
	totalPages: number;
	newest?: string;
	newer?: string;
	oldest?: string;
	older?: string;
}

interface FooterLink {
	text: string;
	url: string;
	dataLinkName: string;
	extraClasses?: string;
}
interface FooterType {
	footerLinks: FooterLink[][];
}

type ContentType =
	| 'article'
	| 'network'
	| 'section'
	| 'imageContent'
	| 'interactive'
	| 'gallery'
	| 'video'
	| 'audio'
	| 'liveBlog'
	| 'tag'
	| 'index'
	| 'crossword'
	| 'survey'
	| 'signup'
	| 'userid';

type PageTypeType = {
	hasShowcaseMainElement: boolean;
	isFront: boolean;
	isLiveblog: boolean;
	isMinuteArticle: boolean;
	isPaidContent: boolean;
	isPreview: boolean;
	isSensitive: boolean;
};

// Data types for the API request bodies from clients that require
// transformation before internal use. If we use the data as-is, we avoid the
// CAPI prefix. Note also, the 'CAPI' prefix naming convention is a bit
// misleading - the model is *not* the same as the Content API content models.

interface CAPILinkType {
    url: string;
    title: string;
    longTitle?: string;
    iconName?: string;
    children?: CAPILinkType[];
    pillar?: LegacyPillar;
    more?: boolean;
    classList?: string[];
}

interface CAPINavType {
    currentUrl: string;
    pillars: CAPILinkType[];
    otherLinks: CAPILinkType[];
    brandExtensions: CAPILinkType[];
    currentNavLink?: CAPILinkType;
    currentNavLinkTitle?: string;
    currentPillarTitle?: string;
    subNavSections?: {
        parent?: CAPILinkType;
        links: CAPILinkType[];
    };
    readerRevenueLinks: ReaderRevenuePositions;
}

// WARNING: run `gen-schema` task if changing this to update the associated JSON
// schema definition.
interface CAPIType {
	headline: string;
	standfirst: string;
	webTitle: string;
	mainMediaElements: CAPIElement[];
	main: string;
	keyEvents: Block[];
	blocks: Block[];
	pagination?: Pagination;
	author: AuthorType;

	/**
	 * @TJS-format date-time
	 */
	webPublicationDate: string;

	webPublicationDateDisplay: string;
	webPublicationSecondaryDateDisplay: string;
	editionLongForm: string;
	editionId: Edition;
	pageId: string;
	version: number; // TODO: check who uses?
	tags: TagType[];
	format: CAPIFormat;

	// Include pillar and designType until we remove them upstream
	// We type designType as `string` for now so that the field is present,
	// but we don't care what's in it. Pillar we have a type for so we use it
	// but it shouldn't be important.
	designType: string;
	pillar: LegacyPillar;

	isImmersive: boolean;
	sectionLabel: string;
	sectionUrl: string;
	sectionName?: string;
	subMetaSectionLinks: SimpleLinkType[];
	subMetaKeywordLinks: SimpleLinkType[];
	shouldHideAds: boolean;
	isAdFreeUser: boolean;
	openGraphData: { [key: string]: string };
	twitterData: { [key: string]: string };
	webURL: string;
	linkedData: { [key: string]: any }[];
	config: ConfigType;

	showBottomSocialButtons: boolean;
	shouldHideReaderRevenue: boolean;

	// AMP specific (for now)
	guardianBaseURL: string;
	contentType: string;
	hasRelated: boolean;
	publication: string; // TODO: check who uses?
	hasStoryPackage: boolean;
	beaconURL: string;
	isCommentable: boolean;
	commercialProperties: CommercialProperties;
	starRating?: number;
	trailText: string;
	badge?: BadgeType;

	nav: CAPINavType; // TODO move this out as most code uses a different internal NAV model.

	pageFooter: FooterType;

	contributionsServiceUrl: string;
	slotMachineFlags?: string;

	pageType: PageTypeType;

	matchUrl?: string;
	isSpecialReport: boolean;

	anniversaryInteractiveAtom?: InteractiveAtomBlockElement; // TEMPORARY, to be removed following 200th anniversary
}

// Browser data models. Note the CAPI prefix here means something different to
// the models above.

type CAPIBrowserType = {
	format: CAPIFormat;
	config: ConfigTypeBrowser;
	editionId: Edition;
	editionLongForm: string;
	contentType: string;
	sectionName?: string;
	shouldHideReaderRevenue: boolean;
	pageType: {
		isMinuteArticle: boolean;
		isPaidContent: boolean;
		hasShowcaseMainElement: boolean;
	};
	hasRelated: boolean;
	hasStoryPackage: boolean;
	shouldHideAds: boolean;
	isAdFreeUser: boolean;
	pageId: string;
	tags: TagType[];
	isCommentable: boolean;
	nav: {
		readerRevenueLinks: {
			footer: ReaderRevenueCategories;
			header: ReaderRevenueCategories;
		};
	};
	contributionsServiceUrl: string;
	isImmersive: boolean;
	isPhotoEssay: boolean;
	isSpecialReport: boolean;
	isLiveBlog: boolean;
	isLive: boolean;
	matchUrl?: string;
	elementsToHydrate: CAPIElement[];
	isPreview?: boolean;
	webTitle: string;
	stage: string;
};

interface TagType {
	id: string;
	type: string;
	title: string;
	twitterHandle?: string;
	paidContentType?: string;
	bylineImageUrl?: string;
}

interface BadgeType {
	seriesTag: string;
	imageUrl: string;
}

type ImagePositionType = 'left' | 'top' | 'right';

type SmallHeadlineSize = 'tiny' | 'small' | 'medium' | 'large';

type AvatarType = {
	src: string;
	alt: string;
};

type MediaType = 'Video' | 'Audio' | 'Gallery';

type LineEffectType = 'squiggly' | 'dotted' | 'straight';

type ShareIconSize = 'small' | 'medium';

type LeftColSize = 'compact'|'wide';

type CardPercentageType = '25%' | '33%' | '50%' | '67%' | '75%' | '100%';

type HeadlineLink = {
	to: string; // the href for the anchor tag
	visitedColour?: string; // a custom colour for the :visited state
	preventFocus?: boolean; // if true, stop the link from being tabbable and focusable
};

type UserBadge = {
	name: string;
};

type UserProfile = {
	userId: string;
	displayName: string;
	webUrl: string;
	apiUrl: string;
	avatar: string;
	secureAvatarUrl: string;
	badge: UserBadge[];

	// only included from /profile/me endpoint
	privateFields?: {
		canPostComment: boolean;
		isPremoderated: boolean;
		hasCommented: boolean;
	};
};

/**
 * Football
 */
type TeamType = {
	id: string;
	name: string;
	codename: string;
	players: PlayerType[];
	possession: number;
	shotsOn: number;
	shotsOff: number;
	corners: number;
	fouls: number;
	colours: string;
	score: number;
	crest: string;
	scorers: string[];
};

type PlayerType = {
	id: string;
	name: string;
	position: string;
	lastName: string;
	substitute: boolean;
	timeOnPitch: string;
	shirtNumber: string;
	events: EventType[];
};

type EventType = {
	eventTime: string; // minutes
	eventType: 'substitution' | 'dismissal' | 'booking';
};

type MatchReportType = {
	id: string;
	isResult: boolean;
	homeTeam: TeamType;
	awayTeam: TeamType;
	competition: {
		fullName: string;
	};
	isLive: boolean;
	venue: string;
	comments: string;
	minByMinUrl: string;
}

/**
 * Onwards
 */
type OnwardsType = {
	heading: string;
	trails: TrailType[];
	description?: string;
	url?: string;
	ophanComponentName: OphanComponentName;
    format: Format;
	isCuratedContent?: boolean;
    isFullCardImage?: boolean;
};

type OphanComponentName =
	| 'series'
	| 'more-on-this-story'
	| 'related-stories'
	| 'related-content'
	| 'more-media-in-section'
	| 'more-galleries'
	| 'curated-content'
	| 'default-onwards'; // We should never see this in the analytics data!

interface CommercialConfigType {
	isPaidContent?: boolean;
	pageId: string;
	webPublicationDate?: number;
	headline?: string;
	author?: string;
	keywords?: string;
	section?: string;
	edition?: string;
	series?: string;
	toneIds?: string;
	contentType: string;
	ampIframeUrl: string;
}

/**
 * the config model will contain useful app/site
 * level data. Although currently derived from the config model
 * constructed in frontend and passed to dotcom-rendering
 * this data could eventually be defined in dotcom-rendering
 */
interface ConfigType extends CommercialConfigType {
	ajaxUrl: string;
	sentryPublicApiKey: string;
	sentryHost: string;
	dcrSentryDsn: string;
	switches: { [key: string]: boolean };
	abTests: { [key: string]: string };
	dfpAccountId: string;
	commercialBundleUrl: string;
	revisionNumber: string;
	shortUrlId: string;
	isDev?: boolean;
	googletagUrl: string;
	stage: string;
	frontendAssetsFullURL: string;
	adUnit: string;
	isSensitive: boolean;
	videoDuration?: number;
	edition: string;
	section: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	sharedAdTargeting: { [key: string]: any };
	isPaidContent?: boolean;
	keywordIds: string;
	showRelatedContent: boolean;
	shouldHideReaderRevenue?: boolean;
	idApiUrl: string;
	discussionApiUrl: string;
	discussionD2Uid: string;
	discussionApiClientHeader: string;
	isPhotoEssay?: boolean;
	references?: { [key: string]: string }[];
	host?: string;
	idUrl?: string;
	mmaUrl?: string;
	brazeApiKey?: string;
	ipsosTag?: string;
	isLiveBlog?: boolean;
	isLive?: boolean;
	isPreview?: boolean;
}

interface ConfigTypeBrowser {
	frontendAssetsFullURL: string;
	isDev: boolean;
	ajaxUrl: string;
	shortUrlId: string;
	pageId: string;
	isPaidContent: boolean;
	showRelatedContent: boolean;
	keywordIds: string;
	ampIframeUrl: string;
	ampPrebid: boolean;
	permutive: boolean;
	enableSentryReporting: boolean;
	enableDiscussionSwitch: boolean;
	slotBodyEnd: boolean;
	isSensitive: boolean;
	videoDuration: number;
	edition: string;
	section: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	sharedAdTargeting: { [key: string]: any };
	adUnit: string;
	idApiUrl: string;
	discussionApiUrl: string;
	discussionD2Uid: string;
	discussionApiClientHeader: string;
	dcrSentryDsn: string;
	remoteBanner: boolean;
	remoteHeader: boolean;
	puzzlesBanner: boolean;
	ausMoment2020Header: boolean;
	switches: CAPIType['config']['switches'];
	abTests: CAPIType['config']['abTests'];
	host?: string;
	idUrl?: string;
	mmaUrl?: string;
}

interface GADataType {
	pillar: LegacyPillar;
	webTitle: string;
	section: string;
	contentType: string;
	commissioningDesks: string;
	contentId: string;
	authorIds: string;
	keywordIds: string;
	toneIds: string;
	seriesId: string;
	isHosted: string;
	edition: Edition;
	beaconUrl: string;
}

// ----------------- //
// General DataTypes //
// ----------------- //

interface DCRServerDocumentData {
	page: string;
	site: string;
	CAPI: CAPIType;
	NAV: NavType;
	GA: GADataType;
	linkedData: { [key: string]: any; };
}

interface BrowserNavType {
	currentNavLink: string;
	subNavSections?: SubNavType;
}

interface DCRBrowserDocumentData {
	page: string;
	site: string;
	CAPI: CAPIBrowserType;
	NAV: BrowserNavType;
	GA: GADataType;
	linkedData: { [key: string]: any; };
}

// All Components that are loaded with loadable
// should be added here, this is the chunk name as
// defined in loadable-manifest-browser.json
type BlockElementType = string;
interface ComponentNameChunkMap {
    chunkName: string;
    addWhen: BlockElementType | 'always';
}
interface EditionDropdownLoadable extends ComponentNameChunkMap{
    chunkName: 'EditionDropdown';
    addWhen: 'always';
}
interface YoutubeBlockLoadable extends ComponentNameChunkMap {
    chunkName: 'elements-YoutubeBlockComponent';
    addWhen: YoutubeBlockElement['_type'];
}

interface RichLinkBlockLoadable extends ComponentNameChunkMap {
    chunkName: 'elements-RichLinkComponent';
    addWhen: RichLinkBlockElement['_type'];
}

interface InteractiveBlockLoadaable extends ComponentNameChunkMap {
    chunkName: 'elements-InteractiveBlockComponent';
    addWhen: InteractiveBlockElement['_type'];
}

// There are docs on loadable in ./docs/loadable-components.md
type LoadableComponents = [EditionDropdownLoadable, YoutubeBlockLoadable, RichLinkBlockLoadable, InteractiveBlockLoadaable]

interface CarouselImagesMap {
	'300'?: string;
	'460'?: string;
}
interface BaseTrailType {
    url: string;
    headline: string;
    isLiveBlog: boolean;
    webPublicationDate: string;
    image?: string;
	carouselImages?: CarouselImagesMap;
    avatarUrl?: string;
    mediaType?: MediaType;
    mediaDuration?: number;
    ageWarning?: string;
    byline?: string;
    showByline?: boolean;
    kickerText?: string;
    shortUrl?: string;
    commentCount?: number;
    starRating?: number;
    linkText?: string;
	branding?: Branding
}
interface TrailType extends BaseTrailType {
	palette: Palette;
	format: Format;
}

interface CAPITrailType extends BaseTrailType {
	format: CAPIFormat;
	// Include pillar and designType until we remove them upstream
	// We type designType as `string` for now so that the field is present,
	// but we don't care what's in it. Pillar we have a type for so we use it
	// but it shouldn't be important.
	designType: string;
	pillar: LegacyPillar;
}

interface TrailTabType {
	heading: string;
	trails: TrailType[];
}

interface CAPITrailTabType {
	heading: string;
	trails: CAPITrailType[];
}

interface MostViewedFooterPayloadType {
	tabs: CAPITrailTabType[];
	mostCommented: CAPITrailType;
	mostShared: CAPITrailType;
}

// ------------
// RichLinks //
// ------------
type RichLinkCardType =
	| 'special-report'
	| 'live'
	| 'dead'
	| 'feature'
	| 'editorial'
	| 'comment'
	| 'podcast'
	| 'media'
	| 'analysis'
	| 'review'
	| 'letters'
	| 'external'
	| 'news';

// ----------
// AdSlots //
// ----------
type AdSlotType =
	| 'right'
	| 'top-above-nav'
	| 'mostpop'
	| 'merchandising-high'
	| 'merchandising'
	| 'comments'
	| 'survey';

// ------------------------------
// 3rd party type declarations //
// ------------------------------
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'dompurify' {
	const createDOMPurify: any;
	export default createDOMPurify;
}
declare module 'compose-function' {
	const compose: any;
	export default compose;
}
declare module 'minify-css-string' {
	const minifyCSSString: any;
	export default minifyCSSString;
}
declare module 'chromatic/isChromatic';
/* eslint-enable @typescript-eslint/no-explicit-any */

declare module 'dynamic-import-polyfill' {
	export const initialize: any;
}

// ------------------------------------- //
// AMP types                             //
// ------------------------------------- //

declare namespace JSX {
	/* eslint-disable @typescript-eslint/no-explicit-any */
	interface IntrinsicElements {
		'amp-state': any;
		'amp-form': any;
		'amp-experiment': any;
		'amp-sidebar': any;
		'amp-accordion': any;
		'amp-img': any;
		'amp-twitter': any;
		'amp-list': any;
		'amp-vimeo': any;
		'amp-facebook': any;
		'amp-video': any;
		'amp-instagram': any;
		'amp-soundcloud': any;
		'amp-iframe': any;
		'amp-analytics': any;
		'amp-pixel': any;
		'amp-ad': any;
		'amp-sticky-ad': any;
		'amp-youtube': any;
		'amp-geo': any;
		'amp-consent': any;
		'amp-live-list': any;
		'amp-audio': any;
		'amp-embed': any;
	}
	/* eslint-enable @typescript-eslint/no-explicit-any */
}

// SVG handling
declare module '*.svg' {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const content: any;
	export default content;
}

// Extend PerformanceEntry from lib.dom.ts with current 'In Draft' properties (to allow access as use in browsers that support)
// lib.dom.ts: https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.performanceentry.html
// Draft: https://wicg.github.io/element-timing/#sec-performance-element-timing
interface PerformanceEntry {
	loadTime: number;
	renderTime: number;
}
