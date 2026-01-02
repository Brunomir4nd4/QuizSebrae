import { NextResponse } from 'next/server';

export async function GET() {
	// Verificação de vitalidade simples - confirma se a aplicação está respondendo
	return NextResponse.json(
		{
			status: 'ok',
			timestamp: new Date().toISOString(),
		},
		{ status: 200 }
	);
}