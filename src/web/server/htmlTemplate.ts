import resetCSS from /* preval */ '@root/src/lib/reset-css';
import autoFoft from /* preval */ '@root/src/lib/auto-foft';
import { getFontsCss } from '@root/src/lib/fonts-css';
import { getStatic, CDN } from '@root/src/lib/assets';
import { brandBackground } from '@guardian/src-foundations/palette';
import he from 'he';

export const htmlTemplate = ({
    title = 'The Guardian',
    description,
    linkedData,
    priorityScriptTags,
    lowPriorityScriptTags,
    css,
    html,
    windowGuardian,
    fontFiles = [],
    ampLink,
    openGraphData,
    twitterData,
    keywords,
}: {
    title?: string;
    description: string;
    linkedData: object;
    priorityScriptTags: string[];
    lowPriorityScriptTags: string[];
    css: string;
    html: string;
    fontFiles?: string[];
    windowGuardian: string;
    ampLink?: string;
    openGraphData: { [key: string]: string };
    twitterData: { [key: string]: string };
    keywords: string;
}) => {
    const favicon =
        process.env.NODE_ENV === 'production'
            ? 'favicon-32x32.ico'
            : 'favicon-32x32-dev-yellow.ico';

    const fontPreloadTags = fontFiles.map(
        (fontFile) =>
            `<link rel="preload" href="${getStatic(
                fontFile,
            )}" as="font" crossorigin>`,
    );

    const generateMetaTags = (
        dataObject: { [key: string]: string },
        attributeName: 'name' | 'property',
    ) => {
        if (dataObject) {
            return Object.entries(dataObject)
                .map(
                    ([id, value]) =>
                        `<meta ${attributeName}="${id}" content="${value}"/>`,
                )
                .join('\n');
        }
        return '';
    };

    const openGraphMetaTags = generateMetaTags(openGraphData, 'property');

    // Opt out of having information from our website used for personalization of content and suggestions for Twitter users, including ads
    // See https://developer.twitter.com/en/docs/twitter-for-websites/webpage-properties/overview
    const twitterSecAndPrivacyMetaTags = `<meta name="twitter:dnt" content="on">`;

    const twitterMetaTags = generateMetaTags(twitterData, 'name');

    // Duplicated prefetch and preconnect tags from DCP:
    // Documented here: https://github.com/guardian/frontend/pull/12935
    // Preconnect should be used for the most crucial third party domains
    // "use preconnect when you know for sure that you’re going to be accessing a resource"
    // - https://www.smashingmagazine.com/2019/04/optimization-performance-resource-hints/
    // DNS-prefetch should be used for other third party domains that we are likely to connect to but not sure (ads)
    // Preconnecting to too many URLs can reduce page performance
    // DNS-prefetch can also be used as a fallback for IE11
    // More information on preconnecting:
    // https://css-tricks.com/using-relpreconnect-to-establish-network-connections-early-and-increase-performance/
    // More information on prefetching:
    // https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch
    const staticPreconnectUrls = [
        `${CDN}`,
        `https://i.guim.co.uk`,
        `https://j.ophan.co.uk`,
        `https://ophan.theguardian.com`,
    ];

    const staticPrefetchUrls = [
        ...staticPreconnectUrls,
        `https://api.nextgen.guardianapps.co.uk`,
        `https://hits-secure.theguardian.com`,
        `https://interactive.guim.co.uk`,
        `https://ipv6.guim.co.uk`,
        `https://phar.gu-web.net`,
        `https://static.theguardian.com`,
        `https://support.theguardian.com`,
    ];

    const preconnectTags = staticPreconnectUrls.map(
        (src) => `<link rel="preconnect" href="${src}">`,
    );

    const prefetchTags = staticPrefetchUrls.map(
        (src) => `<link rel="dns-prefetch" href="${src}">`,
    );

    return `<!doctype html>
        <html lang="en">
            <head>
                <title>${title}</title>
                <meta name="description" content="${he.encode(description)}" />
                <meta charset="utf-8">

                <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
                <meta name="theme-color" content="${brandBackground.primary}" />
                <link rel="icon" href="https://static.guim.co.uk/images/${favicon}">

                ${preconnectTags.join('\n')}
                ${prefetchTags.join('\n')}

                <script type="application/ld+json">
                    ${JSON.stringify(linkedData)}
                </script>

                <!-- TODO make this conditional when we support more content types -->
                ${ampLink ? `<link rel="amphtml" href="${ampLink}">` : ''}

                ${fontPreloadTags.join('\n')}

                ${openGraphMetaTags}

                ${twitterSecAndPrivacyMetaTags}

                ${twitterMetaTags}

                <script>
                    window.guardian = ${windowGuardian};
                    window.guardian.queue = []; // Queue for functions to be fired by polyfill.io callback
                </script>

                <script type="module">
                    window.guardian.mustardCut = true;
                </script>

                <script nomodule>
                    // Browser fails mustard check
                    window.guardian.mustardCut = false;
                </script>

                <script>
                    // this is a global that's called at the bottom of the pf.io response,
                    // once the polyfills have run. This may be useful for debugging.
                    // mainly to support browsers that don't support async=false or defer
                    function guardianPolyfilled() {
                        window.guardian.polyfilled = true;
                        if (window.guardian.mustardCut === false) {
                            window.guardian.queue.forEach(function(startup) { startup() })
                        }
                    }

                    // We've got contracts to abide by with the Ophan tracker
                    // Setting pageViewId here ensures we're not getting race-conditions at all
                    window.guardian.config.ophan = {
                        // This is duplicated from
                        // https://github.com/guardian/ophan/blob/master/tracker-js/assets/coffee/ophan/transmit.coffee
                        // Please do not change this without talking to the Ophan project first.
                        pageViewId:
                            new Date().getTime().toString(36) +
                            'xxxxxxxxxxxx'.replace(/x/g, function() {
                                return Math.floor(Math.random() * 36).toString(36);
                            }),
                    };
                </script>

                <script>
                    // Set the browserId from the bwid cookie on the ophan object created above
                    // This will need to be replaced later with an async request to an endpoint
                    (function (window, document) {

                        function getCookieValue(name) {
                            var nameEq = name + "=",
                                cookies = document.cookie.split(';'),
                                value = null;
                            cookies.forEach(function (cookie) {
                                while (cookie.charAt(0) === ' ') {
                                    cookie = cookie.substring(1, cookie.length);
                                }
                                if (cookie.indexOf(nameEq) === 0) {
                                    value = cookie.substring(nameEq.length, cookie.length);
                                }
                            });
                            return value;
                        }

                        window.guardian.config.ophan.browserId = getCookieValue("bwid");

                    })(window, document);
                </script>

                <noscript>
                    <img src="https://sb.scorecardresearch.com/p?c1=2&c2=6035250&cv=2.0&cj=1&cs_ucfr=0&comscorekw=${keywords}" />
                </noscript>
                ${[...priorityScriptTags].join('\n')}
                <style data-auto-foft-fonts>${getFontsCss()}</style>
                <script>
                // mark: PswXqO - keep these in sync with preloads
                // Using https://github.com/guardian/auto-foft
                // and fonts from https://github.com/guardian/fonts
                // We load the regular weight, non-italic versions of body
                // fonts, and the bold and medium weights of headlines.
                // The weightings are described in 
 				// https://theguardian.design/2a1e5182b/p/930d69-typography
                window.autoFoft = {
                    isCritical: function (font) {
                        switch (font.family) {
                            case 'GuardianTextEgyptian':
                            case 'Guardian Text Egyptian Web':
                            case 'GuardianTextSans':
                            case 'Guardian Text Sans Web':
                                return (font.weight === 'normal' || font.weight === '400') && 
                                    font.style === 'normal';
                            case 'GH Guardian Headline':
                            case 'Guardian Egyptian Web':
                                return (font.weight === '500' || font.weight === '700') &&
                                    font.style === 'normal';
                            default:
                                return false;
                        }
                    }
                }
                ${autoFoft}
                </script>
                <style>${resetCSS}${css}</style>
            </head>

            <body>
                <div id="react-root"></div>
                ${html}
                ${[...lowPriorityScriptTags].join('\n')}
            </body>
        </html>`;
};
