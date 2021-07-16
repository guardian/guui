import { css } from '@emotion/react';
import { brandAltBackground } from '@guardian/src-foundations/palette';
import { headline, textSans } from '@guardian/src-foundations/typography';
import { space } from '@guardian/src-foundations';

import { BylineLink } from '@root/src/web/components/BylineLink';
import { Display, Design, Format, Special } from '@guardian/types';
import { decidePalette } from '@root/src/web/lib/decidePalette';

const wrapperStyles = css`
	margin-left: 6px;
	margin-top: 4px;
	/* Without z-index here the byline appears behind the main image for showcase views */
	z-index: 1;
`;

const yellowBoxStyles = (format: Format) => css`
	${format.theme === Special.Labs
		? textSans.large({ lineHeight: 'regular' })
		: headline.xxsmall({
				fontWeight: 'regular',
				lineHeight: 'loose',
		  })}
	font-style: italic;
	background-color: ${brandAltBackground.primary};
	box-shadow: 4px 0 0 ${brandAltBackground.primary},
		-6px 0 0 ${brandAltBackground.primary};
	display: inline-block;
	box-decoration-break: clone;
	a {
		color: inherit;
		text-decoration: none;
		:hover {
			text-decoration: underline;
		}
	}
`;

const opinionWrapperStyles = css`
	display: inline-block;
`;

const opinionStyles = (palette: Palette, format: Format) => css`
	${format.theme === Special.Labs
		? textSans.xxxlarge({ lineHeight: 'loose' })
		: headline.medium({
				fontWeight: 'light',
		  })}
	line-height: 38px;
	/* Used to prevent the byline stretching full width */
	display: inline;
	font-style: italic;
	color: ${palette.text.headlineByline};
	background: ${palette.background.headlineByline};
	a {
		color: inherit;
		text-decoration: none;
		:hover {
			text-decoration: underline;
		}
	}
`;

const immersiveStyles = (format: Format) => css`
	${format.theme === Special.Labs
		? textSans.large({ lineHeight: 'tight' })
		: headline.xsmall({
				fontWeight: 'light',
		  })}
	margin-bottom: ${space[6]}px;
`;

const immersiveLinkStyles = (palette: Palette, format: Format) => css`
	a {
		color: ${palette.text.headlineByline};
		border-bottom: 1px solid
			${format.theme === Special.Labs
				? palette.border.articleLink
				: palette.text.headlineByline};
		text-decoration: none;
		:hover {
			border-bottom: 1px solid ${palette.hover.headlineByline};
			color: ${palette.hover.headlineByline};
			text-decoration: none;
		}
	}
`;

// If there is an image reduce the width of the author div
const authorBylineWithImage = css`
	width: 68%;
`;

type Props = {
	format: Format;
	byline: string;
	tags: TagType[];
};

const hasSingleContributor = (tags: TagType[]) =>
	tags.filter((tag) => tag.type === 'Contributor').length === 1;

export const HeadlineByline = ({ format, byline, tags }: Props) => {
	if (byline === '') {
		return null;
	}

	const palette = decidePalette(format);

	switch (format.display) {
		case Display.Immersive:
			return (
				<div css={immersiveStyles(format)}>
					by{' '}
					<span css={immersiveLinkStyles(palette, format)}>
						<BylineLink byline={byline} tags={tags} />
					</span>
				</div>
			);
		case Display.Showcase:
		case Display.NumberedList:
		case Display.Standard:
		default: {
			switch (format.design) {
				case Design.Interview:
					return (
						<div css={wrapperStyles}>
							<div css={yellowBoxStyles(format)}>
								<BylineLink byline={byline} tags={tags} />
							</div>
						</div>
					);
				case Design.Editorial:
				case Design.Letter:
				case Design.Comment:
					return (
						<div
							css={[
								opinionWrapperStyles,
								hasSingleContributor(tags) &&
									authorBylineWithImage,
							]}
						>
							<div css={opinionStyles(palette, format)}>
								<BylineLink byline={byline} tags={tags} />
							</div>
						</div>
					);
				default:
					return null;
			}
		}
	}
};
