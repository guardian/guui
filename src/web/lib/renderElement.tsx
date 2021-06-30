import { BlockquoteBlockComponent } from '@root/src/web/components/elements/BlockquoteBlockComponent';
import { CalloutBlockComponent } from '@root/src/web/components/elements/CalloutBlockComponent';
import { CaptionBlockComponent } from '@root/src/web/components/elements/CaptionBlockComponent';
import { CommentBlockComponent } from '@root/src/web/components/elements/CommentBlockComponent';
import { CodeBlockComponent } from '@root/src/web/components/elements/CodeBlockComponent';
import { DefaultRichLink } from '@root/src/web/components/DefaultRichLink';
import { DocumentBlockComponent } from '@root/src/web/components/elements/DocumentBlockComponent';
import { DisclaimerBlockComponent } from '@root/src/web/components/elements/DisclaimerBlockComponent';
import { DividerBlockComponent } from '@root/src/web/components/elements/DividerBlockComponent';
import { EmbedBlockComponent } from '@root/src/web/components/elements/EmbedBlockComponent';
import { UnsafeEmbedBlockComponent } from '@root/src/web/components/elements/UnsafeEmbedBlockComponent';
import { GuVideoBlockComponent } from '@root/src/web/components/elements/GuVideoBlockComponent';
import { HighlightBlockComponent } from '@root/src/web/components/elements/HighlightBlockComponent';
import { ImageBlockComponent } from '@root/src/web/components/elements/ImageBlockComponent';
import { InstagramBlockComponent } from '@root/src/web/components/elements/InstagramBlockComponent';
import { InteractiveBlockComponent } from '@root/src/web/components/elements/InteractiveBlockComponent';
import { ItemLinkBlockElement } from '@root/src/web/components/elements/ItemLinkBlockElement';
import { MainMediaEmbedBlockComponent } from '@root/src/web/components/elements/MainMediaEmbedBlockComponent';
import { NumberedTitleBlockComponent } from '@root/src/web/components/elements/NumberedTitleBlockComponent';
import { MapEmbedBlockComponent } from '@root/src/web/components/elements/MapEmbedBlockComponent';
import { MultiImageBlockComponent } from '@root/src/web/components/elements/MultiImageBlockComponent';
import { PullQuoteBlockComponent } from '@root/src/web/components/elements/PullQuoteBlockComponent';
import { SoundcloudBlockComponent } from '@root/src/web/components/elements/SoundcloudBlockComponent';
import { SpotifyBlockComponent } from '@root/src/web/components/elements/SpotifyBlockComponent';
import { StarRatingBlockComponent } from '@root/src/web/components/elements/StarRatingBlockComponent';
import { SubheadingBlockComponent } from '@root/src/web/components/elements/SubheadingBlockComponent';
import { TableBlockComponent } from '@root/src/web/components/elements/TableBlockComponent';
import { TextBlockComponent } from '@root/src/web/components/elements/TextBlockComponent';
import { TweetBlockComponent } from '@root/src/web/components/elements/TweetBlockComponent';
import { VideoFacebookBlockComponent } from '@root/src/web/components/elements/VideoFacebookBlockComponent';
import { VimeoBlockComponent } from '@root/src/web/components/elements/VimeoBlockComponent';
import { VineBlockComponent } from '@root/src/web/components/elements/VineBlockComponent';
import { YoutubeEmbedBlockComponent } from '@root/src/web/components/elements/YoutubeEmbedBlockComponent';
import { YoutubeBlockComponent } from '@root/src/web/components/elements/YoutubeBlockComponent';
import {
	WitnessVideoBlockComponent,
	WitnessImageBlockComponent,
	WitnessTextBlockComponent,
} from '@root/src/web/components/elements/WitnessBlockComponent';
import { getSharingUrls } from '@root/src/lib/sharing-urls';
import { ClickToView } from '@root/src/web/components/ClickToView';
import {
	AudioAtom,
	ChartAtom,
	ExplainerAtom,
	InteractiveAtom,
	InteractiveLayoutAtom,
	QandaAtom,
	GuideAtom,
	ProfileAtom,
	TimelineAtom,
	VideoAtom,
	PersonalityQuizAtom,
	KnowledgeQuizAtom,
} from '@guardian/atoms-rendering';
import { Design, Format } from '@guardian/types';
import { Figure } from '../components/Figure';

type Props = {
	format: Format;
	palette: Palette;
	element: CAPIElement;
	adTargeting?: AdTargeting;
	host?: string;
	index: number;
	isMainMedia: boolean;
	hideCaption?: boolean;
	starRating?: number;
	pageId: string;
	webTitle: string;
};

// updateRole modifies the role of an element in a way appropriate for most
// article types.
export const updateRole = (el: CAPIElement, format: Format): CAPIElement => {
	const isLiveBlog =
		format.design === Design.LiveBlog || format.design === Design.DeadBlog;

	switch (el._type) {
		case 'model.dotcomrendering.pageElements.ImageBlockElement':
			if (isLiveBlog && el.role !== 'thumbnail') {
				el.role = 'inline';
			}

			return el;
		case 'model.dotcomrendering.pageElements.RichLinkBlockElement':
			if (isLiveBlog) {
				el.role = 'inline';
			} else {
				el.role = 'richLink';
			}

			return el;
		default:
			if (isLiveBlog && 'role' in el) {
				el.role = 'inline';
			}

			return el;
	}
};

// renderElement converts a CAPI element to JSX. A boolean 'ok' flag is returned
// along with the element to indicate if the element is null, in which case
// callers can e.g. avoid further work/wrapping as required. Unfortunately,
// there is no straightforward way to tell if a React element is null by direct
// inspection.
export const renderElement = ({
	format,
	palette,
	element,
	adTargeting,
	host,
	index,
	hideCaption,
	isMainMedia,
	starRating,
	pageId,
	webTitle,
}: Props): [boolean, JSX.Element] => {
	switch (element._type) {
		case 'model.dotcomrendering.pageElements.AudioAtomBlockElement':
			return [
				true,
				<AudioAtom
					id={element.id}
					trackUrl={element.trackUrl}
					kicker={element.kicker}
					title={element.title}
					duration={element.duration}
					pillar={format.theme}
				/>,
			];
		case 'model.dotcomrendering.pageElements.BlockquoteBlockElement':
			return [
				true,
				<BlockquoteBlockComponent
					key={index}
					html={element.html}
					palette={palette}
					quoted={element.quoted}
				/>,
			];

		case 'model.dotcomrendering.pageElements.CalloutBlockElement':
			return [
				true,
				<CalloutBlockComponent callout={element} palette={palette} />,
			];
		case 'model.dotcomrendering.pageElements.CaptionBlockElement':
			return [
				true,
				<CaptionBlockComponent
					key={index}
					format={format}
					palette={palette}
					captionText={element.captionText}
					padCaption={element.padCaption}
					credit={element.credit}
					displayCredit={element.displayCredit}
					shouldLimitWidth={element.shouldLimitWidth}
					isOverlayed={element.isOverlayed}
				/>,
			];
		case 'model.dotcomrendering.pageElements.ChartAtomBlockElement':
			return [true, <ChartAtom id={element.id} html={element.html} />];
		case 'model.dotcomrendering.pageElements.CodeBlockElement':
			return [
				true,
				<CodeBlockComponent
					code={element.html}
					language={element.language}
				/>,
			];
		case 'model.dotcomrendering.pageElements.CommentBlockElement':
			return [
				true,
				<CommentBlockComponent
					body={element.body}
					avatarURL={element.avatarURL}
					profileURL={element.profileURL}
					profileName={element.profileName}
					dateTime={element.dateTime}
					permalink={element.permalink}
				/>,
			];
		case 'model.dotcomrendering.pageElements.DisclaimerBlockElement':
			return [true, <DisclaimerBlockComponent html={element.html} />];
		case 'model.dotcomrendering.pageElements.DividerBlockElement':
			return [
				true,
				<DividerBlockComponent
					size={element.size}
					spaceAbove={element.spaceAbove}
				/>,
			];
		case 'model.dotcomrendering.pageElements.DocumentBlockElement':
			return [
				true,
				<ClickToView
					role={element.role}
					isTracking={element.isThirdPartyTracking}
					isMainMedia={isMainMedia}
					source={element.source}
					sourceDomain={element.sourceDomain}
				>
					<DocumentBlockComponent
						embedUrl={element.embedUrl}
						height={element.height}
						width={element.width}
						title={element.title}
						source={element.source}
					/>
				</ClickToView>,
			];
		case 'model.dotcomrendering.pageElements.EmbedBlockElement':
			if (!element.safe) {
				if (isMainMedia) {
					return [
						true,
						<MainMediaEmbedBlockComponent
							title={element.alt || ''}
							srcDoc={element.html}
						/>,
					];
				}

				return [
					true,
					<ClickToView
						role={element.role}
						isTracking={element.isThirdPartyTracking}
						isMainMedia={isMainMedia}
						source={element.source}
						sourceDomain={element.sourceDomain}
					>
						<UnsafeEmbedBlockComponent
							key={index}
							html={element.html}
							alt={element.alt || ''}
							index={index}
						/>
					</ClickToView>,
				];
			}
			return [
				true,
				<ClickToView
					role={element.role}
					isTracking={element.isThirdPartyTracking}
					isMainMedia={isMainMedia}
					source={element.source}
					sourceDomain={element.sourceDomain}
				>
					<EmbedBlockComponent
						key={index}
						html={element.html}
						alt={element.alt}
					/>
				</ClickToView>,
			];
		case 'model.dotcomrendering.pageElements.ExplainerAtomBlockElement':
			return [
				true,
				<ExplainerAtom
					key={index}
					id={element.id}
					title={element.title}
					html={element.body}
				/>,
			];
		case 'model.dotcomrendering.pageElements.GuideAtomBlockElement':
			return [
				true,
				<GuideAtom
					id={element.id}
					title={element.title}
					html={element.html}
					image={element.img}
					credit={element.credit}
					pillar={format.theme}
					likeHandler={() => {}}
					dislikeHandler={() => {}}
					expandCallback={() => {}}
				/>,
			];
		case 'model.dotcomrendering.pageElements.GuVideoBlockElement':
			return [
				true,
				<GuVideoBlockComponent
					html={element.html}
					format={format}
					palette={palette}
					credit={element.source}
					caption={element.caption}
				/>,
			];
		case 'model.dotcomrendering.pageElements.HighlightBlockElement':
			return [
				true,
				<HighlightBlockComponent key={index} html={element.html} />,
			];
		case 'model.dotcomrendering.pageElements.ImageBlockElement':
			return [
				true,
				<ImageBlockComponent
					format={format}
					palette={palette}
					key={index}
					element={element}
					hideCaption={hideCaption}
					isMainMedia={isMainMedia}
					starRating={starRating || element.starRating}
					title={element.title}
					isAvatar={element.isAvatar}
				/>,
			];
		case 'model.dotcomrendering.pageElements.InstagramBlockElement':
			return [
				true,
				<ClickToView
					role={element.role}
					isTracking={element.isThirdPartyTracking}
					isMainMedia={isMainMedia}
					source={element.source}
					sourceDomain={element.sourceDomain}
				>
					<InstagramBlockComponent
						key={index}
						element={element}
						index={index}
					/>
				</ClickToView>,
			];
		case 'model.dotcomrendering.pageElements.InteractiveAtomBlockElement':
			if (format.design === Design.Interactive) {
				return [
					true,
					<InteractiveLayoutAtom
						id={element.id}
						elementHtml={element.html}
						elementJs={element.js}
						elementCss={element.css}
					/>,
				];
			}
			return [
				true,
				<InteractiveAtom
					isMainMedia={isMainMedia}
					id={element.id}
					elementHtml={element.html}
					elementJs={element.js}
					elementCss={element.css}
				/>,
			];
		case 'model.dotcomrendering.pageElements.InteractiveBlockElement':
			return [
				true,
				<InteractiveBlockComponent
					url={element.url}
					scriptUrl={element.scriptUrl}
					alt={element.alt}
					role={element.role}
					format={format}
					palette={palette}
				/>,
			];
		case 'model.dotcomrendering.pageElements.ItemLinkBlockElement':
			return [true, <ItemLinkBlockElement html={element.html} />];
		case 'model.dotcomrendering.pageElements.MapBlockElement':
			return [
				true,
				<ClickToView
					role={element.role}
					isTracking={element.isThirdPartyTracking}
					isMainMedia={isMainMedia}
					source={element.source}
					sourceDomain={element.sourceDomain}
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
				</ClickToView>,
			];
		case 'model.dotcomrendering.pageElements.MediaAtomBlockElement':
			return [
				true,
				<VideoAtom
					assets={element.assets}
					poster={element.posterImage && element.posterImage[0].url}
				/>,
			];
		case 'model.dotcomrendering.pageElements.MultiImageBlockElement':
			return [
				true,
				<MultiImageBlockComponent
					format={format}
					palette={palette}
					key={index}
					images={element.images}
					caption={element.caption}
				/>,
			];
		case 'model.dotcomrendering.pageElements.NumberedTitleBlockElement':
			return [
				true,
				<NumberedTitleBlockComponent
					position={element.position}
					html={element.html}
					format={element.format}
				/>,
			];
		case 'model.dotcomrendering.pageElements.ProfileAtomBlockElement':
			return [
				true,
				<ProfileAtom
					id={element.id}
					title={element.title}
					html={element.html}
					image={element.img}
					credit={element.credit}
					pillar={format.theme}
					likeHandler={() => {}}
					dislikeHandler={() => {}}
					expandCallback={() => {}}
				/>,
			];
		case 'model.dotcomrendering.pageElements.PullquoteBlockElement':
			return [
				true,
				<PullQuoteBlockComponent
					key={index}
					html={element.html}
					palette={palette}
					design={format.design}
					attribution={element.attribution}
					role={element.role}
				/>,
			];
		case 'model.dotcomrendering.pageElements.QABlockElement':
			return [
				true,
				<QandaAtom
					id={element.id}
					title={element.title}
					html={element.html}
					image={element.img}
					credit={element.credit}
					pillar={format.theme}
					likeHandler={() => {}}
					dislikeHandler={() => {}}
					expandCallback={() => {}}
				/>,
			];
		case 'model.dotcomrendering.pageElements.QuizAtomBlockElement':
			return [
				true,
				<>
					{element.quizType === 'personality' && (
						<PersonalityQuizAtom
							id={element.id}
							questions={element.questions}
							resultBuckets={element.resultBuckets}
							sharingUrls={getSharingUrls(pageId, webTitle)}
							theme={format.theme}
						/>
					)}
					{element.quizType === 'knowledge' && (
						<KnowledgeQuizAtom
							id={element.id}
							questions={element.questions}
							resultGroups={element.resultGroups}
							sharingUrls={getSharingUrls(pageId, webTitle)}
							theme={format.theme}
						/>
					)}
				</>,
			];
		case 'model.dotcomrendering.pageElements.RichLinkBlockElement':
			return [
				true,
				<DefaultRichLink
					index={index}
					headlineText={element.text}
					url={element.url}
					isPlaceholder={true}
				/>,
			];
		case 'model.dotcomrendering.pageElements.SoundcloudBlockElement':
			return [true, <SoundcloudBlockComponent element={element} />];
		case 'model.dotcomrendering.pageElements.SpotifyBlockElement':
			return [
				true,
				<ClickToView
					role={element.role}
					isTracking={element.isThirdPartyTracking}
					isMainMedia={isMainMedia}
					source={element.source}
					sourceDomain={element.sourceDomain}
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
				</ClickToView>,
			];
		case 'model.dotcomrendering.pageElements.StarRatingBlockElement':
			return [
				true,
				<StarRatingBlockComponent
					key={index}
					rating={element.rating}
					size={element.size}
				/>,
			];
		case 'model.dotcomrendering.pageElements.SubheadingBlockElement':
			return [
				true,
				<SubheadingBlockComponent key={index} html={element.html} />,
			];
		case 'model.dotcomrendering.pageElements.TableBlockElement':
			return [true, <TableBlockComponent element={element} />];

		case 'model.dotcomrendering.pageElements.TextBlockElement':
			return [
				true,
				<>
					<TextBlockComponent
						key={index}
						isFirstParagraph={index === 0}
						html={element.html}
						format={format}
						forceDropCap={element.dropCap}
					/>
				</>,
			];
		case 'model.dotcomrendering.pageElements.TimelineBlockElement':
			return [
				true,
				<TimelineAtom
					id={element.id}
					title={element.title}
					pillar={format.theme}
					events={element.events}
					likeHandler={() => {}}
					dislikeHandler={() => {}}
					expandCallback={() => {}}
				/>,
			];
		case 'model.dotcomrendering.pageElements.TweetBlockElement':
			return [true, <TweetBlockComponent element={element} />];
		case 'model.dotcomrendering.pageElements.VideoFacebookBlockElement':
			return [
				true,
				<ClickToView
					role={element.role}
					isTracking={element.isThirdPartyTracking}
					isMainMedia={isMainMedia}
					source={element.source}
					sourceDomain={element.sourceDomain}
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
				</ClickToView>,
			];
		case 'model.dotcomrendering.pageElements.VideoVimeoBlockElement':
			return [
				true,
				<VimeoBlockComponent
					format={format}
					palette={palette}
					embedUrl={element.embedUrl}
					height={element.height}
					width={element.width}
					caption={element.caption}
					credit={element.credit}
					title={element.title}
				/>,
			];
		case 'model.dotcomrendering.pageElements.VideoYoutubeBlockElement':
			return [
				true,
				<YoutubeEmbedBlockComponent
					format={format}
					palette={palette}
					embedUrl={element.embedUrl}
					height={element.height}
					width={element.width}
					caption={element.caption}
					credit={element.credit}
					title={element.title}
				/>,
			];
		case 'model.dotcomrendering.pageElements.VineBlockElement':
			return [
				true,
				<ClickToView
					// No role given by CAPI
					// eslint-disable-next-line jsx-a11y/aria-role
					role="inline"
					isTracking={element.isThirdPartyTracking}
					source={element.source}
					sourceDomain={element.sourceDomain}
				>
					<VineBlockComponent element={element} />
				</ClickToView>,
			];
		case 'model.dotcomrendering.pageElements.WitnessBlockElement': {
			const witnessType = element.witnessTypeData._type;
			switch (witnessType) {
				case 'model.dotcomrendering.pageElements.WitnessTypeDataImage':
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
					const witnessTypeDataImage = element.witnessTypeData as WitnessTypeDataImage;
					return [
						true,
						<WitnessImageBlockComponent
							assets={element.assets}
							caption={witnessTypeDataImage.caption}
							title={witnessTypeDataImage.title}
							authorName={witnessTypeDataImage.authorName}
							dateCreated={witnessTypeDataImage.dateCreated}
							alt={witnessTypeDataImage.alt}
							palette={palette}
						/>,
					];
				case 'model.dotcomrendering.pageElements.WitnessTypeDataVideo':
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
					const witnessTypeDataVideo = element.witnessTypeData as WitnessTypeDataVideo;
					return [
						true,
						<WitnessVideoBlockComponent
							title={witnessTypeDataVideo.title}
							description={witnessTypeDataVideo.description}
							authorName={witnessTypeDataVideo.authorName}
							youtubeHtml={witnessTypeDataVideo.youtubeHtml}
							dateCreated={witnessTypeDataVideo.dateCreated}
							palette={palette}
						/>,
					];
				case 'model.dotcomrendering.pageElements.WitnessTypeDataText':
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
					const witnessTypeDataText = element.witnessTypeData as WitnessTypeDataText;
					return [
						true,
						<WitnessTextBlockComponent
							title={witnessTypeDataText.title}
							description={witnessTypeDataText.description}
							authorName={witnessTypeDataText.authorName}
							dateCreated={witnessTypeDataText.dateCreated}
							palette={palette}
						/>,
					];
				default:
					return [false, <></>];
			}
		}
		case 'model.dotcomrendering.pageElements.YoutubeBlockElement':
			return [
				true,
				<YoutubeBlockComponent
					format={format}
					palette={palette}
					key={index}
					hideCaption={hideCaption}
					// eslint-disable-next-line jsx-a11y/aria-role
					role="inline"
					adTargeting={adTargeting}
					isMainMedia={isMainMedia}
					id={element.id}
					assetId={element.assetId}
					expired={element.expired}
					overrideImage={element.overrideImage}
					posterImage={element.posterImage}
					duration={element.duration}
					mediaTitle={element.mediaTitle}
					altText={element.altText}
					origin={host}
				/>,
			];
		case 'model.dotcomrendering.pageElements.AudioBlockElement':
		case 'model.dotcomrendering.pageElements.ContentAtomBlockElement':
		case 'model.dotcomrendering.pageElements.GenericAtomBlockElement':
		case 'model.dotcomrendering.pageElements.VideoBlockElement':
		default:
			return [false, <></>];
	}
};

// bareElements is the set of element types that don't get wrapped in a Figure
// for most article types.
const bareElements = new Set([
	'model.dotcomrendering.pageElements.BlockquoteBlockElement',
	'model.dotcomrendering.pageElements.CaptionBlockElement',
	'model.dotcomrendering.pageElements.CodeBlockElement',
	'model.dotcomrendering.pageElements.DividerBlockElement',
	'model.dotcomrendering.pageElements.MediaAtomBlockElement',
	'model.dotcomrendering.pageElements.PullquoteBlockElement',
	'model.dotcomrendering.pageElements.StarRatingBlockElement',
	'model.dotcomrendering.pageElements.SubheadingBlockElement',
	'model.dotcomrendering.pageElements.TextBlockElement',
]);

// renderArticleElement is a wrapper for renderElement that wraps elements in a
// Figure and adds metadata and (role-) styling appropriate for most article
// types.
export const renderArticleElement = ({
	format,
	palette,
	element,
	adTargeting,
	host,
	index,
	hideCaption,
	isMainMedia,
	starRating,
	pageId,
	webTitle,
}: Props): JSX.Element => {
	const withUpdatedRole = updateRole(element, format);

	const [ok, el] = renderElement({
		format,
		palette,
		element: withUpdatedRole,
		adTargeting,
		host,
		index,
		isMainMedia,
		hideCaption,
		starRating,
		pageId,
		webTitle,
	});

	if (!ok) {
		return <></>;
	}

	const needsFigure = !bareElements.has(element._type);

	return needsFigure ? (
		<Figure
			isMainMedia={isMainMedia}
			id={'elementId' in element ? element.elementId : undefined}
			role={'role' in element ? (element.role as RoleType) : undefined}
		>
			{el}
		</Figure>
	) : (
		el
	);
};
