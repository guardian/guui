import React, { useEffect } from 'react';
import { css } from 'emotion';

import { embedIframe } from '@root/src/web/browser/embedIframe/embedIframe';

import { UnsafeEmbedBlockComponent } from './UnsafeEmbedBlockComponent';

export default {
	component: UnsafeEmbedBlockComponent,
	title: 'Components/UnsafeEmbedBlockComponent',
};

const html = `<html> <head></head> <body style="padding: 0px; margin: 0px; overflow: hidden;"> <style> @font-face { font-family: "Guardian Egyptian Web"; src: url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianEgyptianWeb/GuardianEgyptianWeb-Light.eot"); src: url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianEgyptianWeb/GuardianEgyptianWeb-Light.eot?#iefix") format("embedded-opentype"), url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianEgyptianWeb/GuardianEgyptianWeb-Light.woff2") format("woff2"), url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianEgyptianWeb/GuardianEgyptianWeb-Light.woff") format("woff"), url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianEgyptianWeb/GuardianEgyptianWeb-Light.ttf") format("truetype"), url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianEgyptianWeb/GuardianEgyptianWeb-Light.svg#GuardianEgyptianWeb-Light") format("svg"); font-weight: normal; font-style: normal; font-stretch: normal; } * { box-sizing: border-box; font-family: 'Guardian Egyptian Web'; } a { text-decoration: none; } body { max-width: 420px; } .the-insider__wrapper { background-color: #333; } .the-insider__header { background-color: #222; padding: 4px; } .the-insider__logo { position: relative; margin: 0; margin-bottom: 24px; display: inline-block; color: #69d1ca; z-index: 10; } .the-insider__logo:after { content: ''; position: absolute; top: .5em; left: -4px; height: .8em; width: 100%; background-color: #333; z-index: -1; padding: 0 4px; } .the-insider__header-title { color: white; font-weight: 400; margin: 4px 0; font-size: 18px; } .the-insider__list { list-style: none; margin: 0; padding: 0; } .the-insider__item { position: relative; padding: 6px 4px; border-bottom: 2px dotted #222; font-size: 18px; color: #bdbdbd; } a .the-insider__item { color: white; } a .the-insider__item:after { content: url('data:image/svg+xml, <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="21.706" height="21.127" viewBox="0 0 21.706 21.127"><defs><path id="a" d="M11.168 2.667l7.141 7.157v.685l-7.141 7.158-.668-.668 5.137-6.147H2.539V9.481h13.098L10.5 3.334z"/></defs><clipPath id="b"><use xlink:href="#a" overflow="visible"/></clipPath><path clip-path="url(#b)" fill="#69d1ca" d="M-4.961-4.833H25.81v30H-4.961z"/></svg>'); background-color: transparent; border: 1px solid #69d1ca; width: 25px; height: 25px; border-radius: 50%; padding-left: 5px; padding-top: 5px; position: absolute; top: 4px; right: 4px; display: block; margin-top: 6px; -webkit-transition: all 0.3s ease-in-out; -moz-transition: all 0.3s ease-in-out; -o-transition: all 0.3s ease-in-out; transition: all 0.3s ease-in-out; } a .the-insider__item:hover { background-color: #222; border-color: transparent; } .the-insider__day-label { display: block; color: #bdbdbd; } a .the-insider__day-label { color: #69d1ca; } .is-current { pointer-events: none; cursor: default; } .is-current .the-insider__item { background-color: #69d1ca; border-bottom-color: transparent; } .is-current .the-insider__item:after { display: none; } .is-current .the-insider__day-label { color: #333; } </style> <div class="the-insider__wrapper"> <div class="the-insider__header"> <h2 class="the-insider__header-title"> One man's fight to reveal<br /> the CIA's torture secrets </h2> <h1 class="the-insider__logo">The Insider</h1> </div> <ul class="the-insider__list"> <a href="http://www.theguardian.com/us-news/2016/sep/09/cia-insider-daniel-jones-senate-torture-investigation" target="_parent"> <li class="the-insider__item"> <span class="the-insider__day-label">Part one</span> Crossing the bridge </li> </a> <a class="is-current" href="http://www.theguardian.com/us-news/2016/sep/10/cia-senate-investigation-constitutional-crisis-daniel-jones" target="_parent"> <li class="the-insider__item"> <span class="the-insider__day-label">Part two</span> A constitutional crisis </li> </a> <a href="http://www.theguardian.com/us-news/2016/sep/11/cia-torture-report-aftermath-daniel-jones-senate-investigation" target="_parent"> <li class="the-insider__item"> <span class="the-insider__day-label">Part three</span> The aftermath </li> </a> </ul> </div> </body> </html>`;
export const DefaultStory = () => {
	useEffect(() => {
		embedIframe().catch((e) =>
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			console.error(`HydratedLayout embedIframe - error: ${e}`),
		);
	}, []);

	return (
		<div
			className={css`
				padding-left: 40px;
			`}
		>
			<UnsafeEmbedBlockComponent
				alt="Example component"
				html={html}
				index={1}
			/>
		</div>
	);
};
DefaultStory.story = { name: 'default' };
