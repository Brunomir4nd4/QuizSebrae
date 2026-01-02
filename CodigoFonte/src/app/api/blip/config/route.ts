import { NextResponse } from 'next/server';

export async function GET() {
    const appKey = process.env.BLIP_APP_KEY;
    if (!appKey) {
        return NextResponse.json({ error: 'BLIP_APP_KEY not set' }, { status: 500 });
    }

    return NextResponse.json({ appKey });
}
