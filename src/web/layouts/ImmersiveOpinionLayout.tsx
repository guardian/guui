import React from 'react';
import { css } from '@emotion/react';

import {
	neutral,
	brandBackground,
	brandBorder,
} from '@guardian/src-foundations/palette';
import { from, until } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
import { Design } from '@guardian/types';
import type { Format } from '@guardian/types';
import { Lines } from '@guardian/src-ed-lines';

import { ArticleBody } from '@root/src/web/components/ArticleBody';
import { RightColumn } from '@root/src/web/components/RightColumn';
import { ArticleContainer } from '@root/src/web/components/ArticleContainer';
import { ArticleMeta } from '@root/src/web/components/ArticleMeta';
import { SubMeta } from '@root/src/web/components/SubMeta';
import { MainMedia } from '@root/src/web/components/MainMedia';
import { ArticleTitle } from '@root/src/web/components/ArticleTitle';
import { ArticleHeadline } from '@root/src/web/components/ArticleHeadline';
import { Standfirst } from '@root/src/web/components/Standfirst';
import { Footer } from '@root/src/web/components/Footer';
import { SubNav } from '@root/src/web/components/SubNav/SubNav';
import { ElementContainer } from '@root/src/web/components/ElementContainer';
import { Nav } from '@root/src/web/components/Nav/Nav';
import { MobileStickyContainer, AdSlot } from '@root/src/web/components/AdSlot';
import { Border } from '@root/src/web/components/Border';
import { GridItem } from '@root/src/web/components/GridItem';
import { Caption } from '@root/src/web/components/Caption';
import { ContainerLayout } from '@root/src/web/components/ContainerLayout';
import { Discussion } from '@frontend/web/components/Discussion';
import { Hide } from '@root/src/web/components/Hide';

import { buildAdTargeting } from '@root/src/lib/ad-targeting';
import { getZIndex } from '@frontend/web/lib/getZIndex';
import { parse } from '@frontend/lib/slot-machine-flags';

import {
	decideLineCount,
	decideLineEffect,
	getCurrentPillar,
} from '@root/src/web/lib/layoutHelpers';
import { BannerWrapper } from '@root/src/web/layouts/lib/stickiness';
import { ContributorAvatar } from '../components/ContributorAvatar';
// import { Container } from 'src/amp/components/Container';

// css={[stackBelow('leftCol'), mostPopularAdStyle]}

const ImmersiveGrid = ({ children }: { children: React.ReactNode }) => (
	<div
		css={css`
			/* IE Fallback */
			display: flex;
			flex-direction: column;
			${until.leftCol} {
				margin-left: 0px;
			}
			${from.leftCol} {
				margin-left: 151px;
			}
			${from.wide} {
				margin-left: 230px;
			}

			@supports (display: grid) {
				display: grid;
				width: 100%;
				margin-left: 0;

				${from.wide} {
					grid-column-gap: 10px;
					grid-template-columns:
						219px /* Left Column (220 - 1px border) */
						1px /* Vertical grey border */
						1fr /* Main content */
						300px; /* Right Column */
					grid-template-areas:
						'caption    border      title       right-column'
						'.          border      headline    right-column'
						'.          border      standfirst  right-column'
						'lines      border      body        right-column'
						'meta       border      body        right-column'
						'meta       border      body        right-column'
						'.          border      body        right-column'
						'.          border      .           right-column';
				}

				${until.wide} {
					grid-column-gap: 10px;
					grid-template-columns:
						140px /* Left Column (220 - 1px border) */
						1px /* Vertical grey border */
						1fr /* Main content */
						300px; /* Right Column */
					grid-template-areas:
						'caption    border      standfirst  right-column'
						'lines      border      body        right-column'
						'meta       border      body        right-column'
						'meta       border      body        right-column'
						'.          border      body        right-column'
						'.          border      .           right-column';
				}

				${until.leftCol} {
					grid-column-gap: 20px;
					grid-template-columns:
						1fr /* Main content */
						300px; /* Right Column */
					grid-template-areas:
						'standfirst  right-column'
						'caption     right-column'
						'lines       right-column'
						'meta        right-column'
						'body        right-column';
				}

				${until.desktop} {
					grid-column-gap: 0px;
					grid-template-columns: 1fr; /* Main content */
					grid-template-areas:
						'standfirst'
						'caption'
						'lines'
						'meta'
						'body';
				}
			}
		`}
	>
		{children}
	</div>
);

const maxWidth = css`
	${from.desktop} {
		max-width: 620px;
	}
`;

const stretchLines = css`
	${until.phablet} {
		margin-left: -20px;
		margin-right: -20px;
	}
	${until.mobileLandscape} {
		margin-left: -10px;
		margin-right: -10px;
	}
`;

const avatarPositionStyles = css`
	display: flex;
	justify-content: flex-end;
	overflow: hidden;
	margin-bottom: -29px;
	margin-top: -70px;
	pointer-events: none;
	${until.phablet} {
		img {
			margin-right: -1.85rem;
		}
	}
`;

interface Props {
	CAPI: CAPIType;
	NAV: NavType;
	format: Format;
	palette: Palette;
}

const decideCaption = (mainMedia: ImageBlockElement): string => {
	const caption = [];
	if (mainMedia && mainMedia.data && mainMedia.data.caption)
		caption.push(mainMedia.data.caption);
	if (
		mainMedia &&
		mainMedia.displayCredit &&
		mainMedia.data &&
		mainMedia.data.credit
	)
		caption.push(mainMedia.data.credit);
	return caption.join(' ');
};

export const ImmersiveOpinionLayout = ({
	CAPI,
	NAV,
	format,
	palette,
}: Props): JSX.Element => {
	const {
		config: { isPaidContent, host },
	} = CAPI;

	const adTargeting: AdTargeting = buildAdTargeting(CAPI.config);

	const showBodyEndSlot =
		parse(CAPI.slotMachineFlags || '').showBodyEnd ||
		CAPI.config.switches.slotBodyEnd;

	const contributorTag = CAPI.tags.find((tag) => tag.type === 'Contributor');
	const avatarUrl = contributorTag && contributorTag.bylineImageUrl;

	// TODO:
	// 1) Read 'forceEpic' value from URL parameter and use it to force the slot to render
	// 2) Otherwise, ensure slot only renders if `CAPI.config.shouldHideReaderRevenue` equals false.

	const seriesTag = CAPI.tags.find(
		(tag) => tag.type === 'Series' || tag.type === 'Blog',
	);
	const showOnwardsLower = seriesTag && CAPI.hasStoryPackage;

	const showComments = CAPI.isCommentable;

	const mainMedia = CAPI.mainMediaElements[0] as ImageBlockElement;
	const captionText = decideCaption(mainMedia);
	const { branding } = CAPI.commercialProperties[CAPI.editionId];

	return (
		<>
			<div
				css={css`
					background-color: ${palette.background.article};
				`}
			>
				<div
					css={[
						mainMedia &&
							css`
								height: 100vh;
								/**
									100vw is normally enough but don't let the content shrink vertically too
									much just in case
								*/
								min-height: 25rem;
								${from.desktop} {
									min-height: 31.25rem;
								}
								${from.wide} {
									min-height: 50rem;
								}
							`,
						css`
							display: flex;
							flex-direction: column;
						`,
					]}
				>
					<header
						css={css`
							${getZIndex('headerWrapper')}
							order: 0;
						`}
					>
						<ElementContainer
							showSideBorders={false}
							showTopBorder={false}
							padded={false}
							backgroundColour={brandBackground.primary}
						>
							<Nav
								format={{
									...format,
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

					<MainMedia
						format={format}
						palette={palette}
						elements={CAPI.mainMediaElements}
						adTargeting={adTargeting}
						starRating={
							format.design === Design.Review && CAPI.starRating
								? CAPI.starRating
								: undefined
						}
						host={host}
						hideCaption={true}
						pageId={CAPI.pageId}
						webTitle={CAPI.webTitle}
					/>
					{mainMedia && (
						<>
							<ContainerLayout
								verticalMargins={false}
								padContent={true}
								centralBorder="full"
								padSides={true}
								leftColSize="compact"
								backgroundColour={palette.background.headline}
								leftContent={
									// eslint-disable-next-line react/jsx-wrap-multilines
									<ArticleTitle
										format={format}
										palette={palette}
										tags={CAPI.tags}
										sectionLabel={CAPI.sectionLabel}
										sectionUrl={CAPI.sectionUrl}
										guardianBaseURL={CAPI.guardianBaseURL}
										badge={CAPI.badge}
									/>
								}
							>
								<div
									css={css`
										position: relative;
										display: flex;
										flex-direction: row;
									`}
								>
									<Hide when="above" breakpoint="leftCol">
										<div
											css={css`
												position: absolute;
												top: -30px;
												left: 0;
												${getZIndex('articleHeadline')}
											`}
										>
											<ArticleTitle
												format={format}
												palette={palette}
												tags={CAPI.tags}
												sectionLabel={CAPI.sectionLabel}
												sectionUrl={CAPI.sectionUrl}
												guardianBaseURL={
													CAPI.guardianBaseURL
												}
												badge={CAPI.badge}
											/>
										</div>
									</Hide>
									<div>
										<ArticleHeadline
											format={format}
											headlineString={CAPI.headline}
											palette={palette}
											tags={CAPI.tags}
											byline={CAPI.author.byline}
										/>
									</div>
									{avatarUrl && (
										<div css={avatarPositionStyles}>
											<ContributorAvatar
												imageSrc={avatarUrl}
												imageAlt={
													CAPI.author.byline || ''
												}
											/>
										</div>
									)}
								</div>
							</ContainerLayout>
							<Lines count={8} />
						</>
					)}
				</div>
			</div>
			<ElementContainer
				showTopBorder={false}
				showSideBorders={false}
				backgroundColour={palette.background.article}
			>
				<ImmersiveGrid>
					{/* Above leftCol, the Caption is controled by ContainerLayout ^^ */}
					<GridItem area="caption">
						<Hide when="above" breakpoint="leftCol">
							<Caption
								palette={palette}
								captionText={captionText}
								format={format}
								shouldLimitWidth={false}
							/>
						</Hide>
					</GridItem>
					<GridItem area="border">
						{format.design === Design.PhotoEssay ? (
							<></>
						) : (
							<Border palette={palette} />
						)}
					</GridItem>
					<GridItem area="standfirst">
						<Standfirst
							format={format}
							standfirst={CAPI.standfirst}
						/>
					</GridItem>
					<GridItem area="lines">
						{format.design === Design.PhotoEssay ? (
							<></>
						) : (
							<div css={maxWidth}>
								<div css={stretchLines}>
									<Lines
										effect={decideLineEffect(
											Design.Article,
											format.theme,
										)}
										count={decideLineCount(Design.Article)}
									/>
								</div>
							</div>
						)}
					</GridItem>
					<GridItem area="meta">
						<div css={maxWidth}>
							<ArticleMeta
								branding={branding}
								format={format}
								palette={palette}
								pageId={CAPI.pageId}
								webTitle={CAPI.webTitle}
								author={CAPI.author}
								tags={CAPI.tags}
								primaryDateline={CAPI.webPublicationDateDisplay}
								secondaryDateline={
									CAPI.webPublicationSecondaryDateDisplay
								}
							/>
						</div>
					</GridItem>
					<GridItem area="body">
						<ArticleContainer>
							<main css={maxWidth}>
								<ArticleBody
									format={format}
									palette={palette}
									blocks={CAPI.blocks}
									adTargeting={adTargeting}
									host={host}
									pageId={CAPI.pageId}
									webTitle={CAPI.webTitle}
								/>
								{showBodyEndSlot && <div id="slot-body-end" />}
								<Lines count={4} />
								<SubMeta
									palette={palette}
									subMetaKeywordLinks={
										CAPI.subMetaKeywordLinks
									}
									subMetaSectionLinks={
										CAPI.subMetaSectionLinks
									}
									pageId={CAPI.pageId}
									webUrl={CAPI.webURL}
									webTitle={CAPI.webTitle}
									showBottomSocialButtons={
										CAPI.showBottomSocialButtons
									}
									badge={CAPI.badge}
									format={format}
								/>
							</main>
						</ArticleContainer>
					</GridItem>
					<GridItem area="right-column">
						<div
							css={css`
								padding-top: 6px;
								height: 100%;
								${from.desktop} {
									/* above 980 */
									margin-left: 20px;
									margin-right: -20px;
								}
								${from.leftCol} {
									/* above 1140 */
									margin-left: 0px;
									margin-right: 0px;
								}
							`}
						>
							<RightColumn>
								<>
									{mainMedia && (
										<div
											css={css`
												margin-top: ${space[4]}px;
											`}
										>
											<AdSlot
												position="right"
												display={format.display}
											/>
										</div>
									)}
								</>
							</RightColumn>
						</div>
					</GridItem>
				</ImmersiveGrid>
			</ElementContainer>

			<ElementContainer
				padded={false}
				showTopBorder={false}
				showSideBorders={false}
				backgroundColour={neutral[93]}
			>
				<AdSlot
					position="merchandising-high"
					display={format.display}
				/>
			</ElementContainer>

			{!isPaidContent && (
				<>
					{/* Onwards (when signed OUT) */}
					<div id="onwards-upper-whensignedout" />
					{showOnwardsLower && (
						<ElementContainer sectionId="onwards-lower-whensignedout" />
					)}

					{showComments && (
						<ElementContainer sectionId="comments">
							<Discussion
								discussionApiUrl={CAPI.config.discussionApiUrl}
								shortUrlId={CAPI.config.shortUrlId}
								isCommentable={CAPI.isCommentable}
								pillar={format.theme}
								palette={palette}
								discussionD2Uid={CAPI.config.discussionD2Uid}
								discussionApiClientHeader={
									CAPI.config.discussionApiClientHeader
								}
								enableDiscussionSwitch={false}
								isAdFreeUser={CAPI.isAdFreeUser}
								shouldHideAds={CAPI.shouldHideAds}
								beingHydrated={false}
								display={format.display}
							/>
						</ElementContainer>
					)}

					{/* Onwards (when signed IN) */}
					<div id="onwards-upper-whensignedin" />
					{showOnwardsLower && (
						<ElementContainer sectionId="onwards-lower-whensignedin" />
					)}

					<ElementContainer sectionId="most-viewed-footer" />
				</>
			)}

			<ElementContainer
				padded={false}
				showTopBorder={false}
				showSideBorders={false}
				backgroundColour={neutral[93]}
			>
				<AdSlot position="merchandising" display={format.display} />
			</ElementContainer>

			{NAV.subNavSections && (
				<ElementContainer padded={false} sectionId="sub-nav-root">
					<SubNav
						subNavSections={NAV.subNavSections}
						currentNavLink={NAV.currentNavLink}
						palette={palette}
					/>
					<Lines count={4} />
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
