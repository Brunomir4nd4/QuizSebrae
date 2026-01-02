import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { StyledSelect } from './StyledSelect.component';

const theme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
	return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('StyledSelect Component', () => {
	const mockSetValue = jest.fn();
	const items = ['Option 1', 'Option 2', 'Option 3'];

	beforeEach(() => {
		mockSetValue.mockClear();
	});

	it('should render with placeholder', () => {
		renderWithProviders(
			<StyledSelect
				placeholder='Select an option'
				items={items}
				name='test-select'
				setValue={mockSetValue}
				value=''
			/>,
		);

		expect(screen.getByText('Select an option')).toBeInTheDocument();
	});

	it('should render all menu items', () => {
		renderWithProviders(
			<StyledSelect
				placeholder='Select an option'
				items={items}
				name='test-select'
				setValue={mockSetValue}
				value=''
			/>,
		);

		const selectButton = screen.getByRole('combobox');
		fireEvent.mouseDown(selectButton);

		expect(screen.getByText('Option 1')).toBeInTheDocument();
		expect(screen.getByText('Option 2')).toBeInTheDocument();
		expect(screen.getByText('Option 3')).toBeInTheDocument();
	});

	it('should call setValue when selection changes', () => {
		renderWithProviders(
			<StyledSelect
				placeholder='Select an option'
				items={items}
				name='test-select'
				setValue={mockSetValue}
				value=''
			/>,
		);

		const selectButton = screen.getByRole('combobox');
		fireEvent.mouseDown(selectButton);

		const option1 = screen.getByText('Option 1');
		fireEvent.click(option1);

		expect(mockSetValue).toHaveBeenCalledTimes(1);
	});

	it('should render with variant true', () => {
		renderWithProviders(
			<StyledSelect
				placeholder='Select an option'
				items={items}
				name='test-select'
				setValue={mockSetValue}
				value=''
				variant={true}
			/>,
		);

		expect(screen.getByText('Select an option')).toBeInTheDocument();
	});

	it('should render FormControl with fullWidth', () => {
		renderWithProviders(
			<StyledSelect
				placeholder='Select an option'
				items={items}
				name='test-select'
				setValue={mockSetValue}
				value=''
			/>,
		);

		const formControl = screen
			.getByRole('combobox')
			.closest('.MuiFormControl-root');
		expect(formControl).toHaveClass('MuiFormControl-fullWidth');
	});
});
