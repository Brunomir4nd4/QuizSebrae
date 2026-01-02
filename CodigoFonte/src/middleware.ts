import { NextRequest, NextResponse } from 'next/server';

export const middleware = async (request: NextRequest) => {
	const response = NextResponse.next();

	const allowedPaths = [
		'/maintenance',
		'/fonts',
		'/images',
		'/layout',
		'/loading',
		'/not-found',
	];

	if (
		!allowedPaths.some((path) => request.url.includes(path)) &&
		response.status >= 500 &&
		response.status < 600
	) {
		return NextResponse.redirect(new URL('/maintenance', request.url));
	}
	return response;
};
