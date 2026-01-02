import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CancelMatriculaModal } from './CancelMatriculaModal.component';

// Mock Material-UI components
jest.mock('@mui/material', () => ({
	Modal: ({
		children,
		open,
		onClose,
		...props
	}: {
		children: React.ReactNode;
		open: boolean;
		onClose?: (event: Record<string, unknown>, reason: string) => void;
		[key: string]: unknown;
	}) => (
		<div
			data-testid='modal'
			data-open={open}
			onClick={() => onClose && onClose({}, 'backdropClick')}
			{...props}>
			{children}
		</div>
	),
	Box: ({
		children,
		...props
	}: {
		children?: React.ReactNode;
		[key: string]: unknown;
	}) => <div {...props}>{children}</div>,
}));

jest.mock('@mui/icons-material/Close', () => ({
	__esModule: true,
	default: () => <div data-testid='close-icon'>×</div>,
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
	__esModule: true,
	default: ({
		src,
		alt,
		width,
		height,
		...props
	}: {
		src: string;
		alt: string;
		width: number;
		height: number;
		[key: string]: unknown;
	}) => (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			src={src}
			alt={alt}
			width={width}
			height={height}
			data-testid='next-image'
			{...props}
		/>
	),
}));

// Mock styled components
jest.mock('./CancelMatriculaModal.styles', () => ({
	ModalContainer: ({
		children,
		...props
	}: {
		children?: React.ReactNode;
		[key: string]: unknown;
	}) => (
		<div data-testid='modal-container' {...props}>
			{children}
		</div>
	),
	CloseButton: ({
		children,
		onClick,
		...props
	}: {
		children?: React.ReactNode;
		onClick?: () => void;
		[key: string]: unknown;
	}) => (
		<button data-testid='close-button' onClick={onClick} {...props}>
			{children}
		</button>
	),
	CancelButton: ({
		children,
		onClick,
		disabled,
		...props
	}: {
		children?: React.ReactNode;
		onClick?: () => void;
		disabled?: boolean;
		[key: string]: unknown;
	}) => (
		<button
			data-testid='cancel-button'
			onClick={onClick}
			disabled={disabled}
			{...props}>
			{children}
		</button>
	),
	ConfirmButton: ({
		children,
		onClick,
		disabled,
		...props
	}: {
		children?: React.ReactNode;
		onClick?: () => void;
		disabled?: boolean;
		[key: string]: unknown;
	}) => (
		<button
			data-testid='confirm-button'
			onClick={onClick}
			disabled={disabled}
			{...props}>
			{children}
		</button>
	),
	StudentCard: ({
		children,
		...props
	}: {
		children?: React.ReactNode;
		[key: string]: unknown;
	}) => (
		<div data-testid='student-card' {...props}>
			{children}
		</div>
	),
	ButtonContainer: ({
		children,
		...props
	}: {
		children?: React.ReactNode;
		[key: string]: unknown;
	}) => (
		<div data-testid='button-container' {...props}>
			{children}
		</div>
	),
}));

jest.mock('@mui/icons-material/Close', () => ({
	__esModule: true,
	default: () => <div data-testid='close-icon'>×</div>,
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
	__esModule: true,
	default: ({
		src,
		alt,
		width,
		height,
		...props
	}: {
		src: string;
		alt: string;
		width: number;
		height: number;
		[key: string]: unknown;
	}) => (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			src={src}
			alt={alt}
			width={width}
			height={height}
			data-testid='next-image'
			{...props}
		/>
	),
}));

// Mock styled components
jest.mock('./CancelMatriculaModal.styles', () => ({
	ModalContainer: ({
		children,
		...props
	}: {
		children?: React.ReactNode;
		[key: string]: unknown;
	}) => (
		<div data-testid='modal-container' {...props}>
			{children}
		</div>
	),
	CloseButton: ({
		children,
		onClick,
		...props
	}: {
		children?: React.ReactNode;
		onClick?: () => void;
		[key: string]: unknown;
	}) => (
		<button data-testid='close-button' onClick={onClick} {...props}>
			{children}
		</button>
	),
	CancelButton: ({
		children,
		onClick,
		disabled,
		...props
	}: {
		children?: React.ReactNode;
		onClick?: () => void;
		disabled?: boolean;
		[key: string]: unknown;
	}) => (
		<button
			data-testid='cancel-button'
			onClick={onClick}
			disabled={disabled}
			{...props}>
			{children}
		</button>
	),
	ConfirmButton: ({
		children,
		onClick,
		disabled,
		...props
	}: {
		children?: React.ReactNode;
		onClick?: () => void;
		disabled?: boolean;
		[key: string]: unknown;
	}) => (
		<button
			data-testid='confirm-button'
			onClick={onClick}
			disabled={disabled}
			{...props}>
			{children}
		</button>
	),
	StudentCard: ({
		children,
		...props
	}: {
		children?: React.ReactNode;
		[key: string]: unknown;
	}) => (
		<div data-testid='student-card' {...props}>
			{children}
		</div>
	),
	ButtonContainer: ({
		children,
		...props
	}: {
		children?: React.ReactNode;
		[key: string]: unknown;
	}) => (
		<div data-testid='button-container' {...props}>
			{children}
		</div>
	),
}));

// Mock styled components
jest.mock('./CancelMatriculaModal.styles', () => ({
	ModalContainer: ({
		children,
		...props
	}: {
		children?: React.ReactNode;
		[key: string]: unknown;
	}) => (
		<div data-testid='modal-container' {...props}>
			{children}
		</div>
	),
	CloseButton: ({
		children,
		onClick,
		...props
	}: {
		children?: React.ReactNode;
		onClick?: () => void;
		[key: string]: unknown;
	}) => (
		<button data-testid='close-button' onClick={onClick} {...props}>
			{children}
		</button>
	),
	CancelButton: ({
		children,
		onClick,
		disabled,
		...props
	}: {
		children?: React.ReactNode;
		onClick?: () => void;
		disabled?: boolean;
		[key: string]: unknown;
	}) => (
		<button
			data-testid='cancel-button'
			onClick={onClick}
			disabled={disabled}
			{...props}>
			{children}
		</button>
	),
	ConfirmButton: ({
		children,
		onClick,
		disabled,
		...props
	}: {
		children?: React.ReactNode;
		onClick?: () => void;
		disabled?: boolean;
		[key: string]: unknown;
	}) => (
		<button
			data-testid='confirm-button'
			onClick={onClick}
			disabled={disabled}
			{...props}>
			{children}
		</button>
	),
	StudentCard: ({
		children,
		...props
	}: {
		children?: React.ReactNode;
		[key: string]: unknown;
	}) => (
		<div data-testid='student-card' {...props}>
			{children}
		</div>
	),
	ButtonContainer: ({
		children,
		...props
	}: {
		children?: React.ReactNode;
		[key: string]: unknown;
	}) => (
		<div data-testid='button-container' {...props}>
			{children}
		</div>
	),
}));

describe('CancelMatriculaModal', () => {
	const defaultProps = {
		title: 'Cancelamento de Matrícula',
		message: 'Tem certeza que deseja cancelar a matrícula?',
		studentName: 'João Silva',
		onConfirm: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the modal with basic props', () => {
		render(<CancelMatriculaModal {...defaultProps} />);

		expect(screen.getByTestId('modal')).toBeInTheDocument();
		expect(screen.getByText('Confirmar')).toBeInTheDocument();
		expect(screen.getByText('Cancelamento de Matrícula')).toBeInTheDocument();
		expect(screen.getByText('João Silva (323)')).toBeInTheDocument();
		expect(
			screen.getByText('Tem certeza que deseja cancelar a matrícula?'),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				'⚠ ️ Atenção! Esta ação não pode ser desfeita e o participante perderá permanentemente o progresso no curso.',
			),
		).toBeInTheDocument();
	});

	it('renders subtitle when provided', () => {
		render(
			<CancelMatriculaModal
				{...defaultProps}
				subtitle='Confirmação necessária'
			/>,
		);

		expect(screen.getByText('Confirmação necessária')).toBeInTheDocument();
	});

	it('renders formatted student phone number', () => {
		render(
			<CancelMatriculaModal {...defaultProps} studentPhone='5511987654321' />,
		);

		expect(screen.getByText('11 9 8765-4321')).toBeInTheDocument();
	});

	it('does not render phone when not provided', () => {
		render(<CancelMatriculaModal {...defaultProps} />);

		expect(screen.queryByText(/11 9 8765-4321/)).not.toBeInTheDocument();
	});

	it('calls onCancel when close button is clicked', () => {
		const onCancel = jest.fn();
		render(<CancelMatriculaModal {...defaultProps} onCancel={onCancel} />);

		const closeButton = screen.getByTestId('close-button');
		fireEvent.click(closeButton);

		expect(onCancel).toHaveBeenCalled();
	});

	it('calls onCancel when modal is closed by backdrop', () => {
		const onCancel = jest.fn();
		render(<CancelMatriculaModal {...defaultProps} onCancel={onCancel} />);

		const modal = screen.getByTestId('modal');
		fireEvent.click(modal);

		expect(onCancel).toHaveBeenCalled();
	});

	it('calls onConfirm when confirm button is clicked', () => {
		render(<CancelMatriculaModal {...defaultProps} />);

		const confirmButton = screen.getByTestId('confirm-button');
		fireEvent.click(confirmButton);

		expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
	});

	it('calls onCancel when review button is clicked', () => {
		const onCancel = jest.fn();
		render(<CancelMatriculaModal {...defaultProps} onCancel={onCancel} />);

		const cancelButton = screen.getByTestId('cancel-button');
		fireEvent.click(cancelButton);

		expect(onCancel).toHaveBeenCalled();
	});

	it('disables buttons when isSubmitting is true', () => {
		render(<CancelMatriculaModal {...defaultProps} isSubmitting={true} />);

		const cancelButton = screen.getByTestId('cancel-button');
		const confirmButton = screen.getByTestId('confirm-button');

		expect(cancelButton).toBeDisabled();
		expect(confirmButton).toBeDisabled();
	});

	it('shows processing text when isSubmitting is true', () => {
		render(<CancelMatriculaModal {...defaultProps} isSubmitting={true} />);

		expect(screen.getByText('Processando...')).toBeInTheDocument();
	});

	it('shows confirmation text when isSubmitting is false', () => {
		render(<CancelMatriculaModal {...defaultProps} isSubmitting={false} />);

		expect(screen.getByText('Confirmar cancelamento')).toBeInTheDocument();
	});

	it('renders HTML in message using dangerouslySetInnerHTML', () => {
		render(
			<CancelMatriculaModal
				{...defaultProps}
				message='<strong>Importante:</strong> Esta ação é irreversível.'
			/>,
		);

		const messageElement = screen.getByText('Importante:').closest('p');
		expect(messageElement).toContainHTML(
			'<strong>Importante:</strong> Esta ação é irreversível.',
		);
	});

	it('renders icons correctly', () => {
		render(<CancelMatriculaModal {...defaultProps} />);

		const images = screen.getAllByTestId('next-image');
		expect(images).toHaveLength(2); // ícone do usuário e ícone do botão confirmar

		expect(images[0]).toHaveAttribute('src', '/icon-user.svg');
		expect(images[1]).toHaveAttribute('src', '/send.svg');
	});

	it('does not call onCancel when not provided', () => {
		render(<CancelMatriculaModal {...defaultProps} />);

		const closeButton = screen.getByTestId('close-button');
		fireEvent.click(closeButton);

		// Não deve quebrar se onCancel não for fornecido
		expect(() => fireEvent.click(closeButton)).not.toThrow();
	});
});
