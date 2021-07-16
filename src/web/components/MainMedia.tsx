import { css } from '@emotion/react';

import { until } from '@guardian/src-foundations/mq';
import { Display } from '@guardian/types';

import { renderArticleElement } from '@root/src/web/lib/renderElement';
import { getZIndex } from '@frontend/web/lib/getZIndex';

const mainMedia = css`
	height: 100%;
	min-height: 1px;
	/*
    Thank you IE11, broken in stasis for all eternity.

    https://github.com/philipwalton/flexbugs/issues/75#issuecomment-161800607
    */
`;

const noGutters = css`
	${until.phablet} {
		margin-left: -20px;
		margin-right: -20px;
	}

	${until.mobileLandscape} {
		margin-left: -10px;
		margin-right: -10px;
	}
`;

const immersiveWrapper = css`
	/*
        Immersive main media is wrapped in a flex div with height 100vw and then
        we use this grow here to ensure the content fills the available height
    */
	flex-grow: 1;
	${getZIndex('mainMedia')}
	/* Prevent the immersive image 100vh from spilling into main content */
    overflow: hidden;
`;

export const MainMedia: React.FC<{
	format: Format;
	palette: Palette;
	elements: CAPIElement[];
	hideCaption?: boolean;
	adTargeting?: AdTargeting;
	starRating?: number;
	host?: string;
	pageId: string;
	webTitle: string;
}> = ({
	elements,
	format,
	palette,
	hideCaption,
	adTargeting,
	starRating,
	host,
	pageId,
	webTitle,
}) => (
	<div
		css={[
			mainMedia,
			format.display === Display.Immersive ? immersiveWrapper : noGutters,
		]}
	>
		{elements.map((element, index) =>
			renderArticleElement({
				format,
				palette,
				element,
				adTargeting,
				host,
				index,
				isMainMedia: true,
				starRating,
				hideCaption,
				pageId,
				webTitle,
			}),
		)}
	</div>
);
