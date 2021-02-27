import fetch from 'node-fetch';

export type AmpExperiment = {
	sticky?: boolean;
	consentNotificationId?: string;
	variants: {
		[key: string]: number; // floating point number
	};
};

export type AmpExperiments = {
	[key: string]: AmpExperiment;
};

export const ampExperimentsDataUrl =
	process.env.GU_STAGE === 'PROD'
		? 'https://contributions.guardianapis.com/amp/experiments_data'
		: 'https://contributions.code.dev-guardianapis.com/amp/experiments_data';

let ampExperimentCache: AmpExperiments = {};
export const getAmpExperimentCache = (): AmpExperiments => ampExperimentCache;

const fetchExperimentsData = (): Promise<void> => {
	return fetch(ampExperimentsDataUrl)
		.then((rawResponse) => rawResponse.json())
		.then((json) => {
			ampExperimentCache = json;
		});
};

const oneMinute = 60_000;
const refreshExperimentsData = () => {
	setTimeout(() => {
		fetchExperimentsData()
			.then(refreshExperimentsData)
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			.catch((e) => console.error(`fetchExperimentsData - error: ${e}`));
	}, oneMinute * 2);
};

fetchExperimentsData()
	.then(refreshExperimentsData)
	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	.catch((e) => console.error(`fetchExperimentsData - error: ${e}`));
