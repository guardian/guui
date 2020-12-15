// ------------------------  //
// CAPIType and its subtypes //
// ------------------------- //

// Pillars are used for styling
// RealPillars have Pillar palette colours
// FakePillars allow us to make modifications to style based on rules outside of the pillar of an article
type RealPillars = 'news' | 'opinion' | 'sport' | 'culture' | 'lifestyle';
type FakePillars = 'labs';
type Pillar = RealPillars | FakePillars;

declare const enum Display {
    Standard,
    Immersive,
    Showcase,
}

// https://github.com/guardian/content-api-scala-client/blob/master/client/src/main/scala/com.gu.contentapi.client/utils/DesignType.scala
type DesignType =
    | 'Article'
    | 'Immersive'
    | 'Media'
    | 'Review'
    | 'Analysis'
    | 'Comment'
    | 'Feature'
    | 'Live'
    | 'SpecialReport'
    | 'Recipe'
    | 'MatchReport'
    | 'Interview'
    | 'GuardianView'
    | 'GuardianLabs'
    | 'Quiz'
    | 'AdvertisementFeature'
    | 'PhotoEssay';

// This is an object that allows you Type defaults of the designTypes.
// The return type looks like: { Feature: any, Live: any, ...}
// and can be used to add TypeSafety when needing to override a style in a designType
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DesignTypesObj = { [key in DesignType]: any };

type Edition = 'UK' | 'US' | 'INT' | 'AU';

type SharePlatform =
    | 'facebook'
    | 'twitter'
    | 'email'
    | 'whatsApp'
    | 'pinterest'
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

interface Branding {
    brandingType?: { name: string };
    sponsorName: string;
    logo: {
        src: string;
        link: string;
        label: string;
        dimensions: { width: number; height: number };
    };
    aboutThisLink: string;
    logoForDarkBackground?: {
        src: string;
        dimensions: { width: number; height: number };
        link: string;
        label: string;
    };
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

interface NavType {
    pillars: PillarType[];
    otherLinks: MoreType;
    brandExtensions: LinkType[];
    currentNavLink: string;
    subNavSections?: SubNavType;
    readerRevenueLinks: ReaderRevenuePositions;
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
    createdOn?: number;
    createdOnDisplay?: string;
    lastUpdated?: number;
    lastUpdatedDisplay?: string;
    title?: string;
    firstPublished?: number;
    firstPublishedDisplay?: string;
    primaryDateLine: string;
    secondaryDateLine: string;
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
    editionLongForm: string;
    editionId: Edition;
    pageId: string;
    version: number; // TODO: check who uses?
    tags: TagType[];
    pillar: Pillar;
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
    linkedData: object[];
    config: ConfigType;
    designType: DesignType;
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nav: any; // as not extracting directly into NavType here for now (nav stuff is getting moved out)

    pageFooter: FooterType;

    contributionsServiceUrl: string;
    slotMachineFlags?: string;

    pageType: PageTypeType;

    matchUrl?: string;
}

type CAPIBrowserType = {
    designType: DesignType;
    pillar: Pillar;
    config: ConfigTypeBrowser;
    richLinks: RichLinkBlockElement[];
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
    matchUrl?: string;
    callouts: CalloutBlockElement[];
    qandaAtoms: QABlockElement[];
    guideAtoms: GuideAtomBlockElement[];
    profileAtoms: ProfileAtomBlockElement[];
    timelineAtoms: TimelineBlockElement[];
    chartAtoms: ChartAtomBlockElement[];
    audioAtoms: AudioAtomBlockElement[];
    youtubeBlockElement: YoutubeBlockElement[];
    youtubeMainMediaBlockElement: YoutubeBlockElement[];
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

// Defines a prefix to be used with a headline (e.g. 'Live /')
interface KickerType {
    text: string;
    designType: DesignType;
    pillar: Pillar;
    showPulsingDot?: boolean;
    showSlash?: boolean;
    inCard?: boolean; // True when headline is showing inside a card (used to handle coloured backgrounds)
}

type ImagePositionType = 'left' | 'top' | 'right';

type SmallHeadlineSize = 'tiny' | 'small' | 'medium' | 'large';

type AvatarType = {
    src: string;
    alt: string;
};

type MediaType = 'Video' | 'Audio' | 'Gallery';

type LineEffectType = 'squiggly' | 'dotted' | 'straight';

interface CardType {
    linkTo: string;
    pillar: Pillar;
    designType: DesignType;
    headlineText: string;
    headlineSize?: SmallHeadlineSize;
    showQuotes?: boolean; // Even with designType !== Comment, a piece can be opinion
    byline?: string;
    isLiveBlog?: boolean; // When designType === 'Live', this denotes if the liveblog is active or not
    showByline?: boolean;
    webPublicationDate?: string;
    imageUrl?: string;
    imagePosition?: ImagePositionType;
    imageSize?: ImageSizeType; // Size is ignored when position = 'top' because in that case the image flows based on width
    standfirst?: string;
    avatar?: AvatarType;
    showClock?: boolean;
    mediaType?: MediaType;
    mediaDuration?: number;
    // Kicker
    kickerText?: string;
    showPulsingDot?: boolean;
    showSlash?: boolean;
    commentCount?: number;
    starRating?: number;
}

type ImageSizeType = 'small' | 'medium' | 'large' | 'jumbo';
type CardPercentageType = '25%' | '33%' | '50%' | '67%' | '75%' | '100%';

type HeadlineLink = {
    to: string; // the href for the anchor tag
    visitedColour?: string; // a custom colour for the :visited state
    preventFocus?: boolean; // if true, stop the link from being tabbable and focusable
};

interface LinkHeadlineType {
    designType: DesignType;
    headlineText: string; // The text shown
    pillar: Pillar; // Used to colour the headline (dark) and the kicker (main)
    showUnderline?: boolean; // Some headlines have text-decoration underlined when hovered
    kickerText?: string;
    showPulsingDot?: boolean;
    showSlash?: boolean;
    showQuotes?: boolean; // When true the QuoteIcon is shown
    size?: SmallHeadlineSize;
    link?: HeadlineLink; // An optional link object configures if/how the component renders an anchor tag
    byline?: string;
}

interface CardHeadlineType {
    headlineText: string; // The text shown
    designType: DesignType; // Used to decide when to add type specific styles
    pillar: Pillar; // Used to colour the headline (dark) and the kicker (main)
    kickerText?: string;
    showPulsingDot?: boolean;
    showSlash?: boolean;
    showQuotes?: boolean; // Even with designType !== Comment, a piece can be opinion
    size?: SmallHeadlineSize;
    byline?: string;
    showByline?: boolean;
}

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

/**
 * Onwards
 */
type OnwardsType = {
    heading: string;
    trails: TrailType[];
    description?: string;
    url?: string;
    ophanComponentName: OphanComponentName;
    pillar: Pillar;
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
    hbImpl: object | string;
    adUnit: string;
    isSensitive: boolean;
    videoDuration: number;
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
    isPhotoEssay: boolean;
    references?: { [key: string]: string }[];
    host?: string;
    idUrl?: string;
    brazeApiKey?: string;
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
    ausMoment2020Header: boolean;
    switches: CAPIType['config']['switches'];
    host?: string;
    idUrl?: string;
}

interface GADataType {
    pillar: Pillar;
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
    linkedData: object;
}

interface DCRBrowserDocumentData {
    page: string;
    site: string;
    CAPI: CAPIBrowserType;
    NAV: SubNavBrowserType;
    GA: GADataType;
    linkedData: object;
}

interface Props {
    data: DCRServerDocumentData; // Do not fall to the tempation to rename 'data' into something else
}

type JSXElements = JSX.Element | JSX.Element[];

type IslandType =
    | 'reader-revenue-links-header'
    | 'sub-nav-root'
    | 'edition-root'
    | 'most-viewed-right'
    | 'share-comment-counts'
    | 'most-viewed-footer'
    | 'reader-revenue-links-footer'
    | 'slot-body-end'
    | 'bottom-banner'
    | 'onwards-upper-whensignedin'
    | 'onwards-upper-whensignedout'
    | 'onwards-lower-whensignedin'
    | 'onwards-lower-whensignedout'
    | 'rich-link'
    | 'links-root'
    | 'match-nav'
    | 'match-stats'
    | 'callout'
    | 'comments'
    | 'qanda-atom'
    | 'guide-atom'
    | 'profile-atom'
    | 'timeline-atom'
    | 'sign-in-gate'
    | 'audio-atom'
    | 'youtube-block'
    | 'youtube-block-main-media'
    | 'chart-atom';

interface TrailType {
    designType: DesignType;
    pillar: Pillar;
    url: string;
    headline: string;
    isLiveBlog: boolean;
    webPublicationDate: string;
    image?: string;
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
}

interface TrailTabType {
    heading: string;
    trails: TrailType[];
}

interface MostViewedFooterPayloadType {
    tabs: TrailTabType[];
    mostCommented: TrailType;
    mostShared: TrailType;
}

// ----------
// AdSlots //
// ----------
type AdSlotType =
    | 'right'
    | 'top-above-nav'
    | 'mostpop'
    | 'merchandising-high'
    | 'merchandising'
    | 'comments';

interface AdSlotParameters {
    name: AdSlotType;
    adTypes: string[];
    sizeMapping: {
        [key: string]: string[];
    };
    showLabel?: boolean;
    refresh?: boolean;
    outOfPage?: boolean;
    optId?: string;
    optClassNames?: string[];
}

// ------------------------------
// 3rd party type declarations //
// ------------------------------
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'emotion-server' {
    export const extractCritical: any;
}
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
        'amp-animation': any;
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
