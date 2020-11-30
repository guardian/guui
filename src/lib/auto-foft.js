// @preval

// note: this file is intended to imported using babel-plugin-preval
// the easiest way is probably with the import-comment:
// https://www.npmjs.com/package/babel-plugin-preval#import-comment

const { readFileSync } = require('fs');

// https://github.com/guardian/auto-foft
module.exports = readFileSync(require.resolve('auto-foft'), 'utf-8');
