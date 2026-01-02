import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Upload from './Upload.component';

// Mock das dependências externas
jest.mock('@mui/material', () => ({
	Divider: () => <div data-testid='divider' />,
	IconButton: ({
		children,
		onClick,
		...props
	}: React.PropsWithChildren<
		{ onClick?: () => void } & Record<string, unknown>
	>) => (
		<button data-testid='icon-button' onClick={onClick} {...props}>
			{children}
		</button>
	),
	Link: ({ children, href }: React.PropsWithChildren<{ href?: string }>) => (
		<a data-testid='link' href={href}>
			{children}
		</a>
	),
	Tooltip: ({
		children,
		title,
	}: React.PropsWithChildren<{ title?: string }>) => (
		<div data-testid='tooltip' title={title}>
			{children}
		</div>
	),
}));

jest.mock('@mui/icons-material', () => ({
	Delete: () => <div data-testid='delete-icon'>🗑️</div>,
	Visibility: () => <div data-testid='visibility-icon'>👁️</div>,
}));

jest.mock('@/components/ButtonIcon', () => ({
	ButtonIcon: ({
		onClick,
		text,
		disabled,
	}: {
		onClick?: () => void;
		text?: string;
		disabled?: boolean;
	}) => (
		<button data-testid='button-icon' onClick={onClick} disabled={disabled}>
			{text}
		</button>
	),
}));

jest.mock('./UploadButton.component', () => ({
	__esModule: true,
	default: ({
		action,
		items,
	}: {
		action?: (e: React.ChangeEvent<HTMLInputElement>) => void;
		items?: unknown[];
	}) => (
		<div data-testid='upload-button' data-items-count={items?.length}>
			<input type='file' multiple data-testid='file-input' onChange={action} />
			Upload Button
		</div>
	),
}));

jest.mock('@/components/BaseModal', () => ({
	BaseModal: ({
		children,
		open,
		onClose,
		header,
		footer,
	}: React.PropsWithChildren<{
		open?: boolean;
		onClose?: () => void;
		header?: React.ReactNode;
		footer?: React.ReactNode;
	}>) =>
		open ? (
			<div data-testid='base-modal'>
				<div data-testid='modal-header'>{header}</div>
				<div data-testid='modal-content'>{children}</div>
				<div data-testid='modal-footer'>{footer}</div>
				<button data-testid='modal-close' onClick={onClose}>
					Close
				</button>
			</div>
		) : null,
}));

jest.mock('@/components/CarouselModal', () => ({
	CarouselModal: ({
		children,
		open,
		onClose,
	}: React.PropsWithChildren<{ open?: boolean; onClose?: () => void }>) =>
		open ? (
			<div data-testid='carousel-modal'>
				{children}
				<button data-testid='carousel-close' onClick={onClose}>
					Close
				</button>
			</div>
		) : null,
}));

jest.mock('@/components/NotifyModal', () => ({
	NotifyModal: ({
		title,
		message,
		callback,
	}: {
		title?: string;
		message?: string;
		callback?: () => void;
	}) => (
		<div data-testid='notify-modal'>
			<h3>{title}</h3>
			<p>{message}</p>
			<button data-testid='notify-close' onClick={callback}>
				Close
			</button>
		</div>
	),
}));

jest.mock('react-slick', () => {
	return {
		__esModule: true,
		default: ({
			children,
		}: React.PropsWithChildren<Record<string, unknown>>) => (
			<div data-testid='slider'>{children}</div>
		),
	};
});

jest.mock('./DeleteButton.styles', () => ({
	DeleteButton: ({
		children,
		onClick,
	}: React.PropsWithChildren<{ onClick?: () => void }>) => (
		<button data-testid='delete-button' onClick={onClick}>
			{children}
		</button>
	),
}));

jest.mock('./ArrowsButton.styles', () => ({
	NextButton: ({
		children,
	}: React.PropsWithChildren<Record<string, unknown>>) => (
		<div data-testid='next-button'>{children}</div>
	),
	PrevButton: ({
		children,
	}: React.PropsWithChildren<Record<string, unknown>>) => (
		<div data-testid='prev-button'>{children}</div>
	),
}));

// Mock dos providers
jest.mock('@/app/providers/UserProvider', () => ({
	useUserContext: () => ({
		classId: 1,
		classesData: {
			1: {
				id: 1,
				title: 'Test Class',
				enroll_id: 'test-enroll',
				courses: {
					id: 1,
					name: 'Test Course',
				},
				ciclos: {
					id: 1,
				},
				facilitator: 1,
				facilitator_name: 'Test Facilitator',
				facilitator_email: 'facilitator@test.com',
			},
		},
	}),
}));

jest.mock('next-auth/react', () => ({
	useSession: () => ({
		data: {
			user: {
				id: 1,
				user_email: 'test@test.com',
				user_display_name: 'Test User',
			},
		},
	}),
}));

jest.mock('@/app/providers/SubmissionsProvider', () => ({
	useSubmissions: () => ({
		submissions: [],
		addSubmissions: jest.fn(),
	}),
}));

// Mock dos serviços
jest.mock('@/app/services/bff/SubmissionService', () => ({
	createSubmission: jest.fn(),
}));

jest.mock('@/utils/sendLog', () => ({
	__esModule: true,
	sendLog: jest.fn(),
}));

jest.mock('@/utils/transformSubmissionsToItems', () => ({
	transformSubmissionsToItems: jest.fn(() => []),
}));

jest.mock('@/utils/renderFile', () => ({
	renderFile: (file: { name: string }) => (
		<div data-testid='rendered-file'>{file.name}</div>
	),
	renderFileThumbnail: (file: { name: string }) => (
		<div data-testid='file-thumbnail'>{file.name}</div>
	),
}));

// Mock do ModalButton
jest.mock('@/components/NotifyModal/NotifyModal.styles', () => ({
	ModalButton: ({
		children,
	}: React.PropsWithChildren<Record<string, unknown>>) => (
		<div data-testid='modal-button'>{children}</div>
	),
}));

// Mock global para URL.createObjectURL e URL.revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-url');
global.URL.revokeObjectURL = jest.fn();

// Importações necessárias para os testes
import { createSubmission } from '@/app/services/bff/SubmissionService';
import { sendLog } from '@/utils/sendLog';

describe('Upload Component', () => {
	const defaultProps = {
		submissionId: 1,
		islastSubmition: false,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Initial Rendering', () => {
		it('should render upload component with correct title and description', () => {
			render(<Upload {...defaultProps} />);

			expect(screen.getByText('Envio')).toBeInTheDocument();
			expect(screen.getByText('de atividade')).toBeInTheDocument();
			expect(
				screen.getByText(
					/Envie para a gente a atividade direcionada pela facilitadora/,
				),
			).toBeInTheDocument();
		});

		it('should render UploadButton component', () => {
			render(<Upload {...defaultProps} />);

			expect(screen.getByTestId('upload-button')).toBeInTheDocument();
		});

		it('should render empty state when no files selected', () => {
			render(<Upload {...defaultProps} />);

			expect(
				screen.getByText('Nenhum arquivo selecionado ainda'),
			).toBeInTheDocument();
			expect(
				screen.getByText(/Compartilhe sua atividade do seu jeito/),
			).toBeInTheDocument();
		});

		it('should not render send button when no files selected', () => {
			render(<Upload {...defaultProps} />);

			expect(screen.queryByTestId('button-icon')).not.toBeInTheDocument();
		});
	});

	describe('File Upload', () => {
		it('should handle file selection', async () => {
			render(<Upload {...defaultProps} />);

			const fileInput = screen.getByTestId('file-input');
			const file = new File(['test content'], 'test.pdf', {
				type: 'application/pdf',
			});

			fireEvent.change(fileInput, { target: { files: [file] } });

			expect(screen.getByText('Arquivos selecionados')).toBeInTheDocument();
			expect(screen.getByText('1')).toBeInTheDocument();
			expect(screen.getByTestId('file-thumbnail')).toBeInTheDocument();
		});

		it('should render multiple files correctly', async () => {
			render(<Upload {...defaultProps} />);

			const fileInput = screen.getByTestId('file-input');
			const files = [
				new File(['content1'], 'file1.pdf', { type: 'application/pdf' }),
				new File(['content2'], 'file2.jpg', { type: 'image/jpeg' }),
			];

			fireEvent.change(fileInput, { target: { files: files } });

			expect(screen.getByText('2')).toBeInTheDocument();
			expect(screen.getAllByTestId('file-thumbnail')).toHaveLength(2);
		});

		it('should show send button when files are selected', async () => {
			render(<Upload {...defaultProps} />);

			const fileInput = screen.getByTestId('file-input');
			const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });

			fireEvent.change(fileInput, { target: { files: [file] } });

			expect(screen.getByTestId('button-icon')).toBeInTheDocument();
			expect(screen.getByText('Enviar atividade')).toBeInTheDocument();
		});
	});

	describe('File Interactions', () => {
		beforeEach(async () => {
			render(<Upload {...defaultProps} />);

			const fileInput = screen.getByTestId('file-input');
			const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });

			fireEvent.change(fileInput, { target: { files: [file] } });
		});

		it('should open carousel modal when expand button is clicked', async () => {
			const expandButton = screen.getAllByTestId('icon-button')[0];
			fireEvent.click(expandButton);

			expect(screen.getByTestId('carousel-modal')).toBeInTheDocument();
			expect(screen.getByTestId('rendered-file')).toBeInTheDocument();
		});

		it('should close carousel modal when close button is clicked', async () => {
			const expandButton = screen.getAllByTestId('icon-button')[0];
			fireEvent.click(expandButton);

			const closeButton = screen.getByTestId('carousel-close');
			fireEvent.click(closeButton);

			expect(screen.queryByTestId('carousel-modal')).not.toBeInTheDocument();
		});

		it('should remove file when delete button is clicked', async () => {
			expect(screen.getByText('1')).toBeInTheDocument();

			const deleteButton = screen.getAllByTestId('icon-button')[1];
			fireEvent.click(deleteButton);

			expect(
				screen.getByText('Nenhum arquivo selecionado ainda'),
			).toBeInTheDocument();
		});
	});

	describe('File Upload Submission', () => {
		beforeEach(async () => {
			render(<Upload {...defaultProps} />);

			const fileInput = screen.getByTestId('file-input');
			const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });

			fireEvent.change(fileInput, { target: { files: [file] } });
		});

		it('should call createSubmission when send button is clicked', async () => {
			const mockCreateSubmission = createSubmission as jest.MockedFunction<
				typeof createSubmission
			>;
			const mockSendLog = sendLog as jest.MockedFunction<typeof sendLog>;

			const mockSubmissionResponse = {
				id: 1,
				participant_id: 1,
				activity_id: 1,
				title: 'Test Submission',
				class_id: 1,
				course_id: 1,
				cycle_id: 1,
				facilitator_id: 1,
				score: null,
				facilitator_comment: null,
				evaluated_at: null,
				created_at: '2023-01-01T00:00:00Z',
				updated_at: '2023-01-01T00:00:00Z',
				status: 'submitted' as const,
				files: [],
			};

			mockCreateSubmission.mockResolvedValue(mockSubmissionResponse);

			const sendButton = screen.getByTestId('button-icon');
			fireEvent.click(sendButton);

			await waitFor(() => {
				expect(mockCreateSubmission).toHaveBeenCalledWith(expect.any(FormData));
				expect(mockSendLog).toHaveBeenCalledWith(
					'test-enroll',
					'Enviou',
					'ATIVIDADE ESTRATEGICA 1',
				);
			});
		});

		it('should show loading state during submission', async () => {
			const mockCreateSubmission = createSubmission as jest.MockedFunction<
				typeof createSubmission
			>;

			mockCreateSubmission.mockImplementation(
				() => new Promise((resolve) => setTimeout(resolve, 100)),
			);

			const sendButton = screen.getByTestId('button-icon');
			fireEvent.click(sendButton);

			expect(screen.getByText('Enviando...')).toBeInTheDocument();
		});

		it('should open success modal after successful submission', async () => {
			const mockCreateSubmission = createSubmission as jest.MockedFunction<
				typeof createSubmission
			>;

			const mockSubmissionResponse = {
				id: 1,
				participant_id: 1,
				activity_id: 1,
				title: 'Test Submission',
				class_id: 1,
				course_id: 1,
				cycle_id: 1,
				facilitator_id: 1,
				score: null,
				facilitator_comment: null,
				evaluated_at: null,
				created_at: '2023-01-01T00:00:00Z',
				updated_at: '2023-01-01T00:00:00Z',
				status: 'submitted' as const,
				files: [],
			};

			mockCreateSubmission.mockResolvedValue(mockSubmissionResponse);

			const sendButton = screen.getByTestId('button-icon');
			fireEvent.click(sendButton);

			await waitFor(() => {
				expect(screen.getByTestId('base-modal')).toBeInTheDocument();
			});

			expect(screen.getByText('Atividade')).toBeInTheDocument();
			expect(screen.getByText('enviada!')).toBeInTheDocument();
		});

		it('should show error modal when submission fails', async () => {
			const mockCreateSubmission = createSubmission as jest.MockedFunction<
				typeof createSubmission
			>;

			mockCreateSubmission.mockRejectedValue(new Error('Upload failed'));

			const sendButton = screen.getByTestId('button-icon');
			fireEvent.click(sendButton);

			await waitFor(() => {
				expect(screen.getByTestId('notify-modal')).toBeInTheDocument();
			});

			expect(screen.getByText('Erro ao enviar o arquivo')).toBeInTheDocument();
		});
	});

	describe('Last Submission Modal', () => {
		it('should show different modal content for last submission', async () => {
			const mockCreateSubmission = createSubmission as jest.MockedFunction<
				typeof createSubmission
			>;

			const mockSubmissionResponse = {
				id: 1,
				participant_id: 1,
				activity_id: 1,
				title: 'Test Submission',
				class_id: 1,
				course_id: 1,
				cycle_id: 1,
				facilitator_id: 1,
				score: null,
				facilitator_comment: null,
				evaluated_at: null,
				created_at: '2023-01-01T00:00:00Z',
				updated_at: '2023-01-01T00:00:00Z',
				status: 'submitted' as const,
				files: [],
			};

			mockCreateSubmission.mockResolvedValue(mockSubmissionResponse);

			render(<Upload submissionId={1} islastSubmition={true} />);

			const fileInput = screen.getByTestId('file-input');
			const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });

			fireEvent.change(fileInput, { target: { files: [file] } });

			const sendButton = screen.getByTestId('button-icon');
			fireEvent.click(sendButton);

			await waitFor(() => {
				expect(screen.getByTestId('base-modal')).toBeInTheDocument();
			});

			expect(screen.getByTestId('modal-footer')).toBeInTheDocument();
			expect(screen.getByTestId('link')).toBeInTheDocument();
		});
	});

	describe('Error Handling', () => {
		it('should show error for invalid file type', async () => {
			render(<Upload {...defaultProps} />);

			const fileInput = screen.getByTestId('file-input');
			const invalidFile = new File(['test'], 'test.exe', {
				type: 'application/x-msdownload',
			});

			fireEvent.change(fileInput, { target: { files: [invalidFile] } });

			expect(screen.getByTestId('notify-modal')).toBeInTheDocument();
			expect(screen.getByText('Erro ao enviar o arquivo')).toBeInTheDocument();
		});

		it('should close error modal when callback is called', async () => {
			render(<Upload {...defaultProps} />);

			const fileInput = screen.getByTestId('file-input');
			const invalidFile = new File(['test'], 'test.exe', {
				type: 'application/x-msdownload',
			});

			fireEvent.change(fileInput, { target: { files: [invalidFile] } });

			const closeButton = screen.getByTestId('notify-close');
			fireEvent.click(closeButton);

			expect(screen.queryByTestId('notify-modal')).not.toBeInTheDocument();
		});
	});

	describe('Accessibility', () => {
		it('should have proper tooltips for action buttons', async () => {
			render(<Upload {...defaultProps} />);

			const fileInput = screen.getByTestId('file-input');
			const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });

			fireEvent.change(fileInput, { target: { files: [file] } });

			const tooltips = screen.getAllByTestId('tooltip');
			expect(tooltips).toHaveLength(2);
			expect(tooltips[0]).toHaveAttribute('title', 'Expandir');
			expect(tooltips[1]).toHaveAttribute('title', 'Remover');
		});
	});
});
