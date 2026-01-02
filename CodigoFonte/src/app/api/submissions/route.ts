import { submissions_app_key, submissions_url } from '@/utils/consts';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	console.log('tamoaqui');
	try {
		const formData = await req.formData();

		const authHeader = req.headers.get('Authorization');
		const token = authHeader || submissions_app_key || '';

		const response = await fetch(`${submissions_url}/submissions`, {
			method: 'POST',
			body: formData,
			headers: {
				Authorization: token,
				Accept: 'application/json',
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error('Validation errors:', errorData);
			return NextResponse.json(
				{ error: 'Erro ao criar submissão', details: errorData },
				{ status: response.status },
			);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error('Erro na rota /api/submission:', error);
		return NextResponse.json(
			{ error: 'Erro interno do servidor' },
			{ status: 500 },
		);
	}
}

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);

		const queryParams = new URLSearchParams();

		const allowedParams = [
			'course_id',
			'class_id',
			'participant_id',
			'facilitator_id',
			'status',
			'order',
		];

		allowedParams.forEach((param) => {
			const value = searchParams.get(param);
			if (value) {
				queryParams.append(param, value);
			}
		});

		const url = `${submissions_url}/submissions?${queryParams.toString()}`;

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: submissions_app_key ?? '',
				Accept: 'application/json',
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error('Erro na API externa:', errorData);
			return NextResponse.json(
				{ error: 'Erro ao buscar submissões', details: errorData },
				{ status: response.status },
			);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error('Erro no GET /api/submission:', error);
		return NextResponse.json(
			{ error: 'Erro interno do servidor' },
			{ status: 500 },
		);
	}
}
