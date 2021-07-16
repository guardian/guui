import { css } from '@emotion/react';

import { Display, Design, Pillar } from '@guardian/types';
import { decidePalette } from '@root/src/web/lib/decidePalette';
import { ElementContainer } from '../ElementContainer';
import { Flex } from '../Flex';
import { LeftColumn } from '../LeftColumn';
import { RightColumn } from '../RightColumn';

import { CaptionBlockComponent } from './CaptionBlockComponent';

export default {
	component: CaptionBlockComponent,
	title: 'Components/CaptionBlockComponent',
};

/*
    type Props = {
        display: Display;
        design: Design;
        captionText?: string;
        pillar: Theme;
        padCaption?: boolean;
        credit?: string;
        displayCredit?: boolean;
        isOverlayed?: boolean;
    };
 */

const Container = ({ children }: { children: React.ReactNode }) => (
	<ElementContainer showTopBorder={false}>
		<Flex>
			<LeftColumn>
				<></>
			</LeftColumn>
			<div
				css={css`
					width: 620px;
					padding: 20px;
					flex-grow: 1;
				`}
			>
				{children}
			</div>
			<RightColumn>
				<></>
			</RightColumn>
		</Flex>
	</ElementContainer>
);

export const StandardArticle = () => {
	return (
		<Container>
			<CaptionBlockComponent
				captionText="Caption text"
				format={{
					display: Display.Standard,
					design: Design.Article,
					theme: Pillar.News,
				}}
				palette={decidePalette({
					display: Display.Standard,
					design: Design.Article,
					theme: Pillar.News,
				})}
			/>
		</Container>
	);
};
StandardArticle.story = {
	name: 'with defaults',
};

export const PhotoEssay = () => {
	return (
		<Container>
			<CaptionBlockComponent
				captionText="Caption text"
				format={{
					display: Display.Immersive,
					design: Design.PhotoEssay,
					theme: Pillar.Lifestyle,
				}}
				palette={decidePalette({
					display: Display.Immersive,
					design: Design.PhotoEssay,
					theme: Pillar.Lifestyle,
				})}
				padCaption={false}
				credit="Credit text"
				displayCredit={false}
				isOverlayed={false}
			/>
		</Container>
	);
};
PhotoEssay.story = {
	name: 'PhotoEssay',
};

export const PhotoEssayHTML = () => {
	return (
		<Container>
			<CaptionBlockComponent
				captionText="<ul><li>Line 1 text</li><li>Line 2 text</li><li>Line 3 text</li></ul>"
				format={{
					display: Display.Immersive,
					design: Design.PhotoEssay,
					theme: Pillar.Sport,
				}}
				palette={decidePalette({
					display: Display.Immersive,
					design: Design.PhotoEssay,
					theme: Pillar.Sport,
				})}
				padCaption={false}
				credit="Credit text"
				displayCredit={false}
				isOverlayed={false}
			/>
		</Container>
	);
};
PhotoEssayHTML.story = {
	name: 'PhotoEssay using html',
};

export const Padded = () => {
	return (
		<Container>
			<CaptionBlockComponent
				captionText="Caption text"
				format={{
					display: Display.Standard,
					design: Design.Analysis,
					theme: Pillar.Culture,
				}}
				palette={decidePalette({
					display: Display.Standard,
					design: Design.Analysis,
					theme: Pillar.Culture,
				})}
				padCaption={true}
				credit="Credit text"
				displayCredit={false}
				isOverlayed={false}
			/>
		</Container>
	);
};
Padded.story = {
	name: 'when padded',
};

export const Credited = () => {
	return (
		<Container>
			<CaptionBlockComponent
				captionText="Caption textQuas repellat sapiente nobis vel. Expedita veniam ut officiis. Omnis tempore natus est distinctio sapiente aliquid dolores soluta. Vel facere vitae velit et non. Eveniet omnis impedit mollitia voluptas omnis sit"
				format={{
					display: Display.Standard,
					design: Design.MatchReport,
					theme: Pillar.Culture,
				}}
				palette={decidePalette({
					display: Display.Standard,
					design: Design.MatchReport,
					theme: Pillar.Culture,
				})}
				padCaption={false}
				credit="Credit text"
				displayCredit={true}
				isOverlayed={false}
			/>
		</Container>
	);
};
Credited.story = {
	name: 'with credit',
};

export const Overlayed = () => {
	return (
		<Container>
			<CaptionBlockComponent
				captionText="Caption textQuas repellat sapiente nobis vel. Expedita veniam ut officiis. Omnis tempore natus est distinctio sapiente aliquid dolores soluta. Vel facere vitae velit et non. Eveniet omnis impedit mollitia voluptas omnis sit"
				format={{
					display: Display.Showcase,
					design: Design.Comment,
					theme: Pillar.Sport,
				}}
				palette={decidePalette({
					display: Display.Showcase,
					design: Design.Comment,
					theme: Pillar.Sport,
				})}
				padCaption={false}
				credit="Credit text"
				displayCredit={false}
				isOverlayed={true}
			/>
		</Container>
	);
};
Overlayed.story = {
	name: 'when overlayed',
};
