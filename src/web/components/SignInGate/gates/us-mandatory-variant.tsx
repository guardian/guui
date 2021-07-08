import React, { Suspense } from 'react';
import { Lazy } from '@root/src/web/components/Lazy';

import type { SignInGateComponent } from '@frontend/web/components/SignInGate/types';
import { initPerf } from '@root/src/web/browser/initPerf';
import { canShowMandatoryUs } from '@root/src/web/components/SignInGate/displayRule';

const SignInGateMain = React.lazy(() => {
	const { start, end } = initPerf('SignInGateMain');
	start();
	return import(
		/* webpackChunkName: "SignInGateMain" */ '../gateDesigns/SignInGateMain'
	).then((module) => {
		end();
		return { default: module.SignInGateMain };
	});
});

export const signInGateComponent: SignInGateComponent = {
	gate: ({
		ophanComponentId,
		dismissGate,
		guUrl,
		signInUrl,
		abTest,
		isComment,
	}) => (
		<Lazy margin={300}>
			<Suspense fallback={<></>}>
				<SignInGateMain
					ophanComponentId={ophanComponentId}
					dismissGate={dismissGate}
					guUrl={guUrl}
					signInUrl={signInUrl}
					abTest={abTest}
					isComment={isComment}
					isMandatory={true}
				/>
			</Suspense>
		</Lazy>
	),
	canShow: canShowMandatoryUs,
};
