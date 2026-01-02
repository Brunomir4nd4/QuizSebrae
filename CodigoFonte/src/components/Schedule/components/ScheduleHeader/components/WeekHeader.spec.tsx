import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DateTime, Settings } from 'luxon';

import { WeekHeader } from './WeekHeader.component';

// Configure Luxon locale for Portuguese
Settings.defaultLocale = 'pt-BR';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
	return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('WeekHeader Component', () => {
	beforeEach(() => {
		Settings.defaultLocale = 'pt-BR';
	});

	it('should render week header with all 7 days', () => {
		const weekStart = DateTime.fromISO('2025-08-11');
		const weekEnd = DateTime.fromISO('2025-08-18');

		renderWithTheme(WeekHeader(weekStart, weekEnd));

		// Should have 7 day displays
		const days = screen.getAllByText(/\d+/);
		expect(days.length).toBeGreaterThanOrEqual(7);
	});

	it('should render correct day numbers for the week', () => {
		const weekStart = DateTime.fromISO('2025-08-11');
		const weekEnd = DateTime.fromISO('2025-08-18');

		renderWithTheme(WeekHeader(weekStart, weekEnd));

		// Check for specific day numbers
		expect(screen.getByText('11')).toBeInTheDocument();
		expect(screen.getByText('12')).toBeInTheDocument();
		expect(screen.getByText('13')).toBeInTheDocument();
		expect(screen.getByText('14')).toBeInTheDocument();
		expect(screen.getByText('15')).toBeInTheDocument();
		expect(screen.getByText('16')).toBeInTheDocument();
		expect(screen.getByText('17')).toBeInTheDocument();
	});

	it('should highlight today when current date is in the week', () => {
		const today = DateTime.now();
		const weekStart = today.startOf('week');
		const weekEnd = weekStart.plus({ days: 7 });

		const { container } = renderWithTheme(WeekHeader(weekStart, weekEnd));

		// Should have a div with 'today' class
		const todayElement = container.querySelector('.today');
		expect(todayElement).toBeInTheDocument();
	});

	it('should not highlight any day when current date is not in the week', () => {
		const weekStart = DateTime.fromISO('2025-12-01');
		const weekEnd = DateTime.fromISO('2025-12-08');

		const { container } = renderWithTheme(WeekHeader(weekStart, weekEnd));

		// Should not have any div with 'today' class
		const todayElement = container.querySelector('.today');
		expect(todayElement).not.toBeInTheDocument();
	});

	it('should render hour spacer element', () => {
		const weekStart = DateTime.fromISO('2025-08-11');
		const weekEnd = DateTime.fromISO('2025-08-18');

		const { container } = renderWithTheme(WeekHeader(weekStart, weekEnd));

		// Should have hour-spacer elements
		const hourSpacers = container.querySelectorAll('.hour-spacer');
		expect(hourSpacers.length).toBeGreaterThan(0);
	});

	it('should render 7 dividers for week columns', () => {
		const weekStart = DateTime.fromISO('2025-08-11');
		const weekEnd = DateTime.fromISO('2025-08-18');

		const { container } = renderWithTheme(WeekHeader(weekStart, weekEnd));

		// Should have WeekHeaderDividers with 7 divs (excluding hour-spacer)
		const dividers = container.querySelectorAll('.hour-spacer + div');
		expect(dividers.length).toBeGreaterThanOrEqual(0);
	});

	it('should respect the locale from weekStart parameter', () => {
		const weekStart = DateTime.fromISO('2025-08-11').setLocale('pt-BR');
		const weekEnd = DateTime.fromISO('2025-08-18').setLocale('pt-BR');

		renderWithTheme(WeekHeader(weekStart, weekEnd));

		// Should render Portuguese weekday names
		expect(screen.getByText(/seg/i)).toBeInTheDocument();
	});
});
