import React from 'react';
import {
	render,
	screen,
	fireEvent,
	waitFor,
	act,
} from '@testing-library/react';
import { CancelRegistrationModal } from './CancelRegistration.component';
import { cancelEnroll } from '@/app/services/external/EnrollService';
import { signOut } from 'next-auth/react';
import { datadogRum } from '@datadog/browser-rum';

// Mock Material-UI components
jest.mock('@mui/material', () => ({
	FormControl: ({
		children,
		fullWidth,
	}: {
		children: React.ReactNode;
		fullWidth?: boolean;
	}) => (
		<div data-testid='form-control' data-full-width={fullWidth}>
			{children}
		</div>
	),
	InputLabel: ({
		children,
		...props
	}: {
		children: React.ReactNode;
		[key: string]: unknown;
	}) => (
		<label data-testid='input-label' {...props}>
			{children}
		</label>
	),
	MenuItem: ({
		children,
		value,
		...props
	}: {
		children: React.ReactNode;
		value: string;
		[key: string]: unknown;
	}) => (
		<option data-testid='menu-item' value={value} {...props}>
			{children}
		</option>
	),
	Select: ({
		children,
		value,
		onChange,
		labelId,
		id,
		...props
	}: {
		children: React.ReactNode;
		value: string;
		onChange: (e: { target: { value: string } }) => void;
		labelId?: string;
		id?: string;
		[key: string]: unknown;
	}) => (
		<select
			data-testid='select'
			value={value}
			onChange={(e) => onChange({ target: { value: e.target.value } })}
			aria-labelledby={labelId}
			id={id}
			{...props}>
			{children}
		</select>
	),
	Divider: () => <hr data-testid='divider' />,
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
	signOut: jest.fn().mockResolvedValue(undefined),
}));

// Mock next/navigation
const mockReplace = jest.fn();
const mockBack = jest.fn();
jest.mock('next/navigation', () => ({
	useRouter: () => ({
		replace: mockReplace,
		back: mockBack,
	}),
}));

// Mock datadog
jest.mock('@datadog/browser-rum', () => ({
	datadogRum: {
		clearUser: jest.fn(),
	},
}));

// Mock BaseModal
jest.mock('../BaseModal/BaseModal.component', () => ({
	BaseModal: ({
		children,
		header,
		footer,
		open,
		onClose,
		width,
	}: {
		children: React.ReactNode;
		header?: React.ReactNode;
		footer?: React.ReactNode;
		open: boolean;
		onClose: () => void;
		width?: string;
	}) => (
		<div
			data-testid='base-modal'
			data-open={open}
			data-width={width}
			data-has-header={!!header}
			data-has-footer={!!footer}>
			{header && <div data-testid='modal-header'>{header}</div>}
			<div data-testid='modal-body'>{children}</div>
			{footer && <div data-testid='modal-footer'>{footer}</div>}
			<button data-testid='modal-close' onClick={onClose}>
				×
			</button>
		</div>
	),
}));

// Mock ButtonIcon
jest.mock('../ButtonIcon', () => ({
	ButtonIcon: ({
		text,
		onClick,
		disabled,
		...props
	}: {
		text: string;
		onClick: () => void;
		disabled?: boolean;
		[key: string]: unknown;
	}) => (
		<button
			data-testid='button-icon'
			onClick={onClick}
			disabled={disabled}
			{...props}>
			{text}
		</button>
	),
}));

// Mock cancelEnroll service
jest.mock('@/app/services/external/EnrollService', () => ({
	cancelEnroll: jest.fn(),
}));

// Mock localStorage
const mockLocalStorage = {
	removeItem: jest.fn(),
	getItem: jest.fn(),
	setItem: jest.fn(),
	clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
	value: mockLocalStorage,
});

describe('CancelRegistrationModal', () => {
	const defaultProps = {
		enrollId: '12345',
		token: 'test-token',
	};

	const mockCancelEnroll = cancelEnroll as jest.MockedFunction<
		typeof cancelEnroll
	>;
	const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;
	const mockDatadogRum = datadogRum;

	beforeEach(() => {
		jest.clearAllMocks();
		jest.clearAllTimers();
		mockCancelEnroll.mockResolvedValue({ status: 'cancelled' });
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('renders initial screen for reason selection', () => {
		render(<CancelRegistrationModal {...defaultProps} />);

		expect(screen.getByTestId('base-modal')).toBeInTheDocument();
		expect(screen.getByText('Cancelar')).toBeInTheDocument();
		expect(screen.getByText('matrícula')).toBeInTheDocument();
		expect(screen.getByTestId('select')).toBeInTheDocument();
		expect(screen.getByText('Motivo do cancelamento')).toBeInTheDocument();
		expect(screen.getByText('Atenção!')).toBeInTheDocument();
		expect(screen.getByText('CONTINUAR CANCELAMENTO')).toBeInTheDocument();
	});

	it('allows selecting a reason', () => {
		render(<CancelRegistrationModal {...defaultProps} />);

		const select = screen.getByTestId('select');
		fireEvent.change(select, { target: { value: 'Doença' } });

		expect(select).toHaveValue('Doença');
	});

	it('disables button when no reason is selected', () => {
		render(<CancelRegistrationModal {...defaultProps} />);

		const button = screen.getByTestId('button-icon');
		expect(button).toBeDisabled();
	});

	it('enables button when a reason is selected', () => {
		render(<CancelRegistrationModal {...defaultProps} />);

		const select = screen.getByTestId('select');
		fireEvent.change(select, { target: { value: 'Doença' } });

		const button = screen.getByTestId('button-icon');
		expect(button).not.toBeDisabled();
	});

	it('transitions to confirmation screen when clicking continue', () => {
		render(<CancelRegistrationModal {...defaultProps} />);

		const select = screen.getByTestId('select');
		fireEvent.change(select, { target: { value: 'Doença' } });

		const button = screen.getByTestId('button-icon');
		fireEvent.click(button);

		expect(screen.getByText('Confirmar cancelamento')).toBeInTheDocument();
		expect(
			screen.getByText('Deseja continuar com cancelamento sua matrícula?'),
		).toBeInTheDocument();
		expect(screen.getByText('CONFIRMAR CANCELAMENTO')).toBeInTheDocument();
	});

	it('shows loading during cancellation', async () => {
		mockCancelEnroll.mockImplementation(
			() =>
				new Promise((resolve) =>
					setTimeout(() => resolve({ status: 'cancelled' }), 100),
				),
		);

		render(<CancelRegistrationModal {...defaultProps} />);

		// Ir para tela de confirmação
		const select = screen.getByTestId('select');
		fireEvent.change(select, { target: { value: 'Doença' } });
		const continueButton = screen.getByTestId('button-icon');
		fireEvent.click(continueButton);

		// Clicar em confirmar
		const confirmButton = screen.getByTestId('button-icon');
		fireEvent.click(confirmButton);

		// Verificar se o botão está desabilitado durante loading
		expect(confirmButton).toBeDisabled();
	});

	it('shows success screen after successful cancellation', async () => {
		render(<CancelRegistrationModal {...defaultProps} />);

		// Ir para tela de confirmação
		const select = screen.getByTestId('select');
		fireEvent.change(select, { target: { value: 'Doença' } });
		const continueButton = screen.getByTestId('button-icon');
		fireEvent.click(continueButton);

		// Confirmar cancelamento
		const confirmButton = screen.getByTestId('button-icon');
		await act(async () => {
			fireEvent.click(confirmButton);
		});

		await waitFor(() => {
			expect(screen.getByText('Matrícula')).toBeInTheDocument();
			expect(screen.getByText('cancelada')).toBeInTheDocument();
			expect(
				screen.getByText('Esperamos ver você novamente!'),
			).toBeInTheDocument();
			expect(screen.getByText(/Você será deslogado em/)).toBeInTheDocument();
		});
	});

	it('starts countdown after cancellation confirmed', async () => {
		jest.useFakeTimers();

		render(<CancelRegistrationModal {...defaultProps} />);

		// Simular seleção de motivo usando fireEvent.change
		const select = screen.getByRole('combobox');
		fireEvent.change(select, { target: { value: 'Doença' } });

		// Aguardar o estado ser atualizado
		await waitFor(() => {
			expect(screen.getByText('CONTINUAR CANCELAMENTO')).not.toBeDisabled();
		});

		// Clicar em continuar
		const continueButton = screen.getByText('CONTINUAR CANCELAMENTO');
		fireEvent.click(continueButton);

		// Aguardar transição para tela de confirmação
		await waitFor(() => {
			expect(screen.getByText('CONFIRMAR CANCELAMENTO')).toBeInTheDocument();
		});

		// Simular confirmação
		const confirmButton = screen.getByText('CONFIRMAR CANCELAMENTO');
		fireEvent.click(confirmButton);

		// Aguardar o countdown aparecer (usando regex para encontrar o texto)
		await waitFor(() => {
			expect(screen.getByText(/Você será deslogado em/i)).toBeInTheDocument();
			expect(screen.getByText(/00:00:/)).toBeInTheDocument();
		});

		// Verificar que a tela de sucesso está sendo exibida
		expect(screen.getByText('Matrícula')).toBeInTheDocument();
		expect(screen.getByText('cancelada')).toBeInTheDocument();

		jest.useRealTimers();
	});

	it('logs out after countdown ends', async () => {
		jest.useFakeTimers();

		render(<CancelRegistrationModal {...defaultProps} />);

		// Ir para tela de confirmação e confirmar
		const select = screen.getByTestId('select');
		fireEvent.change(select, { target: { value: 'Doença' } });
		const continueButton = screen.getByTestId('button-icon');
		fireEvent.click(continueButton);
		const confirmButton = screen.getByTestId('button-icon');

		await act(async () => {
			fireEvent.click(confirmButton);
		});

		// Avançar tempo suficiente para countdown terminar
		act(() => {
			jest.advanceTimersByTime(30000);
		});

		await waitFor(() => {
			expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('class_id');
			expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
				'class_id_expiration',
			);
			expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('course_id');
			expect(mockSignOut).toHaveBeenCalledWith({ redirect: true });
			expect(mockDatadogRum.clearUser).toHaveBeenCalled();
			expect(mockReplace).toHaveBeenCalledWith('/');
		});

		jest.useRealTimers();
	});

	it('calls callback when closing', () => {
		const mockCallback = jest.fn();
		render(
			<CancelRegistrationModal {...defaultProps} callback={mockCallback} />,
		);

		const closeButton = screen.getByTestId('modal-close');
		fireEvent.click(closeButton);

		expect(mockCallback).toHaveBeenCalled();
	});

	it('goes back in navigation when backOnClose=true', () => {
		render(<CancelRegistrationModal {...defaultProps} backOnClose={true} />);

		const closeButton = screen.getByTestId('modal-close');
		fireEvent.click(closeButton);

		expect(mockBack).toHaveBeenCalled();
	});

	it('does not call callback when not provided', () => {
		render(<CancelRegistrationModal {...defaultProps} />);

		const closeButton = screen.getByTestId('modal-close');
		fireEvent.click(closeButton);

		// Não deve quebrar se callback não for fornecido
		expect(() => fireEvent.click(closeButton)).not.toThrow();
	});

	it('does not go back in navigation when backOnClose=false', () => {
		render(<CancelRegistrationModal {...defaultProps} backOnClose={false} />);

		const closeButton = screen.getByTestId('modal-close');
		fireEvent.click(closeButton);

		expect(mockBack).not.toHaveBeenCalled();
	});

	it('does not open modal when modalOpen=false', () => {
		render(<CancelRegistrationModal {...defaultProps} modalOpen={false} />);

		const modal = screen.getByTestId('base-modal');
		expect(modal).toHaveAttribute('data-open', 'false');
	});

	it('opens modal by default when modalOpen is not provided', () => {
		render(<CancelRegistrationModal {...defaultProps} />);

		const modal = screen.getByTestId('base-modal');
		expect(modal).toHaveAttribute('data-open', 'true');
	});

	it('renders select options correctly', () => {
		render(<CancelRegistrationModal {...defaultProps} />);

		const options = screen.getAllByTestId('menu-item');
		expect(options).toHaveLength(4); // 1 disabled + 3 opções

		expect(options[1]).toHaveAttribute('value', 'Doença');
		expect(options[2]).toHaveAttribute('value', 'Conciliação de tempo');
		expect(options[3]).toHaveAttribute(
			'value',
			'A proposta do curso não agradou',
		);
	});
});
