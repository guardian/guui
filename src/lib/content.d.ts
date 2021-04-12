// -------------------------------------
// Elements
// -------------------------------------
interface ThirdPartyEmbeddedContent {
	isThirdPartyTracking: boolean;
	source?: string;
	sourceDomain?: string;
}
interface AudioAtomBlockElement {
	_type: 'model.dotcomrendering.pageElements.AudioAtomBlockElement';
	elementId: string;
	id: string;
	kicker: string;
	title?: string;
	trackUrl: string;
	duration: number;
	coverUrl: string;
	role?: RoleType;
}

interface AudioBlockElement {
	_type: 'model.dotcomrendering.pageElements.AudioBlockElement';
	elementId: string;
}

interface BlockquoteBlockElement {
	_type: 'model.dotcomrendering.pageElements.BlockquoteBlockElement';
	elementId: string;
	html: string;
	quoted?: boolean;
}

interface CaptionBlockElement {
	_type: 'model.dotcomrendering.pageElements.CaptionBlockElement';
	elementId: string;
	captionText?: string;
	padCaption?: boolean;
	credit?: string;
	displayCredit?: boolean;
	shouldLimitWidth?: boolean;
	isOverlayed?: boolean;
}

interface CalloutBlockElement {
	_type: 'model.dotcomrendering.pageElements.CalloutBlockElement';
	elementId: string;
	id: string;
	calloutsUrl: string;
	activeFrom: number;
	displayOnSensitive: boolean;
	formId: number;
	title: string;
	description: string;
	tagName: string;
	formFields: CampaignFieldType[];
	role?: RoleType;
}

interface ChartAtomBlockElement {
	_type: 'model.dotcomrendering.pageElements.ChartAtomBlockElement';
	elementId: string;
	id: string;
	url: string;
	html: string;
	css?: string;
	js?: string;
	role?: RoleType;
	placeholderUrl?: string;
}

interface QuizAtomBlockElement {
	_type: 'model.dotcomrendering.pageElements.QuizAtomBlockElement';
	elementId: string;
	quizType: 'personality' | 'knowledge';
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
	elementId: string;
	code: string;
	isMandatory: boolean;
	language?: Language;
}

interface CommentBlockElement {
	_type: 'model.dotcomrendering.pageElements.CommentBlockElement';
	elementId: string;
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
	elementId: string;
	atomId: string;
}

interface DisclaimerBlockElement {
	_type: 'model.dotcomrendering.pageElements.DisclaimerBlockElement';
	elementId: string;
	html: string;
	role?: RoleType;
}

interface DividerBlockElement {
	_type: 'model.dotcomrendering.pageElements.DividerBlockElement';
}

interface DocumentBlockElement extends ThirdPartyEmbeddedContent {
	_type: 'model.dotcomrendering.pageElements.DocumentBlockElement';
	elementId: string;
	embedUrl: string;
	height: number;
	width: number;
	title?: string;
	role?: RoleType;
}

interface EmbedBlockElement extends ThirdPartyEmbeddedContent {
	_type: 'model.dotcomrendering.pageElements.EmbedBlockElement';
	elementId: string;
	safe?: boolean;
	role?: RoleType;
	alt?: string;
	height?: number;
	width?: number;
	html: string;
	isMandatory: boolean;
}

interface ExplainerAtomBlockElement {
	_type: 'model.dotcomrendering.pageElements.ExplainerAtomBlockElement';
	elementId: string;
	id: string;
	title: string;
	body: string;
	role?: RoleType;
}

interface GenericAtomBlockElement {
	_type: 'model.dotcomrendering.pageElements.GenericAtomBlockElement';
	url: string;
	placeholderUrl?: string;
	id?: string;
	html?: string;
	css?: string;
	js?: string;
	elementId: string;
}

interface GuideAtomBlockElement {
	_type: 'model.dotcomrendering.pageElements.GuideAtomBlockElement';
	elementId: string;
	id: string;
	label: string;
	title: string;
	img?: string;
	html: string;
	credit: string;
	role?: RoleType;
}

interface GuVideoBlockElement {
	_type: 'model.dotcomrendering.pageElements.GuVideoBlockElement';
	elementId: string;
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
	elementId: string;
	html: string;
}

interface ImageBlockElement {
	_type: 'model.dotcomrendering.pageElements.ImageBlockElement';
	elementId: string;
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
	elementId: string;
	html: string;
	url: string;
	hasCaption: boolean;
	role?: RoleType;
}

interface InteractiveAtomBlockElement {
	_type: 'model.dotcomrendering.pageElements.InteractiveAtomBlockElement';
	elementId: string;
	url: string;
	id: string;
	js: string;
	html?: string;
	css?: string;
	placeholderUrl?: string;
	role?: RoleType;
}

// Can't guarantee anything in interactiveBlockElement :shrug:
interface InteractiveBlockElement {
	_type: 'model.dotcomrendering.pageElements.InteractiveBlockElement';
	elementId: string;
	url?: string;
	isMandatory?: boolean;
	scriptUrl?: string;
	alt?: string;
	role?: RoleType;
	caption?: string;
}

interface MapBlockElement extends ThirdPartyEmbeddedContent {
	_type: 'model.dotcomrendering.pageElements.MapBlockElement';
	elementId: string;
	embedUrl: string;
	originalUrl: string;
	title: string;
	height: number;
	width: number;
	caption?: string;
	role?: RoleType;
}

interface MediaAtomBlockElement {
	_type: 'model.dotcomrendering.pageElements.MediaAtomBlockElement';
	elementId: string;
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
	elementId: string;
	images: ImageBlockElement[];
	caption?: string;
	role?: RoleType;
}

interface ProfileAtomBlockElement {
	_type: 'model.dotcomrendering.pageElements.ProfileAtomBlockElement';
	elementId: string;
	id: string;
	label: string;
	title: string;
	img?: string;
	html: string;
	credit: string;
	role?: RoleType;
}

interface PullquoteBlockElement {
	_type: 'model.dotcomrendering.pageElements.PullquoteBlockElement';
	elementId: string;
	html?: string;
	role: string;
	attribution?: string;
	isThirdPartyTracking?: boolean;
}

interface QABlockElement {
	_type: 'model.dotcomrendering.pageElements.QABlockElement';
	elementId: string;
	id: string;
	title: string;
	img?: string;
	html: string;
	credit: string;
	role?: RoleType;
}

interface RichLinkBlockElement {
	_type: 'model.dotcomrendering.pageElements.RichLinkBlockElement';
	elementId: string;
	url: string;
	text: string;
	prefix: string;
	role?: Weighting;
}

interface SoundcloudBlockElement extends ThirdPartyEmbeddedContent {
	_type: 'model.dotcomrendering.pageElements.SoundcloudBlockElement';
	elementId: string;
	html: string;
	id: string;
	isTrack: boolean;
	isMandatory: boolean;
	role?: RoleType;
}

interface SpotifyBlockElement extends ThirdPartyEmbeddedContent {
	_type: 'model.dotcomrendering.pageElements.SpotifyBlockElement';
	elementId: string;
	embedUrl?: string;
	title?: string;
	height?: number;
	width?: number;
	caption?: string;
	role?: RoleType;
}

interface SubheadingBlockElement {
	_type: 'model.dotcomrendering.pageElements.SubheadingBlockElement';
	elementId: string;
	html: string;
}

interface TableBlockElement {
	_type: 'model.dotcomrendering.pageElements.TableBlockElement';
	elementId: string;
	isMandatory: boolean;
	html: string;
	role?: RoleType;
}

interface TextBlockElement {
	_type: 'model.dotcomrendering.pageElements.TextBlockElement';
	elementId: string;
	dropCap?: boolean;
	html: string;
}

interface TimelineBlockElement {
	_type: 'model.dotcomrendering.pageElements.TimelineBlockElement';
	elementId: string;
	id: string;
	title: string;
	description?: string;
	events: TimelineEvent[];
	role?: RoleType;
}

interface TweetBlockElement extends ThirdPartyEmbeddedContent {
	_type: 'model.dotcomrendering.pageElements.TweetBlockElement';
	elementId: string;
	html: string;
	url: string;
	id: string;
	hasMedia: boolean;
	role?: RoleType;
}

interface VineBlockElement extends ThirdPartyEmbeddedContent {
	_type: 'model.dotcomrendering.pageElements.VineBlockElement';
	elementId: string;
	url: string;
	height: number;
	width: number;
	originalUrl: string;
	title: string;
}

interface VideoBlockElement extends ThirdPartyEmbeddedContent {
	_type: 'model.dotcomrendering.pageElements.VideoBlockElement';
	elementId: string;
	role?: RoleType;
}

interface VideoFacebookBlockElement extends ThirdPartyEmbeddedContent {
	_type: 'model.dotcomrendering.pageElements.VideoFacebookBlockElement';
	elementId: string;
	url: string;
	height: number;
	width: number;
	caption?: string;
	embedUrl?: string;
	role?: RoleType;
}

interface VideoVimeoBlockElement extends ThirdPartyEmbeddedContent {
	_type: 'model.dotcomrendering.pageElements.VideoVimeoBlockElement';
	elementId: string;
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
	elementId: string;
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
	elementId: string;
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
	elementId: string;
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
	unixDate: number;
	body?: string;
	toDate?: string;
	toUnixDate?: number;
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
