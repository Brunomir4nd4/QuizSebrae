import { NextResponse } from 'next/server';

export async function GET() {
	try {
		// Verificação de prontidão - confirma se a aplicação está pronta para receber tráfego
		// Pode incluir verificações de dependências externas se necessário
		
		return NextResponse.json(
			{
				status: 'ready',
				timestamp: new Date().toISOString(),
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{
				status: 'not_ready',
				timestamp: new Date().toISOString(),
			},
			{ status: 503 }
		);
	}
}