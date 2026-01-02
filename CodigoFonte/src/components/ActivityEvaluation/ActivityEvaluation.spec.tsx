/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	render,
	screen,
	fireEvent,
	act,
	waitFor,
} from '@testing-library/react';
import ActivityEvaluation from './ ActivityEvaluation.component';
import React from 'react';
import { useUserContext } from '@/app/providers/UserProvider';
import { SessionProvider } from 'next-auth/react';
import {
	createSubmission,
	deleteSubmission,
	getSubmissionFiles,
	updateSubmission,
} from '@/app/services/bff/SubmissionService';

jest.mock('@/app/providers/UserProvider', () => ({
	useUserContext: jest.fn(),
}));

jest.mock('@/app/services/bff/SubmissionService', () => ({
	updateSubmission: jest.fn(),
	deleteSubmission: jest.fn(),
	getSubmissionFiles: jest.fn(),
	createSubmission: jest.fn(),
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

jest.mock('@/utils/renderFile', () => ({
	renderFile: jest.fn((file: any) => <div>{file.name}</div>),
	renderFileThumbnail: jest.fn((file: any) => <div>{file.name}</div>),
}));

jest.mock('@/utils/downloadFile', () => ({
	downloadFile: jest.fn(),
}));

jest.mock('@/utils/dateUtils', () => ({
	isDateWithinLimit: jest.fn(() => true),
}));

jest.mock('../CarouselModal', () => ({
	CarouselModal: ({ children, open }: any) =>
		open ? <div data-testid='carousel-modal'>{children}</div> : null,
}));

jest.mock('../ButtonIcon', () => ({
	ButtonIcon: ({ text, onClick, disabled }: any) => (
		<button onClick={onClick} disabled={disabled}>
			{text}
		</button>
	),
}));

jest.mock('../ButtonDownload', () => ({
	ButtonDownload: ({ text, onClick }: any) => (
		<button onClick={onClick}>{text}</button>
	),
}));

jest.mock('../ConfirmDeleteSubmissionModal', () => ({
	__esModule: true,
	default: ({ open, handleClose, deleteSubmission }: any) =>
		open ? (
			<div data-testid='confirm-delete-modal'>
				<button onClick={handleClose}>Cancelar</button>
				<button onClick={deleteSubmission}>Confirmar</button>
			</div>
		) : null,
}));

jest.mock('../NotifyModal', () => ({
	NotifyModal: ({ title, message }: any) => (
		<div data-testid='notify-modal'>
			<h1>{title}</h1>
			<p>{message}</p>
		</div>
	),
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
			evaluate_course: 'https://example.com/evaluate',
		},
		ciclos: {
			id: 1,
		},
		turno: {
			value: 'diurno',
		},
	},
};

const mockFileItems = [
	{
		id: '1',
		name: 'file1.pdf',
		type: 'application/pdf',
		url: 'https://example.com/file1.pdf',
	},
	{
		id: '2',
		name: 'file2.png',
		type: 'image/png',
		url: 'https://example.com/file2.png',
	},
];

const renderWithSession = (component: React.ReactElement) => {
	return render(<SessionProvider session={null}>{component}</SessionProvider>);
};

describe('ActivityEvaluation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(useUserContext as jest.Mock).mockReturnValue({
			classId: mockClassId,
			classesData: mockClassesData,
		});
		global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
		global.URL.revokeObjectURL = jest.fn();
	});

	describe('Status: recebida', () => {
		it('renders received activity with files', async () => {
			await act(async () => {
				renderWithSession(
					<ActivityEvaluation
						id={1}
						status='recebida'
						items={mockFileItems}
						selectedParticipant={1}
						selectedStudentName='Aluno 1'
						selectedStudentEmail='aluno1@example.com'
						selectedActivity={1}
					/>,
				);
			});

			expect(screen.getByText('file1.pdf')).toBeInTheDocument();
			expect(screen.getByText('file2.png')).toBeInTheDocument();
			expect(screen.getByText('Baixar atividade')).toBeInTheDocument();
		});

		it('renders received activity without files (other channel)', async () => {
			await act(async () => {
				renderWithSession(
					<ActivityEvaluation
						id={1}
						status='recebida'
						items={[]}
						selectedParticipant={1}
						selectedStudentName='Aluno 1'
						selectedStudentEmail='aluno1@example.com'
						selectedActivity={1}
					/>,
				);
			});

			expect(
				screen.getByText('Atividade recebida em outro canal.'),
			).toBeInTheDocument();
		});

		it('shows release resubmission button for facilitator', async () => {
			await act(async () => {
				renderWithSession(
					<ActivityEvaluation
						id={1}
						status='recebida'
						items={mockFileItems}
						selectedParticipant={1}
						selectedStudentName='Aluno 1'
						selectedStudentEmail='aluno1@example.com'
						selectedActivity={1}
					/>,
				);
			});

			expect(
				screen.getByText('Liberar reenvio da atividade'),
			).toBeInTheDocument();
		});

		it('opens confirmation modal when clicking release resubmission', async () => {
			await act(async () => {
				renderWithSession(
					<ActivityEvaluation
						id={1}
						status='recebida'
						items={mockFileItems}
						selectedParticipant={1}
						selectedStudentName='Aluno 1'
						selectedStudentEmail='aluno1@example.com'
						selectedActivity={1}
					/>,
				);
			});

			const resubmitButton = screen.getByText('Liberar reenvio da atividade');

			await act(async () => {
				fireEvent.click(resubmitButton);
			});

			expect(screen.getByTestId('confirm-delete-modal')).toBeInTheDocument();
		});

		it('downloads files when clicking download button', async () => {
			const mockBlob = new Blob(['test'], { type: 'application/pdf' });
			(getSubmissionFiles as jest.Mock).mockResolvedValue(mockBlob);

			await act(async () => {
				renderWithSession(
					<ActivityEvaluation
						id={1}
						status='recebida'
						items={mockFileItems}
						selectedParticipant={1}
						selectedStudentName='Aluno 1'
						selectedStudentEmail='aluno1@example.com'
						selectedActivity={1}
					/>,
				);
			});

			const downloadButton = screen.getByText('Baixar atividade');

			await act(async () => {
				fireEvent.click(downloadButton);
			});

			await waitFor(() => {
				expect(getSubmissionFiles).toHaveBeenCalledWith({
					participant_id: 1,
					activity_id: 1,
					class_id: mockClassId,
				});
			});
		});
	});

	describe('Status: não recebida', () => {
		it('renders not received status', async () => {
			await act(async () => {
				renderWithSession(
					<ActivityEvaluation
						id={1}
						status='não recebida'
						selectedParticipant={1}
						selectedStudentName='Aluno 1'
						selectedStudentEmail='aluno1@example.com'
						selectedActivity={1}
					/>,
				);
			});

			expect(screen.getByText('Atividade não recebida.')).toBeInTheDocument();
			expect(screen.getByText(/Recebi em outro canal/i)).toBeInTheDocument();
		});

		it('changes status to received in other channel', async () => {
			(createSubmission as jest.Mock).mockResolvedValue({});

			await act(async () => {
				renderWithSession(
					<ActivityEvaluation
						id={1}
						status='não recebida'
						selectedParticipant={1}
						selectedStudentName='Aluno 1'
						selectedStudentEmail='aluno1@example.com'
						selectedActivity={1}
					/>,
				);
			});

			const changeStatusButton = screen.getByText(/Recebi em outro canal/i);

			await act(async () => {
				fireEvent.click(changeStatusButton);
			});

			await waitFor(() => {
				expect(createSubmission).toHaveBeenCalled();
			});
		});

		it('does not show evaluation section when status is not received', async () => {
			await act(async () => {
				renderWithSession(
					<ActivityEvaluation
						id={1}
						status='não recebida'
						selectedParticipant={1}
						selectedStudentName='Aluno 1'
						selectedStudentEmail='aluno1@example.com'
						selectedActivity={1}
					/>,
				);
			});

			expect(screen.queryByText('Faça a avaliação')).not.toBeInTheDocument();
			expect(screen.queryByText('Avaliação Realizada')).not.toBeInTheDocument();
		});
	});

	describe('Status: recebida em outro canal', () => {
		it('renders received in other channel status', async () => {
			await act(async () => {
				renderWithSession(
					<ActivityEvaluation
						id={1}
						status='recebida em outro canal'
						selectedParticipant={1}
						selectedStudentName='Aluno 1'
						selectedStudentEmail='aluno1@example.com'
						selectedActivity={1}
					/>,
				);
			});

			expect(
				screen.getByText('Atividade recebida em outro canal.'),
			).toBeInTheDocument();
			expect(screen.getByText(/não recebida/i)).toBeInTheDocument();
		});

		it('changes status to not received', async () => {
			(deleteSubmission as jest.Mock).mockResolvedValue({});

			await act(async () => {
				renderWithSession(
					<ActivityEvaluation
						id={1}
						status='recebida em outro canal'
						selectedParticipant={1}
						selectedStudentName='Aluno 1'
						selectedStudentEmail='aluno1@example.com'
						selectedActivity={1}
					/>,
				);
			});

			const changeStatusButton = screen.getByText(/não recebida/i);

			await act(async () => {
				fireEvent.click(changeStatusButton);
			});

			await waitFor(() => {
				expect(deleteSubmission).toHaveBeenCalledWith(1);
			});
		});
	});

	describe('Avaliação', () => {
		it('shows evaluation form when there is no feedback', async () => {
			await act(async () => {
				renderWithSession(
					<ActivityEvaluation
						id={1}
						status='recebida'
						items={mockFileItems}
						selectedParticipant={1}
						selectedStudentName='Aluno 1'
						selectedStudentEmail='aluno1@example.com'
						selectedActivity={1}
					/>,
				);
			});

			expect(screen.getByText('Faça a avaliação')).toBeInTheDocument();
			expect(screen.getByText('Escreva seu feedback:')).toBeInTheDocument();
			expect(screen.getByText('Enviar avaliação')).toBeInTheDocument();
		});

		it('shows performed evaluation when there is feedback', async () => {
			await act(async () => {
				renderWithSession(
					<ActivityEvaluation
						id={1}
						status='avaliada'
						items={mockFileItems}
						feedback={{
							note: 4,
							comment: 'Ótimo trabalho!',
						}}
						selectedParticipant={1}
						selectedStudentName='Aluno 1'
						selectedStudentEmail='aluno1@example.com'
						selectedActivity={1}
					/>,
				);
			});

			expect(screen.getByText('Avaliação Realizada')).toBeInTheDocument();
			expect(screen.getByText('Comentário:')).toBeInTheDocument();
			expect(screen.getByText('Ótimo trabalho!')).toBeInTheDocument();
		});

		it('allows changing grade and comment', async () => {
			await act(async () => {
				renderWithSession(
					<ActivityEvaluation
						id={1}
						status='recebida'
						items={mockFileItems}
						selectedParticipant={1}
						selectedStudentName='Aluno 1'
						selectedStudentEmail='aluno1@example.com'
						selectedActivity={1}
					/>,
				);
			});

			const commentInput = screen.getByPlaceholderText('Comentário...');

			await act(async () => {
				fireEvent.change(commentInput, { target: { value: 'Muito bom!' } });
			});

			expect(commentInput).toHaveValue('Muito bom!');
		});

		it('sends evaluation when clicking send', async () => {
			(updateSubmission as jest.Mock).mockResolvedValue({});
			const onChange = jest.fn();

			await act(async () => {
				renderWithSession(
					<ActivityEvaluation
						id={1}
						status='recebida'
						items={mockFileItems}
						selectedParticipant={1}
						selectedStudentName='Aluno 1'
						selectedStudentEmail='aluno1@example.com'
						selectedActivity={1}
						onChange={onChange}
					/>,
				);
			});

			const commentInput = screen.getByPlaceholderText('Comentário...');

			await act(async () => {
				fireEvent.change(commentInput, {
					target: { value: 'Ótimo trabalho!' },
				});
			});

			const submitButton = screen.getByText('Enviar avaliação');

			await act(async () => {
				fireEvent.click(submitButton);
			});

			await waitFor(() => {
				expect(updateSubmission).toHaveBeenCalledWith(
					1,
					expect.objectContaining({
						status: 'evaluated',
						facilitator_comment: 'Ótimo trabalho!',
						participant_email: 'aluno1@example.com',
						participant_name: 'Aluno 1',
					}),
				);
				expect(onChange).toHaveBeenCalled();
			});
		});

		it('does not send evaluation if comment is empty', async () => {
			await act(async () => {
				renderWithSession(
					<ActivityEvaluation
						id={1}
						status='recebida'
						items={mockFileItems}
						selectedParticipant={1}
						selectedStudentName='Aluno 1'
						selectedStudentEmail='aluno1@example.com'
						selectedActivity={1}
					/>,
				);
			});

			const submitButton = screen.getByText('Enviar avaliação');

			expect(submitButton).toBeDisabled();
		});
	});

	describe('Reenvio de submissão', () => {
		it('confirms submission resubmission', async () => {
			(deleteSubmission as jest.Mock).mockResolvedValue({});
			const onChange = jest.fn();

			await act(async () => {
				renderWithSession(
					<ActivityEvaluation
						id={1}
						status='recebida'
						items={mockFileItems}
						selectedParticipant={1}
						selectedStudentName='Aluno 1'
						selectedStudentEmail='aluno1@example.com'
						selectedActivity={1}
						onChange={onChange}
					/>,
				);
			});

			const resubmitButton = screen.getByText('Liberar reenvio da atividade');

			await act(async () => {
				fireEvent.click(resubmitButton);
			});

			const confirmButton = screen.getByText('Confirmar');

			await act(async () => {
				fireEvent.click(confirmButton);
			});

			await waitFor(() => {
				expect(deleteSubmission).toHaveBeenCalledWith(
					1,
					expect.objectContaining({
						participant_name: 'Aluno 1',
						participant_email: 'aluno1@example.com',
						action: 'resend',
					}),
				);
				expect(onChange).toHaveBeenCalled();
			});
		});

		it('shows error when resubmission fails', async () => {
			(deleteSubmission as jest.Mock).mockRejectedValue(
				new Error('Erro ao deletar'),
			);

			await act(async () => {
				renderWithSession(
					<ActivityEvaluation
						id={1}
						status='recebida'
						items={mockFileItems}
						selectedParticipant={1}
						selectedStudentName='Aluno 1'
						selectedStudentEmail='aluno1@example.com'
						selectedActivity={1}
					/>,
				);
			});

			const resubmitButton = screen.getByText('Liberar reenvio da atividade');

			await act(async () => {
				fireEvent.click(resubmitButton);
			});

			const confirmButton = screen.getByText('Confirmar');

			await act(async () => {
				fireEvent.click(confirmButton);
			});

			await waitFor(() => {
				expect(screen.getByTestId('notify-modal')).toBeInTheDocument();
				expect(
					screen.getByText('Erro ao Permitir Reenvio'),
				).toBeInTheDocument();
			});
		});

		it('cancels resubmission when clicking cancel', async () => {
			await act(async () => {
				renderWithSession(
					<ActivityEvaluation
						id={1}
						status='recebida'
						items={mockFileItems}
						selectedParticipant={1}
						selectedStudentName='Aluno 1'
						selectedStudentEmail='aluno1@example.com'
						selectedActivity={1}
					/>,
				);
			});

			const resubmitButton = screen.getByText('Liberar reenvio da atividade');

			await act(async () => {
				fireEvent.click(resubmitButton);
			});

			expect(screen.getByTestId('confirm-delete-modal')).toBeInTheDocument();

			const cancelButton = screen.getByText('Cancelar');

			await act(async () => {
				fireEvent.click(cancelButton);
			});

			expect(
				screen.queryByTestId('confirm-delete-modal'),
			).not.toBeInTheDocument();
		});
	});

	describe('Status desconhecido', () => {
		it('renders default message for unknown status', async () => {
			await act(async () => {
				renderWithSession(
					<ActivityEvaluation
						id={1}
						status='status desconhecido'
						selectedParticipant={1}
						selectedStudentName='Aluno 1'
						selectedStudentEmail='aluno1@example.com'
						selectedActivity={1}
					/>,
				);
			});

			expect(
				screen.getByText('Nenhuma atividade encontrada'),
			).toBeInTheDocument();
		});
	});
});
