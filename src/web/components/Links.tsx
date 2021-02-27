import React, { useEffect, useState } from 'react';
import { css, cx } from 'emotion';

import SearchIcon from '@frontend/static/icons/search.svg';

import { brand, brandText, brandAlt } from '@guardian/src-foundations/palette';
import { textSans } from '@guardian/src-foundations/typography';
import { from } from '@guardian/src-foundations/mq';

import { getCookie } from '@root/src/web/browser/cookie';
import { DropdownLinkType, Dropdown } from '@root/src/web/components/Dropdown';

import ProfileIcon from '@frontend/static/icons/profile.svg';
import GiftingIcon from '@frontend/static/icons/gifting.svg';
import { getZIndex } from '@frontend/web/lib/getZIndex';
import { createAuthenticationEventParams } from '@root/src/lib/identity-component-event';
import { useOnce } from '@frontend/web/lib/useOnce';

type Props = {
	giftingURL: string;
	userId?: string;
	idUrl?: string;
	mmaUrl?: string;
};

const linkStyles = css`
	${textSans.medium()};
	color: ${brandText.primary};
	float: left;
	position: relative;
	transition: color 80ms ease-out;
	text-decoration: none;
	padding: 7px 0;

	${from.tablet} {
		padding: 5px 7px;
	}

	:hover,
	:focus {
		color: ${brandAlt[400]};
	}

	svg {
		fill: currentColor;
		float: left;
		height: 18px;
		width: 18px;
		margin: 3px 4px 0 0;
	}
`;

const linkTablet = ({ showAtTablet }: { showAtTablet: boolean }) => css`
	display: none;

	${from.tablet} {
		display: ${showAtTablet ? 'block' : 'none'};
	}

	${from.desktop} {
		display: block;
	}
`;

const seperatorStyles = css`
	border-left: 1px solid ${brand[600]};
	float: left;
	height: 24px;
	margin: 0 -2px 0 10px;
	display: none;

	${from.desktop} {
		display: block;
	}
`;

const seperatorHideStyles = css`
	border-left: 1px solid ${brand[600]};
	float: left;
	height: 24px;
	margin: 0 -2px 0 10px;
	display: none;

	${from.tablet} {
		display: block;
	}
`;

const Search = ({
	className,
	children,
	href,
	dataLinkName,
}: {
	className?: string;
	children: React.ReactNode;
	href: string;
	dataLinkName: string;
}) => (
	<a href={href} className={className} data-link-name={dataLinkName}>
		{children}
	</a>
);

const linksStyles = css`
	position: absolute;
	left: 10px;
	top: 0;

	${from.mobileLandscape} {
		left: 20px;
	}

	${from.tablet} {
		left: auto;
		right: 205px;
	}

	${from.desktop} {
		right: 266px;
	}

	${from.wide} {
		right: 342px;
	}

	${getZIndex('headerLinks')}
`;

export const Links = ({
	userId,
	giftingURL,
	idUrl: idUrlFromConfig,
	mmaUrl: mmaUrlFromConfig,
}: Props) => {
	const [showGiftingLink, setShowGiftingLink] = useState<boolean>();
	const [identityLinks, setIdentityLinks] = useState<DropdownLinkType[]>();

	// show gifting if support messaging isn't shown
	useEffect(() => {
		setShowGiftingLink(getCookie('gu_hide_support_messaging') === 'true');
	}, []);

	// Fall back on prod URLs just in case these aren't set for any reason
	const idUrl = idUrlFromConfig || 'https://profile.theguardian.com';
	const mmaUrl = mmaUrlFromConfig || 'https://manage.theguardian.com';

	// userId is used to construction `Comments & replies` URL. We therefore need to handle the
	// case where userId is not defined.
	// This logic also causes a re-render resolving a previosu issue we had when we know the DOM
	// structure could be different from the server rendered
	useOnce(() => {
		if (userId) {
			setIdentityLinks([
				{
					url: `${mmaUrl}/`,
					title: 'Account overview',
					dataLinkName: 'nav2 : topbar : account overview',
				},
				{
					url: `${mmaUrl}/public-settings`,
					title: 'Profile',
					dataLinkName: 'nav2 : topbar : edit profile',
				},
				{
					url: `${mmaUrl}/email-prefs`,
					title: 'Emails & marketing',
					dataLinkName: 'nav2 : topbar : email prefs',
				},
				{
					url: `${mmaUrl}/account-settings`,
					title: 'Settings',
					dataLinkName: 'nav2 : topbar : settings',
				},
				{
					url: `${mmaUrl}/help`,
					title: 'Help',
					dataLinkName: 'nav2 : topbar : help',
				},
				{
					url: `${idUrl}/user/id/${userId}`,
					title: 'Comments & replies',
					dataLinkName: 'nav2 : topbar : comment activity',
				},
				{
					url: `${idUrl}/signout`,
					title: 'Sign out',
					dataLinkName: 'nav2 : topbar : sign out',
				},
			]);
		} else {
			setIdentityLinks([]);
		}
	}, [userId, setIdentityLinks]);

	return (
		<div data-print-layout="hide" className={linksStyles}>
			{showGiftingLink && giftingURL !== '' && (
				<>
					<div className={seperatorStyles} />
					<a
						href={giftingURL}
						className={cx(
							linkTablet({ showAtTablet: false }),
							linkStyles,
						)}
						data-link-name="nav2 : gifting-cta"
					>
						<GiftingIcon />
						Gift options
					</a>
				</>
			)}

			<div className={seperatorStyles} />
			<a
				href="https://jobs.theguardian.com/?INTCMP=jobs_uk_web_newheader"
				className={cx(linkTablet({ showAtTablet: false }), linkStyles)}
				data-link-name="nav2 : job-cta"
			>
				Search jobs
			</a>
			<div className={seperatorHideStyles} />

			{identityLinks && identityLinks.length > 0 ? (
				<div className={linkStyles}>
					<ProfileIcon />
					<Dropdown
						label="My account"
						links={identityLinks}
						id="my-account"
						dataLinkName="nav2 : topbar: my account"
					/>
				</div>
			) : (
				<a
					className={linkStyles}
					href={`${idUrl}/signin?INTCMP=DOTCOM_NEWHEADER_SIGNIN&ABCMP=ab-sign-in&${createAuthenticationEventParams(
						'guardian_signin_header',
					)}`}
					data-link-name="nav2 : topbar : signin"
				>
					<ProfileIcon /> Sign in
				</a>
			)}

			<Search
				className={cx(linkTablet({ showAtTablet: false }), linkStyles)}
				href="https://www.google.co.uk/advanced_search?q=site:www.theguardian.com"
				dataLinkName="nav2 : search"
			>
				<SearchIcon />
				<>Search</>
			</Search>
		</div>
	);
};
