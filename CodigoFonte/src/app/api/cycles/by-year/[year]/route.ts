import { nextAuthOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import { NextResponse, NextRequest } from 'next/server';
import { baseUrl } from '@/utils/consts';

export async function GET(
	_request: NextRequest,
	context: { params: { year: string } },
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

	const { year } = context.params;
	const { token } = session.user;

	try {
		const response = await fetch(`${baseUrl}/api/dhedalos/v1/cycles/${year}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			console.error(`Error fetching cycles for year ${year}:`, response.status);
			return NextResponse.json(
				{
					message: `Erro ao buscar ciclos do ano ${year}`,
					status: response.status,
				},
				{ status: response.status },
			);
		}

		const data = await response.json();
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error('Error fetching cycles by year:', error);
		return NextResponse.json(
			{
				message: 'Erro ao obter os ciclos.',
				error: error instanceof Error ? error.message : 'Unknown error',
				status: 500,
			},
			{ status: 500 },
		);
	}
}
