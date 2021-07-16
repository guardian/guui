import { Design, Display, Pillar, Special } from '@guardian/types';
import { ElementContainer } from '@frontend/web/components/ElementContainer';

import { LinkHeadline } from '@frontend/web/components/LinkHeadline';
import { decidePalette } from '@root/src/web/lib/decidePalette';

export default {
	component: LinkHeadline,
	title: 'Components/LinkHeadline',
};

export const xsmallStory = () => (
	<ElementContainer showTopBorder={false} showSideBorders={false}>
		<LinkHeadline
			headlineText="This is how a large headline link looks"
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
			size="large"
		/>
	</ElementContainer>
);
xsmallStory.story = { name: 'Size | large' };

export const liveStory = () => (
	<ElementContainer showTopBorder={false} showSideBorders={false}>
		<LinkHeadline
			headlineText="This is how a headline with a live kicker looks"
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
			kickerText="Live"
		/>
	</ElementContainer>
);
liveStory.story = { name: 'With Live kicker' };

export const noSlash = () => (
	<ElementContainer showTopBorder={false} showSideBorders={false}>
		<LinkHeadline
			headlineText="This is how a headline with no kicker slash looks"
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
			kickerText="Live"
			showSlash={false}
		/>
	</ElementContainer>
);
noSlash.story = { name: 'With Live kicker but no slash' };

export const pulsingDot = () => (
	<ElementContainer showTopBorder={false} showSideBorders={false}>
		<LinkHeadline
			headlineText="This is how a headline with a pulsing dot looks"
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
			kickerText="Live"
			showPulsingDot={true}
		/>
	</ElementContainer>
);
pulsingDot.story = { name: 'With pulsing dot' };

export const cultureVariant = () => (
	<ElementContainer showTopBorder={false} showSideBorders={false}>
		<LinkHeadline
			headlineText="This is how a headline with the culture pillar looks"
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
			kickerText="Art and stuff"
		/>
	</ElementContainer>
);
cultureVariant.story = { name: 'With a culture kicker' };

export const opinionxxxsmall = () => (
	<ElementContainer showTopBorder={false} showSideBorders={false}>
		<LinkHeadline
			headlineText="This is how small links to opinion articles look"
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
			showQuotes={true}
			size="small"
			byline="Comment byline"
		/>
	</ElementContainer>
);
opinionxxxsmall.story = { name: 'Quotes | small' };

export const OpinionKicker = () => (
	<ElementContainer showTopBorder={false} showSideBorders={false}>
		<LinkHeadline
			headlineText="This is how an opinion headline with a kicker looks"
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
			showQuotes={true}
			kickerText="George Monbiot"
			showSlash={true}
		/>
	</ElementContainer>
);
OpinionKicker.story = { name: 'With an opinion kicker' };

export const SpecialReport = () => (
	<ElementContainer showTopBorder={false} showSideBorders={false}>
		<LinkHeadline
			headlineText="This is how a Special Report headline with a kicker looks"
			palette={decidePalette({
				display: Display.Standard,
				design: Design.Comment,
				theme: Special.SpecialReport,
			})}
			format={{
				display: Display.Standard,
				design: Design.Comment,
				theme: Special.SpecialReport,
			}}
			showQuotes={true}
			kickerText="Special Report"
			showSlash={true}
		/>
	</ElementContainer>
);
SpecialReport.story = { name: 'when Special Report' };

export const InUnderlinedState = () => (
	<ElementContainer showTopBorder={false} showSideBorders={false}>
		<LinkHeadline
			headlineText="This is the underlined state when showUnderline is true"
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
			showUnderline={true}
			size="small"
			kickerText="I am never underlined"
			showSlash={true}
			link={{
				to:
					'https://www.theguardian.com/us-news/2019/nov/14/nancy-pelosi-trump-ukraine-bribery',
			}}
		/>
	</ElementContainer>
);
InUnderlinedState.story = { name: 'With showUnderline true' };

export const linkStory = () => (
	<ElementContainer showTopBorder={false} showSideBorders={false}>
		<LinkHeadline
			headlineText="This is how a headline looks as a link"
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
			kickerText="I am not a link"
			showSlash={true}
			link={{
				to:
					'https://www.theguardian.com/us-news/2019/nov/14/nancy-pelosi-trump-ukraine-bribery',
			}}
		/>
	</ElementContainer>
);
linkStory.story = { name: 'With linkTo provided' };

export const LiveBlogSizes = () => (
	<ElementContainer showTopBorder={false} showSideBorders={false}>
		<LinkHeadline
			headlineText="Revealed: how US and UK spy agencies defeat internet privacy and security"
			palette={decidePalette({
				display: Display.Standard,
				design: Design.LiveBlog,
				theme: Pillar.News,
			})}
			format={{
				display: Display.Standard,
				design: Design.LiveBlog,
				theme: Pillar.News,
			}}
			showQuotes={true}
			kickerText="Large live"
			showSlash={true}
			showPulsingDot={true}
			size="large"
		/>
		<br />
		<LinkHeadline
			headlineText="Revealed: how US and UK spy agencies defeat internet privacy and security"
			palette={decidePalette({
				display: Display.Standard,
				design: Design.LiveBlog,
				theme: Pillar.News,
			})}
			format={{
				display: Display.Standard,
				design: Design.LiveBlog,
				theme: Pillar.News,
			}}
			showQuotes={true}
			kickerText="Medium live"
			showSlash={true}
			showPulsingDot={true}
			size="medium"
		/>
		<br />
		<LinkHeadline
			headlineText="Revealed: how US and UK spy agencies defeat internet privacy and security"
			palette={decidePalette({
				display: Display.Standard,
				design: Design.LiveBlog,
				theme: Pillar.News,
			})}
			format={{
				display: Display.Standard,
				design: Design.LiveBlog,
				theme: Pillar.News,
			}}
			showQuotes={true}
			kickerText="Small live"
			showSlash={true}
			showPulsingDot={true}
			size="small"
		/>
		<br />
		<LinkHeadline
			headlineText="Revealed: how US and UK spy agencies defeat internet privacy and security"
			palette={decidePalette({
				display: Display.Standard,
				design: Design.LiveBlog,
				theme: Pillar.News,
			})}
			format={{
				display: Display.Standard,
				design: Design.LiveBlog,
				theme: Pillar.News,
			}}
			showQuotes={true}
			kickerText="Tiny live"
			showSlash={true}
			showPulsingDot={true}
			size="xsmall"
		/>
	</ElementContainer>
);
LiveBlogSizes.story = { name: 'with various sizes' };

export const DeadBlogSizes = () => (
	<ElementContainer showTopBorder={false} showSideBorders={false}>
		<LinkHeadline
			headlineText="Revealed: how US and UK spy agencies defeat internet privacy and security"
			palette={decidePalette({
				display: Display.Standard,
				design: Design.DeadBlog,
				theme: Pillar.News,
			})}
			format={{
				display: Display.Standard,
				design: Design.DeadBlog,
				theme: Pillar.News,
			}}
			showQuotes={true}
			kickerText="Large live"
			showSlash={true}
			showPulsingDot={true}
			size="large"
		/>
		<br />
		<LinkHeadline
			headlineText="Revealed: how US and UK spy agencies defeat internet privacy and security"
			palette={decidePalette({
				display: Display.Standard,
				design: Design.DeadBlog,
				theme: Pillar.News,
			})}
			format={{
				display: Display.Standard,
				design: Design.DeadBlog,
				theme: Pillar.News,
			}}
			showQuotes={true}
			kickerText="Medium live"
			showSlash={true}
			showPulsingDot={true}
			size="medium"
		/>
		<br />
		<LinkHeadline
			headlineText="Revealed: how US and UK spy agencies defeat internet privacy and security"
			palette={decidePalette({
				display: Display.Standard,
				design: Design.DeadBlog,
				theme: Pillar.News,
			})}
			format={{
				display: Display.Standard,
				design: Design.DeadBlog,
				theme: Pillar.News,
			}}
			showQuotes={true}
			kickerText="Small live"
			showSlash={true}
			showPulsingDot={true}
			size="small"
		/>
		<br />
		<LinkHeadline
			headlineText="Revealed: how US and UK spy agencies defeat internet privacy and security"
			palette={decidePalette({
				display: Display.Standard,
				design: Design.DeadBlog,
				theme: Pillar.News,
			})}
			format={{
				display: Display.Standard,
				design: Design.DeadBlog,
				theme: Pillar.News,
			}}
			showQuotes={true}
			kickerText="Tiny live"
			showSlash={true}
			showPulsingDot={true}
			size="xsmall"
		/>
	</ElementContainer>
);
DeadBlogSizes.story = { name: 'with various sizes' };

export const Updated = () => (
	<ElementContainer showTopBorder={false} showSideBorders={false}>
		<LinkHeadline
			headlineText=""
			palette={decidePalette({
				display: Display.Standard,
				design: Design.LiveBlog,
				theme: Pillar.News,
			})}
			format={{
				display: Display.Standard,
				design: Design.LiveBlog,
				theme: Pillar.News,
			}}
			showPulsingDot={true}
			showSlash={false}
			kickerText="Updated 7m ago"
			size="xsmall"
		/>
	</ElementContainer>
);
Updated.story = { name: 'Last updated' };
