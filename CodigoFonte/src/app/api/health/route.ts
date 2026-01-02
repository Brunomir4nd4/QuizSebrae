import { NextResponse } from 'next/server';

export async function GET() {
	try {
		// Verificações básicas de saúde da aplicação
		const healthStatus = {
			status: 'healthy',
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
			version: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
			node_version: process.version,
			memory: {
				used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
				total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
			},
			env: process.env.NODE_ENV || 'unknown',
		};

		return NextResponse.json(healthStatus, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{
				status: 'unhealthy',
				timestamp: new Date().toISOString(),
				error: 'Internal server error',
			},
			{ status: 500 }
		);
	}
}