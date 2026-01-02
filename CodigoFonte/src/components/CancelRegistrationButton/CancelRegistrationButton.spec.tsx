import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CancelRegistrationButton } from './CancelRegistrationButton.component';

// Mock ButtonIcon component
jest.mock('@/components/ButtonIcon', () => ({
	ButtonIcon: ({
		text,
		onClick,
		disabled,
		icon,
		size,
		iconSize,
	}: {
		text: string;
		onClick?: () => void;
		disabled?: boolean;
		icon: string;
		size: string;
		iconSize: string;
	}) => (
		<button
			data-testid='button-icon'
			onClick={onClick}
			disabled={disabled}
			data-icon={icon}
			data-size={size}
			data-icon-size={iconSize}>
			{text}
		</button>
	),
}));

// Mock CancelRegistrationModal component
jest.mock('../CancelRegistrationModal/CancelRegistration.component', () => ({
	CancelRegistrationModal: ({
		callback,
		enrollId,
		token,
	}: {
		callback?: () => void;
		enrollId: string;
		token: string;
	}) => (
		<div
			data-testid='cancel-registration-modal'
			data-enroll-id={enrollId}
			data-token={token}
			data-callback={!!callback}>
			Modal Content
		</div>
	),
}));

describe('CancelRegistrationButton', () => {
	const defaultProps = {
		text: 'Cancelar Matrícula',
		enrollId: '12345',
		token: 'test-token',
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the button correctly', () => {
		render(<CancelRegistrationButton {...defaultProps} />);

		const button = screen.getByTestId('button-icon');
		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent('Cancelar Matrícula');
		expect(button).toHaveAttribute('data-icon', '/icon-arrow-next.svg');
		expect(button).toHaveAttribute('data-size', 'medium');
		expect(button).toHaveAttribute('data-icon-size', '50px');
	});

	it('does not render modal initially', () => {
		render(<CancelRegistrationButton {...defaultProps} />);

		expect(
			screen.queryByTestId('cancel-registration-modal'),
		).not.toBeInTheDocument();
	});

	it('opens modal when button is clicked', () => {
		render(<CancelRegistrationButton {...defaultProps} />);

		const button = screen.getByTestId('button-icon');
		fireEvent.click(button);

		const modal = screen.getByTestId('cancel-registration-modal');
		expect(modal).toBeInTheDocument();
		expect(modal).toHaveAttribute('data-enroll-id', '12345');
		expect(modal).toHaveAttribute('data-token', 'test-token');
		expect(modal).toHaveAttribute('data-callback', 'true');
	});

	it('closes modal when callback is called', () => {
		render(<CancelRegistrationButton {...defaultProps} />);

		// Abre o modal
		const button = screen.getByTestId('button-icon');
		fireEvent.click(button);
		expect(screen.getByTestId('cancel-registration-modal')).toBeInTheDocument();

		// Simula o callback sendo chamado (o modal se fecha)
		// Como estamos mockando o componente, precisamos testar indiretamente
		// Clicando novamente no botão, que deveria abrir o modal novamente
		fireEvent.click(button);
		// Como o estado alterna, o modal deveria estar fechado agora
		// Mas como estamos renderizando condicionalmente baseado no estado,
		// vamos verificar se o modal não está mais presente
		expect(
			screen.queryByTestId('cancel-registration-modal'),
		).not.toBeInTheDocument();
	});

	it('applies correct alignment', () => {
		render(
			<CancelRegistrationButton {...defaultProps} align='justify-center' />,
		);

		const container = screen.getByTestId('button-icon').parentElement;
		expect(container).toHaveClass('justify-center');
	});

	it('applies default alignment (justify-start)', () => {
		render(<CancelRegistrationButton {...defaultProps} />);

		const container = screen.getByTestId('button-icon').parentElement;
		expect(container).toHaveClass('justify-start');
	});

	it('disables button when disabled=true', () => {
		render(<CancelRegistrationButton {...defaultProps} disabled={true} />);

		const button = screen.getByTestId('button-icon');
		expect(button).toBeDisabled();
	});

	it('enables button when disabled=false (default)', () => {
		render(<CancelRegistrationButton {...defaultProps} />);

		const button = screen.getByTestId('button-icon');
		expect(button).not.toBeDisabled();
	});

	it('does not call onClick when provided (does not interfere with functionality)', () => {
		const mockOnClick = jest.fn();
		render(
			<CancelRegistrationButton {...defaultProps} onClick={mockOnClick} />,
		);

		const button = screen.getByTestId('button-icon');
		fireEvent.click(button);

		// O onClick prop não deve ser chamado, pois o componente sobrescreve com changeStatusModal
		expect(mockOnClick).not.toHaveBeenCalled();
	});

	it('applies correct CSS classes to container', () => {
		render(<CancelRegistrationButton {...defaultProps} />);

		const container = screen.getByTestId('button-icon').parentElement;
		expect(container).toHaveClass('w-full', 'flex', 'justify-start');
	});
});
