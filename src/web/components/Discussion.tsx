import React, { useState, useEffect } from 'react';
import { css } from 'emotion';

import { space } from '@guardian/src-foundations';
import { CommentCount } from '@frontend/web/components/CommentCount';
import { RightColumn } from '@frontend/web/components/RightColumn';
import { AdSlot } from '@root/src/web/components/AdSlot';
import { App as Comments } from '@guardian/discussion-rendering';
import { from } from '@guardian/src-foundations/mq';

import { Portal } from '@frontend/web/components/Portal';
import { Lazy } from '@frontend/web/components/Lazy';
import { Flex } from '@frontend/web/components/Flex';
import { SignedInAs } from '@frontend/web/components/SignedInAs';
import { ContainerLayout } from '@frontend/web/components/ContainerLayout';
import { Hide } from '@frontend/web/components/Hide';
import { getDiscussion } from '@root/src/web/lib/getDiscussion';
import { getCommentContext } from '@root/src/web/lib/getCommentContext';
import { Display } from '@guardian/types';

type Props = {
	discussionApiUrl: string;
	shortUrlId: string;
	isCommentable: boolean;
	pillar: Theme;
	palette: Palette;
	discussionD2Uid: string;
	discussionApiClientHeader: string;
	enableDiscussionSwitch: boolean;
	isAdFreeUser: boolean;
	shouldHideAds: boolean;
	user?: UserProfile;
	// **************************************************************************
	// beingHydrated?
	// We use this prop to solve a problem we have with Storybook. If you remove
	// it then the page will render fine on production but our layout stories
	// will render two copies of Discussion, side by side. The reason for this
	// is because we technically server side render these layout stories on the
	// client, inside the story file itself.
	//
	// Yes, it's true, having props purely to solve test implementation problems
	// is not great. If you feel strongly about this and want to remove this
	// prop I'm okay with that. If you were able to solve this another way
	// then thank you!
	beingHydrated?: boolean;
	// **************************************************************************
	display: Display;
};

const commentIdFromUrl = () => {
	if (typeof window === 'undefined') return;
	const { hash } = window.location;
	if (!hash) return;
	if (!hash.includes('comment')) return;
	if (!hash.split('-')[1]) return;
	return parseInt(hash.split('-')[1], 10);
};

export const Discussion = ({
	discussionApiUrl,
	shortUrlId,
	isCommentable,
	pillar,
	palette,
	user,
	discussionD2Uid,
	discussionApiClientHeader,
	enableDiscussionSwitch,
	isAdFreeUser,
	shouldHideAds,
	beingHydrated,
	display,
}: Props) => {
	const [commentCount, setCommentCount] = useState<number>();
	const [isClosedForComments, setIsClosedForComments] = useState<boolean>(
		true,
	);
	const [commentPage, setCommentPage] = useState<number>();
	const [commentPageSize, setCommentPageSize] = useState<25 | 50 | 100>();
	const [commentOrderBy, setCommentOrderBy] = useState<
		'newest' | 'oldest' | 'recommendations'
	>();
	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const [hashCommentId, setHashCommentId] = useState<number | undefined>(
		commentIdFromUrl(),
	);
	const hasCommentsHash =
		typeof window !== 'undefined' &&
		window.location &&
		window.location.hash === '#comments';

	const handlePermalink = (commentId: number) => {
		if (typeof window === 'undefined') return false;
		window.location.hash = `#comment-${commentId}`;
		const comment = window.document.getElementById(`comment-${commentId}`);
		if (comment) {
			// The comment was already on the page so just scroll to it.
			comment.scrollIntoView();
		}
		setHashCommentId(commentId);
		return false;
	};

	useEffect(() => {
		const callFetch = async () => {
			const response = await getDiscussion(discussionApiUrl, shortUrlId);
			setCommentCount(response && response.discussion.commentCount);
			setIsClosedForComments(
				response && response.discussion.isClosedForComments,
			);
		};

		if (isCommentable) {
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			callFetch().catch((e) => console.error(`callFetch - error: ${e}`));
		}
	}, [discussionApiUrl, shortUrlId, isCommentable]);

	// Check the url to see if there is a comment hash, e.g. ...crisis#comment-139113120
	// If so, make a call to get the context of this comment so we know what page it is
	// on.
	useEffect(() => {
		if (hashCommentId) {
			getCommentContext(discussionApiUrl, hashCommentId)
				.then((context) => {
					setCommentPage(context.page);
					setCommentPageSize(context.pageSize);
					setCommentOrderBy(context.orderBy);
					setIsExpanded(true);
				})
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				.catch((e) => console.error(`getCommentContext - error: ${e}`));
		}
	}, [discussionApiUrl, hashCommentId]);

	useEffect(() => {
		if (hasCommentsHash) {
			setIsExpanded(true);
		}
	}, [hasCommentsHash]);

	const hideAd = isAdFreeUser || shouldHideAds;

	return (
		<>
			{commentCount !== undefined && beingHydrated && (
				<Portal root="comment-count-root">
					<CommentCount
						isCommentable={isCommentable}
						commentCount={commentCount}
						palette={palette}
						setIsExpanded={setIsExpanded}
					/>
				</Portal>
			)}

			<ContainerLayout
				padSides={false}
				padContent={false}
				// If we're not hiding an advert stretch to the right
				stretchRight={!hideAd}
				leftContent={
					// eslint-disable-next-line react/jsx-wrap-multilines
					<SignedInAs
						pillar={pillar}
						enableDiscussionSwitch={enableDiscussionSwitch}
						user={user}
						commentCount={commentCount || 0}
						isClosedForComments={isClosedForComments}
					/>
				}
			>
				<Flex>
					<div
						className={css`
							${from.leftCol} {
								padding-left: 10px;
							}
							max-width: 100%;
						`}
					>
						<Hide when="above" breakpoint="leftCol">
							<div
								className={css`
									padding-bottom: ${space[2]}px;
								`}
							>
								<SignedInAs
									pillar={pillar}
									enableDiscussionSwitch={
										enableDiscussionSwitch
									}
									user={user}
									commentCount={commentCount || 0}
								/>
							</div>
						</Hide>

						{beingHydrated && isExpanded && (
							<Comments
								user={user}
								baseUrl={discussionApiUrl}
								pillar={pillar}
								initialPage={commentPage}
								pageSizeOverride={commentPageSize}
								isClosedForComments={
									isClosedForComments ||
									!enableDiscussionSwitch
								}
								orderByOverride={commentOrderBy}
								shortUrl={shortUrlId}
								additionalHeaders={{
									'D2-X-UID': discussionD2Uid,
									'GU-Client': discussionApiClientHeader,
								}}
								expanded={isExpanded}
								commentToScrollTo={hashCommentId}
								onPermalinkClick={handlePermalink}
								apiKey="dotcom-rendering"
							/>
						)}

						{beingHydrated && !isExpanded && (
							<Lazy margin={300}>
								<Comments
									user={user}
									baseUrl={discussionApiUrl}
									pillar={pillar}
									initialPage={commentPage}
									pageSizeOverride={commentPageSize}
									isClosedForComments={
										isClosedForComments ||
										!enableDiscussionSwitch
									}
									orderByOverride={commentOrderBy}
									shortUrl={shortUrlId}
									additionalHeaders={{
										'D2-X-UID': discussionD2Uid,
										'GU-Client': discussionApiClientHeader,
									}}
									expanded={isExpanded}
									commentToScrollTo={hashCommentId}
									onPermalinkClick={handlePermalink}
									apiKey="dotcom-rendering"
								/>
							</Lazy>
						)}
					</div>
					<>
						{!hideAd && (
							<RightColumn>
								<div
									className={css`
										position: static;
										height: 100%;
										padding-left: 20px;
									`}
								>
									<AdSlot
										position="comments"
										display={display}
									/>
								</div>
							</RightColumn>
						)}
					</>
				</Flex>
			</ContainerLayout>
		</>
	);
};
