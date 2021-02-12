import '../webpackPublicPath';
import { startup } from '@root/src/web/browser/startup';
import { coreVitals } from './coreVitals';

const init = (): Promise<void> => {
    coreVitals();
    return Promise.resolve();
};

startup('coreVitals', null, init);
