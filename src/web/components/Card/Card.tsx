import { css } from '@emotion/react';

import { Design } from '@guardian/types';
import { brandAltBackground } from '@guardian/src-foundations/palette';

import { StarRating } from '@root/src/web/components/StarRating/StarRating';
import { CardHeadline } from '@frontend/web/components/CardHeadline';
import { Avatar } from '@frontend/web/components/Avatar';
import { Flex } from '@frontend/web/components/Flex';
import { Hide } from '@frontend/web/components/Hide';
import { MediaMeta } from '@frontend/web/components/MediaMeta';
import { CardCommentCount } from '@frontend/web/components/CardCommentCount';

import { decidePalette } from '@root/src/web/lib/decidePalette';
import { formatCount } from '@root/src/web/lib/formatCount';

import { ContentWrapper } from './components/ContentWrapper';
import { HeadlineWrapper } from './components/HeadlineWrapper';
import { CardLayout } from './components/CardLayout';
import { ImageWrapper } from './components/ImageWrapper';
import { AvatarContainer } from './components/AvatarContainer';
import { StandfirstWrapper } from './components/StandfirstWrapper';
import { CardFooter } from './components/CardFooter';
import { TopBar } from './components/TopBar';
import { CardLink } from './components/CardLink';
import { CardAge } from './components/CardAge';
import { CardBranding } from './components/CardBranding';

type Props = {
	linkTo: string;
	format: Format;
	headlineText: string;
	headlineSize?: HeadlineSizeType;
	showQuotes?: boolean; // Even with design !== Comment, a piece can be opinion
	byline?: string;
	showByline?: boolean;
	webPublicationDate?: string;
	imageUrl?: string;
	imagePosition?: ImagePositionType;
	imageSize?: ImageSizeType; // Size is ignored when position = 'top' because in that case the image flows based on width
	isFullCardImage?: boolean; // For use in Carousel until we decide a `Display.Immersive` convention
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
	alwaysVertical?: boolean;
	minWidthInPixels?: number;
	// Ophan tracking
	dataLinkName?: string;
	// Labs
	branding?: Branding;
};

type ImageSizeType = 'small' | 'medium' | 'large' | 'jumbo';

type CoveragesType = {
	image: {
		small: CardPercentageType;
		medium: CardPercentageType;
		large: CardPercentageType;
		jumbo: CardPercentageType;
	};
	content: {
		small: CardPercentageType;
		medium: CardPercentageType;
		large: CardPercentageType;
		jumbo: CardPercentageType;
	};
};

const coverages: CoveragesType = {
	// coverages is how we set the image size relative to the space given
	// to the headline. These percentages are passed to flex-basis inside the
	// wrapper components
	image: {
		small: '25%',
		medium: '50%',
		large: '67%',
		jumbo: '75%',
	},
	content: {
		small: '75%',
		medium: '50%',
		large: '33%',
		jumbo: '25%',
	},
};

const starWrapper = css`
	background-color: ${brandAltBackground.primary};
	position: absolute;
	bottom: 0;
	margin-top: 2px;
`;

const StarRatingComponent: React.FC<{ rating: number }> = ({ rating }) => (
	<>
		<Hide when="above" breakpoint="desktop">
			<div css={starWrapper}>
				<StarRating rating={rating} size="small" />
			</div>
		</Hide>
		<Hide when="below" breakpoint="desktop">
			<div css={starWrapper}>
				<StarRating rating={rating} size="medium" />
			</div>
		</Hide>
	</>
);

const fullCardImageAgeStyles = css`
	min-width: 25%;
	align-self: flex-end;
	text-align: end;
`;

export const Card = ({
	linkTo,
	format,
	headlineText,
	headlineSize,
	showQuotes,
	byline,
	showByline,
	webPublicationDate,
	imageUrl,
	imagePosition,
	imageSize,
	isFullCardImage,
	standfirst,
	avatar,
	showClock,
	mediaType,
	mediaDuration,
	kickerText,
	showPulsingDot,
	showSlash,
	commentCount,
	starRating,
	alwaysVertical,
	minWidthInPixels,
	dataLinkName,
	branding,
}: Props) => {
	// Decide how we position the image on the card
	let imageCoverage: CardPercentageType | undefined;
	let contentCoverage: CardPercentageType | undefined;
	if (imageSize && imagePosition !== 'top') {
		// We only specifiy an explicit width for the image when
		// we're positioning left or right, not top. Top positioned
		// images flow naturally
		imageCoverage = coverages.image[imageSize];
		contentCoverage = coverages.content[imageSize];
	}

	const showCommentCount = commentCount || commentCount === 0;
	const { long: longCount, short: shortCount } = formatCount(commentCount);

	/**
	 * Why are we setting cardPalette like this?
	 *
	 * Good question. Basically, we had a production issue and this was the easiest and
	 * quickest way to fix it rather than fixing Card's properly 😱
	 *
	 * Once:
	 * 1. Cards have been refactored to remove `isFullSizeImage`
	 * 2. We support the concept of a container type and
	 * 3. We  and are able to handle Carousels natively - in
	 *    the model
	 * Then this should be removed.
	 */
	const cardPalette = decidePalette(format);

	return (
		<CardLink
			linkTo={linkTo}
			format={format}
			palette={cardPalette}
			dataLinkName={dataLinkName}
		>
			<TopBar palette={cardPalette} isFullCardImage={isFullCardImage}>
				<CardLayout
					imagePosition={imagePosition}
					alwaysVertical={alwaysVertical}
					minWidthInPixels={minWidthInPixels}
				>
					<>
						{imageUrl && (
							<ImageWrapper
								percentage={imageCoverage}
								alwaysVertical={alwaysVertical}
								isFullCardImage={isFullCardImage}
							>
								<img
									src={imageUrl}
									alt=""
									role="presentation"
								/>
								<>
									{starRating !== undefined ? (
										<StarRatingComponent
											rating={starRating}
										/>
									) : null}
								</>
							</ImageWrapper>
						)}
						<ContentWrapper
							percentage={contentCoverage}
							isFullCardImage={isFullCardImage}
						>
							<Flex>
								<HeadlineWrapper
									isFullCardImage={isFullCardImage}
								>
									<CardHeadline
										headlineText={headlineText}
										format={format}
										palette={cardPalette}
										size={headlineSize}
										showQuotes={showQuotes}
										kickerText={
											format.design === Design.LiveBlog
												? 'Live'
												: kickerText
										}
										showPulsingDot={
											format.design === Design.LiveBlog ||
											showPulsingDot
										}
										showSlash={
											format.design === Design.LiveBlog ||
											showSlash
										}
										byline={byline}
										showByline={showByline}
										isFullCardImage={isFullCardImage}
									/>
								</HeadlineWrapper>
								<>
									{avatar && (
										<Hide when="above" breakpoint="tablet">
											<AvatarContainer>
												<Avatar
													imageSrc={avatar.src}
													imageAlt={avatar.alt}
													palette={cardPalette}
												/>
											</AvatarContainer>
										</Hide>
									)}
								</>
							</Flex>
							<div
								css={isFullCardImage && fullCardImageAgeStyles}
							>
								{standfirst && (
									<StandfirstWrapper palette={cardPalette}>
										{standfirst}
									</StandfirstWrapper>
								)}
								{avatar && (
									<Hide when="below" breakpoint="tablet">
										<AvatarContainer>
											<Avatar
												imageSrc={avatar.src}
												imageAlt={avatar.alt}
												palette={cardPalette}
											/>
										</AvatarContainer>
									</Hide>
								)}
								<CardFooter
									format={format}
									age={
										webPublicationDate ? (
											<CardAge
												format={format}
												palette={cardPalette}
												webPublicationDate={
													webPublicationDate
												}
												showClock={showClock}
											/>
										) : undefined
									}
									isFullCardImage={isFullCardImage}
									mediaMeta={
										format.design === Design.Media &&
										mediaType ? (
											<MediaMeta
												palette={cardPalette}
												mediaType={mediaType}
												mediaDuration={mediaDuration}
											/>
										) : undefined
									}
									commentCount={
										showCommentCount &&
										longCount &&
										shortCount ? (
											<CardCommentCount
												palette={cardPalette}
												long={longCount}
												short={shortCount}
											/>
										) : undefined
									}
									cardBranding={
										branding ? (
											<CardBranding
												branding={branding}
												palette={cardPalette}
												format={format}
											/>
										) : undefined
									}
								/>
							</div>
						</ContentWrapper>
					</>
				</CardLayout>
			</TopBar>
		</CardLink>
	);
};
