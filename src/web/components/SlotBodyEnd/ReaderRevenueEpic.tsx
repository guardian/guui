import React, { useEffect, useState } from 'react';
import * as emotion from 'emotion';
import * as emotionCore from '@emotion/core';
import * as emotionTheming from 'emotion-theming';
import {
	getBodyEnd,
	getViewLog,
	logView,
	getWeeklyArticleHistory,
} from '@guardian/automat-client';
import {
	isRecurringContributor,
	getLastOneOffContributionDate,
	shouldHideSupportMessaging,
	getArticleCountConsent,
} from '@root/src/web/lib/contributions';
import { getForcedVariant } from '@root/src/web/lib/readerRevenueDevUtils';
import { CanShowResult } from '@root/src/web/lib/messagePicker';
import { initPerf } from '@root/src/web/browser/initPerf';
import {
	sendOphanComponentEvent,
	TestMeta,
} from '@root/src/web/browser/ophan/ophan';
import { Metadata } from '@guardian/automat-client/dist/types';
import { getCookie } from '../../browser/cookie';
import { useHasBeenSeen } from '../../lib/useHasBeenSeen';

const { css } = emotion;

type HasBeenSeen = [boolean, (el: HTMLDivElement) => void];

type PreEpicConfig = {
	meta: TestMeta;
	module: {
		url: string;
		props: { [key: string]: any };
	};
};

type EpicConfig = {
	meta: TestMeta;
	module: {
		url: string;
		props: EpicProps;
	};
};

type EpicProps = {
	onReminderOpen: () => void;
	// Also anything specified by support-dotcom-components
};

const checkForErrors = (response: Response) => {
	if (!response.ok) {
		throw Error(
			response.statusText ||
				`ReaderRevenueEpic | An api call returned HTTP status ${response.status}`,
		);
	}
	return response;
};

const sendOphanReminderEvent = (componentId: string): void => {
	const componentEvent = {
		component: {
			componentType: 'ACQUISITIONS_OTHER',
			id: componentId,
		},
		action: 'CLICK',
	};

	window.guardian.ophan.record({ componentEvent });
};

interface OpenProps {
	buttonCopyAsString: string;
}

const sendOphanReminderOpenEvent = ({ buttonCopyAsString }: OpenProps) => {
	sendOphanReminderEvent('precontribution-reminder-prompt-clicked');
	sendOphanReminderEvent(
		`precontribution-reminder-prompt-copy-${buttonCopyAsString}`,
	);
};

const wrapperMargins = css`
	margin: 18px 0;
`;

type Props = {
	isSignedIn?: boolean;
	countryCode?: string;
	contentType: string;
	sectionName?: string;
	shouldHideReaderRevenue: boolean;
	isMinuteArticle: boolean;
	isPaidContent: boolean;
	tags: TagType[];
	contributionsServiceUrl: string;
};

const buildPayload = async (props: Props): Promise<Metadata> => {
	return {
		tracking: {
			ophanPageId: window.guardian.config.ophan.pageViewId,
			ophanComponentId: '', // TODO: Remove ophanComponentId from @guardian/automat-client/dist/types.d.ts Tracking type
			platformId: 'GUARDIAN_WEB',
			clientName: 'dcr',
			referrerUrl: window.location.origin + window.location.pathname,
		},
		targeting: {
			contentType: props.contentType,
			sectionName: props.sectionName || '', // TODO update client to reflect that this is optional
			shouldHideReaderRevenue: props.shouldHideReaderRevenue,
			isMinuteArticle: props.isMinuteArticle,
			isPaidContent: props.isPaidContent,
			tags: props.tags,
			showSupportMessaging: !shouldHideSupportMessaging(
				props.isSignedIn || false,
			),
			isRecurringContributor: isRecurringContributor(
				props.isSignedIn || false,
			),
			lastOneOffContributionDate: getLastOneOffContributionDate(),
			epicViewLog: getViewLog(),
			weeklyArticleHistory: getWeeklyArticleHistory(),
			hasOptedOutOfArticleCount: !(await getArticleCountConsent()),
			mvtId: Number(getCookie('GU_mvt_id')),
			countryCode: props.countryCode,
		},
	} as Metadata; // Metadata type incorrectly does not include required hasOptedOutOfArticleCount property
};

export const canShow = ({
	isSignedIn,
	countryCode,
	contentType,
	sectionName,
	shouldHideReaderRevenue,
	isMinuteArticle,
	isPaidContent,
	tags,
	contributionsServiceUrl,
}: Props): Promise<CanShowResult> => {
	if (shouldHideReaderRevenue || isPaidContent) {
		// We never serve Reader Revenue epics in this case
		return Promise.resolve({ result: false });
	}
	const dataPerf = initPerf('contributions-epic-data');
	dataPerf.start();

	const forcedVariant = getForcedVariant('epic');
	const queryString = forcedVariant ? `?force=${forcedVariant}` : '';

	return buildPayload({
		isSignedIn,
		countryCode,
		contentType,
		sectionName,
		shouldHideReaderRevenue,
		isMinuteArticle,
		isPaidContent,
		tags,
		contributionsServiceUrl,
	})
		.then((contributionsPayload) =>
			getBodyEnd(
				contributionsPayload,
				`${contributionsServiceUrl}/epic${queryString}`,
			),
		)
		.then((response) => {
			dataPerf.end();
			return checkForErrors(response);
		})
		.then((response) => response.json())
		.then((json: { data?: PreEpicConfig }) => {
			if (!json.data) {
				return { result: false };
			}

			const { meta, module } = json.data;

			return {
				result: true,
				meta: {
					meta,
					module,
					onReminderOpen: sendOphanReminderOpenEvent,
				},
			};
		});
};

export const ReaderRevenueEpic = ({ meta, module }: EpicConfig) => {
	const [Epic, setEpic] = useState<React.FC<EpicProps>>();
	const [hasBeenSeen, setNode] = useHasBeenSeen({
		rootMargin: '-18px',
		threshold: 0,
		debounce: true,
	}) as HasBeenSeen;

	useEffect(() => {
		window.guardian.automat = {
			react: React,
			preact: React, // temp while we deploy newer contributions-service at which point client-lib does this for us
			emotionCore,
			emotionTheming,
			emotion,
		};

		const modulePerf = initPerf('contributions-epic-module');
		modulePerf.start();

		window
			.guardianPolyfilledImport(module.url)
			.then((epicModule: { ContributionsEpic: React.FC<EpicProps> }) => {
				modulePerf.end();
				setEpic(() => epicModule.ContributionsEpic); // useState requires functions to be wrapped
				sendOphanComponentEvent('INSERT', meta);
			})
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			.catch((error) => console.log(`epic - error is: ${error}`));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (hasBeenSeen && meta) {
			// Should only run once
			const { abTestName } = meta;

			logView(abTestName);

			sendOphanComponentEvent('VIEW', meta);
		}
	}, [hasBeenSeen, meta]);
	if (Epic) {
		return (
			<div ref={setNode} className={wrapperMargins}>
				{/* eslint-disable-next-line react/jsx-props-no-spreading */}
				<Epic {...module.props} />
			</div>
		);
	}

	return null;
};
