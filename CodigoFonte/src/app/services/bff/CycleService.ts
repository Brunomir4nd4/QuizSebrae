/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cycle } from '@/types/ICycles';

/**
 * Obtém os ciclos de um determinado ano através da API Route.
 * @param year - O ano para filtrar os ciclos
 * @returns Uma Promise que resolve em um array de ciclos
 */
export const getCyclesByYear = async (
	year: string | number,
): Promise<Cycle[]> => {
	try {
		const response = await fetch(`/api/cycles/by-year/${year}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			console.error(`Error fetching cycles for year ${year}:`, response.status);
			throw new Error(`Failed to fetch cycles: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error in getCyclesByYear:', error);
		throw error;
	}
};

/**
 * Obtém todos os ciclos disponíveis através da API Route.
 * @returns Uma Promise que resolve em um array de ciclos
 */
export const getCycles = async (): Promise<Cycle[]> => {
	try {
		const response = await fetch(`/api/cycles`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			console.error('Error fetching cycles:', response.status);
			throw new Error(`Failed to fetch cycles: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error in getCycles:', error);
		throw error;
	}
};
