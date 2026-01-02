import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ConsultancyFirstStep } from '../index';

jest.mock('next-auth/react', () => ({
	useSession: () => ({
		data: {
			user: {
				id: 1,
				name: 'Test User',
			},
		},
		status: 'authenticated',
	}),
}));

jest.mock('@/hooks', () => ({
	getDateObject: (date: string) => {
		const map: Record<
			string,
			{ dayName: string; dayNumber: string; mounthName: string; hour: string }
		> = {
			'2025-08-18': {
				dayName: 'Seg',
				dayNumber: '18',
				mounthName: 'Agosto',
				hour: '14:00',
			},
			'2025-08-19': {
				dayName: 'Ter',
				dayNumber: '19',
				mounthName: 'Agosto',
				hour: '15:00',
			},
			'2025-08-20': {
				dayName: 'Qua',
				dayNumber: '20',
				mounthName: 'Agosto',
				hour: '16:00',
			},
		};
		return (
			map[date] || {
				dayName: 'Seg',
				dayNumber: '01',
				mounthName: 'Janeiro',
				hour: '00:00',
			}
		);
	},
	dateIsBeforeToday: () => false,
	checkIfAnyDateIsAfterToday: () => true,
}));

describe('ConsultancyFirstStep', () => {
	const chooseDateMock = jest.fn();
	const consultancyDatesMock = [['2025-08-18', '2025-08-19', '2025-08-20']];
	const userAppointmentsMock = null;

	beforeEach(() => {
		chooseDateMock.mockClear();
	});

	it('calls chooseConsultancyDate when clicking CardWeekDay', () => {
		render(
			<ConsultancyFirstStep
				consultancyDates={consultancyDatesMock}
				currentDateSelected={null}
				classId='1'
				userAppointments={userAppointmentsMock}
				chooseConsultancyDate={chooseDateMock}
				is_group_meetings_enabled={false}
				labelConfiguration={{
					label_configuration_regular: 'Test Label Regular',
					label_configuration_strong: 'Test Label Strong',
					label_configuration_suffix: 'Test Label Suffix',
				}}
			/>,
		);

		const card = screen.getByText('18');
		fireEvent.click(card);

		expect(chooseDateMock).toHaveBeenCalledWith('2025-08-18');
	});

	it('renders mentorship title with custom labels', () => {
		render(
			<ConsultancyFirstStep
				consultancyDates={consultancyDatesMock}
				currentDateSelected={null}
				classId='1'
				userAppointments={userAppointmentsMock}
				chooseConsultancyDate={chooseDateMock}
				is_group_meetings_enabled={false}
				labelConfiguration={{
					label_configuration_regular: 'Individual',
					label_configuration_strong: 'Mentoria',
					label_configuration_suffix: 'ª',
				}}
			/>,
		);

		expect(screen.getByText(/1ª Mentoria/i)).toBeInTheDocument();
		expect(screen.getByText(/Individual/i)).toBeInTheDocument();
	});

	it('displays ConsultancyConfirmed when scheduling already exists', () => {
		const userAppointmentsWithData = {
			1: {
				id: 1,
				start_time: '2025-08-18 14:00:00',
				finish_time: '2025-08-18 15:00:00',
				comments: '',
				additional_fields: null,
				class_id: '1',
				type_id: 1 as const,
				client_id: null,
				employee_id: 123,
				created_at: '2025-08-01 00:00:00',
				updated_at: '2025-08-01 00:00:00',
				deleted_at: null,
				client: null,
				employee: {
					id: 123,
					name: 'Employee Test',
					cpf: '12345678900',
					email: 'test@test.com',
					phone_number: '999999999',
					created_at: '2025-08-01 00:00:00',
					updated_at: '2025-08-01 00:00:00',
					deleted_at: null,
				},
			},
		};

		render(
			<ConsultancyFirstStep
				consultancyDates={consultancyDatesMock}
				currentDateSelected={null}
				classId='1'
				userAppointments={userAppointmentsWithData}
				chooseConsultancyDate={chooseDateMock}
				is_group_meetings_enabled={false}
				labelConfiguration={{
					label_configuration_regular: 'Individual',
					label_configuration_strong: 'Mentoria',
					label_configuration_suffix: 'ª',
				}}
			/>,
		);

		// Não deve renderizar os cards de seleção de data
		expect(screen.queryByText('18')).not.toBeInTheDocument();
	});

	it('renders multiple dates correctly', () => {
		render(
			<ConsultancyFirstStep
				consultancyDates={consultancyDatesMock}
				currentDateSelected={null}
				classId='1'
				userAppointments={userAppointmentsMock}
				chooseConsultancyDate={chooseDateMock}
				is_group_meetings_enabled={false}
				labelConfiguration={{
					label_configuration_regular: 'Individual',
					label_configuration_strong: 'Mentoria',
					label_configuration_suffix: 'ª',
				}}
			/>,
		);

		expect(screen.getByText('18')).toBeInTheDocument();
		expect(screen.getByText('19')).toBeInTheDocument();
		expect(screen.getByText('20')).toBeInTheDocument();
	});

	it('renders multiple mentorship blocks', () => {
		const multipleDates = [
			['2025-08-18', '2025-08-19'],
			['2025-08-25', '2025-08-26'],
		];

		render(
			<ConsultancyFirstStep
				consultancyDates={multipleDates}
				currentDateSelected={null}
				classId='1'
				userAppointments={userAppointmentsMock}
				chooseConsultancyDate={chooseDateMock}
				is_group_meetings_enabled={false}
				labelConfiguration={{
					label_configuration_regular: 'Individual',
					label_configuration_strong: 'Mentoria',
					label_configuration_suffix: 'ª',
				}}
			/>,
		);

		expect(screen.getByText(/1ª Mentoria/i)).toBeInTheDocument();
		expect(screen.getByText(/2ª Mentoria/i)).toBeInTheDocument();
	});

	it('uses default labels when not provided', () => {
		render(
			<ConsultancyFirstStep
				consultancyDates={consultancyDatesMock}
				currentDateSelected={null}
				classId='1'
				userAppointments={userAppointmentsMock}
				chooseConsultancyDate={chooseDateMock}
				is_group_meetings_enabled={false}
				labelConfiguration={{
					label_configuration_regular: '',
					label_configuration_strong: '',
					label_configuration_suffix: '',
				}}
			/>,
		);

		// Deve usar os valores padrão
		expect(screen.getByText(/1ª Mentoria/i)).toBeInTheDocument();
	});
});
