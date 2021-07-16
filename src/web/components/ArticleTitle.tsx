import { css } from '@emotion/react';

import { from, until } from '@guardian/src-foundations/mq';
import { Badge } from '@frontend/web/components/Badge';
import { Display, Design } from '@guardian/types';
import { SeriesSectionLink } from './SeriesSectionLink';

type Props = {
	format: Format;
	palette: Palette;
	tags: TagType[];
	sectionLabel: string;
	sectionUrl: string;
	guardianBaseURL: string;
	badge?: BadgeType;
};

const sectionStyles = css`
	padding-top: 8px;
	display: flex;
	flex-direction: row;
	${from.leftCol} {
		flex-direction: column;
	}
`;

const titleBadgeWrapper = css`
	margin-bottom: 6px;
	margin-top: 6px;
	${until.leftCol} {
		display: flex;
		margin-right: 10px;
	}
`;

const badgeContainer = css`
	display: flex;
	padding-top: 3px;
	padding-bottom: 6px;
`;

const marginTop = css`
	margin-top: 6px;
`;

const immersiveMargins = (format: Format) => {
	if (
		format.display === Display.Standard ||
		format.display === Display.Showcase
	) {
		return null;
	}

	switch (format.design) {
		case Design.Comment:
		case Design.Editorial:
		case Design.Letter:
			return css`
				max-width: 400px;
				margin-bottom: 4px;
			`;
		case Design.PrintShop:
			return null;
		default:
			return css`
				max-width: 400px;
				margin-bottom: 4px;
				/*
			Make sure we vertically align the title font with the body font
		*/
				${from.tablet} {
					margin-left: 16px;
				}
				${from.leftCol} {
					margin-left: 25px;
				}
			`;
	}
};

export const ArticleTitle = ({
	format,
	palette,
	tags,
	sectionLabel,
	sectionUrl,
	guardianBaseURL,
	badge,
}: Props) => (
	<div css={[sectionStyles, badge && badgeContainer]}>
		{badge && format.display !== Display.Immersive && (
			<div css={titleBadgeWrapper}>
				<Badge imageUrl={badge.imageUrl} seriesTag={badge.seriesTag} />
			</div>
		)}
		<div
			css={[
				badge && marginTop,
				format.display === Display.Immersive &&
					format.design !== Design.PrintShop &&
					immersiveMargins(format),
			]}
		>
			<SeriesSectionLink
				format={format}
				palette={palette}
				tags={tags}
				sectionLabel={sectionLabel}
				sectionUrl={sectionUrl}
				guardianBaseURL={guardianBaseURL}
				badge={badge}
			/>
		</div>
	</div>
);
