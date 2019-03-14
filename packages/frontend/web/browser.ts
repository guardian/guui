import React from 'react';
import { hydrate as hydrateCSS } from 'emotion';
import { hydrate as hydrateApp } from 'react-dom';
import 'ophan-tracker-js';
import { getRaven } from '@frontend/web/browser/raven';
import {
    init as initGa,
    sendPageView as sendGaPageView,
} from '@frontend/web/browser/ga';
import { Article } from './pages/Article';
import { ReportedError, reportError } from '@frontend/web/browser/reportError';
import { loadScript } from '@frontend/web/browser/loadScript';

if (module.hot) {
    module.hot.accept();
}

// ------------------------------

// Kick off the app
const hydrate = () => {
    const { cssIDs, data } = window.guardian.app;

    initGa();

    const container = document.getElementById('app');

    if (container) {
        /**
         * TODO: Remove conditional when Emotion's issue is resolved.
         * We're having to prevent emotion hydrating styles in the browser
         * in development mode to retain the sourceMap info. As detailed
         * in the issue raised here https://github.com/emotion-js/emotion/issues/487
         */
        if (process.env.NODE_ENV !== 'development') {
            hydrateCSS(cssIDs);
        }

        hydrateApp(React.createElement(Article, { data }), container);
    }

    sendGaPageView();
};

const initApp = () => {
    const { commercialUrl } = window.guardian.app.data.config;
    if (commercialUrl) {
        loadScript(commercialUrl)
            .then(() => {
                hydrate();
            })
            .catch(err => {
                reportError(err, {}, false);
                hydrate();
            });
    } else {
        hydrate();
    }
};

const run = () => {
    getRaven()
        .catch(err => {
            initApp();
        })
        .then(raven => {
            if (!raven) {
                return;
            }

            const oldOnError = window.onerror;

            /**
             * Make sure global onerror doesn't report errors
             * already manually reported via reportError module
             * by checking for 'reported' property
             */
            window.onerror = (
                message,
                filename,
                lineno,
                colno,
                error: ReportedError | undefined,
            ) => {
                // Not all browsers pass the error object
                if (!error || !error.reported) {
                    oldOnError(message, filename, lineno, colno, error);
                }
            };

            // Report unhandled promise rejections
            window.addEventListener('unhandledrejection', event => {
                // Prevent error output on the console:
                event.preventDefault();

                // Typecast Event to PromiseRejectionEvent for TypeScript
                const { reason } = event as PromiseRejectionEvent;
                raven.captureException(reason);
            });

            raven.context(
                {
                    tags: {
                        feature: 'initApp',
                    },
                },
                initApp,
            );
        })
        .catch(() => {
            /**
             * Raven will have reported any unhandled promise
             * rejections from this chain so return here.
             */
            return;
        });
};

/*
    We want to run `run` only after polyfill.io has initialised
    By the time this script runs, if `window.guardian.polyfilled` is true,
    meaning that polyfill.io has initialised, then we run run(), otherwise
    we stick it in window.guardian.onPolyfilled to be ran later.
*/
if (window.guardian.polyfilled) {
    run();
} else {
    window.guardian.onPolyfilled = run;
}
