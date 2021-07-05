import { css, Global } from '@emotion/react';

import {
	brandBackground,
	brandBorder,
	labs,
	border,
	brandLine,
	neutral,
} from '@guardian/src-foundations/palette';
import { Display, Format, Special } from '@guardian/types';
import { Lines } from '@guardian/src-ed-lines';

import { Footer } from '@root/src/web/components/Footer';
import { SubNav } from '@root/src/web/components/SubNav/SubNav';
import { ElementContainer } from '@root/src/web/components/ElementContainer';
import { Nav } from '@root/src/web/components/Nav/Nav';
import { MobileStickyContainer } from '@root/src/web/components/AdSlot';
import { LabsHeader } from '@frontend/web/components/LabsHeader';

import { getZIndex } from '@frontend/web/lib/getZIndex';

import { Stuck, BannerWrapper } from '@root/src/web/layouts/lib/stickiness';
import { getCurrentPillar } from '@root/src/web/lib/layoutHelpers';

import { renderElement } from '../lib/renderElement';
import { Header } from '../components/Header';
import { HeaderAdSlot } from '../components/HeaderAdSlot';
import { interactiveLegacyGlobalStyles } from './lib/interactiveLegacyStyling';

interface Props {
	CAPI: CAPIType;
	NAV: NavType;
	format: Format;
	palette: Palette;
}

const Renderer: React.FC<{
	format: Format;
	palette: Palette;
	elements: CAPIElement[];
	host?: string;
	pageId: string;
	webTitle: string;
}> = ({ format, palette, elements, host, pageId, webTitle }) => {
	// const cleanedElements = elements.map(element =>
	//     'html' in element ? { ...element, html: clean(element.html) } : element,
	// );
	// ^^ Until we decide where to do the "isomorphism split" in this this code is not safe here.
	//    But should be soon.
	const output = elements.map((element, index) => {
		const [ok, el] = renderElement({
			format,
			palette,
			element,
			adTargeting: undefined,
			host,
			index,
			isMainMedia: false,
			pageId,
			webTitle,
		});

		return ok ? (
			<figure
				id={'elementId' in element ? element.elementId : undefined}
				key={index}
			>
				{el}
			</figure>
		) : null;
	});

	return <div>{output}</div>;
};

const NavHeader = ({ CAPI, NAV, format, palette }: Props): JSX.Element => {
	// Typically immersives use the slim nav, but this switch is used to force
	// the full nav - typically during special events such as Project 200, or
	// the Euros. The motivation is to better onboard new visitors; interactives
	// often reach readers who are less familiar with the Guardian.
	const isSlimNav = !CAPI.config.switches.interactiveFullHeaderSwitch;

	if (isSlimNav) {
		return (
			<header
				css={css`
					${getZIndex('headerWrapper')}
					order: 0;
				`}
			>
				<ElementContainer
					showSideBorders={true}
					borderColour={brandLine.primary}
					showTopBorder={false}
					padded={false}
					backgroundColour={brandBackground.primary}
				>
					<Nav
						format={{
							display: format.display,
							design: format.design,
							theme: getCurrentPillar(CAPI),
						}}
						nav={NAV}
						subscribeUrl={
							CAPI.nav.readerRevenueLinks.header.subscribe
						}
						edition={CAPI.editionId}
					/>
				</ElementContainer>
			</header>
		);
	}

	return (
		<div>
			<div data-print-layout="hide">
				<Stuck>
					<ElementContainer
						showTopBorder={false}
						showSideBorders={false}
						padded={false}
						shouldCenter={false}
						element="aside"
					>
						<HeaderAdSlot
							isAdFreeUser={CAPI.isAdFreeUser}
							shouldHideAds={CAPI.shouldHideAds}
							display={format.display}
						/>
					</ElementContainer>
				</Stuck>
				{format.theme !== Special.Labs && (
					<ElementContainer
						showTopBorder={false}
						showSideBorders={false}
						padded={false}
						backgroundColour={brandBackground.primary}
					>
						<Header
							edition={CAPI.editionId}
							idUrl={CAPI.config.idUrl}
							mmaUrl={CAPI.config.mmaUrl}
							isAnniversary={
								CAPI.config.switches.anniversaryHeaderSvg
							}
						/>
					</ElementContainer>
				)}
			</div>

			<ElementContainer
				showSideBorders={true}
				borderColour={brandLine.primary}
				showTopBorder={false}
				padded={false}
				backgroundColour={brandBackground.primary}
			>
				<Nav
					format={{
						display: Display.Standard,
						design: format.design,
						theme: getCurrentPillar(CAPI),
					}}
					nav={NAV}
					subscribeUrl={CAPI.nav.readerRevenueLinks.header.subscribe}
					edition={CAPI.editionId}
				/>
			</ElementContainer>

			{NAV.subNavSections && format.theme !== Special.Labs && (
				<ElementContainer
					backgroundColour={neutral[100]}
					padded={false}
					sectionId="sub-nav-root"
				>
					<SubNav
						subNavSections={NAV.subNavSections}
						currentNavLink={NAV.currentNavLink}
						palette={palette}
					/>
				</ElementContainer>
			)}
		</div>
	);
};

export const InteractiveImmersiveLayout = ({
	CAPI,
	NAV,
	format,
	palette,
}: Props): JSX.Element => {
	const {
		config: { host },
	} = CAPI;

	return (
		<>
			{CAPI.isLegacyInteractive && (
				<Global styles={interactiveLegacyGlobalStyles} />
			)}
			<div
				css={css`
					background-color: ${palette.background.article};
				`}
			>
				<NavHeader
					CAPI={CAPI}
					NAV={NAV}
					format={format}
					palette={palette}
				/>

				{format.theme === Special.Labs && (
					<Stuck>
						<ElementContainer
							showSideBorders={true}
							showTopBorder={false}
							backgroundColour={labs[400]}
							borderColour={border.primary}
							sectionId="labs-header"
						>
							<LabsHeader />
						</ElementContainer>
					</Stuck>
				)}
			</div>

			<ElementContainer
				showTopBorder={false}
				showSideBorders={false}
				shouldCenter={false}
				padded={false}
				backgroundColour={palette.background.article}
				element="article"
			>
				<main>
					<Renderer
						format={format}
						palette={palette}
						elements={CAPI.blocks[0] ? CAPI.blocks[0].elements : []}
						host={host}
						pageId={CAPI.pageId}
						webTitle={CAPI.webTitle}
					/>
				</main>
			</ElementContainer>

			{NAV.subNavSections && (
				<ElementContainer
					padded={false}
					sectionId="sub-nav-root"
					backgroundColour={neutral[100]}
					element="nav"
				>
					<SubNav
						subNavSections={NAV.subNavSections}
						currentNavLink={NAV.currentNavLink}
						palette={palette}
					/>
					<Lines count={4} effect="straight" />
				</ElementContainer>
			)}

			<ElementContainer
				padded={false}
				backgroundColour={brandBackground.primary}
				borderColour={brandBorder.primary}
				showSideBorders={false}
			>
				<Footer
					pageFooter={CAPI.pageFooter}
					pillar={format.theme}
					pillars={NAV.pillars}
				/>
			</ElementContainer>

			<BannerWrapper />
			<MobileStickyContainer />
		</>
	);
};
