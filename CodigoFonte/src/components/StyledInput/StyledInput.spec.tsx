import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { StyledInput } from './StyledInput.component';

const theme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
	return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('StyledInput Component', () => {
	const mockSetValue = jest.fn();

	beforeEach(() => {
		mockSetValue.mockClear();
	});

	it('should render with default variant', () => {
		renderWithProviders(
			<StyledInput
				placeholder='Test placeholder'
				value='test value'
				setValue={mockSetValue}
				name='test-input'
			/>,
		);

		const input = screen.getByPlaceholderText('Test placeholder');
		expect(input).toBeInTheDocument();
		expect(input).toHaveValue('test value');
		expect(input).toHaveAttribute('name', 'test-input');
	});

	it('should render with variant false', () => {
		renderWithProviders(
			<StyledInput
				placeholder='Test placeholder'
				value='test value'
				setValue={mockSetValue}
				name='test-input'
				variant={false}
			/>,
		);

		const input = screen.getByPlaceholderText('Test placeholder');
		expect(input).toBeInTheDocument();
		expect(input).toHaveValue('test value');
	});

	it('should call setValue when input changes', () => {
		renderWithProviders(
			<StyledInput
				placeholder='Test placeholder'
				value=''
				setValue={mockSetValue}
				name='test-input'
			/>,
		);

		const input = screen.getByPlaceholderText('Test placeholder');
		fireEvent.change(input, { target: { value: 'new value' } });

		expect(mockSetValue).toHaveBeenCalledTimes(1);
	});

	it('should render FormControl with fullWidth', () => {
		renderWithProviders(
			<StyledInput
				placeholder='Test placeholder'
				value=''
				setValue={mockSetValue}
				name='test-input'
			/>,
		);

		const formControl = screen
			.getByRole('textbox')
			.closest('.MuiFormControl-root');
		expect(formControl).toHaveClass('MuiFormControl-fullWidth');
	});
});
