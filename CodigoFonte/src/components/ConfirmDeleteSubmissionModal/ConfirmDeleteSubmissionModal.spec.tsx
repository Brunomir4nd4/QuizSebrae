import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmDeleteSubmissionModal from './index';

jest.mock('../BaseModal', () => ({
	BaseModal: ({
		open,
		header,
		footer,
		children,
	}: {
		open: boolean;
		header: React.ReactNode;
		footer: React.ReactNode;
		children: React.ReactNode;
	}) =>
		open ? (
			<div data-testid='base-modal'>
				{header}
				{children}
				<div data-testid='modal-footer'>{footer}</div>
			</div>
		) : null,
}));

describe('ConfirmDeleteSubmissionModal', () => {
	const mockHandleClose = jest.fn();
	const mockDeleteSubmission = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders modal when open is true', () => {
		render(
			<ConfirmDeleteSubmissionModal
				open={true}
				handleClose={mockHandleClose}
				deleteSubmission={mockDeleteSubmission}
			/>,
		);

		expect(screen.getByTestId('base-modal')).toBeInTheDocument();
		expect(screen.getByText('Liberar reenvio')).toBeInTheDocument();
		expect(screen.getByText('da atividade?')).toBeInTheDocument();
		expect(
			screen.getByText(/Tem certeza que deseja liberar o reenvio da atividade/),
		).toBeInTheDocument();
	});

	it('does not render modal when open is false', () => {
		render(
			<ConfirmDeleteSubmissionModal
				open={false}
				handleClose={mockHandleClose}
				deleteSubmission={mockDeleteSubmission}
			/>,
		);

		expect(screen.queryByTestId('base-modal')).not.toBeInTheDocument();
	});

	it('calls handleClose when "No, go back" button is clicked', () => {
		render(
			<ConfirmDeleteSubmissionModal
				open={true}
				handleClose={mockHandleClose}
				deleteSubmission={mockDeleteSubmission}
			/>,
		);

		const backButton = screen.getByText('Não, voltar');
		fireEvent.click(backButton);

		expect(mockHandleClose).toHaveBeenCalledTimes(1);
	});

	it('calls deleteSubmission when "Yes, release" button is clicked', () => {
		render(
			<ConfirmDeleteSubmissionModal
				open={true}
				handleClose={mockHandleClose}
				deleteSubmission={mockDeleteSubmission}
			/>,
		);

		const deleteButton = screen.getByText('Sim, liberar');
		fireEvent.click(deleteButton);

		expect(mockDeleteSubmission).toHaveBeenCalledTimes(1);
	});
});
