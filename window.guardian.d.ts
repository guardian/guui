import { WindowGuardianConfig } from '@root/src/model/window-guardian';
import { ReaderRevenueDevUtils } from '@root/src/web/lib/readerRevenueDevUtils';

declare global {
    /* ~ Here, declare things that go in the global namespace, or augment
     *~ existing declarations in the global namespace
     */
    interface Window {
        guardian: {
            app: {
                data: {
                    GA: { [key: string]: any }
                    [key: string]: any
                    CAPI: CAPIBrowserType
                };
                cssIDs: string[];

            };
            mustardCut: boolean;
            polyfilled: boolean;
            onPolyfilled: () => void;
            queue: Array<() => void>;
            config: WindowGuardianConfig;
            ophan: {
                setEventEmitter: () => void; // We don't currently have a custom eventEmitter on DCR - like 'mediator' in Frontend.
                trackComponentAttention: (
                    name: string,
                    el: Element,
                    visiblityThreshold: number,
                ) => void;
                record: ({}) => void;
                viewId: string;
                pageViewId: string;
            };
            modules: {
                sentry: {
                    reportError: (error: Error, feature: string) => void;
                };
            };
            // TODO expose as type from Automat client lib
            automat: {
				[key: string ]: any;
            };
            readerRevenue: ReaderRevenueDevUtils;
            gaPath:  string;
        };
        GoogleAnalyticsObject: string;
        ga: UniversalAnalytics.ga | null;
        /**
         * ES6 module import, possibly polyfilled depending on the current
         * browser. There are three categories:
         *
         * 1. Full support out of the box
         * 2. ES6 module support but not dynamic modules
         * 3. No module support
         *
         * This gives support across all 3 cases.
         */
        guardianPolyfilledImport: (url: string) => Promise<any>; // can't be nested beyond top level
        Cypress: any; // for checking if running within cypress
    }
}
/* ~ this line is required as per TypeScript's global-modifying-module.d.ts instructions */
export {};
