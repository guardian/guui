import React from 'react';
import { css } from '@emotion/css';

import { Design } from '@guardian/types';
import { neutral } from '@guardian/src-foundations/palette';
import { headline, textSans } from '@guardian/src-foundations/typography';

import { BylineLink } from '@frontend/web/components/BylineLink';

import TwitterIcon from '@frontend/static/icons/twitter.svg';

const twitterHandleStyles = (palette: Palette) => css`
	${textSans.xsmall()};
	font-weight: bold;
	color: ${palette.text.twitterHandle};

	padding-right: 10px;
	display: inline-block;

	svg {
		height: 10px;
		max-width: 12px;
		margin-right: 0px;
		fill: ${neutral[ 46 ]};
	}

	a {
		color: ${palette.text.twitterHandle};
		text-decoration: none;
	}
`;

const bylineStyles = (palette: Palette) => css`
	${headline.xxxsmall()};
	color: ${palette.text.byline};
	padding-bottom: 8px;
	font-style: italic;

	a {
		font-weight: 700;
		color: ${palette.text.byline};
		text-decoration: none;
		font-style: normal;
		:hover {
			text-decoration: underline;
		}
	}
`;

export const Contributor: React.FC<{
	author: AuthorType;
	tags: TagType[];
	format: Format;
	palette: Palette;
}> = ({ author, tags, format, palette }) => {
	if (!author.byline) {
		return null;
	}

	const onlyOneContributor: boolean =
		tags.filter((tag) => tag.type === 'Contributor').length === 1;

	return (
		<address
			aria-label="Contributor info"
			data-component="meta-byline"
			data-link-name="byline"
		>
			{format.design !== Design.Interview && (
				<div className={bylineStyles(palette)}>
					<BylineLink byline={author.byline} tags={tags} />
				</div>
			)}
			{onlyOneContributor && author.twitterHandle && (
				<div className={twitterHandleStyles(palette)}>
					<TwitterIcon />
					<a
						href={`https://www.twitter.com/${author.twitterHandle}`}
						aria-label={`@${author.twitterHandle} on Twitter`}
					>
						@{author.twitterHandle}
					</a>
				</div>
			)}
		</address>
	);
};
