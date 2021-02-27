import React, { useEffect, useState } from 'react';
import * as emotion from 'emotion';
import * as emotionCore from '@emotion/core';
import * as emotionTheming from 'emotion-theming';
import { getZIndex } from '@root/src/web/lib/getZIndex';
import { Props as BrazeBannerProps } from '@guardian/braze-components';
import {
	submitComponentEvent,
	record,
} from '@root/src/web/browser/ophan/ophan';
import { initPerf } from '@root/src/web/browser/initPerf';
import {
	hasCurrentBrazeUser,
	setHasCurrentBrazeUser,
	clearHasCurrentBrazeUser,
} from '@root/src/web/lib/hasCurrentBrazeUser';
import { checkBrazeDependencies } from '@root/src/web/lib/braze/checkBrazeDependencies';
import { BrazeMessages } from '@root/src/web/lib/braze/BrazeMessages';
import {
	getInitialisedAppboy,
	SDK_OPTIONS,
} from '@root/src/web/lib/braze/initialiseAppboy';
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

const containerStyles = emotion.css`
    position: fixed;
    bottom: -1px;
    width: 100%;
    ${getZIndex('banner')}
`;

const getMessageFromBraze = async (
	apiKey: string,
	brazeUuid: string,
): Promise<CanShowResult> => {
	const sdkLoadTiming = initPerf('braze-sdk-load');
	sdkLoadTiming.start();

	const appboy = await getInitialisedAppboy(apiKey);

	const sdkLoadTimeTaken = sdkLoadTiming.end();
	record({
		component: 'braze-sdk-load-timing',
		value: sdkLoadTimeTaken,
	});

	const appboyTiming = initPerf('braze-appboy');
	appboyTiming.start();

	const brazeMessages = new BrazeMessages(appboy);

	const messages = brazeMessages.getMessageForBanner();

	appboy.changeUser(brazeUuid);
	appboy.openSession();
	setHasCurrentBrazeUser();

	return messages
		.then((message) => {
			const logButtonClickWithBraze = (internalButtonId: number) => {
				const thisButton = new appboy.InAppMessageButton(
					`Button: ID ${internalButtonId}`,
					undefined,
					undefined,
					undefined,
					undefined,
					undefined,
					internalButtonId,
				);
				appboy.logInAppMessageButtonClick(thisButton, message as any);
			};

			const logImpressionWithBraze = () => {
				// Log the impression with Braze
				appboy.logInAppMessageImpression(message);
			};
			const meta = {
				dataFromBraze: message.extras,
				logImpressionWithBraze,
				logButtonClickWithBraze,
			};
			return { result: true, meta };
		})
		.then((outcome) => {
			const appboyTimeTaken = appboyTiming.end();

			record({
				component: 'braze-appboy-timing',
				value: appboyTimeTaken,
			});

			return outcome;
		})
		.catch(() => {
			return { result: false };
		})
		.finally(() => {
			appboyTiming.clear();
		});
};

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

const maybeWipeUserData = async (
	apiKey?: string,
	brazeUuid?: null | string,
): Promise<void> => {
	if (apiKey && !brazeUuid && hasCurrentBrazeUser()) {
		const appboy = await getInitialisedAppboy(apiKey);

		try {
			appboy.wipeData();
			clearHasCurrentBrazeUser();
		} catch (error) {
			window.guardian.modules.sentry.reportError(error, 'braze-banner');
		}
	}
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
	isSignedIn: boolean,
	idApiUrl: string,
): Promise<CanShowResult> => {
	const bannerTiming = initPerf('braze-banner');
	bannerTiming.start();

	const forcedBrazeMeta = getBrazeMetaFromQueryString();
	if (forcedBrazeMeta) {
		return {
			result: true,
			meta: forcedBrazeMeta,
		};
	}

	const dependenciesResult = await checkBrazeDependencies(
		isSignedIn,
		idApiUrl,
	);

	if (!dependenciesResult.isSuccessful) {
		const { failure, data } = dependenciesResult;
		if (SDK_OPTIONS.enableLogging) {
			// eslint-disable-next-line no-console
			console.log(
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				`Not attempting to show Braze messages. Dependency ${failure.field} failed with ${failure.data}.`,
			);
		}

		await maybeWipeUserData(
			data.apiKey as string | undefined,
			data.brazeUuid as string | null | undefined,
		);

		return { result: false };
	}

	const { data } = dependenciesResult;

	try {
		const result = await getMessageFromBraze(
			data.apiKey as string,
			data.brazeUuid as string,
		);

		const timeTaken = bannerTiming.end();
		record({
			component: 'braze-banner-timing',
			value: timeTaken,
		});

		return result;
	} catch (e) {
		bannerTiming.clear();
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
			// TODO: unify the way we handle sharing these deps (this is
			// duplicated in SlotBodyEnd). Probably via the automat client
			// library.
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
