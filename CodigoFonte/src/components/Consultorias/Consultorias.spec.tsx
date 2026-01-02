import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { Consultorias } from './index';
import * as hooks from './hooks';
import { useUserContext } from '@/app/providers/UserProvider';
import { useRouter } from 'next/navigation';

// Mock hooks e providers
jest.mock('@/app/providers/UserProvider', () => ({
	useUserContext: jest.fn(),
}));

jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));

jest.mock('./hooks', () => ({
	getAvailableSlots: jest.fn(),
	getAvaliableGroupMeetingsSlots: jest.fn(),
	useGetUserAppointment: jest.fn(),
}));

jest.mock('../Loader', () => ({
	Loader: () => <div>Loader</div>,
}));

jest.mock('../AppointmentModal', () => ({
	AppointmentModal: ({ open }: { open: boolean }) =>
		open ? <div>Modal Aberto</div> : null,
}));

jest.mock('./components', () => ({
	ConsultancyFirstStep: ({
		consultancyDates,
		chooseConsultancyDate,
	}: {
		consultancyDates: string[];
		chooseConsultancyDate: (date: string) => void;
	}) => (
		<div>
			<div>Selecione a data</div>
			{consultancyDates.map((date: string) => (
				<button key={date} onClick={() => chooseConsultancyDate(date)}>
					{date}
				</button>
			))}
		</div>
	),
	ConsultancySecondStep: ({
		dateWithSlots,
		setStartTime,
	}: {
		dateWithSlots: { slots: string[] } | null;
		setStartTime: (time: string) => void;
	}) =>
		dateWithSlots ? (
			<div>
				{dateWithSlots.slots.map((time: string) => (
					<button key={time} onClick={() => setStartTime(time)}>
						{time}
					</button>
				))}
			</div>
		) : null,
}));

jest.mock(
	'./components/ConsultancyThirdStep/ConsultancyThirdStep.component',
	() => ({
		ConsultancyThirdStep: () => <div>Third Step</div>,
	}),
);

jest.mock('../ButtonIcon', () => ({
	ButtonIcon: ({ onClick, text }: { onClick: () => void; text: string }) => (
		<button onClick={onClick}>{text}</button>
	),
}));

jest.mock('../NotifyModal', () => ({
	NotifyModal: ({ message }: { message: string }) => <div>{message}</div>,
}));

describe('Consultorias component', () => {
	const mockClassId = '1';
	const mockClassesData = {
		[mockClassId]: {
			enable_calendar: true,
			individual_meetings: ['2025-08-15', '2025-08-16', '2025-08-17'],
			courses: {
				slug: 'curso-test',
				group_limit: 5,
				form_subjects: ['subject1', 'subject2'],
			},
			facilitator: 10,
		},
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const mockUserAppointments: any = [];

	const mockMeetingType = {
		is_group_meetings_enabled: false,
		facilitator: {
			ID: 1,
			user_firstname: 'Facilitador',
			user_lastname: 'Teste',
			display_name: 'Facilitador Teste',
			user_email: 'teste@exemplo.com',
			cpf: '12345678900',
			phone: '11999999999',
			whatsapp_message: 'Olá',
		},
	};

	const mockSlots = { slots: ['10:00', '11:00'] };

	beforeEach(() => {
		// Mock scrollIntoView
		Element.prototype.scrollIntoView = jest.fn();

		(useUserContext as jest.Mock).mockReturnValue({
			classesData: mockClassesData,
			classId: mockClassId,
		});
		(hooks.useGetUserAppointment as jest.Mock).mockReturnValue([]);
		(hooks.getAvailableSlots as jest.Mock).mockResolvedValue(mockSlots);
		(hooks.getAvaliableGroupMeetingsSlots as jest.Mock).mockResolvedValue(
			mockSlots,
		);
		(useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
	});

	it('shows loader when classesData or classId do not exist', () => {
		(useUserContext as jest.Mock).mockReturnValue({
			classesData: null,
			classId: null,
		});
		render(
			<Consultorias
				userAppointmentsByClass={mockUserAppointments}
				meetingType={mockMeetingType}
			/>,
		);
		expect(screen.getByText('Loader')).toBeInTheDocument();
	});

	it('redirects when enable_calendar is false', () => {
		const pushMock = jest.fn();
		(useRouter as jest.Mock).mockReturnValue({ push: pushMock });
		(useUserContext as jest.Mock).mockReturnValue({
			classesData: { [mockClassId]: { enable_calendar: false } },
			classId: mockClassId,
		});

		render(
			<Consultorias
				userAppointmentsByClass={mockUserAppointments}
				meetingType={mockMeetingType}
			/>,
		);
		expect(pushMock).toHaveBeenCalledWith('/home');
	});

	it('shows NotifyModal when enable_calendar is true but there are no individual_meetings', () => {
		(useUserContext as jest.Mock).mockReturnValue({
			classesData: {
				[mockClassId]: {
					enable_calendar: true,
					individual_meetings: [],
					courses: mockClassesData[mockClassId].courses,
				},
			},
			classId: mockClassId,
		});

		render(
			<Consultorias
				userAppointmentsByClass={mockUserAppointments}
				meetingType={mockMeetingType}
			/>,
		);
		expect(
			screen.getByText('Não há agendamentos disponíveis.'),
		).toBeInTheDocument();
	});

	it('renders ConsultancyFirstStep correctly', () => {
		render(
			<Consultorias
				userAppointmentsByClass={mockUserAppointments}
				meetingType={mockMeetingType}
			/>,
		);
		expect(screen.getByText('Selecione a data')).toBeInTheDocument();
	});

	it('renders available consultancy dates', () => {
		render(
			<Consultorias
				userAppointmentsByClass={mockUserAppointments}
				meetingType={mockMeetingType}
			/>,
		);
		expect(screen.getByText('2025-08-15')).toBeInTheDocument();
		expect(screen.getByText('2025-08-16')).toBeInTheDocument();
		expect(screen.getByText('2025-08-17')).toBeInTheDocument();
	});

	it('chama getAvailableSlots ao clicar em uma data', async () => {
		render(
			<Consultorias
				userAppointmentsByClass={mockUserAppointments}
				meetingType={mockMeetingType}
			/>,
		);

		const dateButton = screen.getByText('2025-08-15');
		fireEvent.click(dateButton);

		await waitFor(() => {
			expect(hooks.getAvailableSlots).toHaveBeenCalledWith(
				'2025-08-15',
				mockClassId,
			);
		});
	});

	it('calls getAvaliableGroupMeetingsSlots when is_group_meetings_enabled is true', async () => {
		const mockMeetingTypeGroup = {
			...mockMeetingType,
			is_group_meetings_enabled: true,
		};

		render(
			<Consultorias
				userAppointmentsByClass={mockUserAppointments}
				meetingType={mockMeetingTypeGroup}
			/>,
		);

		const dateButton = screen.getByText('2025-08-15');
		fireEvent.click(dateButton);

		await waitFor(() => {
			expect(hooks.getAvaliableGroupMeetingsSlots).toHaveBeenCalledWith(
				mockClassId,
				'2025-08-15',
			);
		});
	});
});
