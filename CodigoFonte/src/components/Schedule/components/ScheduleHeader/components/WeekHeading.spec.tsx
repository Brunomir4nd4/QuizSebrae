import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DateTime, Settings } from 'luxon';

import { WeekHeading } from './WeekHeading.component';

// Configure Luxon locale for Portuguese
Settings.defaultLocale = 'pt-BR';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
	return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('WeekHeading Component', () => {
	beforeEach(() => {
		Settings.defaultLocale = 'pt-BR';
	});

	it('should render month name in Portuguese', () => {
		const date = DateTime.fromISO('2025-08-13');

		renderWithTheme(WeekHeading(date));

		const heading = screen.getByRole('heading');
		expect(heading).toHaveTextContent(/agosto/i);
	});

	it('should render year', () => {
		const date = DateTime.fromISO('2025-08-13');

		renderWithTheme(WeekHeading(date));

		const heading = screen.getByRole('heading');
		expect(heading).toHaveTextContent('2025');
	});

	it('should capitalize month name', () => {
		const date = DateTime.fromISO('2025-08-13');

		const { container } = renderWithTheme(WeekHeading(date));

		const strong = container.querySelector('strong');
		expect(strong).toBeInTheDocument();
		expect(strong).toHaveTextContent(/agosto/i);
	});

	it('should render different months correctly', () => {
		const januaryDate = DateTime.fromISO('2025-01-15');

		renderWithTheme(WeekHeading(januaryDate));

		expect(screen.getByRole('heading')).toHaveTextContent(/janeiro/i);
		expect(screen.getByRole('heading')).toHaveTextContent('2025');
	});

	it('should render December correctly', () => {
		const decemberDate = DateTime.fromISO('2024-12-25');

		renderWithTheme(WeekHeading(decemberDate));

		expect(screen.getByRole('heading')).toHaveTextContent(/dezembro/i);
		expect(screen.getByRole('heading')).toHaveTextContent('2024');
	});

	it('should render month and year together', () => {
		const date = DateTime.fromISO('2025-11-30');

		renderWithTheme(WeekHeading(date));

		const heading = screen.getByRole('heading');
		expect(heading).toHaveTextContent(/novembro.*2025/i);
	});

	it('should have proper heading structure with strong tag for month', () => {
		const date = DateTime.fromISO('2025-08-13');

		renderWithTheme(WeekHeading(date));

		const heading = screen.getByRole('heading');
		const strong = heading.querySelector('strong');

		expect(heading.tagName).toBe('H1');
		expect(strong).toBeInTheDocument();
	});
});
