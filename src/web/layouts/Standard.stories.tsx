import React, { useEffect } from 'react';

import {
	makeGuardianBrowserCAPI,
	makeGuardianBrowserNav,
} from '@root/src/model/window-guardian';
import { Article } from '@root/fixtures/articles/Article';
import { PhotoEssay } from '@root/fixtures/articles/PhotoEssay';
import { Review } from '@root/fixtures/articles/Review';
import { PrintShop } from '@root/fixtures/articles/PrintShop';
import { Analysis } from '@root/fixtures/articles/Analysis';
import { Feature } from '@root/fixtures/articles/Feature';
import { Live } from '@root/fixtures/articles/Live';
import { GuardianView } from '@root/fixtures/articles/GuardianView';
import { Interview } from '@root/fixtures/articles/Interview';
import { Quiz } from '@root/fixtures/articles/Quiz';
import { Recipe } from '@root/fixtures/articles/Recipe';
import { Comment } from '@root/fixtures/articles/Comment';
import { MatchReport } from '@root/fixtures/articles/MatchReport';

import { HydrateApp } from '@root/src/web/components/HydrateApp';
import { embedIframe } from '@root/src/web/browser/embedIframe/embedIframe';
import { mockRESTCalls } from '@root/src/web/lib/mockRESTCalls';

import { extractNAV } from '@root/src/model/extract-nav';
import { DecideLayout } from './DecideLayout';

mockRESTCalls();

export default {
	title: 'Layouts/Standard',
	parameters: {
		chromatic: { viewports: [1300], delay: 800, diffThreshold: 0.2 },
	},
};

const convertToStandard = (CAPI: CAPIType) => {
	return {
		...CAPI,
		pageType: {
			...CAPI.pageType,
			hasShowcaseMainElement: false,
		},
		isImmersive: false,
	};
};

// HydratedLayout is used here to simulated the hydration that happens after we init react on
// the client. We need a separate component so that we can make use of useEffect to ensure
// the hydrate step only runs once the dom has been rendered.
const HydratedLayout = ({ ServerCAPI }: { ServerCAPI: CAPIType }) => {
	const NAV = extractNAV(ServerCAPI.nav);

	useEffect(() => {
		const CAPI = makeGuardianBrowserCAPI(ServerCAPI);
		HydrateApp({ CAPI, NAV: makeGuardianBrowserNav(NAV) });
		embedIframe().catch((e) =>
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			console.error(`HydratedLayout embedIframe - error: ${e}`),
		);
	}, [ServerCAPI, NAV]);
	return <DecideLayout CAPI={ServerCAPI} NAV={NAV} />;
};

export const ArticleStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Article);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
ArticleStory.story = { name: 'Article' };

export const ReviewStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Review);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
ReviewStory.story = { name: 'Review' };

export const PrintShopStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(PrintShop);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
PrintShopStory.story = { name: 'PrintShop' };

export const CommentStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Comment);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
CommentStory.story = { name: 'Comment' };

export const PhotoEssayStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(PhotoEssay);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
PhotoEssayStory.story = { name: 'PhotoEssay' };

export const AnalysisStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Analysis);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
AnalysisStory.story = {
	name: 'Analysis',
	parameters: {
		viewport: { defaultViewport: 'mobileMedium' },
		chromatic: { viewports: [480] },
	},
};

export const FeatureStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Feature);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
FeatureStory.story = { name: 'Feature' };

export const LiveStory = (): React.ReactNode => {
	const LiveBlog = {
		...Live,
		config: {
			...Live.config,
			isLive: true,
		},
	};
	const ServerCAPI = convertToStandard(LiveBlog);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
LiveStory.story = { name: 'LiveBlog' };

export const DeadStory = (): React.ReactNode => {
	const DeadBlog = {
		...Live,
		config: {
			...Live.config,
			isLive: false,
		},
	};
	const ServerCAPI = convertToStandard(DeadBlog);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
DeadStory.story = { name: 'DeadBlog' };

export const GuardianViewStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(GuardianView);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
GuardianViewStory.story = {
	name: 'GuardianView',
	parameters: {
		viewport: { defaultViewport: 'phablet' },
		chromatic: { viewports: [660] },
	},
};

export const InterviewStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Interview);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
InterviewStory.story = {
	name: 'Interview',
	parameters: {
		viewport: { defaultViewport: 'desktop' },
		chromatic: { viewports: [980] },
	},
};

export const QuizStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Quiz);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
QuizStory.story = {
	name: 'Quiz',
	parameters: {
		viewport: { defaultViewport: 'desktop' },
		chromatic: { viewports: [1300] },
	},
};

export const RecipeStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Recipe);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
RecipeStory.story = {
	name: 'Recipe',
	parameters: {
		viewport: { defaultViewport: 'mobileMedium' },
		chromatic: { viewports: [375] },
	},
};

export const MatchReportStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(MatchReport);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
MatchReportStory.story = {
	name: 'MatchReport',
	parameters: {
		viewport: { defaultViewport: 'desktop' },
		chromatic: { viewports: [1330] },
	},
};
