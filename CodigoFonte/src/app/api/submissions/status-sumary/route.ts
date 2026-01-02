import { NextRequest, NextResponse } from 'next/server';
import { submissions_app_key, submissions_url } from '@/utils/consts';

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);

		const queryParams = new URLSearchParams();

		const allowedParams = ['class_id', 'facilitator_id', 'cycle_id'];

		allowedParams.forEach((param) => {
			const value = searchParams.get(param);
			if (value) {
				queryParams.append(param, value);
			}
		});

		const url = `${submissions_url}/submissions/status-sumary?${queryParams.toString()}`;

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
