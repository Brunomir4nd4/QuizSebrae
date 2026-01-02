import { submissions_app_key, submissions_url } from '@/utils/consts';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
	try {
		const formData = await req.formData();
		const submissionId = formData.get('id');

		if (!submissionId) {
			return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });
		}

		const apiForm = new FormData();
		apiForm.append('status', formData.get('status')!);
		apiForm.append('score', formData.get('score')!);
		apiForm.append('facilitator_comment', formData.get('facilitator_comment')!);
		apiForm.append('participant_email', formData.get('participant_email')!);
		apiForm.append('participant_name', formData.get('participant_name')!);
		apiForm.append('course_name', formData.get('course_name')!);
		const response = await fetch(
			`${submissions_url}/submissions/${submissionId}`,
			{
				method: 'POST',
				body: apiForm,
				headers: {
					Authorization: submissions_app_key ?? '',
					Accept: 'application/json',
				},
			},
		);

		if (!response.ok) {
			const err = await response.json();
			return NextResponse.json(
				{ error: 'Erro', details: err },
				{ status: response.status },
			);
		}

		return NextResponse.json(await response.json());
	} catch (error) {
		return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const submissionId = params.id;

		if (!submissionId) {
			return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });
		}

		const body = await req.json();

		const response = await fetch(
			`${submissions_url}/submissions/${submissionId}`,
			{
				method: 'DELETE',
				headers: {
					Authorization: submissions_app_key ?? '',
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			},
		);

		if (!response.ok) {
			const err = await response.json();
			return NextResponse.json(
				{ error: 'Erro', details: err },
				{ status: response.status },
			);
		}

		return NextResponse.json(await response.json());
	} catch (error) {
		return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
	}
}
