interface AssetHash {
	[key: string]: { [key: string]: [] };
}

let loadableManifest: AssetHash = {};
let loadableManifestLegacy: AssetHash = {};

try {
	// path is relative to the server bundle
	// eslint-disable-next-line import/no-unresolved
	loadableManifest = require('./loadable-manifest-browser.json');
	// eslint-disable-next-line import/no-unresolved
	loadableManifestLegacy = require('./loadable-manifest-browser.legacy.json');
} catch (e) {
	// do nothing
}

// TODO: this should be removed in favor of `frontendAssetsFullURL` defined in CAPI
// GU_STAGE is set in cloudformation.yml, so will be undefined locally
const stage =
	typeof process.env.GU_STAGE === 'string'
		? process.env.GU_STAGE.toUpperCase()
		: process.env.GU_STAGE;

export const CDN = stage
	? `//assets${stage === 'CODE' ? '-code' : ''}.guim.co.uk/`
	: '/';
export const loadableManifestJson = loadableManifest;

export const getScriptArrayFromFilename = (
	filename: string,
): { src: string; legacy: boolean }[] => {
	// 'ophan.87b473fc83e9ca6250fc.js' -> 'ophan'
	const chunkName = filename.split('.')[0];
	const chunks: string[] | undefined =
		loadableManifestLegacy.assetsByChunkName[chunkName];
	const legacyFilename = chunks && chunks.length > 0 && chunks[0];

	const scriptArray = [{ src: `${CDN}assets/${filename}`, legacy: false }];
	// legacyFilename can be undefined, we therefor should only add it if defined
	if (legacyFilename)
		scriptArray.push({
			src: `${CDN}assets/${legacyFilename}`,
			legacy: true,
		});

	return scriptArray;
};

export const getScriptArrayFromChunkName = (
	chunkName: string,
): { src: string; legacy?: boolean }[] => {
	const chunks: string[] | undefined =
		loadableManifestJson.assetsByChunkName[chunkName];
	const filename = chunks && chunks.length > 0 && chunks[0];
	if (!filename) {
		return [];
	}
	return getScriptArrayFromFilename(filename);
};
