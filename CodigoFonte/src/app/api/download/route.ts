import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);

		const filePath = searchParams.get('url');
		const fileName = searchParams.get('name') || 'arquivo';

		if (!filePath) {
			return NextResponse.json(
				{ error: 'Caminho do arquivo não fornecido' },
				{ status: 400 },
			);
		}
		const storageUrl = process.env.SUBMISSIONS_STORAGE_URL;

		if (!storageUrl) {
			return NextResponse.json(
				{ error: 'Configuração de storage não encontrada' },
				{ status: 500 },
			);
		}

		const fullUrl = `${storageUrl}/${filePath}`;
		const response = await fetch(fullUrl);

		if (!response.ok || !response.body) {
			return NextResponse.json(
				{ error: 'Erro ao baixar o arquivo.' },
				{ status: response.ok ? 500 : response.status },
			);
		}

		const contentType =
			response.headers.get('content-type') || 'application/octet-stream';

		// Reutiliza o body como stream diretamente
		const bodyStream = response.body;

		const resHeaders = new Headers();
		resHeaders.set('Content-Disposition', `attachment; filename="${fileName}"`);
		resHeaders.set('Content-Type', contentType);

		return new NextResponse(bodyStream, {
			status: 200,
			headers: resHeaders,
		});
	} catch (error) {
		console.error('Erro ao baixar o arquivo:', error);
		return NextResponse.json({ error: 'Erro inesperado.' }, { status: 500 });
	}
}
