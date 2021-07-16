import { css } from '@emotion/react';

import { BlockquoteBlockComponent } from '@frontend/web/components/elements/BlockquoteBlockComponent';
import { Display, Design, Pillar, Special } from '@guardian/types';
import { decidePalette } from '@root/src/web/lib/decidePalette';

const shortQuoteHtml =
	'<blockquote class="quoted"> \n <p>We’ve now got evidence</blockquote>';
const blockquoteHtml =
	'<blockquote class="quoted"> \n <p>We’ve now got evidence that under <a href="https://www.theguardian.com/politics/boris-johnson">Boris Johnson</a> the NHS is on the table and will be up for sale. He tried to cover it up in a secret agenda but today it’s been exposed.</p> \n</blockquote>';

export default {
	component: BlockquoteBlockComponent,
	title: 'Components/BlockquoteComponent',
};

const containerStyles = css`
	max-width: 620px;
	margin: 20px;
`;

export const Unquoted = () => {
	return (
		<div css={containerStyles}>
			<h1>Long</h1>
			<BlockquoteBlockComponent
				html={blockquoteHtml}
				palette={decidePalette({
					design: Design.Article,
					display: Display.Standard,
					theme: Pillar.News,
				})}
				format={{
					design: Design.Article,
					display: Display.Standard,
					theme: Pillar.News,
				}}
			/>
			<h1>Short</h1>
			<BlockquoteBlockComponent
				html={shortQuoteHtml}
				palette={decidePalette({
					design: Design.Article,
					display: Display.Standard,
					theme: Pillar.News,
				})}
				format={{
					design: Design.Article,
					display: Display.Standard,
					theme: Pillar.News,
				}}
			/>
		</div>
	);
};
Unquoted.story = { name: 'Unquoted' };

export const Quoted = () => {
	return (
		<div css={containerStyles}>
			<h1>News</h1>
			<BlockquoteBlockComponent
				html={blockquoteHtml}
				palette={decidePalette({
					design: Design.Article,
					display: Display.Standard,
					theme: Pillar.News,
				})}
				format={{
					design: Design.Article,
					display: Display.Standard,
					theme: Pillar.News,
				}}
				quoted={true}
			/>
			<h1>Sport</h1>
			<BlockquoteBlockComponent
				html={blockquoteHtml}
				palette={decidePalette({
					design: Design.Article,
					display: Display.Standard,
					theme: Pillar.Sport,
				})}
				format={{
					design: Design.Article,
					display: Display.Standard,
					theme: Pillar.Sport,
				}}
				quoted={true}
			/>
			<h1>Culture</h1>
			<BlockquoteBlockComponent
				html={blockquoteHtml}
				palette={decidePalette({
					design: Design.Article,
					display: Display.Standard,
					theme: Pillar.Culture,
				})}
				format={{
					design: Design.Article,
					display: Display.Standard,
					theme: Pillar.Culture,
				}}
				quoted={true}
			/>
			<h1>Lifestyle</h1>
			<BlockquoteBlockComponent
				html={blockquoteHtml}
				palette={decidePalette({
					design: Design.Article,
					display: Display.Standard,
					theme: Pillar.Lifestyle,
				})}
				format={{
					design: Design.Article,
					display: Display.Standard,
					theme: Pillar.Lifestyle,
				}}
				quoted={true}
			/>
			<h1>Opinion</h1>
			<BlockquoteBlockComponent
				html={blockquoteHtml}
				palette={decidePalette({
					design: Design.Article,
					display: Display.Standard,
					theme: Pillar.Opinion,
				})}
				format={{
					design: Design.Article,
					display: Display.Standard,
					theme: Pillar.Opinion,
				}}
				quoted={true}
			/>
			<h1>SpecialReport</h1>
			<BlockquoteBlockComponent
				html={blockquoteHtml}
				palette={decidePalette({
					design: Design.Article,
					display: Display.Standard,
					theme: Special.SpecialReport,
				})}
				format={{
					design: Design.Article,
					display: Display.Standard,
					theme: Special.SpecialReport,
				}}
				quoted={true}
			/>
			<h1>Labs</h1>
			<BlockquoteBlockComponent
				html={blockquoteHtml}
				palette={decidePalette({
					design: Design.Article,
					display: Display.Standard,
					theme: Special.Labs,
				})}
				format={{
					design: Design.Article,
					display: Display.Standard,
					theme: Special.Labs,
				}}
				quoted={true}
			/>
			<h1>LiveBlog News</h1>
			<BlockquoteBlockComponent
				html={blockquoteHtml}
				palette={decidePalette({
					design: Design.LiveBlog,
					display: Display.Standard,
					theme: Pillar.News,
				})}
				format={{
					design: Design.LiveBlog,
					display: Display.Standard,
					theme: Pillar.News,
				}}
				quoted={true}
			/>
			<h1>DeadBlog News</h1>
			<BlockquoteBlockComponent
				html={blockquoteHtml}
				palette={decidePalette({
					design: Design.DeadBlog,
					display: Display.Standard,
					theme: Pillar.News,
				})}
				format={{
					design: Design.DeadBlog,
					display: Display.Standard,
					theme: Pillar.News,
				}}
				quoted={true}
			/>
			<h1>LiveBlog News</h1>
			<BlockquoteBlockComponent
				html={blockquoteHtml}
				palette={decidePalette({
					design: Design.LiveBlog,
					display: Display.Standard,
					theme: Pillar.Sport,
				})}
				format={{
					design: Design.LiveBlog,
					display: Display.Standard,
					theme: Pillar.Sport,
				}}
				quoted={true}
			/>
			<h1>DeadBlog Sport</h1>
			<BlockquoteBlockComponent
				html={blockquoteHtml}
				palette={decidePalette({
					design: Design.DeadBlog,
					display: Display.Standard,
					theme: Pillar.Sport,
				})}
				format={{
					design: Design.DeadBlog,
					display: Display.Standard,
					theme: Pillar.Sport,
				}}
				quoted={true}
			/>
		</div>
	);
};
Quoted.story = { name: 'Quoted' };
