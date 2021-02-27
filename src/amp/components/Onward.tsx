import React from 'react';
import { css } from 'emotion';
import { InnerContainer } from '@root/src/amp/components/InnerContainer';
import { OnwardContainer } from '@root/src/amp/components/OnwardContainer';

const wrapper = css`
	background-color: white;
	padding-top: 24px;
`;

const sectionHasMostViewed = (sectionID: string): boolean => {
	const whitelist = new Set([
		'commentisfree',
		'sport',
		'football',
		'fashion',
		'lifeandstyle',
		'education',
		'culture',
		'business',
		'technology',
		'politics',
		'environment',
		'travel',
		'film',
		'media',
		'money',
		'society',
		'science',
		'music',
		'books',
		'stage',
		'cities',
		'tv-and-radio',
		'artanddesign',
		'global-development',
	]);

	return whitelist.has(sectionID);
};

export const Onward: React.FC<{
	pageID: string;
	sectionID?: string;
	hasStoryPackage: boolean;
	hasRelated: boolean;
	seriesTags: TagType[];
	guardianBaseURL: string;
}> = ({
	pageID,
	sectionID,
	hasStoryPackage,
	hasRelated,
	seriesTags,
	guardianBaseURL,
}) => {
	const ampBaseURL = 'https://amp.theguardian.com';

	const container = (path: string, componentName: string) => (
		<OnwardContainer
			key={path}
			componentName={componentName}
			guardianBaseURL={guardianBaseURL}
			path={path}
		/>
	);

	const storyPackage = hasStoryPackage
		? [
				container(
					`${ampBaseURL}/story-package-mf2/${pageID}.json`,
					'more-on-this-story',
				),
		  ]
		: [];

	const series = seriesTags.map((tag) =>
		container(`${ampBaseURL}/series-mf2/${tag.id}.json`, 'series'),
	);

	const related =
		hasRelated && !hasStoryPackage && series.length < 1
			? [
					container(
						`${ampBaseURL}/related-mf2/${pageID}.json`,
						'related-stories',
					),
			  ]
			: [];

	// Frontend:
	const mostRead = container(
		`${ampBaseURL}/most-read-mf2.json`,
		'most-popular',
	);

	const hasSectionMostViewed = sectionID && sectionHasMostViewed(sectionID);
	const sectionMostViewed =
		hasSectionMostViewed && sectionID
			? container(
					`${ampBaseURL}/container/count/1/offset/0/section/${sectionID}/mf2.json`,
					`most-viewed-in-${sectionID}`,
			  )
			: container(
					`${ampBaseURL}/container/count/1/offset/0/mf2.json`,
					'most-viewed',
			  );

	const headlines = container(
		`${ampBaseURL}/container/count/3/offset/${
			hasSectionMostViewed ? 0 : 1 // TODO not entirely sure why this is needed
		}/mf2.json`,
		'headlines',
	);

	const containers = storyPackage.concat(
		series,
		related,
		sectionMostViewed,
		mostRead,
		headlines,
	);

	return <InnerContainer className={wrapper}>{containers}</InnerContainer>;
};
