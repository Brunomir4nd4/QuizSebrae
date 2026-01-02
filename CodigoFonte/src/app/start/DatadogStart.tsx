'use client';

import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';
import { useEffect } from 'react';

interface DatadogStartProps {
	appVersion?: string;
	apiUrl?: string;
	site: string;
	env: string;
	service: string;
	clientId: string;
	clientToken: string;
	sessionSampleRate?: number;
}

// Global flag to prevent multiple initializations
let isDatadogInitialized = false;

export default function DatadogStart({
	appVersion,
	apiUrl,
	site,
	env,
	service,
	clientId,
	clientToken,
	sessionSampleRate,
}: DatadogStartProps) {
	useEffect(() => {
		// Check if already initialized globally
		if (isDatadogInitialized) {
			return;
		}

		isDatadogInitialized = true;

		datadogRum.init({
			applicationId: clientId ?? '',
			clientToken: clientToken ?? '',
			site: site,
			service: service,
			env: env,
			version: appVersion ?? '0.0.0',
			sessionSampleRate: sessionSampleRate,
			sessionReplaySampleRate: 20,
			trackUserInteractions: true,
			trackResources: true,
			trackLongTasks: true,
			defaultPrivacyLevel: 'mask-user-input',
			allowedTracingUrls: [
				{
					match: apiUrl ?? '',
					propagatorTypes: ['tracecontext'],
				},
			],
		});

		datadogLogs.init({
			clientToken: clientToken ?? '',
			env: env,
			version: appVersion ?? '0.0.0',
			site: site,
			forwardErrorsToLogs: true,
			sessionSampleRate: sessionSampleRate,
		});
	}, []); // Empty dependency array ensures it runs only once

	return <></>;
}
