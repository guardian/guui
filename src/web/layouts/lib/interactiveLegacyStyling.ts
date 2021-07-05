import { css } from '@emotion/react';
import { from, until } from '@guardian/src-foundations/mq';

import { center } from '@root/src/web/lib/center';

// Classes present in Frontend that we add for legacy interactives.
export const interactiveLegacyClasses = {
	contentInteractive: 'content--interactive',
	contentLabels: 'content__labels',
	contentLabelsNotImmersive: 'content__labels--not-immersive',
	contentMainColumn: 'content__main-column--interactive',
	headline: 'content__headline',
	labelLink: 'content__label__link',
};

// Styles expected by interactives from the Frontend days. These only load for legacy interactives
export const interactiveLegacyGlobalStyles = css`
	.gs-container {
		${center}
	}

	.${interactiveLegacyClasses.contentInteractive} {
		margin-bottom: 1rem;

		/* stylelint-disable */
		font-family: GuardianTextEgyptian, Guardian Text Egyptian Web, Georgia,
			serif;
		/* stylelint-enable */

		font-size: 1.0625rem;
		line-height: 1.5;
		font-weight: 400;

		::before,
		::after {
			box-sizing: content-box;
		}
	}

	button,
	input,
	optgroup,
	select,
	textarea {
		color: inherit;
	}

	button,
	html input[type='button'],
	input[type='reset'],
	input[type='submit'] {
		cursor: pointer;
	}

	/* Start social icon support */
	.meta__social {
		padding-top: 0.375rem;
	}

	.social__item {
		float: left;
		min-width: 2rem;
		padding: 0 0.1875rem 0.375rem 0;
		cursor: pointer;

		.inline-icon__fallback {
			display: none;
		}

		.inline-icon {
			background-color: transparent;
			border: 1px solid #dcdcdc; /* stylelint-disable-line */
			transition: fill 0.3s ease, background-color 0.3s ease;
		}

		.social-icon {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			border: 0;
			min-width: 2rem;
			max-width: 100%;
			width: auto;
			height: 2rem;
			svg {
				height: 88%;
				width: 88%;
			}
		}

		.rounded-icon {
			border-radius: 62.5rem;
			display: inline-block;
			vertical-align: middle;
			position: relative;
		}

		.centered-icon svg {
			top: 0;
			bottom: 0;
			right: 0;
			left: 0;
			margin: auto;
			position: absolute;
		}
	}

	.content__dateline {
		font-size: 0.75rem;
		line-height: 1rem;
		position: relative;
		box-sizing: border-box;
		padding-top: 0.125rem;
		margin-bottom: 0.375rem;
	}
	/* End social icon support */

	/* Typically required for ad display. */
	${until.tablet} {
		.hide-until-tablet {
			display: none;
		}
	}

	${from.tablet} {
		.mobile-only {
			display: none;
		}
	}
`;
