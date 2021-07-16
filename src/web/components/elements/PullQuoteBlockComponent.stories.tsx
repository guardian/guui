import { Display, Design, Pillar, Special } from '@guardian/types';

import { decidePalette } from '@root/src/web/lib/decidePalette';
import { PullQuoteBlockComponent } from '@root/src/web/components/elements/PullQuoteBlockComponent';

import { ContainerLayout } from '../ContainerLayout';

export default {
	component: PullQuoteBlockComponent,
	title: 'Components/PullQuoteBlockComponent',
};

// Inline
export const SportInline = () => {
	return (
		<ContainerLayout centralBorder="full">
			<PullQuoteBlockComponent
				design={Design.Article}
				palette={decidePalette({
					display: Display.Standard,
					design: Design.Article,
					theme: Pillar.Sport,
				})}
				format={{
					display: Display.Standard,
					design: Design.Article,
					theme: Pillar.Sport,
				}}
				html="Even if part of my job is filthy, I still love it – it’s my work"
				// eslint-disable-next-line jsx-a11y/aria-role
				role="inline"
				attribution="Julie-Lou Dubreuilh"
			/>
		</ContainerLayout>
	);
};
SportInline.story = {
	name: 'Sport, inline, Article',
};

export const LabsInline = () => {
	return (
		<ContainerLayout centralBorder="full">
			<PullQuoteBlockComponent
				design={Design.Article}
				palette={decidePalette({
					display: Display.Standard,
					design: Design.Article,
					theme: Special.Labs,
				})}
				format={{
					display: Display.Standard,
					design: Design.Article,
					theme: Special.Labs,
				}}
				html="Even if part of my job is filthy, I still love it – it’s my work"
				// eslint-disable-next-line jsx-a11y/aria-role
				role="inline"
				attribution="Julie-Lou Dubreuilh"
			/>
		</ContainerLayout>
	);
};
LabsInline.story = {
	name: 'Labs, inline, Article',
};

export const LifestyleInline = () => {
	return (
		<ContainerLayout centralBorder="full">
			<PullQuoteBlockComponent
				design={Design.Article}
				palette={decidePalette({
					display: Display.Standard,
					design: Design.Article,
					theme: Pillar.Lifestyle,
				})}
				format={{
					display: Display.Standard,
					design: Design.Article,
					theme: Pillar.Lifestyle,
				}}
				html="Even if part of my job is filthy, I still love it – it’s my work"
				// eslint-disable-next-line jsx-a11y/aria-role
				role="inline"
				attribution="Julie-Lou Dubreuilh"
			/>
		</ContainerLayout>
	);
};
LifestyleInline.story = {
	name: 'Lifestyle, inline, Article',
};

export const CultureInline = () => {
	return (
		<ContainerLayout centralBorder="full">
			<PullQuoteBlockComponent
				design={Design.Article}
				palette={decidePalette({
					display: Display.Standard,
					design: Design.Article,
					theme: Pillar.Culture,
				})}
				format={{
					display: Display.Standard,
					design: Design.Article,
					theme: Pillar.Culture,
				}}
				html="Even if part of my job is filthy, I still love it – it’s my work"
				// eslint-disable-next-line jsx-a11y/aria-role
				role="inline"
				attribution="Julie-Lou Dubreuilh"
			/>
		</ContainerLayout>
	);
};
CultureInline.story = {
	name: 'Culture, inline, Article',
};

export const NewsInline = () => {
	return (
		<ContainerLayout centralBorder="full">
			<PullQuoteBlockComponent
				design={Design.Article}
				palette={decidePalette({
					display: Display.Standard,
					design: Design.Article,
					theme: Pillar.News,
				})}
				format={{
					display: Display.Standard,
					design: Design.Article,
					theme: Pillar.News,
				}}
				html="Even if part of my job is filthy, I still love it – it’s my work"
				// eslint-disable-next-line jsx-a11y/aria-role
				role="inline"
				attribution="Julie-Lou Dubreuilh"
			/>
		</ContainerLayout>
	);
};
NewsInline.story = {
	name: 'News, inline, Article',
};

export const OpinionInline = () => {
	return (
		<ContainerLayout centralBorder="full">
			<PullQuoteBlockComponent
				design={Design.Comment}
				palette={decidePalette({
					display: Display.Standard,
					design: Design.Comment,
					theme: Pillar.Opinion,
				})}
				format={{
					display: Display.Standard,
					design: Design.Comment,
					theme: Pillar.Opinion,
				}}
				html="Even if part of my job is filthy, I still love it – it’s my work"
				// eslint-disable-next-line jsx-a11y/aria-role
				role="inline"
				attribution="Julie-Lou Dubreuilh"
			/>
		</ContainerLayout>
	);
};
OpinionInline.story = {
	name: 'Opinion, inline, Comment',
};

export const SpecialReportInline = () => {
	return (
		<ContainerLayout centralBorder="full">
			<PullQuoteBlockComponent
				design={Design.Article}
				palette={decidePalette({
					display: Display.Standard,
					design: Design.Article,
					theme: Special.SpecialReport,
				})}
				format={{
					display: Display.Standard,
					design: Design.Article,
					theme: Special.SpecialReport,
				}}
				html="Even if part of my job is filthy, I still love it – it’s my work"
				// eslint-disable-next-line jsx-a11y/aria-role
				role="inline"
				attribution="Julie-Lou Dubreuilh"
			/>
		</ContainerLayout>
	);
};
SpecialReportInline.story = {
	name: 'SpecialReport, inline, Article',
};

// Supporting
export const SportSupporting = () => {
	return (
		<ContainerLayout centralBorder="full">
			<PullQuoteBlockComponent
				design={Design.Article}
				palette={decidePalette({
					display: Display.Standard,
					design: Design.Article,
					theme: Pillar.Sport,
				})}
				format={{
					display: Display.Standard,
					design: Design.Article,
					theme: Pillar.Sport,
				}}
				html="Even if part of my job is filthy, I still love it – it’s my work"
				// eslint-disable-next-line jsx-a11y/aria-role
				role="supporting"
				attribution="Julie-Lou Dubreuilh"
			/>
		</ContainerLayout>
	);
};
SportSupporting.story = {
	name: 'Sport, supporting, Article',
};

export const LabsSupporting = () => {
	return (
		<ContainerLayout centralBorder="full">
			<PullQuoteBlockComponent
				design={Design.Article}
				palette={decidePalette({
					display: Display.Standard,
					design: Design.Article,
					theme: Special.Labs,
				})}
				format={{
					display: Display.Standard,
					design: Design.Article,
					theme: Special.Labs,
				}}
				html="Even if part of my job is filthy, I still love it – it’s my work"
				// eslint-disable-next-line jsx-a11y/aria-role
				role="supporting"
				attribution="Julie-Lou Dubreuilh"
			/>
		</ContainerLayout>
	);
};
LabsSupporting.story = {
	name: 'Labs, supporting, Article',
};

export const LifestyleSupporting = () => {
	return (
		<ContainerLayout centralBorder="full">
			<PullQuoteBlockComponent
				design={Design.Article}
				palette={decidePalette({
					display: Display.Standard,
					design: Design.Article,
					theme: Pillar.Lifestyle,
				})}
				format={{
					display: Display.Standard,
					design: Design.Article,
					theme: Pillar.Lifestyle,
				}}
				html="Even if part of my job is filthy, I still love it – it’s my work"
				// eslint-disable-next-line jsx-a11y/aria-role
				role="supporting"
				attribution="Julie-Lou Dubreuilh"
			/>
		</ContainerLayout>
	);
};
LifestyleSupporting.story = {
	name: 'Lifestyle, supporting, Article',
};

export const CultureSupporting = () => {
	return (
		<ContainerLayout centralBorder="full">
			<PullQuoteBlockComponent
				design={Design.Article}
				palette={decidePalette({
					display: Display.Standard,
					design: Design.Article,
					theme: Pillar.Culture,
				})}
				format={{
					display: Display.Standard,
					design: Design.Article,
					theme: Pillar.Culture,
				}}
				html="Even if part of my job is filthy, I still love it – it’s my work"
				// eslint-disable-next-line jsx-a11y/aria-role
				role="supporting"
				attribution="Julie-Lou Dubreuilh"
			/>
		</ContainerLayout>
	);
};
CultureSupporting.story = {
	name: 'Culture, supporting, Article',
};

export const NewsSupporting = () => {
	return (
		<ContainerLayout centralBorder="full">
			<PullQuoteBlockComponent
				design={Design.Article}
				palette={decidePalette({
					display: Display.Standard,
					design: Design.Article,
					theme: Pillar.News,
				})}
				format={{
					display: Display.Standard,
					design: Design.Article,
					theme: Pillar.News,
				}}
				html="Even if part of my job is filthy, I still love it – it’s my work"
				// eslint-disable-next-line jsx-a11y/aria-role
				role="supporting"
				attribution="Julie-Lou Dubreuilh"
			/>
		</ContainerLayout>
	);
};
NewsSupporting.story = {
	name: 'News, supporting, Article',
};

export const OpinionSupporting = () => {
	return (
		<ContainerLayout centralBorder="full">
			<PullQuoteBlockComponent
				design={Design.Comment}
				palette={decidePalette({
					display: Display.Standard,
					design: Design.Comment,
					theme: Pillar.Opinion,
				})}
				format={{
					display: Display.Standard,
					design: Design.Comment,
					theme: Pillar.Opinion,
				}}
				html="Even if part of my job is filthy, I still love it – it’s my work"
				// eslint-disable-next-line jsx-a11y/aria-role
				role="supporting"
				attribution="Julie-Lou Dubreuilh"
			/>
		</ContainerLayout>
	);
};
OpinionSupporting.story = {
	name: 'Opinion, supporting, Comment',
};

export const SpecialReportSupporting = () => {
	return (
		<ContainerLayout centralBorder="full">
			<PullQuoteBlockComponent
				design={Design.Article}
				palette={decidePalette({
					display: Display.Standard,
					design: Design.Article,
					theme: Special.SpecialReport,
				})}
				format={{
					display: Display.Standard,
					design: Design.Article,
					theme: Special.SpecialReport,
				}}
				html="Even if part of my job is filthy, I still love it – it’s my work"
				// eslint-disable-next-line jsx-a11y/aria-role
				role="supporting"
				attribution="Julie-Lou Dubreuilh"
			/>
		</ContainerLayout>
	);
};
SpecialReportSupporting.story = {
	name: 'SpecialReport, supporting, Article',
};

// PhotoEssay
export const PhotoEssayInline = () => {
	return (
		<ContainerLayout centralBorder="full">
			<PullQuoteBlockComponent
				design={Design.PhotoEssay}
				palette={decidePalette({
					display: Display.Standard,
					design: Design.PhotoEssay,
					theme: Pillar.News,
				})}
				format={{
					display: Display.Standard,
					design: Design.PhotoEssay,
					theme: Pillar.News,
				}}
				html="Even if part of my job is filthy, I still love it – it’s my work"
				// eslint-disable-next-line jsx-a11y/aria-role
				role="inline"
				attribution="Julie-Lou Dubreuilh"
			/>
		</ContainerLayout>
	);
};
PhotoEssayInline.story = {
	name: 'News, inline, PhotoEssay',
};

export const PhotoEssaySupporting = () => {
	return (
		<ContainerLayout centralBorder="full">
			<PullQuoteBlockComponent
				design={Design.PhotoEssay}
				palette={decidePalette({
					display: Display.Standard,
					design: Design.PhotoEssay,
					theme: Pillar.News,
				})}
				format={{
					display: Display.Standard,
					design: Design.PhotoEssay,
					theme: Pillar.News,
				}}
				html="Even if part of my job is filthy, I still love it – it’s my work"
				// eslint-disable-next-line jsx-a11y/aria-role
				role="supporting"
				attribution="Julie-Lou Dubreuilh"
			/>
		</ContainerLayout>
	);
};
PhotoEssaySupporting.story = {
	name: 'News, supporting, PhotoEssay',
};
