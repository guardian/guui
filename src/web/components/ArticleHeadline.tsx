import { css } from '@emotion/react';

import { HeadlineTag } from '@root/src/web/components/HeadlineTag';
import { HeadlineByline } from '@root/src/web/components/HeadlineByline';

import { headline, textSans } from '@guardian/src-foundations/typography';
import { from, until } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
import { Display, Design, Format, Special } from '@guardian/types';
import { getZIndex } from '@frontend/web/lib/getZIndex';
import { interactiveLegacyClasses } from '@root/src/web/layouts/lib/interactiveLegacyStyling';

type Props = {
	headlineString: string;
	format: Format;
	byline?: string;
	tags: TagType[];
	isShowcase?: boolean; // Used for Interviews to change headline position
	palette: Palette;
};

const curly = (x: any) => x;

const topPadding = css`
	${from.leftCol} {
		padding-top: ${space[1]}px;
	}
`;

const standardFont = css`
	${headline.medium()};
	${until.tablet} {
		${headline.small()};
	}
`;

const labsFont = css`
	${textSans.xlarge({ fontWeight: 'bold' })};
	line-height: 32px;
	${from.tablet} {
		${textSans.xxxlarge({ fontWeight: 'bold' })};
		line-height: 38px;
	}
`;

const boldFont = css`
	${headline.medium({ fontWeight: 'bold' })};
	${until.tablet} {
		${headline.small({ fontWeight: 'bold' })};
	}
`;

const jumboFont = css`
	${headline.xlarge({ fontWeight: 'bold' })};
	line-height: 56px;
	${until.desktop} {
		${headline.medium({ fontWeight: 'bold' })};
	}
`;

const jumboLabsFont = css`
	${textSans.xxxlarge({ fontWeight: 'bold' })};
	font-size: 50px;
	line-height: 56px;
	${until.desktop} {
		${textSans.xxlarge({ fontWeight: 'bold' })};
		font-size: 34px;
		line-height: 38px;
	}
`;

const invertedFont = css`
	${headline.medium({ fontWeight: 'bold' })};
	line-height: 42px;
	${until.tablet} {
		${headline.small({ fontWeight: 'bold' })};
		line-height: 35px;
	}
`;

const lightFont = css`
	${headline.medium({ fontWeight: 'light' })};
	font-size: 2.125rem;
	line-height: 2.375rem;
	${until.mobileMedium} {
		${headline.small({ fontWeight: 'light' })};
	}
`;

const underlinedStyles = css`
	background-image: repeating-linear-gradient(
		to bottom,
		transparent,
		transparent 47px,
		rgba(171, 6, 19, 0.5)
	);
	line-height: 48px;
	background-size: 1rem 48px;
	${until.tablet} {
		background-image: repeating-linear-gradient(
			to bottom,
			transparent,
			transparent 39px,
			rgba(171, 6, 19, 0.5)
		);
		line-height: 40px;
		background-size: 1px 40px;
	}

	background-position: top left;
	background-clip: content-box;
	background-origin: content-box;
`;

const displayBlock = css`
	display: block;
`;

const displayInline = css`
	display: inline;
`;

const displayFlex = css`
	display: flex;
	flex-direction: column;
`;

const shiftSlightly = css`
	margin-bottom: 16px;
`;

const invertedStyles = (palette: Palette) => css`
	position: relative;
	white-space: pre-wrap;
	padding-bottom: ${space[1]}px;
	padding-right: ${space[1]}px;
	box-shadow: -6px 0 0 ${palette.background.headline};
	/* Box decoration is required to push the box shadow out on Firefox */
	box-decoration-break: clone;
`;

const immersiveStyles = css`
	min-height: 112px;
	padding-bottom: ${space[9]}px;
	padding-left: ${space[1]}px;
	${from.mobileLandscape} {
		padding-left: ${space[3]}px;
	}
	${from.tablet} {
		padding-left: ${space[1]}px;
	}
	margin-right: ${space[5]}px;
`;
const reducedBottomPadding = css`
	padding-bottom: ${space[4]}px;
`;

const darkBackground = (palette: Palette) => css`
	background-color: ${palette.background.headline};
`;

const invertedText = css`
	white-space: pre-wrap;
	padding-bottom: ${space[1]}px;
	padding-right: ${space[1]}px;
`;

const maxWidth = css`
	${from.desktop} {
		max-width: 620px;
	}
`;

const invertedWrapper = css`
	/*
        Because we use box-shadow (to get clean and even background styles
        even when lines wrap) we need a margin on this wrapper div to
        shift everything back to the right
    */
	margin-left: 6px;
`;

const immersiveWrapper = css`
	/*
        Make sure we vertically align the headline font with the body font
    */
	margin-left: 6px;
	${from.tablet} {
		margin-left: 16px;
	}
	${from.leftCol} {
		margin-left: 25px;
	}
	/*
        We need this grow to ensure the headline fills the main content column
    */
	flex-grow: 1;
	/*
        This z-index is what ensures the headline text shows above the pseudo black
        box that extends the black background to the right
    */
	${getZIndex('articleHeadline')}
	${until.mobileLandscape} {
		margin-right: 40px;
	}
`;

// Due to MainMedia using position: relative, this seems to effect the rendering order
// To mitigate we use z-index
// TODO: find a cleaner solution
const zIndex = css`
	z-index: 1;
`;

export const ArticleHeadline = ({
	headlineString,
	format,
	tags,
	byline,
	palette,
}: Props) => {
	switch (format.display) {
		case Display.Immersive: {
			switch (format.design) {
				case Design.PrintShop:
					return (
						// Immersive headlines have two versions, with main media, and (this one) without
						<h1
							css={[
								jumboFont,
								maxWidth,
								immersiveStyles,
								displayBlock,
								reducedBottomPadding,
							]}
						>
							{curly(headlineString)}
						</h1>
					);
				case Design.Comment:
				case Design.Editorial:
				case Design.Letter:
					return (
						<>
							<h1
								css={[
									lightFont,
									invertedText,
									maxWidth,
									css`
										color: ${palette.text.headline};
									`,
								]}
							>
								{curly(headlineString)}
							</h1>
							{byline && (
								<HeadlineByline
									format={format}
									byline={byline}
									tags={tags}
								/>
							)}
						</>
					);
				default:
					return (
						// Immersive headlines with main media present, are large and inverted with
						// a black background
						<h1
							css={[
								immersiveWrapper,
								darkBackground(palette),
								css`
									color: ${palette.text.headline};
								`,
							]}
						>
							<span
								css={[
									format.theme === Special.Labs
										? jumboLabsFont
										: jumboFont,
									maxWidth,
									invertedStyles(palette),
									immersiveStyles,
									displayBlock,
								]}
							>
								{curly(headlineString)}
							</span>
						</h1>
					);
			}
		}
		case Display.NumberedList:
			return (
				<h1
					css={[
						boldFont,
						topPadding,
						css`
							color: ${palette.text.headline};
						`,
					]}
				>
					{curly(headlineString)}
				</h1>
			);
		case Display.Showcase:
		case Display.Standard:
		default: {
			switch (format.design) {
				case Design.Review:
				case Design.Recipe:
				case Design.Feature:
					return (
						<h1
							css={[
								boldFont,
								topPadding,
								css`
									color: ${palette.text.headline};
								`,
							]}
						>
							{curly(headlineString)}
						</h1>
					);
				case Design.Comment:
				case Design.Editorial:
					return (
						<>
							<h1
								css={[
									lightFont,
									topPadding,
									css`
										color: ${palette.text.headline};
									`,
								]}
							>
								{curly(headlineString)}
							</h1>
							{byline && (
								<HeadlineByline
									format={format}
									byline={byline}
									tags={tags}
								/>
							)}
						</>
					);

				case Design.Letter:
					return (
						<>
							<h1
								css={[
									lightFont,
									topPadding,
									css`
										color: ${palette.text.headline};
									`,
								]}
							>
								{curly(headlineString)}
							</h1>
						</>
					);
				case Design.Analysis:
					return (
						<h1
							css={[
								standardFont,
								topPadding,
								underlinedStyles,
								css`
									color: ${palette.text.headline};
								`,
							]}
						>
							{curly(headlineString)}
						</h1>
					);
				case Design.Interview:
					return (
						// Inverted headlines have a wrapper div for positioning
						// and a black background (only for the text)
						<div css={[shiftSlightly, maxWidth, displayFlex]}>
							<HeadlineTag
								tagText="Interview"
								palette={palette}
							/>
							<h1
								css={[
									invertedFont,
									invertedWrapper,
									zIndex,
									css`
										color: ${palette.text.headline};
									`,
								]}
							>
								<span
									css={[
										darkBackground(palette),
										invertedStyles(palette),
										displayInline,
									]}
								>
									{curly(headlineString)}
								</span>
							</h1>
							{byline && (
								<HeadlineByline
									format={format}
									byline={byline}
									tags={tags}
								/>
							)}
						</div>
					);
				case Design.LiveBlog:
				case Design.DeadBlog:
					return (
						<h1
							css={[
								standardFont,
								css`
									color: ${palette.text.headline};
								`,
							]}
						>
							{curly(headlineString)}
						</h1>
					);
				case Design.Interactive:
					return (
						<div
							css={css`
								position: relative;
							`}
						>
							<h1
								className={interactiveLegacyClasses.headline}
								css={[
									standardFont,
									topPadding,
									css`
										color: ${palette.text.headline};
									`,
								]}
							>
								{curly(headlineString)}
							</h1>
						</div>
					);
				default:
					return (
						<h1
							css={[
								format.theme === Special.Labs
									? labsFont
									: standardFont,
								topPadding,
								css`
									color: ${palette.text.headline};
								`,
							]}
						>
							{curly(headlineString)}
						</h1>
					);
			}
		}
	}
};
