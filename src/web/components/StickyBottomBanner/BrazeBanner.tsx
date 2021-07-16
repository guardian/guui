import { useEffect, useState } from 'react';
import { css } from '@emotion/react';

import { getZIndex } from '@root/src/web/lib/getZIndex';
import type { CommonBannerComponentProps } from '@guardian/braze-components';
import { submitComponentEvent } from '@root/src/web/browser/ophan/ophan';
import type { BrazeMessagesInterface } from '@guardian/braze-components/logic';
import { getBrazeMetaFromUrlFragment } from '@root/src/web/lib/braze/forceBrazeMessage';
import { CanShowResult } from '@root/src/web/lib/messagePicker';

type Meta = {
	dataFromBraze: {
		[key: string]: string;
	};
	logImpressionWithBraze: () => void;
	logButtonClickWithBraze: (id: number) => void;
};

type Props = {
	meta: Meta;
};

const containerStyles = css`
	position: fixed;
	bottom: -1px;
	width: 100%;
	${getZIndex('banner')}
`;

// We can show a Braze banner if:
// - The Braze switch is on
// - We have a Braze API key
// - The user should have support messaging hidden, implying they are a contributor or subscriber
// - We're not on a Glabs paid content page
// - We've got a Braze UUID from the API, given a user's ID Creds
// - The user has given Consent via CCPA or TCFV2
// - The Braze websdk appboy initialisation does not throw an error
// - The Braze app Boy subscription to in app message returns meta info
// OR
// - The force-braze-message query string arg is passed
export const canShow = async (
	brazeMessagesPromise: Promise<BrazeMessagesInterface>,
): Promise<CanShowResult<any>> => {
	const forcedBrazeMeta = getBrazeMetaFromUrlFragment();
	if (forcedBrazeMeta) {
		return {
			show: true,
			meta: forcedBrazeMeta,
		};
	}

	try {
		const brazeMessages = await brazeMessagesPromise;
		const message = await brazeMessages.getMessageForBanner();

		const logButtonClickWithBraze = (internalButtonId: number) => {
			message.logButtonClick(internalButtonId);
		};

		const logImpressionWithBraze = () => {
			// Log the impression with Braze
			message.logImpression();
		};

		const meta = {
			dataFromBraze: message.extras,
			logImpressionWithBraze,
			logButtonClickWithBraze,
		};

		return { show: true, meta };
	} catch (e) {
		return { show: false };
	}
};

type InnerProps = {
	meta: Meta;
	BrazeComponent: React.FC<CommonBannerComponentProps>;
};

const BrazeBannerWithSatisfiedDependencies = ({
	BrazeComponent,
	meta,
}: InnerProps) => {
	useEffect(() => {
		// Log the impression with Braze
		meta.logImpressionWithBraze();

		// Log VIEW event with Ophan
		submitComponentEvent({
			component: {
				componentType: 'RETENTION_ENGAGEMENT_BANNER',
				id: meta.dataFromBraze.componentName,
			},
			action: 'VIEW',
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div css={containerStyles}>
			<BrazeComponent
				logButtonClickWithBraze={meta.logButtonClickWithBraze}
				submitComponentEvent={submitComponentEvent}
				componentName={meta.dataFromBraze.componentName}
				brazeMessageProps={meta.dataFromBraze}
			/>
		</div>
	);
};

export const BrazeBanner = ({ meta }: Props) => {
	const [BrazeComponent, setBrazeComponent] = useState<
		React.FC<CommonBannerComponentProps>
	>();

	useEffect(() => {
		import(
			/* webpackChunkName: "guardian-braze-components" */ '@guardian/braze-components'
		)
			.then((module) => {
				setBrazeComponent(() => module.BrazeBannerComponent);
			})
			.catch((error) =>
				window.guardian.modules.sentry.reportError(
					error,
					'braze-banner',
				),
			);
	}, []);

	return (
		<>
			{BrazeComponent ? (
				<BrazeBannerWithSatisfiedDependencies
					BrazeComponent={BrazeComponent}
					meta={meta}
				/>
			) : (
				<div />
			)}
		</>
	);
};
