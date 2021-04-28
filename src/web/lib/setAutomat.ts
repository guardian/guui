import React from 'react';
import * as preact from 'preact';
import * as emotion from 'emotion';
import * as emotionTheming from 'emotion-theming';
import * as emotionReact from '@emotion/react';
import * as emotionReactJsxRuntime from '@emotion/react/jsx-runtime';
import * as emotionCore from '@emotion/core';

let hasAutomatBeenSet = false;

export const setAutomat = () => {
	if (!hasAutomatBeenSet) {
		window.guardian.automat = {
			react: React,
			preact,
			emotionCore,
			emotionReact,
			emotionReactJsxRuntime,
			emotionTheming,
			emotion,
		};
		hasAutomatBeenSet = true;
	}
};
