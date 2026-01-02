import { nextAuthOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import { NextResponse, NextRequest } from 'next/server';
import { baseUrl } from '@/utils/consts';

export async function POST(
	_request: NextRequest,
	context: { params: { enrollment_id: string } },
) {
	const session = await getServerSession(nextAuthOptions);

	if (!session) {
		return NextResponse.json(
			{
				message: 'Erro ao obter os dados do Usuário.',
				error: 'You must be logged in.',
				status: 401,
			},
			{ status: 401 },
		);
	}

	const { enrollment_id } = context.params;
	const { token } = session.user;

	try {
		const response = await fetch(
			`${baseUrl}/api/dhedalos/v1/enrollment/${enrollment_id}/request-cancellation`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				cache: 'no-store',
			},
		);

		if (!response.ok) {
			console.error(
				`Error requesting enrollment cancellation for ${enrollment_id}:`,
				response.status,
			);
			return NextResponse.json(
				{
					message: `Erro ao solicitar cancelamento da matrícula ${enrollment_id}`,
					status: response.status,
				},
				{ status: response.status },
			);
		}

		const data = await response.json();
		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error('Error requesting enrollment cancellation:', error);
		return NextResponse.json(
			{
				message: 'Erro ao solicitar cancelamento da matrícula.',
				error: error instanceof Error ? error.message : 'Unknown error',
				status: 500,
			},
			{ status: 500 },
		);
	}
}
