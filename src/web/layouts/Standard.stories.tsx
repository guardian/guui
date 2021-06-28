import { useEffect } from 'react';

import { breakpoints } from '@guardian/src-foundations/mq';

import {
	makeGuardianBrowserCAPI,
	makeGuardianBrowserNav,
} from '@root/src/model/window-guardian';
import { Article } from '@root/fixtures/generated/articles/Article';
import { PhotoEssay } from '@root/fixtures/generated/articles/PhotoEssay';
import { Review } from '@root/fixtures/generated/articles/Review';
import { PrintShop } from '@root/fixtures/generated/articles/PrintShop';
import { Analysis } from '@root/fixtures/generated/articles/Analysis';
import { Feature } from '@root/fixtures/generated/articles/Feature';
import { Live } from '@root/fixtures/generated/articles/Live';
import { Editorial } from '@root/fixtures/generated/articles/Editorial';
import { Letter } from '@root/fixtures/generated/articles/Letter';
import { Interview } from '@root/fixtures/generated/articles/Interview';
import { Quiz } from '@root/fixtures/generated/articles/Quiz';
import { Recipe } from '@root/fixtures/generated/articles/Recipe';
import { Comment } from '@root/fixtures/generated/articles/Comment';
import { MatchReport } from '@root/fixtures/generated/articles/MatchReport';
import { Labs } from '@root/fixtures/generated/articles/Labs';
import { SpecialReport } from '@root/fixtures/generated/articles/SpecialReport';
import { NumberedList } from '@root/fixtures/generated/articles/NumberedList';

import { BootReact } from '@root/src/web/components/BootReact';
import { embedIframe } from '@root/src/web/browser/embedIframe/embedIframe';
import { mockRESTCalls } from '@root/src/web/lib/mockRESTCalls';

import { extractNAV } from '@root/src/model/extract-nav';
import { DecideLayout } from './DecideLayout';

mockRESTCalls();

export default {
	title: 'Layouts/Standard',
	parameters: {
		chromatic: {
			viewports: [breakpoints.wide],
			delay: 800,
			diffThreshold: 0.2,
		},
	},
};

const convertToStandard = (CAPI: CAPIType) => {
	return {
		...CAPI,
		format: {
			...CAPI.format,
			display: 'StandardDisplay' as CAPIDisplay,
		},
	};
};

// HydratedLayout is used here to simulated the hydration that happens after we init react on
// the client. We need a separate component so that we can make use of useEffect to ensure
// the hydrate step only runs once the dom has been rendered.
const HydratedLayout = ({
	ServerCAPI,
	modifyPage,
}: {
	ServerCAPI: CAPIType;
	modifyPage?: () => void;
}) => {
	const NAV = extractNAV(ServerCAPI.nav);

	useEffect(() => {
		const CAPI = makeGuardianBrowserCAPI(ServerCAPI);
		BootReact({ CAPI, NAV: makeGuardianBrowserNav(NAV) });
		embedIframe().catch((e) =>
			console.error(`HydratedLayout embedIframe - error: ${e}`),
		);
		if (modifyPage) {
			modifyPage();
		}
	}, [ServerCAPI, NAV]);
	return <DecideLayout CAPI={ServerCAPI} NAV={NAV} />;
};

export const ArticleStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Article);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
ArticleStory.story = { name: 'Article' };

export const ArticlePrintStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Article);
	return (
		<HydratedLayout
			ServerCAPI={ServerCAPI}
			modifyPage={() => {
				const styleTag = document.createElement('link');
				styleTag.setAttribute('href', '/css/print.css');
				styleTag.setAttribute('rel', 'stylesheet');
				document.getElementById('root')?.prepend(styleTag);
			}}
		/>
	);
};
ArticlePrintStory.story = {
	name: 'Article Print',
};

ArticlePrintStory.parameters = {
	viewport: {
		defaultViewport: 'tablet',
	},
	chromatic: { viewports: [740] },
};

export const ReviewStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Review);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
ReviewStory.story = { name: 'Review' };

export const ReviewNoStarStory = (): React.ReactNode => {
	const ReviewWithoutStars = {
		...Review,
		starRating: undefined,
	};
	const ServerCAPI = convertToStandard(ReviewWithoutStars);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
ReviewNoStarStory.story = { name: 'Review without stars' };

export const PrintShopStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(PrintShop);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
PrintShopStory.story = { name: 'PrintShop' };

export const CommentStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Comment);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
CommentStory.story = {
	name: 'Comment',
	parameters: {
		viewport: { defaultViewport: 'mobileMedium' },
		// Cutout/byline interaction is a specific issue
		// we look out for on mobile on opinion content
		chromatic: { viewports: [breakpoints.mobile, breakpoints.wide] },
	},
};

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
		viewport: { defaultViewport: 'mobileLandscape' },
		chromatic: { viewports: [breakpoints.mobileLandscape] },
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
		format: {
			...Live.format,
			design: 'LiveBlogDesign' as CAPIDesign,
		},
	};
	const ServerCAPI = convertToStandard(LiveBlog);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
LiveStory.story = { name: 'LiveBlog' };

export const DeadStory = (): React.ReactNode => {
	const DeadBlog = {
		...Live,
		format: {
			...Live.format,
			design: 'DeadBlogDesign' as CAPIDesign,
		},
	};
	const ServerCAPI = convertToStandard(DeadBlog);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
DeadStory.story = { name: 'DeadBlog' };

export const EditorialStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Editorial);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
EditorialStory.story = {
	name: 'Editorial',
	parameters: {
		viewport: { defaultViewport: 'phablet' },
		chromatic: { viewports: [breakpoints.phablet] },
	},
};

export const LetterStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Letter);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
LetterStory.story = {
	name: 'Letter',
};

export const InterviewStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Interview);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
InterviewStory.story = {
	name: 'Interview',
	parameters: {
		viewport: { defaultViewport: 'desktop' },
		chromatic: { viewports: [breakpoints.desktop] },
	},
};

export const QuizStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Quiz);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
QuizStory.story = {
	name: 'Quiz',
	parameters: {
		viewport: { defaultViewport: 'wide' },
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
		chromatic: { viewports: [breakpoints.mobileMedium] },
	},
};

export const MatchReportStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(MatchReport);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
MatchReportStory.story = {
	name: 'MatchReport',
	parameters: {
		viewport: { defaultViewport: 'wide' },
	},
};

export const LabsStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Labs);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
LabsStory.story = {
	name: 'Labs',
};

export const SpecialReportStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(SpecialReport);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
SpecialReportStory.story = {
	name: 'SpecialReport',
};

export const NumberedListStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(NumberedList);
	return <HydratedLayout ServerCAPI={ServerCAPI} />;
};
NumberedListStory.story = {
	name: 'NumberedList',
};

// Anniversary stuff (Delete once event is over)

const convertToAnniversary = (CAPI: CAPIType) => {
	return {
		...CAPI,
		config: {
			...CAPI.config,
			switches: {
				...CAPI.config.switches,
				anniversaryHeaderSvg: true,
			},
			abTests: {
				anniversaryAtomVariant: 'variant',
			},
		},
	};
};

export const ArticleAnniversaryStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Article);
	const AnniversaryCAPI = convertToAnniversary(ServerCAPI);
	return <HydratedLayout ServerCAPI={AnniversaryCAPI} />;
};
ArticleAnniversaryStory.story = { name: 'ArticleAnniversary' };

export const ReviewAnniversaryStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Review);
	const AnniversaryCAPI = convertToAnniversary(ServerCAPI);
	return <HydratedLayout ServerCAPI={AnniversaryCAPI} />;
};
ReviewAnniversaryStory.story = { name: 'ReviewAnniversary' };

export const ReviewNoStarAnniversaryStory = (): React.ReactNode => {
	const ReviewWithoutStars = {
		...Review,
		starRating: undefined,
	};
	const ServerCAPI = convertToStandard(ReviewWithoutStars);
	const AnniversaryCAPI = convertToAnniversary(ServerCAPI);
	return <HydratedLayout ServerCAPI={AnniversaryCAPI} />;
};
ReviewNoStarAnniversaryStory.story = {
	name: 'ReviewAnniversary without stars',
};

export const PrintShopAnniversaryStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(PrintShop);
	const AnniversaryCAPI = convertToAnniversary(ServerCAPI);
	return <HydratedLayout ServerCAPI={AnniversaryCAPI} />;
};
PrintShopAnniversaryStory.story = { name: 'PrintShopAnniversary' };

export const CommentAnniversaryStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Comment);
	const AnniversaryCAPI = convertToAnniversary(ServerCAPI);
	return <HydratedLayout ServerCAPI={AnniversaryCAPI} />;
};
CommentAnniversaryStory.story = {
	name: 'CommentAnniversary',
	parameters: {
		viewport: { defaultViewport: 'mobileMedium' },
		// Cutout/byline interaction is a specific issue
		// we look out for on mobile on opinion content
		chromatic: { viewports: [breakpoints.mobile, breakpoints.wide] },
	},
};

export const PhotoEssayAnniversaryStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(PhotoEssay);
	const AnniversaryCAPI = convertToAnniversary(ServerCAPI);
	return <HydratedLayout ServerCAPI={AnniversaryCAPI} />;
};
PhotoEssayAnniversaryStory.story = { name: 'PhotoEssayAnniversary' };

export const AnalysisAnniversaryStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Analysis);
	const AnniversaryCAPI = convertToAnniversary(ServerCAPI);
	return <HydratedLayout ServerCAPI={AnniversaryCAPI} />;
};
AnalysisAnniversaryStory.story = {
	name: 'AnalysisAnniversary',
	parameters: {
		viewport: { defaultViewport: 'mobileLandscape' },
		chromatic: { viewports: [breakpoints.mobileLandscape] },
	},
};

export const FeatureAnniversaryStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Feature);
	const AnniversaryCAPI = convertToAnniversary(ServerCAPI);
	return <HydratedLayout ServerCAPI={AnniversaryCAPI} />;
};
FeatureAnniversaryStory.story = { name: 'FeatureAnniversary' };

export const LiveAnniversaryStory = (): React.ReactNode => {
	const LiveBlog = {
		...Live,
		format: {
			...Live.format,
			design: 'LiveBlogDesign' as CAPIDesign,
		},
	};
	const ServerCAPI = convertToStandard(LiveBlog);
	const AnniversaryCAPI = convertToAnniversary(ServerCAPI);
	return <HydratedLayout ServerCAPI={AnniversaryCAPI} />;
};
LiveAnniversaryStory.story = { name: 'LiveBlogAnniversary' };

export const DeadAnniversaryStory = (): React.ReactNode => {
	const DeadBlog = {
		...Live,
		format: {
			...Live.format,
			design: 'DeadBlogDesign' as CAPIDesign,
		},
	};
	const ServerCAPI = convertToStandard(DeadBlog);
	const AnniversaryCAPI = convertToAnniversary(ServerCAPI);
	return <HydratedLayout ServerCAPI={AnniversaryCAPI} />;
};
DeadAnniversaryStory.story = { name: 'DeadBlogAnniversary' };

export const EditorialAnniversaryStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Editorial);
	const AnniversaryCAPI = convertToAnniversary(ServerCAPI);
	return <HydratedLayout ServerCAPI={AnniversaryCAPI} />;
};
EditorialAnniversaryStory.story = {
	name: 'EditorialAnniversary',
	parameters: {
		viewport: { defaultViewport: 'phablet' },
		chromatic: { viewports: [breakpoints.phablet] },
	},
};

export const LetterAnniversaryStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Letter);
	const AnniversaryCAPI = convertToAnniversary(ServerCAPI);
	return <HydratedLayout ServerCAPI={AnniversaryCAPI} />;
};
LetterAnniversaryStory.story = {
	name: 'LetterAnniversary',
};

export const InterviewAnniversaryStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Interview);
	const AnniversaryCAPI = convertToAnniversary(ServerCAPI);
	return <HydratedLayout ServerCAPI={AnniversaryCAPI} />;
};
InterviewAnniversaryStory.story = {
	name: 'InterviewAnniversary',
	parameters: {
		viewport: { defaultViewport: 'desktop' },
		chromatic: { viewports: [breakpoints.desktop] },
	},
};

export const QuizAnniversaryStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Quiz);
	const AnniversaryCAPI = convertToAnniversary(ServerCAPI);
	return <HydratedLayout ServerCAPI={AnniversaryCAPI} />;
};
QuizAnniversaryStory.story = {
	name: 'QuizAnniversary',
	parameters: {
		viewport: { defaultViewport: 'wide' },
	},
};

export const RecipeAnniversaryStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Recipe);
	const AnniversaryCAPI = convertToAnniversary(ServerCAPI);
	return <HydratedLayout ServerCAPI={AnniversaryCAPI} />;
};
RecipeAnniversaryStory.story = {
	name: 'RecipeAnniversary',
	parameters: {
		viewport: { defaultViewport: 'mobileMedium' },
		chromatic: { viewports: [breakpoints.mobileMedium] },
	},
};

export const MatchReportAnniversaryStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(MatchReport);
	const AnniversaryCAPI = convertToAnniversary(ServerCAPI);
	return <HydratedLayout ServerCAPI={AnniversaryCAPI} />;
};
MatchReportAnniversaryStory.story = {
	name: 'MatchReportAnniversary',
	parameters: {
		viewport: { defaultViewport: 'wide' },
	},
};

export const LabsAnniversaryStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(Labs);
	const AnniversaryCAPI = convertToAnniversary(ServerCAPI);
	return <HydratedLayout ServerCAPI={AnniversaryCAPI} />;
};
LabsAnniversaryStory.story = {
	name: 'LabsAnniversary',
};

export const SpecialReportAnniversaryStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(SpecialReport);
	const AnniversaryCAPI = convertToAnniversary(ServerCAPI);
	return <HydratedLayout ServerCAPI={AnniversaryCAPI} />;
};
SpecialReportAnniversaryStory.story = {
	name: 'SpecialReportAnniversary',
};

export const NumberedListAnniversaryStory = (): React.ReactNode => {
	const ServerCAPI = convertToStandard(NumberedList);
	const AnniversaryCAPI = convertToAnniversary(ServerCAPI);
	return <HydratedLayout ServerCAPI={AnniversaryCAPI} />;
};
NumberedListAnniversaryStory.story = {
	name: 'NumberedListAnniversary',
};
