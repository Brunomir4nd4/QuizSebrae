import { NextResponse } from 'next/server';

export async function GET() {
	const appKey = process.env.PROJECT_NAME;
	if (!appKey) {
		return NextResponse.json(
			{ error: 'PROJECT_NAME not set' },
			{ status: 500 },
		);
	}

	return NextResponse.json({ appKey });
}
