import React, { useEffect, useState } from 'react';
import { css } from 'emotion';

import { Section } from '@root/src/web/components/Section';
import { SubNav } from '@root/src/web/components/SubNav/SubNav';
import { Nav } from '@root/src/web/components/Nav/Nav';
import { brandBackground, brandLine } from '@guardian/src-foundations/palette';
import { Pillar } from '@guardian/types';
import { neutralBorder } from '@root/src/lib/pillars';
import libDebounce from 'lodash.debounce';
import { decideTheme } from '@root/src/web/lib/decideTheme';
import { decideDesign } from '@root/src/web/lib/decideDesign';

interface Props {
	CAPI: CAPIBrowserType;
	NAV: NavType;
	format: Format;
	palette: Palette;
}

const fixed = (pillar: Theme) => css`
	width: 100%;
	position: fixed;
	top: 0;
	z-index: 9000;
	background-color: white;
	box-shadow: 0 0 transparent, 0 0 transparent,
		1px 3px 6px ${neutralBorder(pillar)};
`;

// FixedNav reappears fixed to top of viewport if below initial buffer and user
// is scrolling back. Idea is that scrolling back up may indicate intent to
// reach nav.
export const FixedNav: React.FC<Props> = ({
	CAPI,
	NAV,
	format,
	palette,
}: Props) => {
	const initialState = { shouldFix: false, scrollY: 0 };
	const [state, setState] = useState(initialState);

	const pillar = decideTheme({
		pillar: CAPI.pillar,
		design: decideDesign(CAPI.designType, CAPI.tags),
	});

	useEffect(() => {
		const handle = () => {
			setState((oldState) => {
				const buffer = 300;
				const newY = window.scrollY;
				const goingBack = newY < oldState.scrollY;
				const beforeRange = newY < buffer;

				return {
					shouldFix: goingBack && !beforeRange,
					scrollY: newY,
				};
			});
		};

		window.addEventListener('scroll', libDebounce(handle, 20), {
			passive: true,
		});

		return () => {
			window.removeEventListener('scroll', handle);
		};
	}, []);

	return (
		<>
			<Section
				showSideBorders={true}
				borderColour={brandLine.primary}
				showTopBorder={false}
				padded={false}
				backgroundColour={brandBackground.primary}
			>
				<Nav
					nav={NAV}
					format={{
						...format,
						theme: Pillar.News,
					}}
					subscribeUrl={CAPI.nav.readerRevenueLinks.header.subscribe}
					edition={CAPI.editionId}
				/>
			</Section>

			{NAV.subNavSections && (
				<Section
					backgroundColour={palette.background.article}
					padded={false}
					sectionId="sub-nav-root"
				>
					<SubNav
						subNavSections={NAV.subNavSections}
						currentNavLink={NAV.currentNavLink}
						format={format}
					/>
				</Section>
			)}

			{state.shouldFix && (
				<div className={fixed(pillar)}>
					<Section
						showSideBorders={true}
						borderColour={brandLine.primary}
						showTopBorder={false}
						padded={false}
						backgroundColour={brandBackground.primary}
					>
						<Nav
							nav={NAV}
							format={{
								...format,
								theme: Pillar.News,
							}}
							subscribeUrl={
								CAPI.nav.readerRevenueLinks.header.subscribe
							}
							edition={CAPI.editionId}
						/>
					</Section>

					{NAV.subNavSections && (
						<Section
							backgroundColour={palette.background.article}
							padded={false}
							sectionId="sub-nav-root"
						>
							<SubNav
								subNavSections={NAV.subNavSections}
								currentNavLink={NAV.currentNavLink}
								format={format}
							/>
						</Section>
					)}
				</div>
			)}
		</>
	);
};
