import compose from 'compose-function';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { minify } from 'html-minifier';

// We don't represent lists in incopy, so things will just come across with bullet characters.
// These may also be used for emphasis, so bullet characters don't mean list.
export const bigBullets = (s: string) =>
	s.replace(/•/g, '<span class="bullet">&bull;</span>');

const { window } = new JSDOM('');
const DOMPurify = createDOMPurify(window);

export const minimise = compose(bigBullets, (s: string) =>
	minify(s, {
		collapseWhitespace: true,
		minifyCSS: true,
		minifyJS: true,
	}),
);

export const sanitiseHTML = (html: string, opts?: any): string =>
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	DOMPurify.sanitize(html, opts);
