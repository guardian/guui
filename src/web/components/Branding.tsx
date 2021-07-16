import { css } from '@emotion/react';

import { neutral } from '@guardian/src-foundations';
import { until } from '@guardian/src-foundations/mq';
import { textSans } from '@guardian/src-foundations/typography';

const brandingStyle = css`
	padding-bottom: 10px;
`;

const brandingLabelStyle = css`
	${textSans.xxsmall()};
	color: ${neutral[20]};
`;

const brandingLogoStyle = css`
	${until.phablet} {
		max-width: 140px;
	}
	max-width: 280px;
	width: 100%;
	padding: 10px 0;
	img {
		max-width: 100%;
	}
`;

const brandingAboutLink = (palette: Palette) => css`
	color: ${palette.text.branding};
	${textSans.xxsmall()}
	display: block;
	text-decoration: none;
	&:hover {
		text-decoration: underline;
	}
`;

export const Branding: React.FC<{
	branding: Branding;
	palette: Palette;
}> = ({ branding, palette }) => {
	if (!branding) return null;
	return (
		<div css={brandingStyle}>
			<div css={brandingLabelStyle}>{branding.logo.label}</div>
			<div css={brandingLogoStyle}>
				<a
					href={branding.logo.link}
					data-sponsor={branding.sponsorName.toLowerCase()}
					rel="nofollow"
					aria-label={`Visit the ${branding.sponsorName} website`}
				>
					<img src={branding.logo.src} alt={branding.sponsorName} />
				</a>
			</div>

			<a href={branding.aboutThisLink} css={brandingAboutLink(palette)}>
				About this content
			</a>
		</div>
	);
};
