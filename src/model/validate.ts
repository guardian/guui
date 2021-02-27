import Ajv from 'ajv';
import schema from '@root/src/model/json-schema.json';

const options: Ajv.Options = {
	verbose: false,
	allErrors: false,
	logger: false,
	useDefaults: 'empty',
};

const ajv = new Ajv(options);

const validate = ajv.compile(schema);

export const validateAsCAPIType = (data: { [key: string]: any }): CAPIType => {
	const isValid = validate(data);

	if (!isValid) {
		const url = data.webURL || 'unknown url';

		throw new TypeError(
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			`Unable to validate request body for url ${url}.\n
            ${JSON.stringify(validate.errors, null, 2)}`,
		);
	}

	return data as CAPIType;
};
