import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ConflictModal } from './index';

// Mock do BaseModal para simplificar os testes
jest.mock('../BaseModal', () => ({
	BaseModal: ({
		open,
		onClose,
		header,
		children,
	}: {
		open: boolean;
		onClose: () => void;
		header: React.ReactNode;
		children: React.ReactNode;
	}) =>
		open ? (
			<div data-testid='base-modal'>
				{header}
				{children}
				<button onClick={onClose}>Fechar</button>
			</div>
		) : null,
}));

describe('ConflictModal component', () => {
	const props = {
		open: true,
		onClose: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders modal when open=true', () => {
		render(<ConflictModal {...props} />);
		expect(screen.getByTestId('base-modal')).toBeInTheDocument();
		expect(screen.getByText(/Atenção/i)).toBeInTheDocument();
		expect(screen.getByText(/Escolha um horário/i)).toBeInTheDocument();
	});

	it('does not render modal when open=false', () => {
		render(<ConflictModal {...props} open={false} />);
		expect(screen.queryByTestId('base-modal')).toBeNull();
	});

	it('calls onClose when clicking the close button', () => {
		render(<ConflictModal {...props} />);
		fireEvent.click(screen.getByText('Fechar'));
		expect(props.onClose).toHaveBeenCalledTimes(1);
	});
});
