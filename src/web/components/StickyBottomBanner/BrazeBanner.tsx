import React, { useEffect, useState } from 'react';
import { css } from 'emotion';

import { initAutomat } from '@root/src/web/lib/initAutomat';
import { getZIndex } from '@root/src/web/lib/getZIndex';
import { Props as BrazeBannerProps } from '@guardian/braze-components';
import { submitComponentEvent } from '@root/src/web/browser/ophan/ophan';
import { BrazeMessagesInterface } from '@root/src/web/lib/braze/BrazeMessages';
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

const FORCE_BRAZE_ALLOWLIST = [
	'preview.gutools.co.uk',
	'preview.code.dev-gutools.co.uk',
	'localhost',
	'm.thegulocal.com',
];

const getBrazeMetaFromQueryString = (): Meta | null => {
	if (URLSearchParams) {
		const qsArg = 'force-braze-message';

		const params = new URLSearchParams(window.location.search);
		const value = params.get(qsArg);
		if (value) {
			if (!FORCE_BRAZE_ALLOWLIST.includes(window.location.hostname)) {
				// eslint-disable-next-line no-console
				console.log(`${qsArg} is not supported on this domain`);
				return null;
			}

			try {
				const dataFromBraze = JSON.parse(value);

				return {
					dataFromBraze,
					logImpressionWithBraze: () => {},
					logButtonClickWithBraze: () => {},
				};
			} catch (e) {
				const error = e as Error;
				// Parsing failed. Log a message and fall through.
				// eslint-disable-next-line no-console
				console.log(
					`There was an error with ${qsArg}: `,
					error.message,
				);
			}
		}
	}

	return null;
};

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
): Promise<CanShowResult> => {
	const forcedBrazeMeta = getBrazeMetaFromQueryString();
	if (forcedBrazeMeta) {
		return {
			result: true,
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

		return { result: true, meta };
	} catch (e) {
		return { result: false };
	}
};

type InnerProps = {
	meta: Meta;
	BrazeComponent: React.FC<BrazeBannerProps>;
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
		<div className={containerStyles}>
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
		React.FC<BrazeBannerProps>
	>();

	useEffect(() => {
		if (meta) {
			initAutomat();

			import(
				/* webpackChunkName: "guardian-braze-components" */ '@guardian/braze-components'
			)
				.then((module) => {
					setBrazeComponent(() => module.BrazeMessage);
				})
				.catch((error) =>
					window.guardian.modules.sentry.reportError(
						error,
						'braze-banner',
					),
				);
		}
	}, [meta]);

	if (BrazeComponent && meta) {
		return (
			<BrazeBannerWithSatisfiedDependencies
				BrazeComponent={BrazeComponent}
				meta={meta}
			/>
		);
	}

	return <div />;
};
