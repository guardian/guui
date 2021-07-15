import { Design, Display, Pillar } from '@guardian/types';
import { decideDesign } from '@root/src/web/lib/decideDesign';
import { decideTheme } from '@root/src/web/lib/decideTheme';
import { decideDisplay } from './decideDisplay';
import { decidePalette } from './decidePalette';

export const decideTrail = (trail: CAPITrailType): TrailType => {
	const format: Format = trail.format
		? {
				display: decideDisplay(trail.format),
				theme: decideTheme(trail.format),
				design: decideDesign(trail.format),
		  }
		: {
				display: Display.Standard,
				theme: Pillar.News,
				design: Design.Article,
		  };

	const palette = decidePalette(format);

	return {
		...trail,
		format,
		palette,
	};
};
