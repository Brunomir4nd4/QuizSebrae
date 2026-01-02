import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CarouselModal } from './index';

// Mock Material-UI components
jest.mock('@mui/material', () => ({
	Box: ({
		children,
		...props
	}: {
		children: React.ReactNode;
		[key: string]: unknown;
	}) => (
		<div data-testid='mui-box' {...props}>
			{children}
		</div>
	),
	Modal: ({
		children,
		open,
		...props
	}: {
		children: React.ReactNode;
		open: boolean;
		[key: string]: unknown;
	}) => (
		<div
			data-testid='mui-modal'
			data-open={open}
			data-aria-labelledby={props['aria-labelledby']}
			data-aria-describedby={props['aria-describedby']}
			{...props}>
			{children}
		</div>
	),
}));

// Mock Material-UI icons
jest.mock('@mui/icons-material/Close', () => ({
	__esModule: true,
	default: () => <span data-testid='close-icon'>×</span>,
}));

// Mock styled components
jest.mock('./CarouselModal.styles', () => ({
	ModalContent: ({
		children,
		...props
	}: {
		children: React.ReactNode;
		[key: string]: unknown;
	}) => (
		<div data-testid='modal-content' {...props}>
			{children}
		</div>
	),
	ModalClose: ({
		children,
		onClick,
		...props
	}: {
		children: React.ReactNode;
		onClick: () => void;
		[key: string]: unknown;
	}) => (
		<button data-testid='modal-close' onClick={onClick} {...props}>
			{children}
		</button>
	),
}));

describe('CarouselModal', () => {
	const defaultProps = {
		open: true,
		onClose: jest.fn(),
		children: <div data-testid='modal-children'>Test Content</div>,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the modal when open=true', () => {
		render(<CarouselModal {...defaultProps} />);

		expect(screen.getByTestId('mui-modal')).toBeInTheDocument();
		expect(screen.getByTestId('modal-content')).toBeInTheDocument();
		expect(screen.getByTestId('modal-children')).toBeInTheDocument();
	});

	it('does not render the modal when open=false', () => {
		render(<CarouselModal {...defaultProps} open={false} />);

		expect(screen.getByTestId('mui-modal')).toHaveAttribute(
			'data-open',
			'false',
		);
	});

	it('renders the close button with icon', () => {
		render(<CarouselModal {...defaultProps} />);

		expect(screen.getByTestId('modal-close')).toBeInTheDocument();
		expect(screen.getByTestId('close-icon')).toBeInTheDocument();
	});

	it('calls onClose when the close button is clicked', () => {
		render(<CarouselModal {...defaultProps} />);

		const closeButton = screen.getByTestId('modal-close');
		fireEvent.click(closeButton);

		expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
	});

	it('passes correct props to the Material-UI Modal', () => {
		render(<CarouselModal {...defaultProps} />);

		const modal = screen.getByTestId('mui-modal');
		expect(modal).toHaveAttribute('data-open', 'true');
		expect(modal).toHaveAttribute('data-aria-labelledby', 'modal-modal-title');
		expect(modal).toHaveAttribute(
			'data-aria-describedby',
			'modal-modal-description',
		);
	});

	it('renders children inside the Box', () => {
		render(<CarouselModal {...defaultProps} />);

		const box = screen.getByTestId('mui-box');
		expect(box).toBeInTheDocument();
		expect(screen.getByTestId('modal-children')).toBeInTheDocument();
	});

	it('renders custom children inside the Box', () => {
		const testContent = <p data-testid='test-paragraph'>Custom Content</p>;
		render(<CarouselModal {...defaultProps}>{testContent}</CarouselModal>);

		expect(screen.getByTestId('test-paragraph')).toBeInTheDocument();
		expect(screen.getByTestId('mui-box')).toBeInTheDocument();
	});

	it('does not render when there are no children', () => {
		render(<CarouselModal {...defaultProps}>{null}</CarouselModal>);

		expect(screen.getByTestId('mui-modal')).toBeInTheDocument();
		expect(screen.queryByTestId('modal-children')).not.toBeInTheDocument();
	});

	it('maintains accessibility functionality', () => {
		render(<CarouselModal {...defaultProps} />);

		const modal = screen.getByTestId('mui-modal');
		expect(modal).toHaveAttribute('data-aria-labelledby', 'modal-modal-title');
		expect(modal).toHaveAttribute(
			'data-aria-describedby',
			'modal-modal-description',
		);
	});
});
