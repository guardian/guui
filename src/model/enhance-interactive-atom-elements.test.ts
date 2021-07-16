import { enhance } from './enhance-interactive-atom-elements';

const getData = (): InteractiveAtomBlockElement => ({
	_type: 'model.dotcomrendering.pageElements.InteractiveAtomBlockElement',
	elementId: 'socrates',
	url: 'example.com/boom',
	id: 'socrates-abc',
	js: '',
	html: '',
});

describe('Enhance interactive atoms', () => {
	it('cleans dirty HTML', () => {
		const data = getData();
		data.html = '<div foo</div>';
		const got = enhance([data])[0] as InteractiveAtomBlockElement;

		expect(got.html).toBe('<div></div>');
	});

	it('preserves scripts', () => {
		const data = getData();
		data.html = 'Foo bar <script></script>';
		const got = enhance([data])[0] as InteractiveAtomBlockElement;

		expect(got.html).toBe('Foo bar <script></script>');
	});

	it('preserves iframes', () => {
		const data = getData();
		data.html = 'Foo bar <iframe></iframe>';
		const got = enhance([data])[0] as InteractiveAtomBlockElement;

		expect(got.html).toBe('Foo bar <iframe></iframe>');
	});

	it('preserves data-attributes', () => {
		const data = getData();
		data.html = '<div data-foo="bar">All the stuff...</div>';
		const got = enhance([data])[0] as InteractiveAtomBlockElement;

		expect(got.html).toBe('<div data-foo="bar">All the stuff...</div>');
	});
});
