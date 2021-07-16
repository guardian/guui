import { css } from '@emotion/react';

import { Design, Special } from '@guardian/types';
import { headline, textSans } from '@guardian/src-foundations/typography';
import { neutral } from '@guardian/src-foundations/palette';
import { until } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';

import { QuoteIcon } from '@root/src/web/components/QuoteIcon';
import { Kicker } from '@root/src/web/components/Kicker';
import { Byline } from '@root/src/web/components/Byline';

type Props = {
	headlineText: string; // The text shown
	format: Format; // Used to decide when to add type specific styles
	palette: Palette; // Used to colour the headline and the kicker
	kickerText?: string;
	showPulsingDot?: boolean;
	showSlash?: boolean;
	showQuotes?: boolean; // Even with design !== Comment, a piece can be opinion
	size?: HeadlineSizeType;
	byline?: string;
	showByline?: boolean;
	isFullCardImage?: boolean; // Used for carousel AB test
};

const fontStyles = (size: HeadlineSizeType) => {
	switch (size) {
		case 'large':
			return css`
				${headline.xsmall()};
				${until.desktop} {
					${headline.xxsmall()};
				}
			`;
		case 'medium':
			return css`
				${headline.xxsmall()};
				${until.desktop} {
					${headline.xxxsmall()};
				}
			`;
		case 'small':
			return css`
				${headline.xxxsmall()};
			`;
		case 'xsmall':
			return css`
				${headline.xxxsmall()};
				font-size: 14px;
			`;
	}
};

const labTextStyles = (size: HeadlineSizeType) => {
	switch (size) {
		case 'large':
			return css`
				${textSans.large()};
				${until.desktop} {
					${textSans.medium()};
				}
			`;
		case 'medium':
			return css`
				${textSans.large({ lineHeight: 'tight' })};
				${until.desktop} {
					${textSans.medium({ lineHeight: 'tight' })};
				}
				padding-bottom: ${space[1]}px;
			`;
		case 'small':
			return css`
				${textSans.small()};
			`;
		case 'xsmall':
			return css`
				${textSans.xxsmall()};
				font-size: 14px;
			`;
	}
};

const underlinedStyles = (size: HeadlineSizeType) => {
	function generateUnderlinedCss(baseSize: number) {
		return css`
			background-image: linear-gradient(
				to bottom,
				transparent,
				transparent ${baseSize - 1}px,
				rgba(199, 0, 0, 0.5)
			);
			line-height: ${baseSize - 1}px;
			background-size: 1px ${baseSize}px;
			background-origin: content-box;
			background-clip: content-box;
			margin-right: -5px;
		`;
	}
	switch (size) {
		case 'small':
			return generateUnderlinedCss(21);
		case 'medium':
			return generateUnderlinedCss(24);
		case 'large':
			return generateUnderlinedCss(28);
		default:
			return generateUnderlinedCss(23);
	}
};

const fullCardImageTextStyles = css`
	${headline.xxsmall()};
	color: ${neutral[100]};
	background-color: rgba(0, 0, 0, 0.75);
	box-shadow: -${space[1]}px 0 0 rgba(0, 0, 0, 0.75);
	/* Box decoration is required to push the box shadow out on Firefox */
	box-decoration-break: clone;
	line-height: 1.25;
	/* white-space: pre-wrap; */
	padding-right: ${space[1]}px;
	${until.desktop} {
		${headline.xxxsmall()};
	}
`;

export const CardHeadline = ({
	headlineText,
	format,
	palette,
	showQuotes,
	kickerText,
	showPulsingDot,
	showSlash,
	size = 'medium',
	byline,
	showByline,
	isFullCardImage,
}: Props) => (
	<>
		<h4
			css={[
				format.theme === Special.Labs
					? labTextStyles(size)
					: fontStyles(size),
				format.design === Design.Analysis && underlinedStyles(size),
				isFullCardImage &&
					css`
						line-height: 1; /* Reset line height in full image carousel */
					`,
			]}
		>
			<span css={isFullCardImage && fullCardImageTextStyles}>
				{kickerText && (
					<Kicker
						text={kickerText}
						palette={palette}
						showPulsingDot={showPulsingDot}
						showSlash={showSlash}
						inCard={true}
					/>
				)}
				{showQuotes && (
					<QuoteIcon
						format={format}
						colour={palette.text.cardKicker}
						size={size}
					/>
				)}

				<span
					css={css`
						color: ${palette.text.cardHeadline};
					`}
				>
					{headlineText}
				</span>
			</span>
		</h4>
		{byline && showByline && (
			<Byline
				text={byline}
				palette={palette}
				format={format}
				size={size}
			/>
		)}
	</>
);
