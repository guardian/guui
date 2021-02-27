// -------------------------------------
// Elements
// -------------------------------------
interface ThirdPartyEmbeddedContent {
	isThirdPartyTracking: boolean;
	source?: string;
	sourceDomain?: string;
}

interface InteractiveAtomBlockElementBase {
	url: string;
	placeholderUrl?: string;
	id?: string;
	html?: string;
	css?: string;
	js?: string;
}

interface AudioAtomBlockElement {
	_type: 'model.dotcomrendering.pageElements.AudioAtomBlockElement';
	id: string;
	kicker: string;
	title?: string;
	trackUrl: string;
	duration: number;
	coverUrl: string;
	audioIndex?: number;
	role?: RoleType;
}

interface AudioBlockElement {
	_type: 'model.dotcomrendering.pageElements.AudioBlockElement';
}

interface BlockquoteBlockElement {
	_type: 'model.dotcomrendering.pageElements.BlockquoteBlockElement';
	html: string;
	quoted?: boolean;
}

interface CaptionBlockElement {
	_type: 'model.dotcomrendering.pageElements.CaptionBlockElement';
	captionText?: string;
	padCaption?: boolean;
	credit?: string;
	displayCredit?: boolean;
	shouldLimitWidth?: boolean;
	isOverlayed?: boolean;
}

interface CalloutBlockElement {
	_type: 'model.dotcomrendering.pageElements.CalloutBlockElement';
	id: string;
	calloutsUrl: string;
	activeFrom: number;
	displayOnSensitive: boolean;
	formId: number;
	title: string;
	description: string;
	tagName: string;
	formFields: CampaignFieldType[];
	calloutIndex?: number;
	role?: RoleType;
}

interface ChartAtomBlockElement extends InteractiveAtomBlockElementBase {
	_type: 'model.dotcomrendering.pageElements.ChartAtomBlockElement';
	chartIndex?: number;
	id: string;
	html: string;
	role?: RoleType;
}

interface QuizAtomBlockElement {
	_type: 'model.dotcomrendering.pageElements.QuizAtomBlockElement';
	quizType: 'personality' | 'knowledge';
	quizIndex?: number;
	id: string;
	questions: QuestionType[];
	resultBuckets: ResultBucketsType[];
	resultGroups: {
		id: string;
		title: string;
		shareText: string;
		minScore: number;
	}[];
}

interface CodeBlockElement {
	_type: 'model.dotcomrendering.pageElements.CodeBlockElement';
	code: string;
	isMandatory: boolean;
	language?: Language;
}

interface CommentBlockElement {
	_type: 'model.dotcomrendering.pageElements.CommentBlockElement';
	body: string;
	avatarURL: string;
	profileURL: string;
	profileName: string;
	permalink: string;
	dateTime: string;
	role?: RoleType;
}

interface ContentAtomBlockElement {
	_type: 'model.dotcomrendering.pageElements.ContentAtomBlockElement';
	atomId: string;
}

interface DisclaimerBlockElement {
	_type: 'model.dotcomrendering.pageElements.DisclaimerBlockElement';
	html: string;
	role?: RoleType;
}

interface DividerBlockElement {
	_type: 'model.dotcomrendering.pageElements.DividerBlockElement';
}

interface DocumentBlockElement extends ThirdPartyEmbeddedContent {
	_type: 'model.dotcomrendering.pageElements.DocumentBlockElement';
	embedUrl: string;
	height: number;
	width: number;
	title?: string;
	role?: RoleType;
	documentIndex?: number;
}

interface EmbedBlockElement extends ThirdPartyEmbeddedContent {
	_type: 'model.dotcomrendering.pageElements.EmbedBlockElement';
	safe?: boolean;
	role?: RoleType;
	alt?: string;
	height?: number;
	width?: number;
	html: string;
	isMandatory: boolean;
	embedIndex?: number;
}

interface ExplainerAtomBlockElement {
	_type: 'model.dotcomrendering.pageElements.ExplainerAtomBlockElement';
	id: string;
	title: string;
	body: string;
	role?: RoleType;
}

interface GenericAtomBlockElement extends InteractiveAtomBlockElementBase {
	_type: 'model.dotcomrendering.pageElements.GenericAtomBlockElement';
}

interface GuideAtomBlockElement {
	_type: 'model.dotcomrendering.pageElements.GuideAtomBlockElement';
	id: string;
	label: string;
	title: string;
	img?: string;
	html: string;
	credit: string;
	guideIndex?: number;
	role?: RoleType;
}

interface GuVideoBlockElement {
	_type: 'model.dotcomrendering.pageElements.GuVideoBlockElement';
	assets: VideoAssets[];
	caption: string;
	html: string;
	source: string;
	role?: RoleType;
	imageMedia?: { allImages: Image[] };
	originalUrl?: string;
	url?: string;
}

interface HighlightBlockElement {
	_type: 'model.dotcomrendering.pageElements.HighlightBlockElement';
	html: string;
}

interface ImageBlockElement {
	_type: 'model.dotcomrendering.pageElements.ImageBlockElement';
	media: { allImages: Image[] };
	data: {
		alt?: string;
		credit?: string;
		caption?: string;
		copyright?: string;
	};
	imageSources: ImageSource[];
	displayCredit?: boolean;
	role: RoleType;
	title?: string;
}

interface InstagramBlockElement extends ThirdPartyEmbeddedContent {
	_type: 'model.dotcomrendering.pageElements.InstagramBlockElement';
	html: string;
	url: string;
	hasCaption: boolean;
	role?: RoleType;
	instagramIndex?: number;
}

interface InteractiveAtomBlockElement extends InteractiveAtomBlockElementBase {
	_type: 'model.dotcomrendering.pageElements.InteractiveAtomBlockElement';
	id: string;
	js: string;
	html?: string;
	css?: string;
	role?: RoleType;
}

interface InteractiveBlockElement {
	_type: 'model.dotcomrendering.pageElements.InteractiveBlockElement';
	url?: string;
	isMandatory?: boolean;
	scriptUrl?: string;
	alt?: string;
	role?: RoleType;
}

interface MapBlockElement extends ThirdPartyEmbeddedContent {
	_type: 'model.dotcomrendering.pageElements.MapBlockElement';
	embedUrl: string;
	originalUrl: string;
	title: string;
	source: string;
	height: number;
	width: number;
	caption?: string;
	role?: RoleType;
	mapIndex?: number;
}

interface MediaAtomBlockElement {
	_type: 'model.dotcomrendering.pageElements.MediaAtomBlockElement';
	id: string;
	assets: VideoAssets[];
	posterImage?: {
		url: string;
		width: number;
	}[];
	title?: string;
	duration?: number;
}

interface MultiImageBlockElement {
	_type: 'model.dotcomrendering.pageElements.MultiImageBlockElement';
	images: ImageBlockElement[];
	caption?: string;
	role?: RoleType;
}

interface ProfileAtomBlockElement {
	_type: 'model.dotcomrendering.pageElements.ProfileAtomBlockElement';
	id: string;
	label: string;
	title: string;
	img?: string;
	html: string;
	credit: string;
	profileIndex?: number;
	role?: RoleType;
}

interface PullquoteBlockElement {
	_type: 'model.dotcomrendering.pageElements.PullquoteBlockElement';
	html?: string;
	role: string;
	attribution?: string;
	isThirdPartyTracking?: boolean;
}

interface QABlockElement {
	_type: 'model.dotcomrendering.pageElements.QABlockElement';
	id: string;
	title: string;
	img?: string;
	html: string;
	credit: string;
	qandaIndex?: number;
	role?: RoleType;
}

interface RichLinkBlockElement {
	_type: 'model.dotcomrendering.pageElements.RichLinkBlockElement';
	url: string;
	text: string;
	prefix: string;
	role?: Weighting;
	richLinkIndex?: number;
}

interface SoundcloudBlockElement extends ThirdPartyEmbeddedContent {
	_type: 'model.dotcomrendering.pageElements.SoundcloudBlockElement';
	html: string;
	id: string;
	isTrack: boolean;
	isMandatory: boolean;
	role?: RoleType;
}

interface SpotifyBlockElement extends ThirdPartyEmbeddedContent {
	_type: 'model.dotcomrendering.pageElements.SpotifyBlockElement';
	embedUrl?: string;
	title?: string;
	height?: number;
	width?: number;
	caption?: string;
	role?: RoleType;
	spotifyIndex?: number;
}

interface SubheadingBlockElement {
	_type: 'model.dotcomrendering.pageElements.SubheadingBlockElement';
	html: string;
}

interface TableBlockElement {
	_type: 'model.dotcomrendering.pageElements.TableBlockElement';
	isMandatory: boolean;
	html: string;
	role?: RoleType;
}

interface TextBlockElement {
	_type: 'model.dotcomrendering.pageElements.TextBlockElement';
	dropCap?: boolean;
	html: string;
}

interface TimelineBlockElement {
	_type: 'model.dotcomrendering.pageElements.TimelineBlockElement';
	id: string;
	title: string;
	description?: string;
	events: TimelineEvent[];
	timelineIndex?: number;
	role?: RoleType;
}

interface TweetBlockElement extends ThirdPartyEmbeddedContent {
	_type: 'model.dotcomrendering.pageElements.TweetBlockElement';
	html: string;
	url: string;
	id: string;
	hasMedia: boolean;
	role?: RoleType;
}

interface VineBlockElement extends ThirdPartyEmbeddedContent {
	_type: 'model.dotcomrendering.pageElements.VineBlockElement';
	url: string;
	height: number;
	width: number;
	originalUrl: string;
	title: string;
	vineBlockIndex?: number;
}

interface VideoBlockElement extends ThirdPartyEmbeddedContent {
	_type: 'model.dotcomrendering.pageElements.VideoBlockElement';
	role?: RoleType;
}

interface VideoFacebookBlockElement extends ThirdPartyEmbeddedContent {
	_type: 'model.dotcomrendering.pageElements.VideoFacebookBlockElement';
	url: string;
	height: number;
	width: number;
	caption?: string;
	embedUrl?: string;
	role?: RoleType;
	videoFacebookIndex?: number;
}

interface VideoVimeoBlockElement extends ThirdPartyEmbeddedContent {
	_type: 'model.dotcomrendering.pageElements.VideoVimeoBlockElement';
	embedUrl?: string;
	url: string;
	height: number;
	width: number;
	caption?: string;
	credit?: string;
	title?: string;
	originalUrl?: string;
	role?: RoleType;
}

interface VideoYoutubeBlockElement extends ThirdPartyEmbeddedContent {
	_type: 'model.dotcomrendering.pageElements.VideoYoutubeBlockElement';
	embedUrl?: string;
	url: string;
	originalUrl: string;
	height: number;
	width: number;
	caption?: string;
	credit?: string;
	title?: string;
	role?: RoleType;
}

interface YoutubeBlockElement {
	_type: 'model.dotcomrendering.pageElements.YoutubeBlockElement';
	assetId: string;
	mediaTitle: string;
	id: string;
	channelId?: string;
	duration?: number;
	posterImage?: {
		url: string;
		width: number;
	}[];
	expired: boolean;
	overrideImage?: string;
	altText?: string;
	youtubeIndex?: number;
	role?: RoleType;
}

interface WitnessTypeDataBase {
	authorUsername: string;
	authorGuardianProfileUrl: string;
	originalUrl: string;
	source: string;
	title: string;
	url: string;
	dateCreated: string;
	apiUrl: string;
	authorName: string;
	witnessEmbedType: string;
	html?: string;
	authorWitnessProfileUrl: string;
}

interface WitnessTypeDataImage extends WitnessTypeDataBase {
	_type: 'model.dotcomrendering.pageElements.WitnessTypeDataImage';
	type: 'image';
	alt: string;
	caption: string;
	mediaId: string;
	photographer: string;
}

interface WitnessTypeDataVideo extends WitnessTypeDataBase {
	_type: 'model.dotcomrendering.pageElements.WitnessTypeDataVideo';
	type: 'video';
	description: string;
	youtubeHtml: string;
	youtubeDescription: string;
	youtubeUrl: string;
	width: number;
	youtubeSource: string;
	youtubeAuthorName: string;
	height: number;
	youtubeTitle: string;
}

interface WitnessTypeDataText extends WitnessTypeDataBase {
	_type: 'model.dotcomrendering.pageElements.WitnessTypeDataText';
	type: 'text';
	description: string;
	authorUsername: string;
	originalUrl: string;
	source: string;
	title: string;
	url: string;
	dateCreated: string;
	apiUrl: string;
	authorName: string;
	witnessEmbedType: string;
	authorWitnessProfileUrl: string;
}

interface WitnessAssetType {
	type: 'Image';
	mimeType: 'image/jpeg';
	file: string;
	typeData: {
		name: string;
	};
}
interface WitnessTypeBlockElement extends ThirdPartyEmbeddedContent {
	_type: 'model.dotcomrendering.pageElements.WitnessBlockElement';
	assets: WitnessAssetType[];

	isThirdPartyTracking: boolean;

	witnessTypeData:
		| WitnessTypeDataImage
		| WitnessTypeDataVideo
		| WitnessTypeDataText;
}

type CAPIElement =
	| AudioAtomBlockElement
	| AudioBlockElement
	| BlockquoteBlockElement
	| CaptionBlockElement
	| CalloutBlockElement
	| ChartAtomBlockElement
	| CodeBlockElement
	| CommentBlockElement
	| ContentAtomBlockElement
	| DisclaimerBlockElement
	| DividerBlockElement
	| DocumentBlockElement
	| EmbedBlockElement
	| ExplainerAtomBlockElement
	| GenericAtomBlockElement
	| GuideAtomBlockElement
	| GuVideoBlockElement
	| HighlightBlockElement
	| ImageBlockElement
	| InstagramBlockElement
	| InteractiveAtomBlockElement
	| InteractiveBlockElement
	| MapBlockElement
	| MediaAtomBlockElement
	| MultiImageBlockElement
	| ProfileAtomBlockElement
	| PullquoteBlockElement
	| QABlockElement
	| QuizAtomBlockElement
	| RichLinkBlockElement
	| SoundcloudBlockElement
	| SpotifyBlockElement
	| SubheadingBlockElement
	| TableBlockElement
	| TextBlockElement
	| TimelineBlockElement
	| TweetBlockElement
	| VideoBlockElement
	| VideoFacebookBlockElement
	| VideoVimeoBlockElement
	| VideoYoutubeBlockElement
	| VineBlockElement
	| YoutubeBlockElement
	| WitnessTypeBlockElement;

// -------------------------------------
// Misc
// -------------------------------------

type Weighting =
	| 'inline'
	| 'thumbnail'
	| 'supporting'
	| 'showcase'
	| 'halfwidth'
	| 'immersive';

// aka weighting. RoleType affects how an image is placed. It is called weighting
// in Composer but role in CAPI. We respect CAPI so we maintain this nomenclature
// in DCR
type RoleType =
	| 'immersive'
	| 'supporting'
	| 'showcase'
	| 'inline'
	| 'thumbnail'
	| 'halfWidth';

interface ImageSource {
	weighting: Weighting;
	srcSet: SrcSetItem[];
}

interface SrcSetItem {
	src: string;
	width: number;
}

interface Image {
	index: number;
	fields: {
		height: string;
		width: string;
		isMaster?: string;
		source?: string;
		caption?: string;
	};
	mediaType: string;
	mimeType: string;
	url: string;
}

interface VideoAssets {
	url: string;
	mimeType: string;
	fields?: {
		source?: string;
		embeddable?: string;
		height?: string;
		width?: string;
		caption?: string;
	};
}

interface TimelineEvent {
	title: string;
	date: string;
	body?: string;
	toDate?: string;
}

interface Switches {
	[key: string]: boolean;
}

// Used for CodeBlockElement
type Language =
	| 'typescript'
	| 'javascript'
	| 'css'
	| 'markup'
	| 'scala'
	| 'elm';

// -------------------------------------
// Callout Campaign
// -------------------------------------

type CampaignFieldType =
	| CampaignFieldText
	| CampaignFieldTextArea
	| CampaignFieldFile
	| CampaignFieldRadio
	| CampaignFieldCheckbox
	| CampaignFieldSelect;

interface CampaignField {
	id: string;
	name: string;
	description?: string;
	required: boolean;
	textSize?: number;
	hideLabel: boolean;
	label: string;
}

interface CampaignFieldText extends CampaignField {
	type: 'text';
}

interface CampaignFieldTextArea extends CampaignField {
	type: 'textarea';
}

interface CampaignFieldFile extends CampaignField {
	type: 'file';
}

interface CampaignFieldRadio extends CampaignField {
	type: 'radio';
	options: {
		label: string;
		value: string;
	}[];
}

interface CampaignFieldCheckbox extends CampaignField {
	type: 'checkbox';
	options: {
		label: string;
		value: string;
	}[];
}

interface CampaignFieldSelect extends CampaignField {
	type: 'select';
	options: {
		label: string;
		value: string;
	}[];
}

// -------------------------------------
// Quiz
// -------------------------------------

type AnswerType = {
	id: string;
	text: string;
	revealText?: string;
	isCorrect: boolean;
	answerBuckets: string[];
};

type QuizAtomResultBucketType = {
	id: string;
	title: string;
	description: string;
};

type QuestionType = {
	id: string;
	text: string;
	answers: AnswerType[];
	imageUrl?: string;
};

type ResultBucketsType = {
	id: string;
	title: string;
	description: string;
};
