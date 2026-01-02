/** @type {import('next').NextConfig} */
const nextConfig = {
	// Configuração otimizada para SSR
	output: 'standalone',
	
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
			{
				protocol: 'http',
				hostname: '**',
			},
		],
	},
	
	// Configurações para SSR
	reactStrictMode: true,
	swcMinify: true,
	
	// Configurações de timeout para build
	staticPageGenerationTimeout: 600,
	
	// Configurações experimentais para melhor performance
	experimental: {
		optimizeServerReact: true,
		serverComponentsExternalPackages: ['@jitsi/react-sdk'],
	},
	
	eslint: {
		ignoreDuringBuilds: true,
	},
	
	// Configuração para compressão
	compress: true,
	
	// Headers de segurança
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'X-Frame-Options',
						value: 'DENY',
					},
					{
						key: 'X-XSS-Protection',
						value: '1; mode=block',
					},
				],
			},
		];
	},
};

module.exports = nextConfig;
