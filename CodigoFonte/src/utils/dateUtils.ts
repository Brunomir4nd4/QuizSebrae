export const EXTRA_DAYS = 5;

/**
 * Verifica se a data + EXTRA_DAYS ainda não passou
 * @param brDate Data no formato "dd/mm/aaaa"
 * @returns true se a data somada ainda não passou, false se já passou
 */
export function isDateWithinLimit(brDate: string): boolean {
	const [day, month, year] = brDate.split('/').map(Number);
	if (!day || !month || !year) return false;

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const inputDate = new Date(year, month - 1, day);
	inputDate.setHours(0, 0, 0, 0);

	// Soma os dias extras
	const limitDate = new Date(inputDate);
	limitDate.setDate(limitDate.getDate() + EXTRA_DAYS);

	return limitDate > today;
}
