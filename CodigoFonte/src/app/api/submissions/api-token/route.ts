import { NextRequest, NextResponse } from 'next/server';
import { submissions_app_key, submissions_url } from '@/utils/consts';

export async function GET(req: NextRequest) {
    try {
        const url = `${submissions_url}/submissions/token`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: submissions_app_key ?? '',
                Accept: 'application/json',
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro na API externa:', errorData);
            return NextResponse.json(
                { error: 'Erro ao buscar token', details: errorData },
                { status: response.status },
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Erro no GET /api/submission/api-token:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 },
        );
    }
}
