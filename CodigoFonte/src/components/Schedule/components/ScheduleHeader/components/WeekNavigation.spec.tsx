import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DateTime, Settings } from 'luxon';

import { WeekNavigation } from './WeekNavigation.component';

// Configure Luxon locale for Portuguese
Settings.defaultLocale = 'pt-BR';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
	return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('WeekNavigation Component', () => {
	beforeEach(() => {
		Settings.defaultLocale = 'pt-BR';
	});

	it('should render week start and end dates', () => {
		const weekStart = DateTime.fromISO('2025-08-11');
		const weekEnd = DateTime.fromISO('2025-08-17');
		const onPrevious = jest.fn();
		const onNext = jest.fn();

		renderWithTheme(WeekNavigation(weekStart, weekEnd, onPrevious, onNext));

		// Should display both dates
		expect(screen.getByText('11')).toBeInTheDocument();
		expect(screen.getByText('17')).toBeInTheDocument();
	});

	it('should render "à" separator between dates', () => {
		const weekStart = DateTime.fromISO('2025-08-11');
		const weekEnd = DateTime.fromISO('2025-08-17');
		const onPrevious = jest.fn();
		const onNext = jest.fn();

		renderWithTheme(WeekNavigation(weekStart, weekEnd, onPrevious, onNext));

		expect(screen.getByText('à')).toBeInTheDocument();
	});

	it('should render previous week button', () => {
		const weekStart = DateTime.fromISO('2025-08-11');
		const weekEnd = DateTime.fromISO('2025-08-17');
		const onPrevious = jest.fn();
		const onNext = jest.fn();

		renderWithTheme(WeekNavigation(weekStart, weekEnd, onPrevious, onNext));

		const previousButton = screen.getByTitle('Semana anterior');
		expect(previousButton).toBeInTheDocument();
		expect(previousButton.tagName).toBe('BUTTON');
	});

	it('should render next week button', () => {
		const weekStart = DateTime.fromISO('2025-08-11');
		const weekEnd = DateTime.fromISO('2025-08-17');
		const onPrevious = jest.fn();
		const onNext = jest.fn();

		renderWithTheme(WeekNavigation(weekStart, weekEnd, onPrevious, onNext));

		const nextButton = screen.getByTitle('Próxima semana');
		expect(nextButton).toBeInTheDocument();
		expect(nextButton.tagName).toBe('BUTTON');
	});

	it('should call onPrevious when previous button is clicked', () => {
		const weekStart = DateTime.fromISO('2025-08-11');
		const weekEnd = DateTime.fromISO('2025-08-17');
		const onPrevious = jest.fn();
		const onNext = jest.fn();

		renderWithTheme(WeekNavigation(weekStart, weekEnd, onPrevious, onNext));

		const previousButton = screen.getByTitle('Semana anterior');
		fireEvent.click(previousButton);

		expect(onPrevious).toHaveBeenCalledTimes(1);
	});

	it('should call onNext when next button is clicked', () => {
		const weekStart = DateTime.fromISO('2025-08-11');
		const weekEnd = DateTime.fromISO('2025-08-17');
		const onPrevious = jest.fn();
		const onNext = jest.fn();

		renderWithTheme(WeekNavigation(weekStart, weekEnd, onPrevious, onNext));

		const nextButton = screen.getByTitle('Próxima semana');
		fireEvent.click(nextButton);

		expect(onNext).toHaveBeenCalledTimes(1);
	});

	it('should render weekday names for start and end dates', () => {
		const weekStart = DateTime.fromISO('2025-08-11'); // Monday
		const weekEnd = DateTime.fromISO('2025-08-17'); // Sunday
		const onPrevious = jest.fn();
		const onNext = jest.fn();

		renderWithTheme(WeekNavigation(weekStart, weekEnd, onPrevious, onNext));

		// Should display weekday names in Portuguese
		expect(screen.getByText(/seg/i)).toBeInTheDocument();
		expect(screen.getByText(/dom/i)).toBeInTheDocument();
	});

	it('should allow multiple clicks on navigation buttons', () => {
		const weekStart = DateTime.fromISO('2025-08-11');
		const weekEnd = DateTime.fromISO('2025-08-17');
		const onPrevious = jest.fn();
		const onNext = jest.fn();

		renderWithTheme(WeekNavigation(weekStart, weekEnd, onPrevious, onNext));

		const previousButton = screen.getByTitle('Semana anterior');
		const nextButton = screen.getByTitle('Próxima semana');

		fireEvent.click(previousButton);
		fireEvent.click(previousButton);
		fireEvent.click(nextButton);

		expect(onPrevious).toHaveBeenCalledTimes(2);
		expect(onNext).toHaveBeenCalledTimes(1);
	});

	it('should render navigation as nav element', () => {
		const weekStart = DateTime.fromISO('2025-08-11');
		const weekEnd = DateTime.fromISO('2025-08-17');
		const onPrevious = jest.fn();
		const onNext = jest.fn();

		const { container } = renderWithTheme(
			WeekNavigation(weekStart, weekEnd, onPrevious, onNext),
		);

		const nav = container.querySelector('nav');
		expect(nav).toBeInTheDocument();
	});
});
