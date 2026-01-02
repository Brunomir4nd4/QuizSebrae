import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { DateTime } from 'luxon';
import { DayHeader } from './DayHeader.component';
import { useScheduleContext } from '@/app/providers/ScheduleProvider';

jest.mock('@/app/providers/ScheduleProvider', () => ({
	useScheduleContext: jest.fn(),
}));

interface DayDisplayProps {
	date: DateTime;
	isHeader?: boolean;
	isToday?: boolean;
	onClick?: () => void;
}

jest.mock('./DayDisplay.component', () => ({
	DayDisplay: ({ date, isHeader, isToday, onClick }: DayDisplayProps) =>
		React.createElement(
			'div',
			{
				'data-testid': `day-display-${date.toFormat('yyyy-MM-dd')}`,
				'data-is-header': isHeader,
				'data-is-today': isToday,
				onClick,
			},
			date.toFormat('d'),
		),
}));

describe('DayHeader', () => {
	const mockSetDayViewDate = jest.fn();
	const mockUseScheduleContext = useScheduleContext as jest.MockedFunction<
		typeof useScheduleContext
	>;

	beforeEach(() => {
		mockSetDayViewDate.mockClear();
		mockUseScheduleContext.mockReturnValue({
			scheduleData: 0,
			schedule: [],
			loading: false,
			date: DateTime.local(2025, 8, 15),
			dayViewDate: DateTime.local(2025, 8, 15), // Sexta-feira
			setDayViewDate: mockSetDayViewDate,
			setDate: jest.fn(),
			setScheduleData: jest.fn(),
			setSchedule: jest.fn(),
		});
	});

	it('passes isHeader=true to all DayDisplay', () => {
		const weekStart = DateTime.local(2025, 8, 12);
		const weekEnd = DateTime.local(2025, 8, 18);

		render(<>{DayHeader(weekStart, weekEnd)}</>);

		const dayDisplays = screen.getAllByTestId(/^day-display-/);
		dayDisplays.forEach((display) => {
			expect(display).toHaveAttribute('data-is-header', 'true');
		});
	});

	it('marks the current day as today', () => {
		const weekStart = DateTime.local(2025, 8, 12); // Segunda
		const weekEnd = DateTime.local(2025, 8, 18); // Domingo
		// dayViewDate é 15/08/2025 (sexta-feira), que deve estar na semana

		render(<>{DayHeader(weekStart, weekEnd)}</>);

		// O dia 15 deve ser marcado como today
		const todayDisplay = screen.getByTestId('day-display-2025-08-15');
		expect(todayDisplay).toHaveAttribute('data-is-today', 'true');

		// Outros dias não devem ser today
		const otherDays = screen
			.getAllByTestId(/^day-display-/)
			.filter(
				(display) =>
					!display.getAttribute('data-testid')?.includes('2025-08-15'),
			);
		otherDays.forEach((display) => {
			expect(display).toHaveAttribute('data-is-today', 'false');
		});
	});

	it('calls setDayViewDate when clicking on a day', () => {
		const weekStart = DateTime.local(2025, 8, 12);
		const weekEnd = DateTime.local(2025, 8, 18);

		render(<>{DayHeader(weekStart, weekEnd)}</>);

		const wednesdayDisplay = screen.getByTestId('day-display-2025-08-14'); // Quarta-feira
		fireEvent.click(wednesdayDisplay);

		expect(mockSetDayViewDate).toHaveBeenCalledWith(
			DateTime.local(2025, 8, 14),
		);
	});

	it('does not mark any day as today if dayViewDate is outside the week', () => {
		mockUseScheduleContext.mockReturnValue({
			scheduleData: 0,
			schedule: [],
			loading: false,
			date: DateTime.local(2025, 9, 1),
			dayViewDate: DateTime.local(2025, 9, 1), // Data fora da semana
			setDayViewDate: mockSetDayViewDate,
			setDate: jest.fn(),
			setScheduleData: jest.fn(),
			setSchedule: jest.fn(),
		});

		const weekStart = DateTime.local(2025, 8, 12);
		const weekEnd = DateTime.local(2025, 8, 18);

		render(<>{DayHeader(weekStart, weekEnd)}</>);

		const dayDisplays = screen.getAllByTestId(/^day-display-/);
		dayDisplays.forEach((display) => {
			expect(display).toHaveAttribute('data-is-today', 'false');
		});
	});

	it('renders correct days of the week', () => {
		const weekStart = DateTime.local(2025, 8, 12); // Segunda-feira
		const weekEnd = DateTime.local(2025, 8, 18); // Domingo

		render(<>{DayHeader(weekStart, weekEnd)}</>);

		// Verifica dias específicos
		expect(screen.getByText('12')).toBeInTheDocument(); // Segunda
		expect(screen.getByText('13')).toBeInTheDocument(); // Terça
		expect(screen.getByText('14')).toBeInTheDocument(); // Quarta
		expect(screen.getByText('15')).toBeInTheDocument(); // Quinta
		expect(screen.getByText('16')).toBeInTheDocument(); // Sexta
		expect(screen.getByText('17')).toBeInTheDocument(); // Sábado
	});
});
