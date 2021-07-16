import { Display, Design } from '@guardian/types';
import type { Format } from '@guardian/types';

import { decideTheme } from '@root/src/web/lib/decideTheme';
import { decideDisplay } from '@root/src/web/lib/decideDisplay';
import { decidePalette } from '@root/src/web/lib/decidePalette';
import { decideDesign } from '@root/src/web/lib/decideDesign';

import { StandardLayout } from './StandardLayout';
import { ShowcaseLayout } from './ShowcaseLayout';
import { CommentLayout } from './CommentLayout';
import { ImmersiveLayout } from './ImmersiveLayout';
import { LiveLayout } from './LiveLayout';
import { InteractiveImmersiveLayout } from './InteractiveImmersiveLayout';
import { InteractiveLayout } from './InteractiveLayout';
import { ImmersiveOpinionLayout } from './ImmersiveOpinionLayout';

type Props = {
	CAPI: CAPIType;
	NAV: NavType;
};

export const DecideLayout = ({ CAPI, NAV }: Props): JSX.Element => {
	const display: Display = decideDisplay(CAPI.format);
	const design: Design = decideDesign(CAPI.format);
	const theme: Pillar = decideTheme(CAPI.format);
	const format: Format = {
		display,
		design,
		theme,
	};
	const palette = decidePalette(format);

	// TODO we can probably better express this as data
	switch (display) {
		case Display.Immersive: {
			if (design === Design.Interactive) {
				return (
					<InteractiveImmersiveLayout
						CAPI={CAPI}
						NAV={NAV}
						format={format}
						palette={palette}
					/>
				);
			}
			if (design === Design.Comment || design === Design.Editorial) {
				return (
					<ImmersiveOpinionLayout
						CAPI={CAPI}
						NAV={NAV}
						format={format}
						palette={palette}
					/>
				);
			}
			return (
				<ImmersiveLayout
					CAPI={CAPI}
					NAV={NAV}
					palette={palette}
					format={format}
				/>
			);
		}
		case Display.NumberedList:
		case Display.Showcase: {
			switch (design) {
				case Design.LiveBlog:
				case Design.DeadBlog:
					return (
						<LiveLayout
							CAPI={CAPI}
							NAV={NAV}
							format={format}
							palette={palette}
						/>
					);
				case Design.Comment:
				case Design.Editorial:
				case Design.Letter:
					return (
						<CommentLayout
							CAPI={CAPI}
							NAV={NAV}
							format={format}
							palette={palette}
						/>
					);
				default:
					return (
						<ShowcaseLayout
							CAPI={CAPI}
							NAV={NAV}
							format={format}
							palette={palette}
						/>
					);
			}
		}
		case Display.Standard:
		default: {
			switch (design) {
				case Design.Interactive:
					return (
						<InteractiveLayout
							CAPI={CAPI}
							NAV={NAV}
							format={format}
							palette={palette}
						/>
					);
				case Design.LiveBlog:
				case Design.DeadBlog:
					return (
						<LiveLayout
							CAPI={CAPI}
							NAV={NAV}
							format={format}
							palette={palette}
						/>
					);
				case Design.Comment:
				case Design.Editorial:
				case Design.Letter:
					return (
						<CommentLayout
							CAPI={CAPI}
							NAV={NAV}
							format={format}
							palette={palette}
						/>
					);
				default:
					return (
						<StandardLayout
							CAPI={CAPI}
							NAV={NAV}
							format={format}
							palette={palette}
						/>
					);
			}
		}
	}
};
