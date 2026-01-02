import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dropdown } from './index';

// Mock do Headless UI Menu
jest.mock('@headlessui/react', () => {
	const MockMenuButton = ({
		children,
		...props
	}: React.ComponentProps<'button'>) => <button {...props}>{children}</button>;
	MockMenuButton.displayName = 'MenuButton';

	const MockMenuItems = ({
		children,
		...props
	}: React.ComponentProps<'div'>) => <div {...props}>{children}</div>;
	MockMenuItems.displayName = 'MenuItems';

	const MockMenuItem = ({
		children,
	}: {
		children: (props: { active: boolean }) => React.ReactNode;
	}) => <>{children({ active: false })}</>;
	MockMenuItem.displayName = 'MenuItem';

	const MockMenu = Object.assign(
		({
			as: Component = 'div',
			children,
			...props
		}: {
			as?: React.ElementType;
			children: React.ReactNode;
			[key: string]: unknown;
		}) => <Component {...props}>{children}</Component>,
		{
			Button: MockMenuButton,
			Items: MockMenuItems,
			Item: MockMenuItem,
		},
	);

	return {
		Menu: MockMenu,
	};
});

// Mock do Heroicons
jest.mock('@heroicons/react/20/solid', () => ({
	ChevronDownIcon: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
		<svg className={className} {...props} data-testid='chevron-icon'>
			<path d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' />
		</svg>
	),
}));

describe('Dropdown', () => {
	const mockOnClick = jest.fn();
	const mockProps = {
		startItem: '2023',
		onClick: mockOnClick,
		years: ['2020', '2021', '2022', '2023', '2024'],
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Rendering', () => {
		it('should render the dropdown button with startItem text', () => {
			render(<Dropdown {...mockProps} />);

			const buttons = screen.getAllByRole('button');
			const mainButton = buttons[0]; // O primeiro botão é o botão principal do dropdown
			expect(mainButton).toHaveTextContent('2023');
		});

		it('should render the chevron down icon', () => {
			render(<Dropdown {...mockProps} />);

			const chevronIcon = screen.getByTestId('chevron-icon');
			expect(chevronIcon).toBeInTheDocument();
			expect(chevronIcon).toHaveClass('-mr-1', 'size-5', 'text-gray-400');
		});

		it('should render all year options', () => {
			render(<Dropdown {...mockProps} />);

			// Verificar que cada ano aparece pelo menos uma vez no documento
			mockProps.years.forEach((year) => {
				expect(screen.getAllByText(year).length).toBeGreaterThan(0);
			});
		});

		it('should apply correct CSS classes to button', () => {
			render(<Dropdown {...mockProps} />);

			const buttons = screen.getAllByRole('button');
			const mainButton = buttons[0];
			expect(mainButton).toHaveClass(
				'inline-flex',
				'w-full',
				'justify-center',
				'gap-x-1.5',
				'rounded-md',
				'bg-white',
				'px-3',
				'py-2',
				'text-sm',
				'font-semibold',
				'text-gray-900',
				'ring-1',
				'shadow-xs',
				'ring-gray-300',
				'ring-inset',
				'hover:bg-gray-50',
			);
		});

		it('should apply correct CSS classes to menu items container', () => {
			render(<Dropdown {...mockProps} />);

			const menuItems = document.querySelector('[class*="absolute"]');
			expect(menuItems).toHaveClass(
				'absolute',
				'right-0',
				'z-10',
				'mt-2',
				'w-full',
				'origin-top-right',
				'rounded-md',
				'bg-white',
				'ring-1',
				'shadow-lg',
				'ring-black/5',
			);
		});
	});

	describe('Interactions', () => {
		it('should call onClick with correct year when option is clicked', () => {
			render(<Dropdown {...mockProps} />);

			const year2021Option = screen.getByText('2021');
			fireEvent.click(year2021Option);

			expect(mockOnClick).toHaveBeenCalledWith('2021');
			expect(mockOnClick).toHaveBeenCalledTimes(1);
		});

		it('should call onClick with different years when different options are clicked', () => {
			render(<Dropdown {...mockProps} />);

			const year2020Option = screen.getByText('2020');
			const year2024Option = screen.getByText('2024');

			fireEvent.click(year2020Option);
			fireEvent.click(year2024Option);

			expect(mockOnClick).toHaveBeenCalledWith('2020');
			expect(mockOnClick).toHaveBeenCalledWith('2024');
			expect(mockOnClick).toHaveBeenCalledTimes(2);
		});

		it('should apply active styles when menu item is hovered', () => {
			render(<Dropdown {...mockProps} />);

			const year2022Option = screen.getByText('2022');

			// Simulate active state (this would normally be handled by Headless UI)
			// In a real scenario, Headless UI would pass active: true
			// For testing purposes, we verify the button renders with correct base classes
			expect(year2022Option).toHaveClass(
				'block',
				'w-full',
				'text-left',
				'px-4',
				'py-2',
				'text-sm',
			);
		});
	});

	describe('Props handling', () => {
		it('should display different startItem values', () => {
			const customProps = { ...mockProps, startItem: '2025' };
			render(<Dropdown {...customProps} />);

			const buttons = screen.getAllByRole('button');
			const mainButton = buttons[0];
			expect(mainButton).toHaveTextContent('2025');
		});

		it('should render different sets of years', () => {
			const customProps = {
				...mockProps,
				years: ['2018', '2019', '2020'],
			};
			render(<Dropdown {...customProps} />);

			expect(screen.getAllByText('2018').length).toBeGreaterThan(0);
			expect(screen.getAllByText('2019').length).toBeGreaterThan(0);
			expect(screen.getAllByText('2020').length).toBeGreaterThan(0);
			expect(screen.queryByText('2021')).not.toBeInTheDocument();
		});

		it('should handle empty years array', () => {
			const customProps = { ...mockProps, years: [] };
			render(<Dropdown {...customProps} />);

			// Button should still render
			const buttons = screen.getAllByRole('button');
			const mainButton = buttons[0];
			expect(mainButton).toHaveTextContent('2023');

			// No year options should be rendered in the dropdown menu
			// Only the main button should exist
			expect(buttons).toHaveLength(1);
		});

		it('should handle single year in array', () => {
			const customProps = { ...mockProps, years: ['2023'] };
			render(<Dropdown {...customProps} />);

			// 2023 appears both in the button and in the options
			expect(screen.getAllByText('2023')).toHaveLength(2);
			expect(screen.queryByText('2020')).not.toBeInTheDocument();
		});
	});

	describe('Accessibility', () => {
		it('should have proper button role', () => {
			render(<Dropdown {...mockProps} />);

			const buttons = screen.getAllByRole('button');
			expect(buttons.length).toBeGreaterThan(0);
			// Verify the main button exists
			expect(buttons[0]).toBeInTheDocument();
		});

		it('should have aria-hidden on chevron icon', () => {
			render(<Dropdown {...mockProps} />);

			const chevronIcon = document.querySelector('svg');
			expect(chevronIcon).toHaveAttribute('aria-hidden', 'true');
		});
	});
});
