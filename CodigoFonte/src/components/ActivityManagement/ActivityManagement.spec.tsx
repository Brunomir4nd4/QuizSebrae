/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	render,
	screen,
	fireEvent,
	act,
	waitFor,
} from '@testing-library/react';
import { ActivityManagement } from './index';
import React from 'react';
import { useUserContext } from '@/app/providers/UserProvider';
import useSubmissions from '@/hooks/useSubmissions';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getSubmissionFiles } from '@/app/services/bff/SubmissionService';
import { updateActivityToExternalUtil } from '@/utils/updateActivityToExternalUtil';
import { useActivityTemplates } from '@/hooks/useActivityTemplates';

jest.mock('@/app/providers/UserProvider', () => ({
	useUserContext: jest.fn(),
}));

jest.mock('@/hooks/useActivityTemplates', () => ({
	useActivityTemplates: jest.fn(),
}));

jest.mock('@/hooks/useSubmissions');

jest.mock('next-auth/react', () => {
	const originalModule = jest.requireActual('next-auth/react');
	return {
		...originalModule,
		useSession: jest.fn(() => ({
			data: {
				user: {
					id: 'facilitator-123',
					name: 'Test Facilitator',
					email: 'facilitator@example.com',
					role: ['facilitator'],
				},
			},
			status: 'authenticated',
		})),
		SessionProvider: ({ children }: any) => <>{children}</>,
	};
});

jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));

jest.mock('@/app/services/bff/SubmissionService', () => ({
	createSubmission: jest.fn(),
	getSubmissionFiles: jest.fn(),
}));

jest.mock('@/utils/updateActivityToExternalUtil', () => ({
	updateActivityToExternalUtil: jest.fn(),
}));

jest.mock('@/utils/dateUtils', () => ({
	isDateWithinLimit: jest.fn(() => true),
}));

jest.mock('../Loader', () => ({
	Loader: () => <div data-testid='loader'>Carregando...</div>,
}));

jest.mock('../NotifyModal', () => ({
	NotifyModal: ({ title, message }: any) => (
		<div data-testid='notify-modal'>
			<h1>{title}</h1>
			<p>{message}</p>
		</div>
	),
}));

jest.mock('../ButtonDownload', () => ({
	ButtonDownload: ({ text, onClick }: any) => (
		<button onClick={onClick}>{text}</button>
	),
}));

jest.mock('../ParticipacaoTable/components', () => ({
	BootstrapTooltip: ({ children, title }: any) => (
		<span title={title}>{children}</span>
	),
	WhatsAppButton: ({ whatsAppMessage }: any) => <span>{whatsAppMessage}</span>,
}));

jest.mock('./components/SummaryOfActivities.component', () => ({
	SummaryOfActivities: () => <div>Resumo</div>,
}));

jest.mock('./components/Filter.component', () => ({
	Filter: ({ filter, onChange }: any) => (
		<select value={filter} onChange={(e) => onChange(e.target.value)}>
			<option value='todas'>Todas</option>
			<option value='aprovadas'>Aprovadas</option>
		</select>
	),
}));

jest.mock('./components/ActivitiesSlider', () => ({
	ActivitiesSlider: ({ students }: any) => (
		<div data-testid='activities-slider'>Slider {students.length}</div>
	),
}));

jest.mock('@/utils/shouldIncludeStudent', () => ({
	shouldIncludeStudent: () => true,
}));

const mockClassId = '151673';
const mockClassesData = {
	[mockClassId]: {
		id: 1,
		name: 'Matemática',
		teacher: 'João Silva',
		end_date: '2025-12-31',
		courses: {
			id: 1,
			name: 'Curso de Matemática',
		},
		ciclos: {
			id: 1,
		},
		turno: {
			value: 'diurno',
		},
	},
};

const mockTurma = {
	activities: 2,
	students: [
		{
			id: 'stu1',
			name: 'Aluno 1',
			cpf: '123456789',
			phone: '999999999',
			email: 'aluno1@example.com',
			activities: [
				{ activity_id: 1, status: 'recebida' },
				{ activity_id: 2, status: 'avaliada' },
			],
		},
		{
			id: 'stu2',
			name: 'Aluno 2',
			cpf: '987654321',
			phone: '888888888',
			email: 'aluno2@example.com',
			activities: [
				{ activity_id: 1, status: 'não recebida' },
				{ activity_id: 2, status: 'recebida em outro canal' },
			],
		},
	],
};

const mockThemeSettings = {
	whatsapp_message_to_facilitator: 'Olá, Facilitador!',
};

const mockUseActivityTemplates = useActivityTemplates as jest.Mock;

const baseActivityTemplatesMock = {
	templates: {},
	uploadTemplate: jest.fn(),
	deleteTemplate: jest.fn(),
	fetchTemplates: jest.fn().mockResolvedValue(undefined),
	loading: false,
};

const renderWithSession = (component: React.ReactElement) => {
	return render(<SessionProvider session={null}>{component}</SessionProvider>);
};

describe('ActivityManagement', () => {
	let mockPush: jest.Mock;
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
			updateStudentActivity: jest.fn(),
		});
		mockPush = jest.fn();
		(useRouter as jest.Mock).mockReturnValue({ push: mockPush });
	});

	beforeEach(() => {
		mockUseActivityTemplates.mockReturnValue(baseActivityTemplatesMock);
	});

	it('shows loader if classesData or classId do not exist', async () => {
		(useUserContext as jest.Mock).mockReturnValue({
			classId: null,
			classesData: null,
		});
		await act(async () => {
			renderWithSession(<ActivityManagement />);
		});
		expect(screen.getByTestId('loader')).toBeInTheDocument();
	});

	it('shows loader if loading is true', async () => {
		(useSubmissions as jest.Mock).mockReturnValue({
			turma: mockTurma,
			loading: true,
		});
		await act(async () => {
			renderWithSession(<ActivityManagement />);
		});
		expect(screen.getByTestId('loader')).toBeInTheDocument();
	});

	it('shows NotifyModal if class is null', async () => {
		(useSubmissions as jest.Mock).mockReturnValue({
			turma: null,
			loading: false,
		});
		await act(async () => {
			renderWithSession(<ActivityManagement />);
		});
		expect(screen.getByTestId('notify-modal')).toBeInTheDocument();
		expect(
			screen.getByText(/não foi possível carregar a turma/i),
		).toBeInTheDocument();
	});

	it('renders participants and activities table', async () => {
		await act(async () => {
			renderWithSession(<ActivityManagement />);
		});
		expect(screen.getByText('Participantes')).toBeInTheDocument();
		expect(screen.getByText('Gestão de atividades')).toBeInTheDocument();
		expect(screen.getByText('Aluno 1 (123)')).toBeInTheDocument();
		expect(screen.getByText('Aluno 2 (987)')).toBeInTheDocument();
		expect(screen.getByText('Resumo')).toBeInTheDocument();
	});

	it('renders download buttons when there are received activities', async () => {
		await act(async () => {
			renderWithSession(<ActivityManagement />);
		});
		expect(screen.getAllByText('Baixar atividade').length).toBeGreaterThan(0);
	});

	it("renders 'None available' button when there are no received activities", async () => {
		(useSubmissions as jest.Mock).mockReturnValue({
			turma: { ...mockTurma, students: [] },
			loading: false,
			updateStudentActivity: jest.fn(),
		});
		// mock URL.createObjectURL para evitar erro de download
		global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
		global.URL.revokeObjectURL = jest.fn();
		await act(async () => {
			renderWithSession(<ActivityManagement />);
		});
		// Deve haver um botão para cada atividade
		const noneButtons = screen.getAllByText('Nenhuma disponível');
		expect(noneButtons.length).toBeGreaterThan(0);
	});

	it('filters participants when changing filter', async () => {
		await act(async () => {
			renderWithSession(<ActivityManagement />);
		});
		const filterSelect = screen.getByRole('combobox');
		await act(async () => {
			fireEvent.change(filterSelect, { target: { value: 'aprovadas' } });
		});
		expect(filterSelect).toHaveValue('aprovadas');
	});

	it("calls handleRedirect when clicking 'Make evaluation'", async () => {
		await act(async () => {
			renderWithSession(<ActivityManagement />);
		});
		const avaliarButton = screen.getAllByText('Fazer avaliação')[0];
		await act(async () => {
			fireEvent.click(avaliarButton);
		});
		expect(mockPush).toHaveBeenCalledWith('/gestao-de-atividades/stu1');
	});

	it("calls handleRedirect when clicking 'View'", async () => {
		await act(async () => {
			renderWithSession(<ActivityManagement />);
		});
		const visualizarButton = screen.getAllByText('Visualizar')[0];
		await act(async () => {
			fireEvent.click(visualizarButton);
		});
		expect(mockPush).toHaveBeenCalledWith('/gestao-de-atividades/stu1');
	});

	it("calls handleDownloadFile when clicking 'Download activity'", async () => {
		(getSubmissionFiles as jest.Mock).mockResolvedValue(
			new Blob(['test'], { type: 'application/pdf' }),
		);
		await act(async () => {
			renderWithSession(<ActivityManagement />);
		});
		const downloadButton = screen.getAllByText('Baixar atividade')[0];
		await act(async () => {
			fireEvent.click(downloadButton);
		});
		await waitFor(() => {
			expect(getSubmissionFiles).toHaveBeenCalled();
		});
	});

	it('renders ActivitiesSlider on mobile', async () => {
		// Simula mobile
		global.innerWidth = 500;
		await act(async () => {
			renderWithSession(<ActivityManagement />);
		});
		expect(screen.getByTestId('activities-slider')).toBeInTheDocument();
	});

	it("opens status menu when clicking 'Not Received'", async () => {
		await act(async () => {
			renderWithSession(<ActivityManagement />);
		});
		const naoRecebidaButton = screen.getAllByText('Não Recebida')[0];
		await act(async () => {
			fireEvent.click(naoRecebidaButton);
		});
		expect(
			screen.getByText(/Alterar o status da atividade:/i),
		).toBeInTheDocument();
	});

	it("calls updateActivityToExternalUtil when clicking 'Received in other channel' in menu", async () => {
		await act(async () => {
			renderWithSession(<ActivityManagement />);
		});
		const naoRecebidaButton = screen.getAllByText('Não Recebida')[0];
		await act(async () => {
			fireEvent.click(naoRecebidaButton);
		});
		const recebidaOutroCanalButton = screen.getByText(
			'Recebida em outro canal',
		);
		await act(async () => {
			fireEvent.click(recebidaOutroCanalButton);
		});
		await waitFor(() => {
			expect(updateActivityToExternalUtil).toHaveBeenCalled();
		});
	});

	it('opens BaseModal and shows empty template inputs when there are no templates', async () => {
		await act(async () => {
			renderWithSession(<ActivityManagement />);
		});

		// Clica no botão "Template das atividades"
		await act(async () => {
			fireEvent.click(screen.getByText(/Template das atividades/i));
		});

		// Modal aberto
		expect(
			await screen.findByText((content) =>
				content.includes('Template das atividades'),
			),
		).toBeInTheDocument();

		// Deve renderizar inputs sem arquivo
		const inputs = screen.getAllByText(/Upload de template/i);
		expect(inputs.length).toBeGreaterThan(0);
	});

	it('opens BaseModal and shows existing templates when they exist', async () => {
		mockUseActivityTemplates.mockReturnValue({
			...baseActivityTemplatesMock,
			templates: {
				1: {
					id: 10,
					activity_id: 1,
					course_id: 1,
					cycle_id: 1,
					class_id: 1,
					original_name: 'template-atividade-1.pdf',
					file_path: 'templates/template-atividade-1.pdf',
					file_type: 'pdf',
					created_at: '',
					updated_at: '',
				},
			},
		});

		await act(async () => {
			renderWithSession(<ActivityManagement />);
		});

		await act(async () => {
			fireEvent.click(screen.getByText(/Template das atividades/i));
		});

		expect(
			await screen.findByText((content) =>
				content.includes('Template das atividades'),
			),
		).toBeInTheDocument();

		expect(screen.getByText('template-atividade-1.pdf')).toBeInTheDocument();
	});
});
