import { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';

import type { BrazeMessagesInterface } from '@guardian/braze-components/logic';

import { EpicDataFromBraze } from '@root/src/web/lib/braze/parseBrazeEpicParams';
import { getBrazeMetaFromUrlFragment } from '@root/src/web/lib/braze/forceBrazeMessage';
import { CanShowResult } from '@root/src/web/lib/messagePicker';
import { useOnce } from '@root/src/web/lib/useOnce';
import { useHasBeenSeen } from '@root/src/web/lib/useHasBeenSeen';
import { submitComponentEvent } from '@root/src/web/browser/ophan/ophan';
import type { CommonEndOfArticleComponentProps } from '@guardian/braze-components';

const wrapperMargins = css`
	margin: 18px 0;
`;

const COMPONENT_TYPE = 'RETENTION_EPIC';

type Meta = {
	dataFromBraze?: EpicDataFromBraze;
	logImpressionWithBraze: () => void;
};

type EpicConfig = {
	meta: Meta;
	countryCode: string;
};

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
		const message = await brazeMessages.getMessageForEndOfArticle();

		return {
			show: true,
			meta: {
				dataFromBraze: message.extras,
				logImpressionWithBraze: () => {
					// message.logImpression();
				},
			},
		};
	} catch (e) {
		return { show: false };
	}
};

type InnerProps = {
	meta: Meta;
	countryCode: string;
	BrazeComponent: React.FC<CommonEndOfArticleComponentProps>;
};

const BrazeEpicWithSatisfiedDependencies = ({
	BrazeComponent,
	meta,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	countryCode,
}: InnerProps) => {
	const [hasBeenSeen, setNode] = useHasBeenSeen({
		rootMargin: '-18px',
		threshold: 0,
		debounce: true,
	});

	const epicRef = useRef(null);

	useOnce(() => {
		submitComponentEvent({
			component: {
				componentType: COMPONENT_TYPE,
				// TODO: make ophanComponentId required in the canRender of components
				id: (meta.dataFromBraze as EpicDataFromBraze).ophanComponentId,
			},
			action: 'INSERT',
		});
	}, [meta?.dataFromBraze, epicRef.current]);

	useEffect(() => {
		if (hasBeenSeen && meta && meta.dataFromBraze) {
			meta.logImpressionWithBraze();

			// Log VIEW event with Ophan
			submitComponentEvent({
				component: {
					componentType: COMPONENT_TYPE,
					// TODO: make ophanComponentId required in the canRender of components
					id: meta.dataFromBraze.ophanComponentId,
				},
				action: 'VIEW',
			});
		}
	}, [hasBeenSeen, meta]);

	if (meta.dataFromBraze) {
		return (
			<div ref={setNode} css={wrapperMargins}>
				<div ref={epicRef}>
					{/* eslint-disable-next-line react/jsx-props-no-spreading */}
					<BrazeComponent
						componentName={meta.dataFromBraze.componentName}
						brazeMessageProps={meta.dataFromBraze}
						// TODO: Add real implementation for subscribeToNewsletter
						subscribeToNewsletter={() => {
							return Promise.resolve();
						}}
						// countryCode={countryCode} // TODO: add countryCode to common props in braze-components
					/>
				</div>
			</div>
		);
	}

	return null;
};

export const MaybeBrazeEpic = ({ meta, countryCode }: EpicConfig) => {
	const [BrazeComponent, setBrazeComponent] = useState<
		React.FC<CommonEndOfArticleComponentProps>
	>();

	useEffect(() => {
		import(
			/* webpackChunkName: "guardian-braze-components" */ '@guardian/braze-components'
		)
			.then((module) => {
				setBrazeComponent(() => module.BrazeEndOfArticleComponent);
			})
			.catch((error) =>
				window.guardian.modules.sentry.reportError(error, 'braze-epic'),
			);
	}, []);

	return (
		<>
			{BrazeComponent ? (
				<BrazeEpicWithSatisfiedDependencies
					BrazeComponent={BrazeComponent}
					meta={meta}
					countryCode={countryCode}
				/>
			) : (
				<div />
			)}
		</>
	);
};
