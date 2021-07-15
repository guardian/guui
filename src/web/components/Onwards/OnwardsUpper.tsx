import { css } from '@emotion/react';

import { joinUrl } from '@root/src/lib/joinUrl';
import { ElementContainer } from '@root/src/web/components/ElementContainer';
import { Pillar } from '@guardian/types';

import { OnwardsData } from './OnwardsData';
import { Carousel } from './Carousel/Carousel';

// This list is a direct copy from https://github.com/guardian/frontend/blob/6da0b3d8bfd58e8e20f80fc738b070fb23ed154e/static/src/javascripts/projects/common/modules/onward/related.js#L27
// If you change this list then you should also update ^
// order matters here (first match wins)
export const WHITELISTED_TAGS = [
	// sport tags
	'sport/cricket',
	'sport/rugby-union',
	'sport/rugbyleague',
	'sport/formulaone',
	'sport/tennis',
	'sport/cycling',
	'sport/motorsports',
	'sport/golf',
	'sport/horse-racing',
	'sport/boxing',
	'sport/us-sport',
	'sport/australia-sport',

	// football tags
	'football/championsleague',
	'football/premierleague',
	'football/championship',
	'football/europeanfootball',
	'football/world-cup-2014',

	// football team tags
	'football/manchester-united',
	'football/chelsea',
	'football/arsenal',
	'football/manchestercity',
	'football/tottenham-hotspur',
	'football/liverpool',
];

const firstPopularTag = (
	pageTags: string | string[],
	isPaidContent: boolean,
) => {
	// This function looks for the first tag in pageTags, that also exists in our whitelist
	if (!pageTags) {
		// If there are no page tags we will never find a match so
		return false;
	}

	// The problem here is keywordIds is sometimes a string and sometimes an array of strings. Fun times.
	let tags;
	if (typeof pageTags === 'string') {
		tags = pageTags.split(',');
	} else {
		tags = pageTags;
	}

	const firstTagInWhitelist =
		tags.find((tag: string) => WHITELISTED_TAGS.includes(tag)) || false;

	// For paid content we just return the first tag, otherwise we
	// filter for the first tag in the whitelist
	return isPaidContent ? tags[0] : firstTagInWhitelist;
};

const onwardsWrapper = css`
	width: 100%;
`;

const headlinesContainer = (edition: Edition): string => {
	switch (edition) {
		case 'UK':
			return 'uk-alpha/news/regular-stories';
		case 'US':
			return 'c5cad9ee-584d-4e85-85cd-bf8ee481b026';
		case 'AU':
			return 'au-alpha/news/regular-stories';
		case 'INT':
			return '10f21d96-18f6-426f-821b-19df55dfb831';
	}
};

const sportContainer = (edition: Edition): string => {
	switch (edition) {
		case 'UK':
			return '754c-8e8c-fad9-a927';
		case 'US':
			return 'f6dd-d7b1-0e85-4650';
		case 'AU':
			return 'c45d-318f-896c-3a85';
		case 'INT':
			return 'd1ad8ec3-5ee2-4673-94c8-cc3f8d261e52';
	}
};

const opinionContainer = (edition: Edition): string => {
	switch (edition) {
		case 'UK':
			return '3ff78b30-52f5-4d30-ace8-c887113cbe0d';
		case 'US':
			return '98df412d-b0e7-4d9a-98c2-062642823e94';
		case 'AU':
			return 'au-alpha/contributors/feature-stories';
		case 'INT':
			return 'ee3386bb-9430-4a6d-8bca-b99d65790f3b';
	}
};

const cultureContainer = (edition: Edition): string => {
	switch (edition) {
		case 'UK':
			return 'ae511a89-ef38-4ec9-aab1-3a5ebc96d118';
		case 'US':
			return 'fb59c1f8-72a7-41d5-8365-a4d574809bed';
		case 'AU':
			return '22262088-4bce-4290-9810-cb50bbead8db';
		case 'INT':
			return 'c7154e22-7292-4d93-a14d-22fd4b6b693d';
	}
};

const lifestyleContainer = (edition: Edition): string => {
	switch (edition) {
		case 'UK':
			return 'uk-alpha/features/feature-stories';
		case 'US':
			return 'us-alpha/features/feature-stories';
		case 'AU':
			return '13636104-51ce-4264-bb6b-556c80227331';
		case 'INT':
			return '7b297ef5-a3f9-45e5-b915-b54951d7f6ec';
	}
};

const getContainerDataUrl = (
	pillar: Theme,
	edition: Edition,
	ajaxUrl: string,
) => {
	switch (pillar) {
		case Pillar.Sport:
			return joinUrl([
				ajaxUrl,
				'container/data',
				`${sportContainer(edition)}.json`,
			]);
		case Pillar.News:
			return joinUrl([
				ajaxUrl,
				'container/data',
				`${headlinesContainer(edition)}.json`,
			]);
		case Pillar.Culture:
			return joinUrl([
				ajaxUrl,
				'container/data',
				`${cultureContainer(edition)}.json`,
			]);
		case Pillar.Lifestyle:
			return joinUrl([
				ajaxUrl,
				'container/data',
				`${lifestyleContainer(edition)}.json`,
			]);
		case Pillar.Opinion:
			return joinUrl([
				ajaxUrl,
				'container/data',
				`${opinionContainer(edition)}.json`,
			]);
		default:
			return joinUrl([
				ajaxUrl,
				'container/data',
				`${headlinesContainer(edition)}.json`,
			]);
	}
};

type Props = {
	ajaxUrl: string;
	hasRelated: boolean;
	hasStoryPackage: boolean;
	isAdFreeUser: boolean;
	pageId: string;
	isPaidContent: boolean;
	showRelatedContent: boolean;
	keywordIds: string | string[];
	contentType: string;
	tags: TagType[];
	format: Format;
	edition: Edition;
	pillar: Theme;
};

export const OnwardsUpper = ({
	ajaxUrl,
	hasRelated,
	hasStoryPackage,
	isAdFreeUser,
	pageId,
	isPaidContent,
	showRelatedContent,
	keywordIds,
	contentType,
	tags,
	format,
	pillar,
	edition,
}: Props) => {
	const dontShowRelatedContent = !showRelatedContent || !hasRelated;

	// Related content can be a collection of articles based on
	// two things, 1: A popular tag, or 2: A generic text match
	const tagToFilterBy = firstPopularTag(keywordIds, isPaidContent);

	// In this context, Blog tags are treated the same as Series tags
	const seriesTag = tags.find(
		(tag) => tag.type === 'Series' || tag.type === 'Blog',
	);

	let url;
	let ophanComponentName: OphanComponentName = 'default-onwards';

	if (hasStoryPackage) {
		// Always fetch the story package if it exists
		url = joinUrl([ajaxUrl, 'story-package', `${pageId}.json?dcr=true`]);
		ophanComponentName = 'more-on-this-story';
	} else if (isAdFreeUser && isPaidContent) {
		// Don't show any related content (other than story packages) for
		// adfree users when the content is paid for
	} else if (seriesTag) {
		// Use the series tag to get other data in the same series
		// Example: {
		//              id: "cities/series/the-illustrated-city",
		//              title: "The illustrated city",
		//              type: "Series",
		//          }
		//
		url = joinUrl([ajaxUrl, 'series', `${seriesTag.id}.json?dcr`]);
		ophanComponentName = 'series';
	} else if (dontShowRelatedContent) {
		// Then don't show related content
	} else if (tagToFilterBy) {
		// Use popular in tag endpoint
		let popularInTagUrl = `/popular-in-tag/${tagToFilterBy}.json?dcr=true`;

		// --- Tag excludes --- //
		const tagsToExclude = [];
		// Exclude ad features from non-ad feature content
		if (!isPaidContent) {
			tagsToExclude.push('tone/advertisement-features');
		}
		// We don't want to show professional network content on videos or interactives
		if (
			contentType.toLowerCase() === 'video' ||
			contentType.toLowerCase() === 'interactive'
		) {
			tagsToExclude.push('guardian-professional/guardian-professional');
		}

		// Add any exclude tags to the url
		if (tagsToExclude.length > 0) {
			const queryParams = tagsToExclude.map(
				(tag) => `exclude-tag=${tag}`,
			);
			popularInTagUrl += `&${queryParams.join('&')}`;
		}

		url = joinUrl([ajaxUrl, popularInTagUrl]);
		ophanComponentName = 'related-content';
	} else {
		// Default to generic related endpoint
		const relatedUrl = `/related/${pageId}.json?dcr=true`;

		url = joinUrl([ajaxUrl, relatedUrl]);
		ophanComponentName = 'related-stories';
	}

	const curatedDataUrl = getContainerDataUrl(pillar, edition, ajaxUrl);

	return (
		<div css={onwardsWrapper}>
			{url && (
				<ElementContainer>
					<OnwardsData
						url={url}
						limit={8}
						ophanComponentName={ophanComponentName}
						Container={Carousel}
						format={format}
					/>
				</ElementContainer>
			)}
			<ElementContainer showTopBorder={true}>
				<OnwardsData
					url={curatedDataUrl}
					limit={8}
					ophanComponentName="curated-content"
					Container={Carousel}
					isCuratedContent={true}
					format={format}
				/>
			</ElementContainer>
		</div>
	);
};
