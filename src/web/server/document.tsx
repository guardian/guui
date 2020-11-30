import React from 'react';
import { extractCritical } from 'emotion-server';
import { renderToString } from 'react-dom/server';
import { cache } from 'emotion';
import { CacheProvider } from '@emotion/core';

import { escapeData } from '@root/src/lib/escapeData';
import { getDist } from '@root/src/lib/assets';

import { makeWindowGuardian } from '@root/src/model/window-guardian';
import { DecideLayout } from '../layouts/DecideLayout';
import { htmlTemplate } from './htmlTemplate';

interface RenderToStringResult {
    html: string;
    css: string;
    ids: string[];
}

const generateScriptTags = (
    scripts: Array<{ src: string; module?: boolean }>,
    scriptAttrs: string = '',
) =>
    scripts.reduce((scriptTags, script) => {
        if (script.module) {
            scriptTags.push(
                `<script ${scriptAttrs} type="module" src="${getDist({
                    path: script.src,
                    legacy: false,
                })}"></script>`,
            );
            scriptTags.push(
                `<script ${scriptAttrs} nomodule src="${getDist({
                    path: script.src,
                    legacy: true,
                })}"></script>`,
            );
        } else {
            scriptTags.push(`<script defer src="${script.src}"></script>`);
        }
        return scriptTags;
    }, [] as string[]);

export const document = ({ data }: Props) => {
    const { CAPI, NAV, linkedData } = data;
    const title = `${CAPI.headline} | ${CAPI.sectionLabel} | The Guardian`;
    const { html, css, ids: cssIDs }: RenderToStringResult = extractCritical(
        renderToString(
            // TODO: CacheProvider can be removed when we've moved over to using @emotion/core
            <CacheProvider value={cache}>
                <React.StrictMode>
                    <DecideLayout CAPI={CAPI} NAV={NAV} />
                </React.StrictMode>
            </CacheProvider>,
        ),
    );

    /**
     * Preload the critical woff2 font files
     * mark: PswXqO - keep these in sync with autoFoft rules
     */
    const fontFiles = [
        'fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Regular.woff2',
        'fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-Regular.woff2',
        'fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Medium.woff2',
        'fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Bold.woff2',
    ];

    const polyfillIO =
        'https://assets.guim.co.uk/polyfill.io/v3/polyfill.min.js?rum=0&features=es6,es7,es2017,es2018,es2019,default-3.6,HTMLPictureElement,IntersectionObserver,IntersectionObserverEntry,fetch,NodeList.prototype.forEach&flags=gated&callback=guardianPolyfilled&unknown=polyfill&cacheClear=1';

    /**
     * The highest priority scripts.
     * These scripts have a considerable impact on site performance.
     * Only scripts critical to application execution may go in here.
     * Please talk to the dotcom platform team before adding more.
     * Scripts will be executed in the order they appear in this array
     */
    const priorityScriptTags = generateScriptTags(
        [
            { src: polyfillIO },
            { src: 'ophan.js', module: true },
            CAPI.config && { src: CAPI.config.commercialBundleUrl },
            { src: 'sentry.js', module: true },
            { src: 'dynamicImport.js', module: true },
            { src: 'react.js', module: true },
        ].filter(Boolean),
        'defer',
    );

    /**
     * Low priority scripts. These scripts will be requested
     * asynchronously after the main HTML has been parsed. Execution
     * order is not guaranteed. It is even possible that these execute
     * *before* the high priority scripts, although this is very
     * unlikely.
     */
    const lowPriorityScriptTags = generateScriptTags(
        [
            { src: 'https://www.google-analytics.com/analytics.js' },
            { src: 'ga.js', module: true },
            { src: 'lotame.js', module: true },
            { src: 'atomIframe.js', module: true },
            { src: 'embedIframe.js', module: true },
            { src: 'newsletterEmbedIframe.js', module: true },
        ],
        'async',
    );

    /**
     * We escape windowGuardian here to prevent errors when the data
     * is placed in a script tag on the page
     */
    const windowGuardian = escapeData(
        JSON.stringify(makeWindowGuardian(data, cssIDs)),
    );

    const ampLink = `https://amp.theguardian.com/${data.CAPI.pageId}`;

    const { openGraphData } = CAPI;
    const { twitterData } = CAPI;
    const keywords =
        typeof CAPI.config.keywords === 'undefined' ||
        CAPI.config.keywords === 'Network Front'
            ? ''
            : CAPI.config.keywords;

    return htmlTemplate({
        linkedData,

        priorityScriptTags,

        lowPriorityScriptTags,

        css,
        html,
        fontFiles,
        title,
        description: CAPI.trailText,
        windowGuardian,
        ampLink,
        openGraphData,
        twitterData,
        keywords,
    });
};
