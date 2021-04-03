import React, { useEffect, useState } from 'react';
import { css } from 'emotion';

import {
	parseBrazeEpicParams,
	EpicDataFromBraze,
	Variant,
} from '@root/src/web/lib/braze/parseBrazeEpicParams';
import { BrazeMessagesInterface } from '@root/src/web/lib/braze/BrazeMessages';
import { CanShowResult } from '@root/src/web/lib/messagePicker';
import { useOnce } from '@root/src/web/lib/useOnce';
import { joinUrl } from '@root/src/lib/joinUrl';
import { initAutomat } from '@root/src/web/lib/initAutomat';
import { useHasBeenSeen } from '@root/src/web/lib/useHasBeenSeen';
import { submitComponentEvent } from '@root/src/web/browser/ophan/ophan';

const wrapperMargins = css`
	margin: 18px 0;
`;

const EPIC_COMPONENT_PATH = '/modules/v1/epics/ContributionsEpic.js';

type Meta = {
	dataFromBraze?: EpicDataFromBraze;
	logImpressionWithBraze: () => void;
	// logButtonClickWithBraze: (id: number) => void; // TODO: Handle button click tracking
};

type EpicConfig = {
	meta: Meta;
	contributionsServiceUrl: string;
	countryCode: string;
};

type Tracking = {
	ophanPageId: string;
	platformId: string;
	clientName: string;
	referrerUrl: string;
};

type EpicProps = {
	variant: Variant;
	tracking: Tracking;
	numArticles: number;
	countryCode: string;
};

export const canShow = async (
	brazeMessagesPromise: Promise<BrazeMessagesInterface>,
): Promise<CanShowResult> => {
	try {
		const brazeMessages = await brazeMessagesPromise;
		const message = await brazeMessages.getMessageForEndOfArticle();

		return {
			result: true,
			meta: {
				dataFromBraze: message.extras,
				logImpressionWithBraze: () => {
					message.logImpression();
				},
			},
		};
	} catch (e) {
		return { result: false };
	}
};

const buildEpicProps = (
	dataFromBraze: EpicDataFromBraze,
	countryCode: string,
): EpicProps | null => {
	const variant = parseBrazeEpicParams(dataFromBraze);
	if (variant === null) return null;

	const pageTracking = {
		ophanPageId: window.guardian.config.ophan.pageViewId,
		platformId: 'GUARDIAN_WEB',
		clientName: 'dcr',
		referrerUrl: window.location.origin + window.location.pathname,
	};

	const tracking = {
		...pageTracking,
	};

	return { variant, tracking, numArticles: 0, countryCode };
};

const BrazeEpic = ({
	contributionsServiceUrl,
	meta,
	countryCode,
}: EpicConfig) => {
	const [Epic, setEpic] = useState<React.FC<EpicProps>>();

	const [hasBeenSeen, setNode] = useHasBeenSeen({
		rootMargin: '-18px',
		threshold: 0,
		debounce: true,
	});

	useOnce(() => {
		initAutomat();

		const componentUrl = joinUrl([
			contributionsServiceUrl,
			EPIC_COMPONENT_PATH,
		]);

		window
			.guardianPolyfilledImport(componentUrl)
			.then((epicModule: { ContributionsEpic: React.FC<EpicProps> }) => {
				setEpic(() => epicModule.ContributionsEpic); // useState requires functions to be wrapped
			})
			.catch((error) => {
				window.guardian.modules.sentry.reportError(error, 'braze-epic');
			});
	}, [contributionsServiceUrl, meta]);

	useEffect(() => {
		if (hasBeenSeen && meta && meta.dataFromBraze) {
			meta.logImpressionWithBraze();

			// Log VIEW event with Ophan
			submitComponentEvent({
				component: {
					componentType: 'RETENTION_EPIC',
					id: meta.dataFromBraze.componentName,
				},
				action: 'VIEW',
			});
		}
	}, [hasBeenSeen, meta]);

	if (Epic && meta.dataFromBraze) {
		// This will come from Braze via the meta from canShow
		const props = buildEpicProps(meta.dataFromBraze, countryCode);

		if (props) {
			return (
				<div ref={setNode} className={wrapperMargins}>
					{/* eslint-disable-next-line react/jsx-props-no-spreading */}
					<Epic {...props} />
				</div>
			);
		}
	}

	return null;
};

export const MaybeBrazeEpic = ({
	contributionsServiceUrl,
	meta,
	countryCode,
}: EpicConfig) => {
	const componentName = meta.dataFromBraze?.componentName;

	if (componentName === 'Epic') {
		return (
			<BrazeEpic
				contributionsServiceUrl={contributionsServiceUrl}
				meta={meta}
				countryCode={countryCode}
			/>
		);
	}

	return null;
};
