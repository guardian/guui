import React, { useState } from 'react';
import { useOnce } from '@root/src/web/lib/useOnce';

import {
	pickMessage,
	SlotConfig,
	MaybeFC,
	CandidateConfig,
} from '@root/src/web/lib/messagePicker';

import {
	ReaderRevenueEpic,
	canShow as canShowReaderRevenueEpic,
} from './ReaderRevenueEpic';

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

const buildReaderRevenueEpicConfig = ({
	isSignedIn,
	countryCode,
	contentType,
	sectionName,
	shouldHideReaderRevenue,
	isMinuteArticle,
	isPaidContent,
	tags,
	contributionsServiceUrl,
}: any): CandidateConfig => {
	return {
		candidate: {
			id: 'reader-revenue-banner',
			canShow: () =>
				canShowReaderRevenueEpic({
					isSignedIn,
					countryCode,
					contentType,
					sectionName,
					shouldHideReaderRevenue,
					isMinuteArticle,
					isPaidContent,
					tags,
					contributionsServiceUrl,
				}),
			show: (meta: any) => () => {
				/* eslint-disable-next-line react/jsx-props-no-spreading */
				return <ReaderRevenueEpic {...meta} />;
			},
		},
		timeoutMillis: null,
	};
};

export const SlotBodyEnd = ({
	isSignedIn,
	countryCode,
	contentType,
	sectionName,
	shouldHideReaderRevenue,
	isMinuteArticle,
	isPaidContent,
	tags,
	contributionsServiceUrl,
}: Props) => {
	const [SelectedEpic, setSelectedEpic] = useState<React.FC | null>(null);
	useOnce(() => {
		const readerRevenueEpic = buildReaderRevenueEpicConfig({
			isSignedIn,
			countryCode,
			contentType,
			sectionName,
			shouldHideReaderRevenue,
			isMinuteArticle,
			isPaidContent,
			tags,
			contributionsServiceUrl,
		});
		const epicConfig: SlotConfig = {
			candidates: [readerRevenueEpic],
			name: 'slotBodyEnd',
		};

		pickMessage(epicConfig)
			.then((PickedEpic: () => MaybeFC) => setSelectedEpic(PickedEpic))
			.catch((e) =>
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				console.error(`SlotBodyEnd pickMessage - error: ${e}`),
			);
	}, [isSignedIn, countryCode]);

	if (SelectedEpic) {
		return <SelectedEpic />;
	}

	return null;
};
