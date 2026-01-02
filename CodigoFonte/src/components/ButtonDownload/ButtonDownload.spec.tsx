import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ButtonDownload } from './index';

describe('ButtonDownload', () => {
	const mockOnClick = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the icon and text correctly', () => {
		render(
			<ButtonDownload
				icon='/test-icon.svg'
				text='Download'
				onClick={mockOnClick}
			/>,
		);

		const img = screen.getByAltText('Download');
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute('src', '/test-icon.svg');
		expect(img).toHaveAttribute('width', '18');

		expect(screen.getByText('Download')).toBeInTheDocument();
	});

	it('calls onClick when the button is clicked', () => {
		render(
			<ButtonDownload
				icon='/test-icon.svg'
				text='Download'
				onClick={mockOnClick}
			/>,
		);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});

	it('applies the correct CSS classes', () => {
		render(
			<ButtonDownload
				icon='/test-icon.svg'
				text='Download'
				onClick={mockOnClick}
			/>,
		);

		const button = screen.getByRole('button');
		expect(button).toHaveClass('group');

		const container = button.firstChild as HTMLElement;
		expect(container).toHaveClass(
			'flex',
			'items-center',
			'gap-2',
			'p-[6px]',
			'pr-4',
			'bg-transparent',
			'rounded-[40px]',
			'hover:bg-[#222325]',
			'hover:text-[#1EFF9D]',
			'transition-all',
		);

		const iconContainer = container.firstChild as HTMLElement;
		expect(iconContainer).toHaveClass(
			'w-[32px]',
			'min-w-[32px]',
			'h-[32px]',
			'rounded-full',
			'bg-[#EBD406]',
			'flex',
			'items-center',
			'justify-center',
			'pl-[1px]',
			'pb-[1px]',
		);

		const textSpan = screen.getByText('Download');
		expect(textSpan).toHaveClass('text-xs', 'font-bold');
	});
});
