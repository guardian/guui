/**
 * How do I get a z-index for my new item?
 *
 * Decide a meaningful name for your item and then insert it
 * in the indices array below. The higher up your item visually,
 * then the higher it will be in the z-index stack,
 * 'higher' means _earlier_ in the array.
 *
 * Eg. stickyAdWrapper will be given a higher z-index than bodyArea
 *
 * Once inserted in the array, use getZIndex() to return the css
 *
 * Eg.
 *
 * import { getZIndex } from '@frontend/web/lib/getZIndex';
 *
 * const myCss = css`
 *    color: blue;
 *    ${getZIndex('TheGuardian')}
 * `;
 *
 * As new items are added, all z-indexes are adjusted
 */
const indices = [
	// Modals will go here at the top

	'banner',

	// Stick-nav test
	'stickyNav',

	// Header
	'stickyAdWrapper',
	'stickyNavWrapper',
	'headerWrapper',

	// Header links (should be above The Guardian svg)
	'headerLinks',
	'TheGuardian',

	// Article headline (should be above main media)
	'articleHeadline',
	'immersiveBlackBox',

	// Body
	'bodyArea',
	'rightColumnArea',

	// Main media
	'mainMedia',
];

//
// Implementation code  - you don't need to change this to get a new index
type ZIndex = typeof indices[number];

function reverseArray(array: any[]) {
	return array.map((item, index) => array[array.length - 1 - index]);
}

const decideIndex = (name: string): number | null => {
	let decided;
	reverseArray(indices).forEach((item, index) => {
		if (item === name) decided = index + 1;
	});
	return decided || null;
};

export const getZIndex = (zIndex: ZIndex): string => {
	const selectedIndex = decideIndex(zIndex);
	return selectedIndex ? `z-index: ${selectedIndex};` : '';
};

export const getZIndexImportant = (zIndex: ZIndex): string => {
	const selectedIndex = decideIndex(zIndex);
	return selectedIndex ? `z-index: ${selectedIndex} !important;` : '';
};
