import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ConfirmModal } from './index';

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

describe('ConfirmModal component', () => {
	const props = {
		open: true,
		onClose: jest.fn(),
		week: 'Segunda-feira',
		start: '14:00',
		number: '1',
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders modal when open=true', () => {
		render(<ConfirmModal {...props} />);
		expect(screen.getByTestId('base-modal')).toBeInTheDocument();
		expect(screen.getByText(/Mentoria/i)).toBeInTheDocument();
		expect(screen.getByText(props.week)).toBeInTheDocument();
		expect(screen.getByText(props.number)).toBeInTheDocument();
		expect(screen.getByText(`${props.start}h`)).toBeInTheDocument();
		expect(screen.getByText(/Seu horário/i)).toBeInTheDocument();
		expect(screen.getByText(/Atenção/i)).toBeInTheDocument();
	});

	it('does not render modal when open=false', () => {
		render(<ConfirmModal {...props} open={false} />);
		expect(screen.queryByTestId('base-modal')).toBeNull();
	});

	it('calls onClose when clicking the close button', () => {
		render(<ConfirmModal {...props} />);
		fireEvent.click(screen.getByText('Fechar'));
		expect(props.onClose).toHaveBeenCalledTimes(1);
	});
});
