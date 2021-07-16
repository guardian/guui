import { sanitiseHTML } from '@root/src/model/clean';

// Some interactives contain HTML with unclosed tags etc. To
// preserve (approximate) parity with Frontend we perform some basic
// cleaning.
export const enhance = (elements: CAPIElement[]): CAPIElement[] => {
	return elements.map((element) => {
		if (
			element._type ===
			'model.dotcomrendering.pageElements.InteractiveAtomBlockElement'
		) {
			element.html = element.html
				? sanitiseHTML(element.html, {
						ADD_TAGS: ['iframe', 'script'],
				  })
				: element.html;
		}

		return element;
	});
};

export const enhanceInteractiveAtomElements = (data: CAPIType): CAPIType => {
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
