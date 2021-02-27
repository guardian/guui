// https://stackoverflow.com/a/5624139
function hexToRgb(
	hex: string,
): {
	r: number;
	g: number;
	b: number;
} | null {
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, (_, r: string, g: string, b: string) => {
		return `${r}${r}${g}${g}${b}${b}`;
	});

	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
		  }
		: null;
}

function getBrightness(colour: string): number {
	// http://www.w3.org/TR/AERT#color-contrast
	const rgb = hexToRgb(colour);
	return rgb ? (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 : 0;
}

// Based on https://github.com/bgrins/TinyColor
export const isLight = (colour: string): boolean => {
	if (!colour.startsWith('#')) {
		return getBrightness(`#${colour}`) > 128;
	}
	return getBrightness(colour) > 128;
};
