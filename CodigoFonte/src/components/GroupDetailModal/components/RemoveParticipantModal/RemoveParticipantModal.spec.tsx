import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useScheduleContext } from '@/app/providers/ScheduleProvider';
import * as ScheduleService from '@/app/services/bff/ScheduleService';
import { RemoveParticipantModal } from './RemoveParticipantModal.component';

// Mocks
jest.mock('@/app/providers/ScheduleProvider', () => ({
	useScheduleContext: jest.fn(),
}));

jest.mock('@/app/services/bff/ScheduleService', () => ({
	deleteBookingById: jest.fn(),
}));

describe('RemoveParticipantModal', () => {
	const mockOnClose = jest.fn();
	const mockMainModalClose = jest.fn();
	const mockSetSchedule = jest.fn();

	const mockSchedule = [
		{
			id: 'group1',
			type: 'group',
			group: [{ id: '1', name: 'Participante 1' }],
		},
	];

	beforeEach(() => {
		jest.clearAllMocks();
		(useScheduleContext as jest.Mock).mockReturnValue({
			schedule: mockSchedule,
			setSchedule: mockSetSchedule,
		});
	});

	it('renders modal with title and confirmation text', () => {
		render(
			<RemoveParticipantModal
				open={true}
				onClose={mockOnClose}
				mainModalClose={mockMainModalClose}
				booking_id='1'
				group_id='group1'
				class_id='class1'
			/>,
		);

		expect(
			screen.getByRole('heading', { level: 3, name: /Confirmar remoção/i }),
		).toBeInTheDocument();
		expect(
			screen.getByText(/Tem certeza de que deseja remover esse participante/i),
		).toBeInTheDocument();
	});

	it('calls deleteBookingById and updates schedule on confirm', async () => {
		(ScheduleService.deleteBookingById as jest.Mock).mockResolvedValue({
			status: 200,
			data: { id: '1' },
		});

		render(
			<RemoveParticipantModal
				open={true}
				onClose={mockOnClose}
				mainModalClose={mockMainModalClose}
				booking_id='1'
				group_id='group1'
				class_id='class1'
			/>,
		);

		const confirmButton = screen
			.getAllByText(/Confirmar/i)
			.find((el) => el.tagName.toLowerCase() === 'p' && el.closest('button'));
		fireEvent.click(confirmButton!);

		await waitFor(() => {
			expect(ScheduleService.deleteBookingById).toHaveBeenCalledWith('1');
			expect(mockSetSchedule).toHaveBeenCalled();
			expect(mockOnClose).toHaveBeenCalled();
			expect(mockMainModalClose).toHaveBeenCalled();
		});
	});

	it('does not update schedule if deleteBookingById fails (status != 200)', async () => {
		(ScheduleService.deleteBookingById as jest.Mock).mockResolvedValue({
			status: 500,
		});

		render(
			<RemoveParticipantModal
				open={true}
				onClose={mockOnClose}
				mainModalClose={mockMainModalClose}
				booking_id='1'
				group_id='group1'
				class_id='class1'
			/>,
		);

		const confirmButton = screen.getByRole('button', { name: /Confirmar/i });
		fireEvent.click(confirmButton);

		await waitFor(() => {
			expect(ScheduleService.deleteBookingById).toHaveBeenCalledWith('1');
			expect(mockSetSchedule).not.toHaveBeenCalled();
			expect(mockOnClose).toHaveBeenCalled();
			expect(mockMainModalClose).toHaveBeenCalled();
		});
	});

	it('returns null if prevState is null when updating schedule', async () => {
		(useScheduleContext as jest.Mock).mockReturnValue({
			schedule: null,
			setSchedule: mockSetSchedule,
		});

		(ScheduleService.deleteBookingById as jest.Mock).mockResolvedValue({
			status: 200,
			data: { id: '1' },
		});

		render(
			<RemoveParticipantModal
				open={true}
				onClose={mockOnClose}
				mainModalClose={mockMainModalClose}
				booking_id='1'
				group_id='group1'
				class_id='class1'
			/>,
		);

		const confirmButton = screen.getByRole('button', { name: /Confirmar/i });
		fireEvent.click(confirmButton);

		await waitFor(() => {
			expect(mockSetSchedule).toHaveBeenCalled();
			const setScheduleCallback = mockSetSchedule.mock.calls[0][0];
			expect(setScheduleCallback(null)).toBeNull();
		});
	});

	it('removes group booking when there are multiple participants', async () => {
		const mockScheduleWithMultiple = [
			{
				id: 'group1',
				type: 'group',
				group: [
					{ id: '1', name: 'Participante 1' },
					{ id: '2', name: 'Participante 2' },
				],
			},
		];

		(useScheduleContext as jest.Mock).mockReturnValue({
			schedule: mockScheduleWithMultiple,
			setSchedule: mockSetSchedule,
		});

		(ScheduleService.deleteBookingById as jest.Mock).mockResolvedValue({
			status: 200,
			data: { id: '1' },
		});

		render(
			<RemoveParticipantModal
				open={true}
				onClose={mockOnClose}
				mainModalClose={mockMainModalClose}
				booking_id='1'
				group_id='group1'
				class_id='class1'
			/>,
		);

		const confirmButton = screen.getByRole('button', { name: /Confirmar/i });
		fireEvent.click(confirmButton);

		await waitFor(() => {
			expect(mockSetSchedule).toHaveBeenCalled();
			const setScheduleCallback = mockSetSchedule.mock.calls[0][0];
			const result = setScheduleCallback(mockScheduleWithMultiple);
			expect(result[0].group).toHaveLength(1);
			expect(result[0].group[0].id).toBe('2');
		});
	});
});
