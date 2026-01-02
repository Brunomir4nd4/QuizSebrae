import type { Metadata } from 'next';
import './globals.css';
import localFont from 'next/font/local';
import NextAuthSessionProvider from './providers/SessionProvider';
import { Provider } from '@/theme/Provider.component';
import { GoogleAnalytics } from '@next/third-parties/google';
import DatadogStart from './start/DatadogStart';
import Script from 'next/script';

const ampleAlt = localFont({
	src: [
		{
			path: '../../public/fonts/AmpleAltBold/font.woff2',
			weight: '700',
		},
		{
			path: '../../public/fonts/AmpleAltMedium/font.woff2',
			weight: '500',
		},
		{
			path: '../../public/fonts/AmpleAltRegular/font.woff2',
			weight: '400',
		},
		{
			path: '../../public/fonts/AmpleAltLight/font.woff2',
			weight: '300',
		},
		{
			path: '../../public/fonts/AmpleAltExtraLight/font.woff2',
			weight: '200',
		},
		{
			path: '../../public/fonts/AmpleAltThin/font.woff2',
			weight: '100',
		},
	],
});

const metadataSiteName = process.env.METADATA_SITE_NAME || 'Hub';
const metadataDescription =
	process.env.METADATA_DESCRIPTION || 'Aprenda, transforme e se desenvolva.';
const metadataKeywords =
	process.env.METADATA_KEYWORDS ||
	'plataforma, aulas, curso gratuito, para iniciantes, ead, online, ao vivo, como iniciar, começar do zero, como fazer, redes sociais, conteúdo, com certificado, como estudar';

const projectName = process.env.PROJECT_NAME || '';
const privacyPolicyUrl = process.env.DHEDALOS_PRIVACY_POLICY || '';

const analyticsGoogleId = process.env.ANALYTICS_GOOGLE_ID || '';

// Datadog
const APP_VERSION = process.env.APP_VERSION;
const API_URL = process.env.API_URL;
const DATADOG_SITE = 'datadoghq.com';
const DATADOG_SESSION_SAMPLE_RATE = 100;
const DATADOG_ENV = process.env.DATADOG_ENV;
const DATADOG_SERVICE = process.env.DATADOG_SERVICE;
const DATADOG_CLIENT_ID = process.env.DATADOG_CLIENT_ID;
const DATADOG_CLIENT_TOKEN = process.env.DATADOG_CLIENT_TOKEN;

export const metadata: Metadata = {
	title: metadataSiteName,
	description: metadataDescription,
	keywords: metadataKeywords,
	robots: 'index, follow',
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='pt-br'>
			<link rel='manifest' href='/site.webmanifest' />
			<body className='bg-white text-black'>
				<Script
					id='theme-handler'
					strategy='beforeInteractive'
					dangerouslySetInnerHTML={{
						__html: `
              globalThis.projectName = '${projectName}';
              globalThis.privacyPolicyUrl = '${privacyPolicyUrl}';
              `,
					}}
				/>
				<DatadogStart
					appVersion={APP_VERSION}
					apiUrl={API_URL}
					site={DATADOG_SITE}
					env={DATADOG_ENV || ''}
					service={DATADOG_SERVICE || ''}
					clientId={DATADOG_CLIENT_ID || ''}
					clientToken={DATADOG_CLIENT_TOKEN || ''}
					sessionSampleRate={DATADOG_SESSION_SAMPLE_RATE}
				/>
				<main className={`${ampleAlt.className}`}>
					<Provider fontFamily={ampleAlt.style.fontFamily.split(',')}>
						<NextAuthSessionProvider>{children}</NextAuthSessionProvider>
					</Provider>
				</main>
			</body>
			<GoogleAnalytics gaId={analyticsGoogleId} />
		</html>
	);
}
