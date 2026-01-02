import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppointmentModal } from './index';
import * as ScheduleService from '@/app/services/bff/ScheduleService';
import * as Hooks from '@/hooks';

jest.mock('@/app/services/bff/ScheduleService');
jest.mock('@/hooks');

const mockAppointment = {
	start_time: '2025-08-13T10:00:00',
	finish_time: '2025-08-13T11:00:00',
	additional_fields: {
		main_topic: 'Tema teste',
		social_network: 'Instagram',
		specific_questions: 'Pergunta teste',
		course_name: 'Curso Teste',
	},
	class_id: '1',
	employee_id: 1,
	type_id: 3 as 1 | 2 | 3 | 4,
	course_name: 'Curso Teste',
};

describe('AppointmentModal', () => {
	let setAppointments: jest.Mock;
	let onClose: jest.Mock;

	beforeEach(() => {
		setAppointments = jest.fn();
		onClose = jest.fn();
		(Hooks.getDateObject as jest.Mock).mockImplementation(() => ({
			dayName: 'Quarta',
			dayNumber: 13,
			hour: '10:00',
		}));
	});

	it('renders initial confirmation content', () => {
		render(
			<AppointmentModal
				open={true}
				onClose={onClose}
				appointment={mockAppointment}
				facilitator='Facilitador Teste'
				setAppointments={setAppointments}
			/>,
		);

		expect(
			screen.getByRole('heading', { name: /Confirme sua mentoria/i }),
		).toBeInTheDocument();
		expect(screen.getByText(/Facilitador Teste/i)).toBeInTheDocument();
		expect(screen.getByText(/10:00/i)).toBeInTheDocument();
	});

	it('calls createAppointment and updates state', async () => {
		(ScheduleService.createAppointment as jest.Mock).mockResolvedValue({
			status: 201,
			data: { id: 1, ...mockAppointment },
		});

		render(
			<AppointmentModal
				open={true}
				onClose={onClose}
				appointment={mockAppointment}
				facilitator='Facilitador Teste'
				setAppointments={setAppointments}
			/>,
		);

		const confirmBtn = screen.getByText(/Confirmar mentoria/i);
		fireEvent.click(confirmBtn);

		await waitFor(() => {
			expect(ScheduleService.createAppointment).toHaveBeenCalledWith(
				mockAppointment,
			);
			expect(setAppointments).toHaveBeenCalledWith(expect.any(Function));
		});

		// Conteúdo deve trocar para MentorshipConfirmed
		expect(
			screen.getByRole('heading', { name: /Mentoria confirmada/i }),
		).toBeInTheDocument();
		expect(screen.getByText(/Quarta/i)).toBeInTheDocument();
		expect(screen.getByText(/13/i)).toBeInTheDocument();
		expect(screen.getByText(/10:00h/i)).toBeInTheDocument();
	});
});
