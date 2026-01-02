import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: { path: string[] } },
) {
	try {
		const filePath = params.path.join('/');

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

		if (!response.ok) {
			return NextResponse.json(
				{ error: 'Arquivo não encontrado' },
				{ status: response.status },
			);
		}

		if (!response.body) {
			return NextResponse.json(
				{ error: 'Erro ao processar o arquivo' },
				{ status: 500 },
			);
		}

		const contentType =
			response.headers.get('content-type') || 'application/octet-stream';
		const contentLength = response.headers.get('content-length');

		const resHeaders = new Headers();
		resHeaders.set('Content-Type', contentType);

		if (contentLength) {
			resHeaders.set('Content-Length', contentLength);
		}

		resHeaders.set('Cache-Control', 'public, max-age=3600');

		return new NextResponse(response.body, {
			status: 200,
			headers: resHeaders,
		});
	} catch (error) {
		console.error('Erro ao buscar arquivo:', error);
		return NextResponse.json(
			{ error: 'Erro inesperado ao buscar arquivo' },
			{ status: 500 },
		);
	}
}
