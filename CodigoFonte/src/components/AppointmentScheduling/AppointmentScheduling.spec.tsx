import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { AppointmentScheduling } from './index';
import React from 'react';

jest.mock('@/app/providers/UserProvider', () => ({
	useUserContext: jest.fn(() => ({
		classesData: {
			turma1: {
				enable_calendar: true,
				individual_meetings: [{ date: '2025-10-24' }],
				label_configuration: {},
				courses: {
					name: 'Curso Teste',
					slug: 'curso-teste',
					group_limit: 5,
					form_subjects: ['Assunto 1', 'Assunto 2'],
				},
				facilitator: 'facilitador-1',
			},
		},
	})),
}));

jest.mock('../Loader', () => ({
	Loader: () => <div data-testid='loader'>Carregando...</div>,
}));
jest.mock('@/components/Consultorias/hooks', () => ({
	useGetUserAppointment: jest.fn(() => []),
	getAvailableSlots: jest.fn(() => Promise.resolve({})),
	getAvaliableGroupMeetingsSlots: jest.fn(() => Promise.resolve({})),
}));
jest.mock('@/app/services/bff/ScheduleService', () => ({
	getAppointmentByClassAndCpf: jest.fn(() =>
		Promise.resolve({ data: [], meetingType: { data: {} } }),
	),
}));
jest.mock('@/app/services/bff/ClassService', () => ({
	getMeetingTypeByClassId: jest.fn(() =>
		Promise.resolve({
			data: {
				is_group_meetings_enabled: false,
				facilitator: { display_name: 'Facilitador Teste' },
			},
		}),
	),
}));
jest.mock('../NotifyModal', () => ({
	NotifyModal: () => <div data-testid='notify-modal'>Mensagem</div>,
}));
jest.mock('../AppointmentModal', () => ({
	AppointmentModal: () => <div data-testid='appointment-modal'>Modal</div>,
}));
jest.mock('@/components/Consultorias/components', () => ({
	ConsultancyFirstStep: () => <div data-testid='first-step'>FirstStep</div>,
	ConsultancySecondStep: () => <div data-testid='second-step'>SecondStep</div>,
	ConsultancyThirdStep: () => <div data-testid='third-step'>ThirdStep</div>,
}));

jest.mock('@/app/providers/UserProvider', () => ({
	useUserContext: jest.fn(),
}));
jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));
jest.mock('@/app/services/bff/ScheduleService', () => ({
	getAppointmentByClassAndCpf: jest.fn(),
}));

import { useUserContext } from '@/app/providers/UserProvider';
import { useRouter } from 'next/navigation';
import { getAppointmentByClassAndCpf } from '@/app/services/bff/ScheduleService';

const defaultQuestions = {
	social_network: '',
	main_topic: '',
	specific_questions: '',
};

const defaultProps = {
	classId: 'turma1',
	openModal: false,
	setOpenModal: jest.fn(),
	drawerStep: 0 as 0 | 1,
	setDrawerStep: jest.fn(),
	startTime: '',
	setStartTime: jest.fn(),
	consultancyDate: null,
	setConsultancyDate: jest.fn(),
	setQuestions: jest.fn(),
	questions: defaultQuestions,
	handleDrawerClose: jest.fn(),
};

describe('AppointmentScheduling', () => {
	beforeEach(() => {
		(getAppointmentByClassAndCpf as jest.Mock).mockImplementation(() =>
			Promise.resolve({ data: [], meetingType: { data: {} } }),
		);
	});
	it('shows loader when data is not ready', async () => {
		(useUserContext as jest.Mock).mockReturnValue({ classesData: null });
		await act(async () => {
			render(<AppointmentScheduling {...defaultProps} />);
		});
		expect(screen.getByTestId('loader')).toBeInTheDocument();
	});

	it('redirects to /home if enable_calendar is false', async () => {
		const pushMock = jest.fn();
		(useRouter as jest.Mock).mockReturnValue({ push: pushMock });
		(useUserContext as jest.Mock).mockReturnValue({
			classesData: {
				turma1: {
					enable_calendar: false,
					individual_meetings: [],
					label_configuration: {},
					courses: { name: '', slug: '', group_limit: 0, form_subjects: [] },
					facilitator: '',
				},
			},
		});
		(getAppointmentByClassAndCpf as jest.Mock).mockImplementation(() =>
			Promise.resolve({ data: [], meetingType: { data: {} } }),
		);
		await act(async () => {
			render(<AppointmentScheduling {...defaultProps} />);
			await new Promise((r) => setTimeout(r, 20));
		});
		expect(pushMock).toHaveBeenCalledWith('/home');
	});

	it('shows NotifyModal if all appointments completed', async () => {
		(useUserContext as jest.Mock).mockReturnValue({
			classesData: {
				turma1: {
					enable_calendar: true,
					individual_meetings: [{ date: '2026-10-24' }], // data futura
					label_configuration: {},
					courses: {
						name: 'Curso Teste',
						slug: 'curso-teste',
						group_limit: 5,
						form_subjects: [],
					},
					facilitator: 'facilitador-1',
				},
			},
		});
		(getAppointmentByClassAndCpf as jest.Mock).mockResolvedValue({
			data: [{}, {}],
			meetingType: { data: {} },
		});
		await act(async () => {
			render(<AppointmentScheduling {...defaultProps} />);
			await new Promise((r) => setTimeout(r, 10));
		});
		expect(await screen.findByTestId('notify-modal')).toBeInTheDocument();
	});

	it('renders steps and modal correctly', async () => {
		(useUserContext as jest.Mock).mockReturnValue({
			classesData: {
				turma1: {
					enable_calendar: true,
					individual_meetings: [],
					label_configuration: {},
					courses: {
						name: 'Curso Teste',
						slug: 'curso-teste',
						group_limit: 5,
						form_subjects: [],
					},
					facilitator: 'facilitador-1',
				},
			},
		});
		(getAppointmentByClassAndCpf as jest.Mock).mockResolvedValue({
			data: undefined,
			meetingType: { data: {} },
		});
		await act(async () => {
			render(
				<AppointmentScheduling
					{...defaultProps}
					openModal={true}
					drawerStep={0 as 0 | 1}
				/>,
			);
		});
		expect(await screen.findByTestId('first-step')).toBeInTheDocument();
		expect(screen.getByTestId('second-step')).toBeInTheDocument();
		expect(screen.getByTestId('appointment-modal')).toBeInTheDocument();
	});

	it('renders third step when drawerStep=1', async () => {
		(useUserContext as jest.Mock).mockReturnValue({
			classesData: {
				turma1: {
					enable_calendar: true,
					individual_meetings: [],
					label_configuration: {},
					courses: {
						name: 'Curso Teste',
						slug: 'curso-teste',
						group_limit: 5,
						form_subjects: [],
					},
					facilitator: 'facilitador-1',
				},
			},
		});
		(getAppointmentByClassAndCpf as jest.Mock).mockResolvedValue({
			data: undefined,
			meetingType: { data: {} },
		});
		await act(async () => {
			render(
				<AppointmentScheduling
					{...defaultProps}
					drawerStep={1 as 0 | 1}
					startTime='10:00'
					consultancyDate='2025-10-24'
				/>,
			);
		});
		expect(await screen.findByTestId('third-step')).toBeInTheDocument();
	});
});
