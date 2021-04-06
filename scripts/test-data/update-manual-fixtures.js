/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

const execa = require('execa');
const fs = require('fs');
const { resolve } = require('path');

const root = resolve(__dirname, '..', '..');
const jsonPath = resolve(root, 'fixtures', 'manual', 'data');

/**
 * update-manual-fixtures.js
 *
 * A script to automatically copy the most-read and most-read-geo fixture data to the cypress
 * directory as a JSON file.
 *
 * Should run automatically when the watched files change.
 *
 * Usage
 * $ node scripts/test-data/update-manual-fixtures.js
 */

const camelToUnderscore = (key) => {
	const result = key.replace(/([A-Z])/g, ' $1');
	return result.split(' ').join('-').toLowerCase();
};

const fixtures = ['mostRead', 'mostReadGeo'];

const HEADER = `/**
* DO NOT EDIT THIS FILE!
*
* This file was automatically generated using the update-manual-fixtures.js script.
* Any edits you make here will be lost.
*
* If the data in these fixtures is not what you expect then
*
* 1. Update the data in 'fixtures/manual/data', and then
* 2. Re-run node 'scripts/test-data/update-manual-fixtures.js'
*
*/

`;

try {
	console.log('\nCopying cypress fixture files...');

	fixtures.forEach((fixtureName) => {
		fs.copyFileSync(
			`${jsonPath}/${fixtureName}.json`,
			`${root}/cypress/fixtures/${fixtureName}.json`,
		);
	});

	console.log('\nFormatting cypress fixture files...');
	execa('prettier', [
		'./cypress/fixtures/*',
		'--write',
		'--loglevel',
		'error',
	]).then(() => {
		console.log(`\nDone ✅ Successfully copied Cypress fixtures\n`);
	});

	// Generate manual fixtures
	console.log('\nGenerating "manual" fixture files...');

	fixtures.forEach((fixtureName) => {
		const data = fs.readFileSync(`${jsonPath}/${fixtureName}.json`);
		const json = JSON.parse(data);
		const contents = `${HEADER}export const ${fixtureName} = ${JSON.stringify(
			json,
			null,
			4,
		)}`;

		fs.writeFileSync(
			`${root}/fixtures/generated/${camelToUnderscore(fixtureName)}.ts`,
			contents,
			'utf8',
		);
	});

	console.log('\nFormatting manual fixture files...');
	execa('prettier', [
		'./fixtures/generated/*',
		'--write',
		'--loglevel',
		'error',
	]).then(() => {
		console.log(`\nDone ✅ Successfully updated manual fixtures\n`);
	});
} catch (e) {
	console.error(e);
}