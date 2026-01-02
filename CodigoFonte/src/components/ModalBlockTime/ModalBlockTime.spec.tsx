import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ModalBlockTime } from './ModalBlockTime.component';
import { AppointmentDeleteResponse } from '@/types/IAppointment';
import {
	ScheduleEvent,
	ScheduleEventType,
} from '../Schedule/models/ScheduleEvent';
import { DateTime } from 'luxon';

// Mock next-auth
jest.mock('next-auth/react', () => ({
	useSession: jest.fn(),
}));

// Mock ScheduleProvider
jest.mock('@/app/providers/ScheduleProvider', () => ({
	useScheduleContext: jest.fn(),
}));

// Mock BaseModal
jest.mock('../BaseModal', () => ({
	BaseModal: ({
		onClose,
		header,
		footer,
		children,
	}: {
		open: boolean;
		onClose: () => void;
		header: React.ReactNode;
		footer?: React.ReactNode;
		children: React.ReactNode;
	}) => (
		<div data-testid='base-modal'>
			<div data-testid='modal-header'>{header}</div>
			<div data-testid='modal-body'>{children}</div>
			{footer && <div data-testid='modal-footer'>{footer}</div>}
			<button data-testid='modal-close' onClick={onClose}>
				Close
			</button>
		</div>
	),
}));

// Mock MUI components
jest.mock('@mui/material', () => ({
	Box: ({
		children,
		className,
	}: {
		children: React.ReactNode;
		className?: string;
	}) => (
		<div className={className} data-testid='mui-box'>
			{children}
		</div>
	),
	Divider: () => <div data-testid='mui-divider' />,
	Modal: () => null,
}));

jest.mock('@mui/icons-material/Close', () => {
	const CloseIcon = () => <div data-testid='close-icon' />;
	CloseIcon.displayName = 'CloseIcon';
	return CloseIcon;
});

// Mock MUI system
jest.mock('@mui/system', () => ({
	styled: (component: React.ComponentType) => () => component,
}));

// Mock Schedule component
jest.mock('../Schedule', () => ({
	BOOKING_TYPE: {
		1: 'block',
		2: 'meeting',
		3: 'appointment',
		4: 'group',
	},
}));

// Mock styles
jest.mock('./ModalBlockTime.styles', () => ({
	ModalButton: ({
		children,
		onClick,
	}: {
		children: React.ReactNode;
		onClick: () => void;
	}) => (
		<button data-testid='modal-button' onClick={onClick}>
			{children}
		</button>
	),
}));

import { useSession } from 'next-auth/react';
import { useScheduleContext } from '@/app/providers/ScheduleProvider';

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockUseScheduleContext = useScheduleContext as jest.MockedFunction<
	typeof useScheduleContext
>;

describe('ModalBlockTime Component', () => {
	const mockOnClose = jest.fn();
	const mockBlockCallback = jest.fn();
	const mockSetSchedule = jest.fn();

	const defaultProps = {
		open: true,
		onClose: mockOnClose,
		blockCallback: mockBlockCallback,
		type: 'block' as const,
	};

	const mockAppointmentResponse: AppointmentDeleteResponse = {
		status: 201,
		data: {
			id: 123,
			start_time: '2025-01-15 10:00:00',
			finish_time: '2025-01-15 11:00:00',
			comments: 'Test Block',
			additional_fields: null,
			class_id: 'class-1',
			type_id: 1,
			client_id: null,
			employee_id: 456,
			created_at: '2025-01-15 09:00:00',
			updated_at: '2025-01-15 09:00:00',
			deleted_at: null,
			client: null,
			employee: {
				id: 456,
				name: 'Test Employee',
				cpf: '12345678901',
				email: 'employee@test.com',
				phone_number: '11999999999',
				created_at: '2025-01-01 00:00:00',
				updated_at: '2025-01-01 00:00:00',
				deleted_at: null,
			},
		},
		message: 'Success',
	};

	beforeEach(() => {
		jest.clearAllMocks();

		// Default mocks
		mockUseSession.mockReturnValue({
			data: {
				user: {
					role: ['facilitator'],
				},
			},
		} as ReturnType<typeof useSession>);

		mockUseScheduleContext.mockReturnValue({
			scheduleData: 0,
			schedule: null,
			loading: false,
			date: DateTime.now(),
			dayViewDate: DateTime.now(),
			setDayViewDate: jest.fn(),
			setDate: jest.fn(),
			setScheduleData: jest.fn(),
			setSchedule: mockSetSchedule,
		});
	});

	describe('Supervisor Role', () => {
		it('should render error message for supervisor role', () => {
			mockUseSession.mockReturnValue({
				data: {
					user: {
						role: ['supervisor'],
					},
				},
			} as ReturnType<typeof useSession>);

			render(<ModalBlockTime {...defaultProps} />);

			expect(screen.getByTestId('modal-header')).toHaveTextContent('Atenção');
			expect(screen.getByTestId('modal-body')).toHaveTextContent(
				'Você não pode realizar está ação',
			);
			expect(screen.queryByTestId('modal-button')).not.toBeInTheDocument();
		});
	});

	describe('Non-Supervisor Role', () => {
		it('should render block modal for non-supervisor', () => {
			render(<ModalBlockTime {...defaultProps} />);

			expect(screen.getByTestId('modal-header')).toHaveTextContent(
				'Bloquear Horário',
			);
			expect(screen.getByTestId('modal-body')).toHaveTextContent(
				'Deseja Bloquear esse horário?',
			);
			expect(screen.getByTestId('modal-button')).toBeInTheDocument();
		});

		it('should render unblock modal when type is unblock', () => {
			render(<ModalBlockTime {...defaultProps} type='unblock' />);

			expect(screen.getByTestId('modal-header')).toHaveTextContent(
				'Desbloquear Horário',
			);
			expect(screen.getByTestId('modal-body')).toHaveTextContent(
				'Deseja Desbloquear esse horário?',
			);
		});

		it('should call onClose when modal close button is clicked', () => {
			render(<ModalBlockTime {...defaultProps} />);

			fireEvent.click(screen.getByTestId('modal-close'));

			expect(mockOnClose).toHaveBeenCalledTimes(1);
		});

		it('should call blockCallback and update schedule on successful block', async () => {
			mockBlockCallback.mockResolvedValue(mockAppointmentResponse);

			render(<ModalBlockTime {...defaultProps} />);

			fireEvent.click(screen.getByTestId('modal-button'));

			await waitFor(() => {
				expect(mockBlockCallback).toHaveBeenCalledTimes(1);
			});

			expect(mockSetSchedule).toHaveBeenCalledWith(expect.any(Function));

			// Verify the schedule update function adds the blocked time
			const updateFunction = mockSetSchedule.mock.calls[0][0];
			const result = updateFunction(null);
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({
				id: '123',
				client_name: 'Bloqueado',
				title: 'Test Block',
				class_id: '',
			});
		});

		it('should remove from schedule on successful unblock (status 200)', async () => {
			const unblockResponse = { ...mockAppointmentResponse, status: 200 };
			mockBlockCallback.mockResolvedValue(unblockResponse);

			render(<ModalBlockTime {...defaultProps} type='unblock' />);

			fireEvent.click(screen.getByTestId('modal-button'));

			await waitFor(() => {
				expect(mockBlockCallback).toHaveBeenCalledTimes(1);
			});

			expect(mockSetSchedule).toHaveBeenCalledWith(expect.any(Function));

			// Verify the schedule update function removes the blocked time
			const updateFunction = mockSetSchedule.mock.calls[0][0];
			const existingSchedule: ScheduleEvent[] = [
				{
					id: '123',
					client_name: 'Bloqueado',
					title: 'Test Block',
					type: ScheduleEventType.Block,
					start: new Date(),
					end: new Date(),
					additional_fields: {
						main_topic: '',
						social_network: '',
						specific_questions: '',
					},
					client: {
						cpf: '',
						email: null,
						phone_number: null,
						name: '',
						id: 0,
					},
					employee: {
						cpf: '',
						email: null,
						phone_number: null,
						name: '',
						id: 456,
					},
					class_id: '',
				},
			];
			const result = updateFunction(existingSchedule);
			expect(result).toHaveLength(0);
		});

		it('should call onClose after successful operation', async () => {
			mockBlockCallback.mockResolvedValue(mockAppointmentResponse);

			render(<ModalBlockTime {...defaultProps} />);

			fireEvent.click(screen.getByTestId('modal-button'));

			await waitFor(() => {
				expect(mockOnClose).toHaveBeenCalledTimes(1);
			});
		});
	});
});
