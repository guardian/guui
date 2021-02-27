import React from 'react';
import { css } from 'emotion';
import { palette } from '@guardian/src-foundations';
import { textSans, body } from '@guardian/src-foundations/typography';
import {
	Link,
	footerLinksNew,
	LinkPlatform,
	isOnPlatform,
} from '@root/src/lib/footer-links';
import { ReaderRevenueButton } from '@root/src/amp/components/ReaderRevenueButton';
import { InnerContainer } from './InnerContainer';

const footer = css`
	background-color: ${palette.brand[400]};
	color: ${palette.neutral[86]};
	${textSans.medium()};
	margin-top: 20px;
`;

const footerInner = css`
	position: relative;
	padding-bottom: 6px;
`;

const footerLink = css`
	color: ${palette.neutral[100]};
	text-decoration: none;
	padding-bottom: 12px;
	display: block;

	:hover {
		color: ${palette.brandAlt[400]};
	}
`;

const footerList = css`
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	position: relative;
	padding-top: 12px;

	:before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: calc(50% - 10px);
		width: 1px;
		display: block;
		background-color: rgba(255, 255, 255, 0.3);
	}
`;

const footerListBlock = css`
	margin-right: 10px;
	width: calc(50% - 10px);
	margin-top: 0;
`;

const copyrightContainer = css`
	padding-left: 20px;
	padding-right: 20px;
	padding-top: 20px;
	padding-bottom: 18px;
	border-top: 1px solid rgba(255, 255, 255, 0.3);
	margin-top: 12px;
	position: relative;
`;

const copyright = css`
	${textSans.xsmall()};
`;

const iconContainer = css`
	position: relative;
	float: right;
	margin-top: -6px;
	border-radius: 100%;
	background-color: ${palette.neutral[100]};
	cursor: pointer;
	height: 42px;
	min-width: 42px;
`;

const icon = css`
	:before {
		position: absolute;
		top: 6px;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		border: 2px solid ${palette.brand[400]};
		border-bottom: 0;
		border-right: 0;
		content: '';
		height: 12px;
		width: 12px;
		transform: rotate(45deg);
	}
`;

const backToTopLink = css`
	position: absolute;
	background-color: ${palette.brand[400]};
	color: ${palette.neutral[100]};
	font-weight: 700;
	top: -14px;
	right: 20px;
	padding: 0 5px;
`;

const backToTopText = css`
	display: inline-block;
	padding-right: 0.3125rem;
	padding-top: 3px;
`;

const supportLink = css`
	color: ${palette.brandAlt[400]};
	${body.medium()};
	padding-bottom: 0.375rem;
`;

const year = new Date().getFullYear();

const FooterLinks: React.FC<{
	links: Link[][];
	nav: NavType;
}> = ({ links, nav }) => {
	const linkGroups = links.map((linkGroup) => {
		const ls = linkGroup
			.filter((l) => isOnPlatform(l, LinkPlatform.Amp))
			.map((l, index) => (
				<li key={`${l.title}${index}`}>
					<a className={footerLink} href={l.url} on={l.on}>
						{l.title}
					</a>
				</li>
			));
		const key = linkGroup.reduce((acc, { title }) => `acc-${title}`, '');

		return (
			<ul key={key} className={footerListBlock}>
				{ls}
			</ul>
		);
	});

	return (
		<div className={footerList}>
			{linkGroups}
			<div key="rrblock" className={footerListBlock}>
				<div className={supportLink}>Support The&nbsp;Guardian</div>
				<ReaderRevenueButton
					nav={nav}
					rrLink="ampFooter"
					rrCategory="contribute"
					rightAlignIcon={true}
					linkLabel="Contribute"
				/>
				<ReaderRevenueButton
					nav={nav}
					rrLink="ampFooter"
					rrCategory="subscribe"
					rightAlignIcon={true}
					linkLabel="Subscribe"
				/>
			</div>
		</div>
	);
};

export const Footer: React.FC<{ nav: NavType }> = ({ nav }) => (
	<footer className={footer}>
		<InnerContainer>
			<div className={footerInner}>
				<FooterLinks links={footerLinksNew} nav={nav} />
			</div>
		</InnerContainer>
		<InnerContainer className={copyrightContainer}>
			<a className={backToTopLink} href="#top">
				<span className={backToTopText}>Back to top</span>
				<span className={iconContainer}>
					<i className={icon} />
				</span>
			</a>
			<div className={copyright}>
				© {year} Guardian News & Media Limited or its affiliated
				companies. All rights reserved.
			</div>
		</InnerContainer>
	</footer>
);
