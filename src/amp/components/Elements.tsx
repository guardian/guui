import { AudioAtomBlockComponent } from '@root/src/amp/components/elements/AudioAtomBlockComponent';
import { CommentBlockComponent } from '@root/src/amp/components/elements/CommentBlockComponent';
import { ContentAtomBlockComponent } from '@root/src/amp/components/elements/ContentAtomBlockComponent';
import { DisclaimerBlockComponent } from '@root/src/amp/components/elements/DisclaimerBlockComponent';
import { EmbedBlockComponent } from '@root/src/amp/components/elements/EmbedBlockComponent';
import { Expandable } from '@root/src/amp/components/Expandable';
import { GuVideoBlockComponent } from '@root/src/amp/components/elements/GuVideoBlockComponent';
import { ImageBlockComponent } from '@root/src/amp/components/elements/ImageBlockComponent';
import { InteractiveAtomBlockComponent } from '@root/src/amp/components/elements/InteractiveAtomBlockComponent';
import { InteractiveBlockComponent } from '@root/src/amp/components/elements/InteractiveBlockComponent';
import { PullquoteBlockComponent } from '@root/src/amp/components/elements/PullquoteBlockComponent';
import { RichLinkBlockComponent } from '@root/src/amp/components/elements/RichLinkBlockComponent';
import { SoundcloudBlockComponent } from '@root/src/amp/components/elements/SoundcloudBlockComponent';
import { SubheadingBlockComponent } from '@root/src/amp/components/elements/SubheadingBlockComponent';
import { TextBlockComponent } from '@root/src/amp/components/elements/TextBlockComponent';
import { TimelineBlockComponent } from '@root/src/amp/components/elements/TimelineBlockComponent';
import { TwitterBlockComponent } from '@root/src/amp/components/elements/TwitterBlockComponent';
import { VideoVimeoBlockComponent } from '@root/src/amp/components/elements/VideoVimeoBlockComponent';
import { VideoYoutubeBlockComponent } from '@root/src/amp/components/elements/VideoYoutubeBlockComponent';
import { YoutubeBlockComponent } from '@root/src/amp/components/elements/YoutubeBlockComponent';

import { minimise, sanitiseHTML } from '@root/src/model/clean';

const clean = (html: string) =>
	minimise(
		sanitiseHTML(html, {
			ADD_TAGS: ['#comment'],
			FORCE_BODY: true,
		}),
	);

export const Elements = (
	elements: CAPIElement[],
	pillar: Pillar,
	isImmersive: boolean,
	adTargeting?: AdTargeting,
): JSX.Element[] => {
	const cleanedElements = elements.map((element) => {
		if (
			element._type ===
			'model.dotcomrendering.pageElements.InteractiveAtomBlockElement'
		) {
			element.html = element.html ? clean(element.html) : element.html;
		}
		return element;
	});
	const output = cleanedElements.map((element, i) => {
		switch (element._type) {
			case 'model.dotcomrendering.pageElements.AudioAtomBlockElement':
				return <AudioAtomBlockComponent element={element} />;
			case 'model.dotcomrendering.pageElements.BlockquoteBlockElement':
				return (
					<TextBlockComponent
						key={i}
						html={element.html}
						pillar={pillar}
					/>
				);
			case 'model.dotcomrendering.pageElements.ChartAtomBlockElement':
				return <InteractiveAtomBlockComponent url={element.url} />;
			case 'model.dotcomrendering.pageElements.CommentBlockElement':
				return <CommentBlockComponent key={i} element={element} />;
			case 'model.dotcomrendering.pageElements.ContentAtomBlockElement':
				return <ContentAtomBlockComponent element={element} />;
			case 'model.dotcomrendering.pageElements.DisclaimerBlockElement':
				return (
					<DisclaimerBlockComponent
						key={i}
						html={element.html}
						pillar={pillar}
					/>
				);
			case 'model.dotcomrendering.pageElements.EmbedBlockElement':
				return <EmbedBlockComponent key={i} element={element} />;
			case 'model.dotcomrendering.pageElements.GenericAtomBlockElement':
				return <InteractiveAtomBlockComponent url={element.url} />;
			case 'model.dotcomrendering.pageElements.GuideAtomBlockElement':
				return (
					<Expandable
						id={element.id}
						type={element.label}
						title={element.title}
						img={element.img}
						credit={element.credit}
						pillar={pillar}
					>
						<div
							dangerouslySetInnerHTML={{
								__html: element.html,
							}}
						/>
					</Expandable>
				);
			case 'model.dotcomrendering.pageElements.GuVideoBlockElement':
				return (
					<GuVideoBlockComponent
						key={i}
						element={element}
						pillar={pillar}
					/>
				);
			case 'model.dotcomrendering.pageElements.ImageBlockElement':
				return (
					<ImageBlockComponent
						key={i}
						element={element}
						pillar={pillar}
					/>
				);
			case 'model.dotcomrendering.pageElements.InteractiveAtomBlockElement':
				return (
					<InteractiveAtomBlockComponent
						url={element.url}
						html={element.html}
						placeholderUrl={element.placeholderUrl}
					/>
				); // element.placeholderUrl
			case 'model.dotcomrendering.pageElements.InteractiveBlockElement': // Plain Interactive Embeds
				return (
					<InteractiveBlockComponent
						url={element.url}
						isMandatory={element.isMandatory}
					/>
				);
			case 'model.dotcomrendering.pageElements.ProfileAtomBlockElement':
				return (
					<Expandable
						id={element.id}
						type={element.label}
						title={element.title}
						img={element.img}
						credit={element.credit}
						pillar={pillar}
					>
						<div
							dangerouslySetInnerHTML={{
								__html: element.html,
							}}
						/>
					</Expandable>
				);
			case 'model.dotcomrendering.pageElements.PullquoteBlockElement':
				return (
					<PullquoteBlockComponent
						key={i}
						html={element.html}
						pillar={pillar}
					/>
				);
			case 'model.dotcomrendering.pageElements.QABlockElement':
				return (
					<Expandable
						id={element.id}
						type="Q&A"
						title={element.title}
						img={element.img}
						credit={element.credit}
						pillar={pillar}
					>
						<div
							dangerouslySetInnerHTML={{
								__html: element.html,
							}}
						/>
					</Expandable>
				);
			case 'model.dotcomrendering.pageElements.RichLinkBlockElement':
				return (
					<RichLinkBlockComponent
						key={i}
						element={element}
						pillar={pillar}
					/>
				);
			case 'model.dotcomrendering.pageElements.SoundcloudBlockElement':
				return <SoundcloudBlockComponent key={i} element={element} />;
			case 'model.dotcomrendering.pageElements.SubheadingBlockElement':
				return (
					<SubheadingBlockComponent
						key={i}
						html={element.html}
						pillar={pillar}
						isImmersive={isImmersive}
					/>
				);
			case 'model.dotcomrendering.pageElements.TextBlockElement':
				return (
					<TextBlockComponent
						key={i}
						html={element.html}
						pillar={pillar}
					/>
				);
			case 'model.dotcomrendering.pageElements.TimelineBlockElement':
				return (
					<TimelineBlockComponent
						id={element.id}
						title={element.title}
						description={element.description}
						events={element.events}
						pillar={pillar}
					/>
				);
			case 'model.dotcomrendering.pageElements.TweetBlockElement':
				return (
					<TwitterBlockComponent
						key={i}
						element={element}
						pillar={pillar}
					/>
				);
			case 'model.dotcomrendering.pageElements.VideoVimeoBlockElement':
				return (
					<VideoVimeoBlockComponent
						key={i}
						element={element}
						pillar={pillar}
					/>
				);
			case 'model.dotcomrendering.pageElements.VideoYoutubeBlockElement':
				return (
					<VideoYoutubeBlockComponent
						key={i}
						element={element}
						pillar={pillar}
					/>
				);
			case 'model.dotcomrendering.pageElements.YoutubeBlockElement':
				return (
					<YoutubeBlockComponent
						element={element}
						pillar={pillar}
						adTargeting={adTargeting}
					/>
				);
			default:
				// eslint-disable-next-line no-console
				console.log('Unsupported Element', JSON.stringify(element));
				if ((element as { isMandatory?: boolean }).isMandatory) {
					throw new Error(
						'This page cannot be rendered due to incompatible content that is marked as mandatory.',
					);
				}
				return null;
		}
	});

	return output.filter((el) => el !== null) as JSX.Element[];
};
