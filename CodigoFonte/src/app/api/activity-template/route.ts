import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const submissionsUrl = process.env.SUBMISSIONS_URL;
		const submissionsToken = process.env.SUBMISSIONS_APP_KEY;

		if (!submissionsUrl) {
			return NextResponse.json(
				{ error: 'SUBMISSIONS_URL não configurada' },
				{ status: 500 },
			);
		}

		if (!submissionsToken) {
			return NextResponse.json(
				{ error: 'SUBMISSIONS_TOKEN não configurado' },
				{ status: 500 },
			);
		}

		const formData = await req.formData();

		const endpoint = `${submissionsUrl}/activity-template-files`;

		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				Authorization: submissionsToken,
			},
			body: formData,
		});

		if (!response.ok) {
			const errorText = await response.text();

			return NextResponse.json(
				{
					error: 'Erro ao enviar arquivo para o serviço externo',
					details: errorText,
				},
				{ status: response.status },
			);
		}

		const data = await response.json();

		return NextResponse.json(data, { status: 201 });
	} catch (error) {
		console.error('Erro no upload do template:', error);

		return NextResponse.json(
			{ error: 'Erro inesperado ao enviar o arquivo' },
			{ status: 500 },
		);
	}
}

export async function GET(req: NextRequest) {
	try {
		const submissionsUrl = process.env.SUBMISSIONS_URL;
		const submissionsToken = process.env.SUBMISSIONS_APP_KEY;

		if (!submissionsUrl) {
			return NextResponse.json(
				{ error: 'SUBMISSIONS_URL não configurada' },
				{ status: 500 },
			);
		}

		if (!submissionsToken) {
			return NextResponse.json(
				{ error: 'SUBMISSIONS_TOKEN não configurado' },
				{ status: 500 },
			);
		}

		const { searchParams } = new URL(req.url);

		const classId = searchParams.get('class_id');
		const courseId = searchParams.get('course_id');
		const cycleId = searchParams.get('cycle_id');

		if (!classId || !courseId || !cycleId) {
			return NextResponse.json(
				{ error: 'Parâmetros obrigatórios não informados' },
				{ status: 400 },
			);
		}

		const endpoint =
			`${submissionsUrl}/activity-template-files/filter` +
			`?class_id=${classId}&course_id=${courseId}&cycle_id=${cycleId}`;

		const response = await fetch(endpoint, {
			method: 'GET',
			headers: {
				Authorization: submissionsToken,
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			const errorText = await response.text();

			return NextResponse.json(
				{
					error: 'Erro ao buscar templates',
					details: errorText,
				},
				{ status: response.status },
			);
		}

		const data = await response.json();

		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error('Erro ao buscar activity templates:', error);

		return NextResponse.json(
			{ error: 'Erro inesperado ao buscar templates' },
			{ status: 500 },
		);
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const submissionsUrl = process.env.SUBMISSIONS_URL;
		const submissionsToken = process.env.SUBMISSIONS_APP_KEY;

		if (!submissionsUrl) {
			return NextResponse.json(
				{ error: 'SUBMISSIONS_URL não configurada' },
				{ status: 500 },
			);
		}

		if (!submissionsToken) {
			return NextResponse.json(
				{ error: 'SUBMISSIONS_TOKEN não configurado' },
				{ status: 500 },
			);
		}

		const { searchParams } = new URL(req.url);

		const classId = searchParams.get('class_id');
		const courseId = searchParams.get('course_id');
		const cycleId = searchParams.get('cycle_id');
		const activityId = searchParams.get('activity_id');

		if (!classId || !courseId || !cycleId || !activityId) {
			return NextResponse.json(
				{ error: 'Parâmetros obrigatórios não informados' },
				{ status: 400 },
			);
		}

		const endpoint =
			`${submissionsUrl}/activity-template-files` +
			`?class_id=${classId}` +
			`&course_id=${courseId}` +
			`&cycle_id=${cycleId}` +
			`&activity_id=${activityId}`;

		console.log(endpoint);

		const response = await fetch(endpoint, {
			method: 'DELETE',
			headers: {
				Authorization: submissionsToken,
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			const errorText = await response.text();

			return NextResponse.json(
				{
					error: 'Erro ao deletar template',
					details: errorText,
				},
				{ status: response.status },
			);
		}

		const data = await response.json();

		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error('Erro ao deletar activity template:', error);

		return NextResponse.json(
			{ error: 'Erro inesperado ao deletar template' },
			{ status: 500 },
		);
	}
}
