/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	render,
	screen,
	fireEvent,
	act,
	waitFor,
} from '@testing-library/react';
import { ActivityEvaluationSlider } from './index';
import React from 'react';
import { useUserContext } from '@/app/providers/UserProvider';
import { SessionProvider } from 'next-auth/react';
import useSubmissions from '@/hooks/useSubmissions';

jest.mock('@/app/providers/UserProvider', () => ({
	useUserContext: jest.fn(),
}));

jest.mock('@/hooks/useSubmissions');

jest.mock('next-auth/react', () => {
	const originalModule = jest.requireActual('next-auth/react');
	return {
		...originalModule,
		useSession: jest.fn(() => ({
			data: {
				user: {
					id: 'test-user-id',
					name: 'Test User',
					email: 'test@example.com',
				},
			},
			status: 'authenticated',
		})),
	};
});

jest.mock('../ActivityEvaluation/ ActivityEvaluation.component', () => ({
	__esModule: true,
	default: ({ id, selectedActivity }: any) => (
		<div data-testid={`activity-${id}`}>Activity {selectedActivity}</div>
	),
}));

jest.mock('../ActivityManagement/components/ActivitiesSlider', () => ({
	ActivitiesSlider: () => <div>Activities Slider</div>,
}));

const mockClassId = '151673';
const mockClassesData = {
	[mockClassId]: {
		name: 'Matemática',
		teacher: 'João Silva',
		courses: {
			id: 1,
			evaluate_course: 'https://example.com/evaluate',
		},
		turno: {
			value: 'diurno',
		},
	},
};

const mockThemeSettings = {
	facilitator: { enable_room: true, enable_calendar: true },
	participant: { enable_room: true, enable_calendar: true },
	supervisor: { enable_room: true, enable_calendar: true },
	maintenance_mode: false,
	site_url: 'https://example.com',
	whatsapp_message_to_facilitator: 'Olá, Facilitador!',
	whatsapp_message_to_participant: 'Olá, Participante!',
	whatsapp_support_link: 'https://wa.me/1234567890',
	maintenance_mode_general_hub_active: false,
	maintenance_mode_general_hub_title: '',
	maintenance_mode_general_hub_message: '',
	maintenance_mode_general_hub_description: '',
};

const mockTurma = {
	students: [
		{
			id: 1,
			name: 'Aluno 1',
			email: 'aluno1@example.com',
			activities: [],
		},
	],
};

const mockActivityItems = [
	{
		id: 1,
		status: 'pending',
		items: [
			{
				id: '1',
				name: 'file1.pdf',
				type: 'application/pdf',
				url: 'https://example.com/file1.pdf',
			},
		],
		feedback: { note: 8, comment: 'Feedback 1' },
	},
	{
		id: 2,
		status: 'approved',
		items: [
			{
				id: '2',
				name: 'file2.pdf',
				type: 'application/pdf',
				url: 'https://example.com/file2.pdf',
			},
		],
		feedback: { note: 10, comment: 'Feedback 2' },
	},
];

const renderWithSession = (component: React.ReactElement) => {
	return render(<SessionProvider session={null}>{component}</SessionProvider>);
};

describe('ActivityEvaluationSlider', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(useUserContext as jest.Mock).mockReturnValue({
			classId: mockClassId,
			classesData: mockClassesData,
			themeSettings: mockThemeSettings,
		});
		(useSubmissions as jest.Mock).mockReturnValue({
			turma: mockTurma,
			loading: false,
		});
	});

	it('shows loader when classesData is null', async () => {
		(useUserContext as jest.Mock).mockReturnValue({
			classId: mockClassId,
			classesData: null,
			themeSettings: mockThemeSettings,
		});

		await act(async () => {
			renderWithSession(
				<ActivityEvaluationSlider
					items={mockActivityItems}
					selectedActivity={1}
					selectedParticipant={1}
					selectedStudentName='Aluno 1'
					selectedStudentEmail='aluno1@example.com'
				/>,
			);
		});

		expect(screen.getByText(/carregando/i)).toBeInTheDocument();
	});

	it('shows loader when classId is null', async () => {
		(useUserContext as jest.Mock).mockReturnValue({
			classId: null,
			classesData: mockClassesData,
			themeSettings: mockThemeSettings,
		});

		await act(async () => {
			renderWithSession(
				<ActivityEvaluationSlider
					items={mockActivityItems}
					selectedActivity={1}
					selectedParticipant={1}
					selectedStudentName='Aluno 1'
					selectedStudentEmail='aluno1@example.com'
				/>,
			);
		});

		expect(screen.getByText(/carregando/i)).toBeInTheDocument();
	});

	it('shows loader when loading is true', async () => {
		(useSubmissions as jest.Mock).mockReturnValue({
			turma: mockTurma,
			loading: true,
		});

		await act(async () => {
			renderWithSession(
				<ActivityEvaluationSlider
					items={mockActivityItems}
					selectedActivity={1}
					selectedParticipant={1}
					selectedStudentName='Aluno 1'
					selectedStudentEmail='aluno1@example.com'
				/>,
			);
		});

		expect(screen.getByText(/carregando/i)).toBeInTheDocument();
	});

	it('shows NotifyModal when class is null', async () => {
		(useSubmissions as jest.Mock).mockReturnValue({
			turma: null,
			loading: false,
		});

		await act(async () => {
			renderWithSession(
				<ActivityEvaluationSlider
					items={mockActivityItems}
					selectedActivity={1}
					selectedParticipant={1}
					selectedStudentName='Aluno 1'
					selectedStudentEmail='aluno1@example.com'
				/>,
			);
		});

		expect(
			screen.getByText(/não foi possível carregar a turma/i),
		).toBeInTheDocument();
	});

	it('renders the component correctly', async () => {
		await act(async () => {
			renderWithSession(
				<ActivityEvaluationSlider
					items={mockActivityItems}
					selectedActivity={1}
					selectedParticipant={1}
					selectedStudentName='Aluno 1'
					selectedStudentEmail='aluno1@example.com'
				/>,
			);
		});

		expect(screen.getByText(/1ª atividade/i)).toBeInTheDocument();
		expect(screen.getByTestId('activity-1')).toBeInTheDocument();
	});

	it('navigates to next activity when clicking next arrow', async () => {
		await act(async () => {
			renderWithSession(
				<ActivityEvaluationSlider
					items={mockActivityItems}
					selectedActivity={1}
					selectedParticipant={1}
					selectedStudentName='Aluno 1'
					selectedStudentEmail='aluno1@example.com'
				/>,
			);
		});

		const nextButton = screen.getByAltText(/próximo/i);

		await act(async () => {
			fireEvent.click(nextButton);
		});

		await waitFor(() => {
			expect(screen.getByText(/2ª atividade/i)).toBeInTheDocument();
		});
	});

	it('navigates to previous activity when clicking previous arrow', async () => {
		await act(async () => {
			renderWithSession(
				<ActivityEvaluationSlider
					items={mockActivityItems}
					selectedActivity={2}
					selectedParticipant={1}
					selectedStudentName='Aluno 1'
					selectedStudentEmail='aluno1@example.com'
				/>,
			);
		});

		const prevButton = screen.getByAltText(/anterior/i);

		await act(async () => {
			fireEvent.click(prevButton);
		});

		await waitFor(() => {
			expect(screen.getByText(/1ª atividade/i)).toBeInTheDocument();
		});
	});

	it('opens drawer when clicking Participants button', async () => {
		await act(async () => {
			renderWithSession(
				<ActivityEvaluationSlider
					items={mockActivityItems}
					selectedActivity={1}
					selectedParticipant={1}
					selectedStudentName='Aluno 1'
					selectedStudentEmail='aluno1@example.com'
				/>,
			);
		});

		const openButton = screen.getByText(/participantes/i);

		await act(async () => {
			fireEvent.click(openButton);
		});

		expect(screen.getByText(/fechar/i)).toBeInTheDocument();
	});

	it('closes drawer when clicking Close button', async () => {
		await act(async () => {
			renderWithSession(
				<ActivityEvaluationSlider
					items={mockActivityItems}
					selectedActivity={1}
					selectedParticipant={1}
					selectedStudentName='Aluno 1'
					selectedStudentEmail='aluno1@example.com'
				/>,
			);
		});

		const openButton = screen.getByText(/participantes/i);

		await act(async () => {
			fireEvent.click(openButton);
		});

		const closeButton = screen.getByText(/fechar/i);

		await act(async () => {
			fireEvent.click(closeButton);
		});

		expect(screen.getByText(/participantes/i)).toBeInTheDocument();
	});
});
