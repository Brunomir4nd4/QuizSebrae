import { DateTime } from 'luxon';

/**
 * Gets an object containing day name, day number, and formatted time from a date string.
 * @param dateString - The input date string in the format 'yyyy-MM-dd'.
 * @returns An object with dayName, dayNumber, and hour properties.
 */
export const getDateObject = (dateString: string) => {
	// Parse the input date string using Luxon
	const parsedDate = DateTime.fromFormat(
		dateString,
		isDateFormatWithTime(dateString),
	);

	// Get the day name in Portuguese
	const dayName = parsedDate
		.setLocale('pt')
		.toLocaleString({ weekday: 'short' });

	// Get the day number
	const dayNumber = parsedDate.day.toString();

	// Get the day number
	const mounthName = parsedDate.toLocaleString({ month: 'long' });

	// Get the formatted time (hours and minutes) in 24-hour format
	const formattedTime = parsedDate.toLocaleString({
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});

	// Return an object with the extracted information
	return { dayName, dayNumber, mounthName, hour: formattedTime };
};

function isDateFormatWithTime(dateString: string): string {
	// Check for the presence of time component
	const hasTime = /\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/.test(dateString);

	return hasTime ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd';
}

export const dateIsBeforeToday = (dateString: string) => {
	const date = DateTime.fromISO(dateString);
	const today = DateTime.local();
	const yesterday = today.minus({ days: 1 });
	const isDate1BeforeDate2 = DateTime.isDateTime(date) && yesterday > date;

	return isDate1BeforeDate2;
};

export const isDateTimeOneHourBefore = (dateString: string) => {
	const now = DateTime.now().setZone('America/Sao_Paulo');
	const oneHourBefore = now.plus({ hours: 1 });
	const targetDateTime = DateTime.fromFormat(dateString, 'yyyy-MM-dd HH:mm:ss');

	return targetDateTime < oneHourBefore;
};

export const getTheLastDate = (dates: string[]): string | null => {
	const dateObjects = dates.map((dateString) => DateTime.fromISO(dateString));

	const lastDate = DateTime.max(...dateObjects);

	if (lastDate) {
		return lastDate.toISODate();
	}

	return null;
};

export const addOneHour = (date: string) => {
	const dateTime = DateTime.fromFormat(date, 'yyyy-MM-dd HH:mm:ss');

	// Add one hour to the DateTime object
	const updatedDateTime = dateTime.plus({ hours: 1 });

	// Format the updated DateTime object as a string
	const updatedDateString = updatedDateTime.toFormat('yyyy-MM-dd HH:mm:ss');

	return updatedDateString;
};

export const checkIfAnyDateIsAfterToday = (dates: string[]) => {
	const today = new Date();
	// Remove the time portion of the current date for comparison
	today.setHours(0, 0, 0, 0);

	return dates.some((dateStr) => {
		const date = new Date(dateStr);
		return date > today;
	});
};

/**
 * Verifies if the current date is within a specified date range.
 * @param startDate - Start date in 'dd/MM/yyyy' format.
 * @param endDate - End date in 'dd/MM/yyyy' format.
 * @returns A boolean indicating whether the current date is within the range.
 */
export const isDateWithinEditPeriod = (
	startDate: string,
	endDate: string,
): boolean => {
	const startDateObj = DateTime.fromFormat(startDate, 'dd/MM/yyyy');
	const endDateObj = DateTime.fromFormat(endDate, 'dd/MM/yyyy');
	const now = DateTime.local();

	if (!startDateObj.isValid || !endDateObj.isValid) {
		console.warn('Invalid dates provided for comparison.');
		return false;
	}

	// Gets the day of the week of endDate (1 = Monday, 7 = Sunday)
	const dayOfWeek = endDateObj.weekday;

	// Calculates how many days remain until the next Monday
	const daysUntilNextMonday = (8 - dayOfWeek) % 7;

	// If the deadline falls on a Monday, we want to move it to the Tuesday of the following week
	const extraWeek = dayOfWeek === 1 ? 7 : 0;

	// Adjusts the deadline to the next Monday
	const limitDate = endDateObj
		.plus({ days: daysUntilNextMonday + 1 + extraWeek })
		.endOf('day');

	// Checks if 'now' is between the start date and that next Monday
	return now >= startDateObj && now <= limitDate;
};

/**
 * Hook to check if today's date is within a specified date range.
 * @param startDate - Start date in 'dd/MM/yyyy' format.
 * @param endDate - End date in 'dd/MM/yyyy' format.
 * @returns A boolean indicating whether today's date is within the range.
 */
export const useIsTodayWithinDateRange = (
	startDate: string,
	endDate: string,
): boolean => {
	const startDateObj = DateTime.fromFormat(startDate, 'dd/MM/yyyy').startOf(
		'day',
	);
	const endDateObj = DateTime.fromFormat(endDate, 'dd/MM/yyyy').endOf('day'); // inclui o dia inteiro
	const now = DateTime.local();

	if (!startDateObj.isValid || !endDateObj.isValid) {
		console.warn('Invalid dates provided for comparison.');
		return false;
	}

	return now >= startDateObj && now <= endDateObj;
};

/**
 * Converts a date string from 'dd/MM/yyyy' format to a Luxon DateTime object.
 * @param dateString - The date string in 'dd/MM/yyyy' format.
 * @returns The corresponding Luxon DateTime object.
 */
export const convertToLuxonDate = (dateString: string): DateTime => {
	return DateTime.fromFormat(dateString, 'dd/MM/yyyy');
};
