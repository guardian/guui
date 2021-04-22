import { JSDOM } from 'jsdom';

const isFalseH3 = (element: CAPIElement): boolean => {
	if (!element) return false;
	// Checks if this element is a 'false h3' based on the convention: <p><strong><H3 text</strong></p>
	if (
		element._type !== 'model.dotcomrendering.pageElements.TextBlockElement'
	) {
		return false;
	}
	const frag = JSDOM.fragment(element.html);
	if (!frag || !frag.firstElementChild) return false;
	const html = frag.firstElementChild.outerHTML;
	const text = frag.firstElementChild.textContent;
	// The following things must be true for an element to be a faux H3
	const hasPwrapper = frag.firstElementChild.nodeName === 'P';
	const containsStrongtags = frag.firstElementChild.outerHTML.includes(
		'<strong>',
	);
	const doesNotContainLinks = !frag.firstElementChild.outerHTML.includes(
		'<a>',
	);
	const textLength = text?.length;
	const htmlLength = html.length;
	const onlyHasOneStrongTag = textLength === htmlLength - 24;
	const endsStrong = html.substr(htmlLength - 13) === '</strong></p>';

	return (
		hasPwrapper &&
		containsStrongtags &&
		doesNotContainLinks &&
		onlyHasOneStrongTag &&
		endsStrong
	);
};

const extractH3 = (element: CAPIElement): string => {
	// Extract the text based on the convention: <p><strong><H3 text</strong></p>
	const textElement = element as TextBlockElement;
	const frag = JSDOM.fragment(textElement.html);
	if (isFalseH3(element)) {
		return frag.firstElementChild?.textContent || '';
	}
	return '';
};

const inlineImages = (elements: CAPIElement[]): CAPIElement[] => {
	// Inline all images
	// Why?
	// Because previously, in lagacy times when we used Frontend to render these articles,
	// we positioned images as thumbnails, off to the left. But more recent designs call for
	// images to be inline. This enhancer helps with legacy content still using `thumbnail`
	const inlined: CAPIElement[] = [];
	elements.forEach((thisElement) => {
		if (
			thisElement._type ===
			'model.dotcomrendering.pageElements.ImageBlockElement'
		) {
			// Inline this image
			inlined.push({
				...thisElement,
				role: 'inline',
			} as ImageBlockElement);
		} else {
			// Pass through
			inlined.push(thisElement);
		}
	});
	return inlined;
};

const addH3s = (elements: CAPIElement[]): CAPIElement[] => {
	/**
	 * Why not just add H3s in Composer?
	 * Truth is, you can't. So to get around this there's a convention that says if
	 * you insert <p><strong>Faux H3!</strong>,</p> then we replace it with a h3 tag
	 * instead.
	 *
	 * Note. H3s don't have any styles so we have to add them. In Frontend, they use
	 * a 'fauxH3' class for this. In DCR we add `globalH3Styles` which was added at
	 * the same time as this code.
	 */
	const withH3s: CAPIElement[] = [];
	elements.forEach((thisElement) => {
		if (
			thisElement._type ===
				'model.dotcomrendering.pageElements.TextBlockElement' &&
			isFalseH3(thisElement)
		) {
			const h3Text = extractH3(thisElement);
			withH3s.push(
				{
					_type:
						'model.dotcomrendering.pageElements.DividerBlockElement',
				},
				{
					...thisElement,
					html: `<h3>${h3Text}</h3>`,
				},
			);
		} else {
			// Pass through
			withH3s.push(thisElement);
		}
	});
	return withH3s;
};

const isFullReviewLink = (element: CAPIElement): boolean => {
	if (!element) return false;
	// Checks if this element is a 'full review' based on the convention: <ul> <li><p><strong>Full review:</strong> <a href="https://www.theguardian.com/technology/2019/oct/22/oneplus-7t-pro-review-the-best-kind-of-deja-vu">OnePlus 7T Pro review: the best kind of deja vu</a></p></li> </ul>
	if (
		element._type !== 'model.dotcomrendering.pageElements.TextBlockElement'
	) {
		return false;
	}
	const frag = JSDOM.fragment(element.html);
	if (!frag || !frag.firstElementChild) return false;

	const hasULWrapper = frag.firstElementChild.nodeName === 'UL';
	const hasLINestedWrapper =
		frag.firstElementChild.firstElementChild &&
		frag.firstElementChild.firstElementChild.nodeName === 'LI';

	const wrapper =
		frag.firstElementChild.firstElementChild &&
		frag.firstElementChild.firstElementChild.firstElementChild;

	const hasPWrapper = wrapper && wrapper.nodeName === 'P';
	const containsStrongTags =
		wrapper && wrapper.outerHTML.includes('<strong>');
	const containsLinks = wrapper && wrapper.outerHTML.includes('<a ');

	const hasFullReviewText =
		wrapper &&
		wrapper.firstElementChild &&
		wrapper.firstElementChild.textContent === 'Full review:';

	return (
		!!hasULWrapper &&
		!!hasLINestedWrapper &&
		!!hasPWrapper &&
		!!containsStrongTags &&
		!!containsLinks &&
		!!hasFullReviewText
	);
};

const addFullReviewLink = (elements: CAPIElement[]): CAPIElement[] =>
	elements.map((element) => {
		if (
			element._type ===
				'model.dotcomrendering.pageElements.TextBlockElement' &&
			isFullReviewLink(element)
		) {
			const frag = JSDOM.fragment(element.html);
			const link = frag.querySelector('a');
			return {
				_type: 'model.dotcomrendering.pageElements.FullReviewLink',
				elementId: element.elementId,
				href: link?.href || '',
				title: link?.textContent || '',
			};
		}
		return element;
	});

class Enhancer {
	elements: CAPIElement[];

	constructor(elements: CAPIElement[]) {
		this.elements = elements;
	}

	inlineImages() {
		this.elements = inlineImages(this.elements);
		return this;
	}

	addH3s() {
		this.elements = addH3s(this.elements);
		return this;
	}

	addFullReviewLink() {
		this.elements = addFullReviewLink(this.elements);
		return this;
	}
}

const enhance = (elements: CAPIElement[]): CAPIElement[] => {
	return (
		new Enhancer(elements)
			// Turn false h3s into real ones
			.addH3s()
			// Turn review links into components
			.addFullReviewLink()
			// Always use role `inline` for images
			.inlineImages().elements
	);
};

export const enhanceNumberedLists = (data: CAPIType): CAPIType => {
	const isNumberedList = data.format.display === 'NumberedListDisplay';

	if (!isNumberedList) {
		return data;
	}

	const enhancedBlocks = data.blocks.map((block: Block) => {
		return {
			...block,
			elements: enhance(block.elements),
		};
	});

	return {
		...data,
		blocks: enhancedBlocks,
	} as CAPIType;
};
