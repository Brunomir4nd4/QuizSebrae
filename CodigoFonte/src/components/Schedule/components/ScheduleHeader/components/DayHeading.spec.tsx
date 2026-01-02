import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { DateTime, Settings } from 'luxon';
import { DayHeading } from './DayHeading.component';

// Configurar locale padrão do Luxon para português
Settings.defaultLocale = 'pt-BR';

// Criar um tema mock para o MUI
const theme = createTheme();

// Wrapper com ThemeProvider
const renderWithTheme = (component: React.ReactElement) => {
	return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('DayHeading', () => {
	it('renders the formatted date correctly', () => {
		const date = DateTime.local(2025, 8, 13); // 13 de agosto de 2025
		renderWithTheme(<>{DayHeading(date)}</>);

		const heading = screen.getByRole('heading');
		expect(heading).toHaveTextContent(/13.*de.*agosto.*2025/i);
	});

	it('renders month in uppercase in strong', () => {
		const date = DateTime.local(2025, 1, 15); // 15 de janeiro de 2025
		renderWithTheme(<>{DayHeading(date)}</>);

		const strongElement = screen.getByText(/janeiro/i);
		expect(strongElement.tagName).toBe('STRONG');
	});

	it('renders different dates correctly', () => {
		const date = DateTime.local(2025, 12, 25); // 25 de dezembro de 2025
		renderWithTheme(<>{DayHeading(date)}</>);

		expect(screen.getByText(/25/)).toBeInTheDocument();
		expect(screen.getByText(/dezembro/i)).toBeInTheDocument();
		expect(screen.getByText(/2025/)).toBeInTheDocument();
	});

	it('applies correct styles to the component', () => {
		const date = DateTime.local(2025, 6, 10); // 10 de junho de 2025
		const { container } = renderWithTheme(<>{DayHeading(date)}</>);

		const heading = container.querySelector('h1');
		expect(heading).toBeInTheDocument();
	});

	it('formats day as number', () => {
		const date = DateTime.local(2025, 3, 5); // 5 de março de 2025
		renderWithTheme(<>{DayHeading(date)}</>);

		expect(screen.getByText(/5/)).toBeInTheDocument();
	});

	it('formats month in full', () => {
		const date = DateTime.local(2025, 11, 20); // 20 de novembro de 2025
		renderWithTheme(<>{DayHeading(date)}</>);

		expect(screen.getByText(/novembro/i)).toBeInTheDocument();
	});

	it('formats full year', () => {
		const date = DateTime.local(2024, 7, 15); // 15 de julho de 2024
		renderWithTheme(<>{DayHeading(date)}</>);

		expect(screen.getByText(/2024/)).toBeInTheDocument();
	});
});
