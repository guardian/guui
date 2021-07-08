// Passed raw as configuration to the ad
interface KV {
	name: string;
	value: string;
}

interface AdJson {
	targeting: KV[];
}

export const adJson = (targeting: AdTargetParam[]): AdJson => {
	if (!targeting) {
		return { targeting: [] };
	}

	const json = targeting
		.filter((p) => p.name !== 'p')
		.map(({ name, value }) => ({
			name,
			value: Array.isArray(value) ? value.join(',') : value,
		}));
	json.push({ name: 'p', value: 'amp' });
	json.push({ name: 'rp', value: 'dotcom-rendering' });

	return { targeting: json };
};

export const stringify = (json: AdJson): string => {
	type Map = Record<string, string>;
	const targeting = json.targeting.reduce<Map>((params, param) => {
		params[param.name] = param.value;
		return params;
	}, {});

	return JSON.stringify({ targeting });
};
