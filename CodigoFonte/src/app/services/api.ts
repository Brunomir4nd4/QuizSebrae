/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	baseUrl,
	globalHeaders,
	calendar_url,
	app_key,
	submissions_url,
	submissions_app_key,
} from '@/utils/consts';

export async function proxyRequest(
	endpoint: string,
	method: string = 'GET',
	body?: any,
	responseType: 'json' | 'blob' = 'json',
) {
	const isFormData =
		typeof FormData !== 'undefined' && body instanceof FormData;

	const options =
		method === 'GET'
			? {
					method: method,
					headers: globalHeaders,
				}
			: {
					method,
					headers: isFormData
						? { Authorization: globalHeaders.Authorization }
						: {
								...globalHeaders,
								'Content-Type': 'application/json',
							},
					body: isFormData ? body : JSON.stringify(body),
				};

	if (method !== 'GET') {
		try {
			const response = await fetch(`/api${endpoint}`, options);
			if (!response.ok) {
				console.error(`Error fetching data ${endpoint} :`, response.status);
				throw new Error(`Error fetching data ${endpoint} : ${response.status}`);
			}
			return await response.json();
		} catch (error: any) {
			console.error(`Error fetching data: ${endpoint}`, error);
			throw error;
		}
	}

	let retries = 3;
	const delay = 1000;

	while (retries > 0) {
		try {
			retries--;
			const response = await fetch(`/api${endpoint}`, options);
			if (!response.ok) {
				console.error(`Error fetching data y ${endpoint} :`, response.status);
				if (retries > 0) {
					console.log(`Retrying in ${delay} milliseconds...`);
					await new Promise((resolve) => setTimeout(resolve, delay));
				} else {
					return await response.json();
				}
			} else {
				if (responseType === 'blob') {
					return await response.blob();
				}

				return await response.json();
			}
		} catch (error: any) {
			console.log(retries);
			console.error(`Error fetching data x: ${endpoint}`, error);
			retries--; // Decrement retries
			if (retries > 0) {
				console.log(`Retrying in ${delay} milliseconds...`);
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}
	}

	console.error(`Maximum retries exceeded for fetching data: ${endpoint}`);
}

export async function wpRequest(
	endpoint: string,
	token: string,
	method: string = 'GET',
	nextOptions: any = {},
	body?: any,
) {
	const options: RequestInit = {
		method: method,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: body ? JSON.stringify(body) : undefined,
		next: nextOptions,
	};

	try {
		const response = await fetch(`${baseUrl}/api${endpoint}`, options);
		// if (!response.ok) {
		// 	console.error(`Error fetching data ${endpoint} :`, response.status);
		// 	return {
		// 		status: 'error',
		// 		message: `Failed with status: ${response.status}`,
		// 	};
		// }
		const data = await response.json();

		if (!response.ok) {
			console.error(`Error fetching data ${endpoint} :`, data);
			if (data.status && data.message) {
				return data;
			}
			throw new Error(`Failed with status: ${response.status}`);
		}
		return data;
	} catch (error: any) {
		console.error('Error fetching data:', error);
		return { status: 'error', message: error.message };
	}
}

export async function scheduleRequest(
	endpoint: string,
	method: string = 'GET',
	body?: any,
	nextOptions: any = {},
) {
	const options = {
		method: method,
		body: body ? JSON.stringify(body) : null,
		headers: {
			'Content-Type': 'application/json',
			Authorization: app_key ?? '',
		},
		next: nextOptions,
	};
	try {
		const response = await fetch(`${calendar_url}${endpoint}`, options);
		if (!response.ok) {
			console.error(
				`Error fetching data ${calendar_url}${endpoint} :`,
				response.status,
			);
		}
		return await response.json();
	} catch (error: any) {
		console.error('Error fetching data:', error);
	}
}

export async function submissionRequest(
	endpoint: string,
	method: string = 'GET',
	body?: any,
	nextOptions: any = {},
) {
	const options = {
		method: method,
		body: body ? JSON.stringify(body) : null,
		headers: {
			'Content-Type': 'application/json',
			Authorization: submissions_app_key ?? '',
		},
		next: nextOptions,
	};
	try {
		const response = await fetch(`${submissions_url}${endpoint}`, options);
		if (!response.ok) {
			console.error(
				`Error fetching data ${submissions_url}${endpoint} :`,
				response.status,
			);
		}
		return await response.json();
	} catch (error: any) {
		console.error('Error fetching data:', error);
	}
}
