import { nextAuthOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import { NextResponse, NextRequest } from 'next/server';
import { baseUrl } from '@/utils/consts';

export async function POST(
    request: NextRequest,
    context: { params: { enroll_id: string } },
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

    const { enroll_id } = context.params;
    const { token } = session.user;

    try {
        const { reason } = await request.json();

        const response = await fetch(`${baseUrl}/api/dhedalos/v1/enroll/cancel/${enroll_id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason }),
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(
                `Erro ao cancelar matrícula ${enroll_id}:`,
                response.status,
            );
            return NextResponse.json(
                {
                    message: `Erro ao cancelar matrícula ${enroll_id}`,
                    status: response.status,
                },
                { status: response.status },
            );
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Erro ao cancelar matrícula:', error);
        return NextResponse.json(
            {
                message: 'Erro ao cancelar matrícula.',
                error: error instanceof Error ? error.message : 'Unknown error',
                status: 500,
            },
            { status: 500 },
        );
    }
}
