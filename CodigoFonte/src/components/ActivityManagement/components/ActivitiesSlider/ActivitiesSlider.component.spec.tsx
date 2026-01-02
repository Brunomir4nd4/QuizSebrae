import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ActivitiesSlider } from './index';
import React from 'react';
import { mockClassData } from '@/mocks/  mockClassData';
import * as updateActivityToExternalModule from '@/utils/updateActivityToExternalUtil';
import { useActivityTemplates } from '@/hooks/useActivityTemplates';

jest.mock('react-slick', () => {
	return jest.fn(({ children }) => <div>{children}</div>);
});

jest.mock('@/hooks/useActivityTemplates', () => ({
	useActivityTemplates: jest.fn(),
}));

jest.mock('@/components/ParticipacaoTable/components', () => ({
	WhatsAppButton: ({ whatsAppMessage }: { whatsAppMessage: string }) => (
		<span>{whatsAppMessage}</span>
	),
}));

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
	};
});

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
	useRouter: jest.fn(() => ({ push: mockPush })),
}));

jest.mock('@/app/providers/UserProvider', () => ({
	useUserContext: jest.fn(),
}));

jest.mock('@/hooks/useSubmissions', () => jest.fn());

jest.mock('@/utils/updateActivityToExternalUtil', () => ({
	updateActivityToExternalUtil: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/app/services/bff/SubmissionService', () => ({
	createSubmission: jest.fn(),
}));

jest.mock('@/components/Loader', () => ({
	Loader: () => <div data-testid='loader'>Carregando...</div>,
}));

const mockUpdateActivityToExternalUtil =
	updateActivityToExternalModule.updateActivityToExternalUtil as jest.Mock;

const mockUseActivityTemplates = useActivityTemplates as jest.Mock;

const baseActivityTemplatesMock = {
	templates: {},
	uploadTemplate: jest.fn(),
	deleteTemplate: jest.fn(),
	fetchTemplates: jest.fn().mockResolvedValue(undefined),
	loading: false,
};

const mockStudents = [
	{
		id: 'stu1',
		name: 'Aluno 1',
		cpf: '123456789',
		phone: '999999999',
		email: 'aluno1@example.com',
		activities: [
			{ status: 'avaliada', activity_id: '1' },
			{ status: 'recebida', activity_id: '2' },
		],
	},
	{
		id: 'stu2',
		name: 'Aluno 2',
		cpf: '987654321',
		phone: '888888888',
		email: 'aluno2@example.com',
		activities: [
			{ status: 'não recebida', activity_id: '1' },
			{ status: 'avaliada', activity_id: '2' },
		],
	},
];

const mockTurma = {
	activities: 2,
	students: mockStudents,
};

const mockClassesData = {
	'class-1': {
		courses: { id: 1 },
		ciclos: { id: 1 },
	},
};

const mockUseUserContext = jest.fn();
const mockUseSubmissions = jest.fn();

jest.mock('@/app/providers/UserProvider', () => ({
	useUserContext: () => mockUseUserContext(),
}));
jest.mock('@/hooks/useSubmissions', () => () => mockUseSubmissions());

describe('ActivitiesSlider', () => {
	beforeEach(() => {
		mockPush.mockClear();
		mockUpdateActivityToExternalUtil.mockClear();
		// Mock sessionStorage
		Storage.prototype.setItem = jest.fn();
	});
	beforeEach(() => {
		jest.clearAllMocks();
		mockUseUserContext.mockReturnValue({
			classId: 'class-1',
			classesData: mockClassesData,
		});
		mockUseSubmissions.mockReturnValue({
			turma: mockTurma,
			updateStudentActivity: jest.fn(),
			loading: false,
		});
	});
	beforeEach(() => {
		mockUseActivityTemplates.mockReturnValue(baseActivityTemplatesMock);
	});

	it('shows loader when classesData or classId do not exist', () => {
		mockUseUserContext.mockReturnValue({ classId: null, classesData: null });
		render(
			<ActivitiesSlider
				classData={mockClassData({
					enable_strategic_activities: true,
					strategic_activities_number: 2,
				})}
			/>,
		);
		expect(screen.getByTestId('loader')).toBeInTheDocument();
	});

	it('shows loader when loading is true', () => {
		mockUseSubmissions.mockReturnValue({
			turma: mockTurma,
			updateStudentActivity: jest.fn(),
			loading: true,
		});
		render(
			<ActivitiesSlider
				classData={mockClassData({
					enable_strategic_activities: true,
					strategic_activities_number: 2,
				})}
			/>,
		);
		expect(screen.getByTestId('loader')).toBeInTheDocument();
	});

	it('renders activities and participants correctly', () => {
		render(
			<ActivitiesSlider
				classData={mockClassData({
					enable_strategic_activities: true,
					strategic_activities_number: 2,
				})}
			/>,
		);
		// Verificar se há pelo menos uma atividade renderizada
		const atividades1 = screen.getAllByText((content, node) =>
			node ? node.textContent?.replace(/\s/g, '') === '1ªatividade' : false,
		);
		expect(atividades1.length).toBeGreaterThan(0);
		// Verificar nomes dos alunos (usar getAllByText porque há múltiplos slides)
		const alunos1 = screen.getAllByText(/Aluno 1/);
		expect(alunos1.length).toBeGreaterThan(0);
		const alunos2 = screen.getAllByText(/Aluno 2/);
		expect(alunos2.length).toBeGreaterThan(0);
	});

	it("renders 'Make evaluation' button for received status", () => {
		// Garantir status 'recebida' para pelo menos um aluno
		const turmaComRecebida = {
			...mockTurma,
			students: [
				{
					...mockStudents[0],
					activities: [
						{ status: 'recebida', activity_id: '1' },
						{ status: 'avaliada', activity_id: '2' },
					],
				},
				...mockStudents.slice(1),
			],
		};
		mockUseSubmissions.mockReturnValue({
			turma: turmaComRecebida,
			updateStudentActivity: jest.fn(),
			loading: false,
		});
		render(
			<ActivitiesSlider
				classData={mockClassData({
					enable_strategic_activities: true,
					strategic_activities_number: 2,
				})}
			/>,
		);
		expect(screen.getAllByText(/Fazer avaliação/i).length).toBeGreaterThan(0);
	});

	it("renders 'View' button for evaluated status", () => {
		render(
			<ActivitiesSlider
				classData={mockClassData({
					enable_strategic_activities: true,
					strategic_activities_number: 2,
				})}
			/>,
		);
		expect(screen.getAllByText(/Visualizar/i).length).toBeGreaterThan(0);
	});

	it("renders 'Not Received' button for not received status", () => {
		render(
			<ActivitiesSlider
				classData={mockClassData({
					enable_strategic_activities: true,
					strategic_activities_number: 2,
				})}
			/>,
		);
		expect(screen.getAllByText(/Não Recebida/i).length).toBeGreaterThan(0);
	});

	it("opens menu when clicking 'Not Received' and calls updateActivityToExternalUtil", async () => {
		render(
			<ActivitiesSlider
				classData={mockClassData({
					enable_strategic_activities: true,
					strategic_activities_number: 2,
				})}
			/>,
		);
		const naoRecebidaButton = screen.getAllByText(/Não Recebida/i)[0];
		fireEvent.click(naoRecebidaButton);
		expect(
			screen.getByText(/Alterar o status da atividade:/i),
		).toBeInTheDocument();
		const recebidaOutroCanalButton = screen.getByText(
			/Recebida em outro canal/i,
		);
		fireEvent.click(recebidaOutroCanalButton);
		await waitFor(() => {
			expect(mockUpdateActivityToExternalUtil).toHaveBeenCalled();
		});
	});

	it("calls handleRedirect when clicking 'Make evaluation' or 'View'", () => {
		// Garantir status 'avaliada' para exibir botão de visualizar
		const turmaComAvaliada = {
			...mockTurma,
			students: [
				{
					...mockStudents[0],
					activities: [
						{ status: 'avaliada', activity_id: '1' },
						{ status: 'avaliada', activity_id: '2' },
					],
				},
				...mockStudents.slice(1),
			],
		};
		mockUseSubmissions.mockReturnValue({
			turma: turmaComAvaliada,
			updateStudentActivity: jest.fn(),
			loading: false,
		});
		render(
			<ActivitiesSlider
				classData={mockClassData({
					enable_strategic_activities: true,
					strategic_activities_number: 2,
				})}
			/>,
		);

		// Buscar botão que contém texto "Visualizar"
		const allButtons = screen.getAllByRole('button');
		const visualizarButton = allButtons.find(
			(button) =>
				button.textContent && button.textContent.includes('Visualizar'),
		);

		expect(visualizarButton).toBeDefined();
		if (visualizarButton) {
			fireEvent.click(visualizarButton);
		}
		expect(mockPush).toHaveBeenCalled();
	});

	it('opens BaseModal and shows empty template inputs when there are no templates', async () => {
		render(
			<ActivitiesSlider
				classData={mockClassData({
					enable_strategic_activities: true,
					strategic_activities_number: 2,
				})}
			/>,
		);

		// Clica no botão "Template das atividades"
		fireEvent.click(screen.getByText(/Template das atividades/i));

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

		render(
			<ActivitiesSlider
				classData={mockClassData({
					enable_strategic_activities: true,
					strategic_activities_number: 2,
				})}
			/>,
		);

		fireEvent.click(screen.getByText(/Template das atividades/i));

		expect(
			await screen.findByText((content) =>
				content.includes('Template das atividades'),
			),
		).toBeInTheDocument();

		expect(screen.getByText('template-atividade-1.pdf')).toBeInTheDocument();
	});
});
