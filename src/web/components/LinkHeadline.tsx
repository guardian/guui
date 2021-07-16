import { css } from '@emotion/react';

import { headline } from '@guardian/src-foundations/typography';

import { QuoteIcon } from '@root/src/web/components/QuoteIcon';
import { Kicker } from '@root/src/web/components/Kicker';
import { Byline } from '@root/src/web/components/Byline';

type Props = {
	headlineText: string; // The text shown
	palette: Palette; // Used to colour the headline and the kicker
	format: Format;
	showUnderline?: boolean; // Some headlines have text-decoration underlined when hovered
	kickerText?: string;
	showPulsingDot?: boolean;
	showSlash?: boolean;
	showQuotes?: boolean; // When true the QuoteIcon is shown
	size?: HeadlineSizeType;
	link?: HeadlineLink; // An optional link object configures if/how the component renders an anchor tag
	byline?: string;
};

const fontStyles = (size: HeadlineSizeType) => {
	switch (size) {
		case 'large':
			return css`
				${headline.xsmall()};
			`;
		case 'medium':
			return css`
				${headline.xxsmall()};
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

const textDecorationUnderline = css`
	text-decoration: underline;
`;

const linkStyles = css`
	position: relative;
	color: inherit;
	text-decoration: none;
	:hover {
		text-decoration: underline;
	}
`;

const visitedStyles = (visitedColour: string) => css`
	:visited {
		color: ${visitedColour};
	}
`;

export const LinkHeadline = ({
	headlineText,
	palette,
	format,
	showUnderline = false,
	kickerText,
	showPulsingDot,
	showSlash,
	showQuotes = false,
	size = 'medium',
	link,
	byline,
}: Props) => (
	<h4 css={fontStyles(size)}>
		{kickerText && (
			<Kicker
				text={kickerText}
				palette={palette}
				showPulsingDot={showPulsingDot}
				showSlash={showSlash}
			/>
		)}
		{showQuotes && (
			<QuoteIcon
				format={format}
				colour={palette.text.linkKicker}
				size={size}
			/>
		)}
		{link ? (
			// We were passed a link object so headline should be a link, with link styling
			<>
				<a
					css={[
						// Composed styles - order matters for colours
						linkStyles,
						showUnderline && textDecorationUnderline,
						link.visitedColour && visitedStyles(link.visitedColour),
					]}
					href={link.to}
					// If link.preventFocus is true, set tabIndex to -1 to ensure this
					// link is not tabbed to. Useful if there is an outer link to the same
					// place, such as with MostViewed
					tabIndex={link.preventFocus ? -1 : undefined}
				>
					{headlineText}
				</a>
				{byline && (
					<Byline
						text={byline}
						palette={palette}
						format={format}
						size={size}
					/>
				)}
			</>
		) : (
			// We don't have a link so simply use a span here
			<>
				<span>{headlineText}</span>
				{byline && (
					<Byline
						text={byline}
						size={size}
						palette={palette}
						format={format}
					/>
				)}
			</>
		)}
	</h4>
);
