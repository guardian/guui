import { record } from '@root/src/web/browser/ophan/ophan';

export type MaybeFC = React.FC | null;
type ShowMessage = (meta?: any) => MaybeFC;

export type CanShowResult = {
	result: boolean;
	meta?: any;
};

export type Candidate = {
	id: string;
	show: ShowMessage;
	canShow: () => Promise<CanShowResult>;
};

export type CandidateConfig = {
	candidate: Candidate;
	timeoutMillis: number | null;
};

type CandidateConfigWithTimeout = CandidateConfig & {
	cancelTimeout: () => void;
};

export type SlotConfig = {
	candidates: CandidateConfig[];
	name: string;
};

const recordMessageTimeoutInOphan = (messageId: string, slotName: string) =>
	record({
		component: `${slotName}-picker-timeout-dcr`,
		value: messageId,
	});

const timeoutify = (
	candidateConfig: CandidateConfig,
	slotName: string,
): CandidateConfigWithTimeout => {
	let timer: number | undefined;

	const canShow = (): Promise<CanShowResult> =>
		new Promise((resolve) => {
			if (candidateConfig.timeoutMillis) {
				timer = window.setTimeout(() => {
					recordMessageTimeoutInOphan(
						candidateConfig.candidate.id,
						slotName,
					);
					resolve({ result: false });
				}, candidateConfig.timeoutMillis);
			}

			candidateConfig.candidate
				.canShow()
				.then((result) => resolve(result))
				.catch((e) =>
					// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
					console.error(`timeoutify candidate - error: ${e}`),
				);
		});

	const cancelTimeout = () => timer && clearTimeout(timer);

	return {
		...candidateConfig,
		candidate: {
			...candidateConfig.candidate,
			canShow,
		},
		cancelTimeout,
	};
};

const clearAllTimeouts = (messages: CandidateConfigWithTimeout[]) =>
	messages.map((m) => m.cancelTimeout());

const defaultShow = () => null;

type WinningMessage = {
	idx: number;
	meta?: any;
};

export const pickMessage = ({
	candidates,
	name,
}: SlotConfig): Promise<() => MaybeFC> =>
	new Promise((resolve) => {
		const candidateConfigsWithTimeout = candidates.map((c) =>
			timeoutify(c, name),
		);
		const results = candidateConfigsWithTimeout.map((c) =>
			c.candidate.canShow(),
		);

		const winner: Promise<WinningMessage> = results.reduce(
			async (winningMessageSoFar, canShow, idx) => {
				const runningIdx = (await winningMessageSoFar).idx;
				if (runningIdx >= 0) {
					return winningMessageSoFar;
				}

				const result = await canShow;
				candidateConfigsWithTimeout[idx].cancelTimeout();
				if (result.result) {
					return { idx, meta: result.meta };
				}

				return winningMessageSoFar;
			},
			Promise.resolve({ idx: -1 }),
		);

		winner
			.then(({ idx, meta }: WinningMessage) => {
				clearAllTimeouts(candidateConfigsWithTimeout);
				resolve(
					idx === -1
						? defaultShow
						: () =>
								candidateConfigsWithTimeout[idx].candidate.show(
									meta,
								),
				);
			})
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			.catch((e) => console.error(`pickMessage winner - error: ${e}`));
	});
