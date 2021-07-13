import React from 'react';
import { css } from '@emotion/react';
import { string as curly } from 'curlyquotes';

import { palette } from '@guardian/src-foundations';
import { headline } from '@guardian/src-foundations/typography';
import { until } from '@guardian/src-foundations/mq';

import { pillarPalette_DO_NOT_USE } from '@root/src/lib/pillars';
import { ArticleModel } from '@root/src/amp/types/ArticleModel';
import { MainMedia } from '@root/src/amp/components/MainMedia';
import { Byline } from '@root/src/amp/components/topMeta/Byline';
import { TopMetaExtras } from '@root/src/amp/components/topMeta/TopMetaExtras';
import { Standfirst } from '@root/src/amp/components/topMeta/Standfirst';
import { SeriesLink } from '@root/src/amp/components/topMeta/SeriesLink';
import { getSharingUrls } from '@root/src/lib/sharing-urls';
import { getAgeWarning } from '@root/src/lib/age-warning';
import { Branding } from '@root/src/amp/components/topMeta/Branding';
import { StarRating } from '@root/src/amp/components/StarRating';

const headerStyle = css`
	${headline.small()};
	font-weight: 500;
	padding-bottom: 24px;
	padding-top: 3px;
	color: ${palette.neutral[7]};
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

const bylineStyle = (pillar: Theme) => css`
	${headline.xxxsmall()};
	color: ${pillarPalette_DO_NOT_USE[pillar].main};
	padding-bottom: 8px;
	font-style: italic;

	a {
		font-weight: 700;
		color: ${pillarPalette_DO_NOT_USE[pillar].main};
		text-decoration: none;
		font-style: normal;
	}
`;

const starRatingWrapper = css`
	margin: 0 0 6px -10px;
`;

const Headline: React.FC<{
	headlineText: string;
	starRating?: number;
}> = ({ headlineText, starRating }) => {
	return (
		<div>
			<h1 css={[headerStyle, underlinedStyles]}>{curly(headlineText)}</h1>

			{starRating !== undefined && (
				<div css={starRatingWrapper}>
					<StarRating rating={starRating} size="large" />
				</div>
			)}
		</div>
	);
};

export const TopMetaAnalysis: React.FC<{
	articleData: ArticleModel;
	adTargeting?: AdTargeting;
	pillar: Theme;
}> = ({ articleData, adTargeting, pillar }) => {
	const { branding } = articleData.commercialProperties[
		articleData.editionId
	];

	return (
		<header>
			{articleData.mainMediaElements.map((element, i) => (
				<MainMedia
					key={i}
					element={element}
					pillar={pillar}
					adTargeting={adTargeting}
				/>
			))}

			{!articleData.isImmersive && (
				<SeriesLink
					baseURL={articleData.guardianBaseURL}
					tags={articleData.tags}
					pillar={pillar}
					fallbackToSection={true}
					sectionLabel={articleData.sectionLabel}
					sectionUrl={articleData.sectionUrl}
				/>
			)}

			<Headline
				headlineText={articleData.headline}
				starRating={articleData.starRating}
			/>

			<Standfirst text={articleData.standfirst} pillar={pillar} />

			{branding && <Branding branding={branding} pillar={pillar} />}

			<div css={bylineStyle(pillar)}>
				<Byline
					byline={articleData.author.byline}
					tags={articleData.tags}
					guardianBaseURL={articleData.guardianBaseURL}
				/>
			</div>

			<TopMetaExtras
				sharingUrls={getSharingUrls(
					articleData.pageId,
					articleData.webTitle,
				)}
				pillar={pillar}
				ageWarning={getAgeWarning(
					articleData.tags,
					articleData.webPublicationDate,
				)}
				webPublicationDate={articleData.webPublicationDateDisplay}
				twitterHandle={articleData.author.twitterHandle}
			/>
		</header>
	);
};
