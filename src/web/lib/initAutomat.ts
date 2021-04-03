import React from 'react';
import * as emotion from 'emotion';
import * as emotionCore from '@emotion/core';
import * as emotionTheming from 'emotion-theming';

let isInit = false;
export const initAutomat = () => {
	if (!isInit) {
		window.guardian = window.guardian || {};
		window.guardian.automat = {
			react: React,
			preact: React, // TODO: remove and just export `react` using `preact/compat`
			emotionCore,
			emotionTheming, // TODO: remove once decoupled from Braze
			emotion, // TODO: remove in favor of emotionCore
		};
		isInit = true;
	}
};
