import '../webpackPublicPath';
import { startup } from '@root/src/web/browser/startup';

import { isAdBlockInUse } from './detectAdBlocker';

const init = async (): Promise<void> => {
	// Sentry lets you configure sampleRate to reduce the volume of events sent
	// but this filter only happens _after_ the library is loaded. The Guardian
	// measures page views in the billions so we only want to log 1% of errors that
	// happen but if we used sampleRate to do this we'd be needlessly downloading
	// Sentry 99% of the time. So instead we just do some basic math here
	// and use that to prevent the Sentry script from ever loading.
	const randomCentile = Math.floor(Math.random() * 100) + 1; // A number between 1 - 100
	if (randomCentile <= 99) {
		// 99% of the time we don't want to remotely log errors with Sentry and so
		// we just console them out
		window.guardian.modules.sentry.reportError = (error) => {
			// eslint-disable-next-line no-console
			console.error(error);
		};
		return; // Don't initialise Sentry
	}
	// The other 1% of the time (randomCentile === 100) we continue
	try {
		// Downloading and initiliasing Sentry is asynchronous so we need a way
		// to ensure injection only happens once and to capture any other errors that
		// might happen while this script is loading
		let injected = false;
		const queue: Error[] = [];

		// Function that gets called when an error happens before Sentry is ready
		const injectSentry = async (error?: Error) => {
			// Remember this error for later
			if (error) queue.push(error);

			// Only inject once
			if (injected) {
				return;
			}
			injected = true;

			// Make this call blocking. We are queing errors while we wait for this code to run
			// so we won't miss any and by waiting here we ensure we will never make calls we
			// expect to be blocked
			const adBlockInUse: boolean = await isAdBlockInUse();
			if (adBlockInUse) {
				// Ad Blockers prevent calls to Sentry from working so don't try to load the lib
				return;
			}

			// Load sentry.ts
			const { reportError } = await import(
				/* webpackChunkName: "sentry" */ './sentry'
			);

			// Sentry takes over control of the window.onerror and
			// window.onunhandledrejection listeners but we need to
			// manually redefine our own custom error reporting function
			window.guardian.modules.sentry.reportError = reportError;

			// Now that we have the real reportError function available,
			// send any queued errors
			while (queue.length) {
				const queuedError = queue.shift();
				if (queuedError) reportError(queuedError);
			}
		};

		// This is how we lazy load Sentry. We setup custom functions and
		// listeners to inject Sentry when an error happens
		window.onerror = (message, url, line, column, error) =>
			injectSentry(error);
		window.onunhandledrejection = (event: undefined | { reason?: any }) =>
			event && injectSentry(event.reason);
		window.guardian.modules.sentry.reportError = (error) => {
			injectSentry(error).catch((e) =>
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				console.error(`injectSentry - error: ${e}`),
			);
		};
	} catch {
		// We failed to setup Sentry :(
	}
};

startup('sentryLoader', null, init);
