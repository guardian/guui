import React, { ReactElement, useState, useEffect } from 'react';
import * as emotion from 'emotion';
import * as emotionCore from '@emotion/core';
import * as emotionTheming from 'emotion-theming';

import { Props as BrazeBannerProps } from '@guardian/braze-components';

export default {
	component: 'BrazeBanner',
	title: 'Components/StickyBottomBanner/BrazeBanner',
};

export const DefaultStory = (): ReactElement => {
	const [BrazeMessage, setBrazeMessage] = useState<
		React.FC<BrazeBannerProps>
	>();

	useEffect(() => {
		window.guardian = window.guardian || {};
		window.guardian.automat = {
			react: React,
			preact: React,
			emotionCore,
			emotionTheming,
			emotion,
		};

		import(
			/* webpackChunkName: "guardian-braze-components" */ '@guardian/braze-components'
		)
			.then((module) => {
				setBrazeMessage(() => module.BrazeMessage);
			})
			.catch((e) =>
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				console.error(`braze-components dynamic import - error: ${e}`),
			);
	}, []);

	if (BrazeMessage) {
		const header = 'A note to our digital subscribers';
		const body =
			'Hi John, did you know that as a Guardian digital subscriber you can enjoy an enhanced experience of our quality, independent journalism on all your devices, including The Guardian Live app.';
		const componentName = 'DigitalSubscriberAppBanner';

		return (
			<BrazeMessage
				componentName={componentName}
				logButtonClickWithBraze={(internalButtonId) => {
					// eslint-disable-next-line no-console
					console.log(
						`Button with internal ID ${internalButtonId} clicked`,
					);
				}}
				submitComponentEvent={(componentEvent) => {
					// eslint-disable-next-line no-console
					console.log(
						'submitComponentEvent called with: ',
						componentEvent,
					);
				}}
				brazeMessageProps={{
					header,
					body,
				}}
			/>
		);
	}

	return <div>Loading...</div>;
};

DefaultStory.story = { name: 'Braze Banner' };
