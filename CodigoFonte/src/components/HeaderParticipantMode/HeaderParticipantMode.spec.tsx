import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HeaderParticipantMode } from './index';

// Mock das dependências externas
jest.mock('next-auth/react', () => ({
	signIn: jest.fn(),
	signOut: jest.fn(),
}));

jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));

jest.mock('@/app/services/bff/ParticipantModeLogs', () => ({
	sendParticipantModeLogBff: jest.fn(),
}));

jest.mock('../Loader', () => ({
	LoaderOverlay: () => <div data-testid='loader-overlay'>Loading...</div>,
}));

// Mock do localStorage
const localStorageMock = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
});

describe('HeaderParticipantMode Component', () => {
	const mockRouter = {
		push: jest.fn(),
		refresh: jest.fn(),
	};

	const mockSignIn = jest.requireMock('next-auth/react').signIn;
	const mockSignOut = jest.requireMock('next-auth/react').signOut;
	const mockSendLog = jest.requireMock(
		'@/app/services/bff/ParticipantModeLogs',
	).sendParticipantModeLogBff;
	const mockUseRouter = jest.requireMock('next/navigation').useRouter;

	const mockParticipantData = {
		id: '123',
		cpf: '123.456.789-00',
		participantId: '456',
		participantCpf: '987.654.321-00',
		displayName: 'João Silva',
	};

	beforeEach(() => {
		jest.clearAllMocks();
		mockUseRouter.mockReturnValue(mockRouter);

		// Setup default localStorage mocks
		localStorageMock.getItem.mockImplementation((key: string) => {
			switch (key) {
				case 'participantModeStorage':
					return JSON.stringify(mockParticipantData);
				case 'originalPage':
					return '/dashboard';
				case 'isParticipantMode':
					return 'true';
				default:
					return null;
			}
		});
	});

	describe('Initial Rendering', () => {
		it('should render header with correct structure', () => {
			render(<HeaderParticipantMode />);

			expect(screen.getByText('Modo Participante Ativo')).toBeInTheDocument();
			expect(screen.getByText('Supervisor: João Silva')).toBeInTheDocument();
			expect(screen.getByText('Sair do modo participante')).toBeInTheDocument();
		});

		it('should render SVG icon', () => {
			render(<HeaderParticipantMode />);

			const svg = document.querySelector('svg');
			expect(svg).toBeInTheDocument();
			expect(svg).toHaveAttribute('width', '36');
			expect(svg).toHaveAttribute('height', '36');
		});

		it('should render header with correct CSS classes', () => {
			render(<HeaderParticipantMode />);

			const header = document.querySelector('div.fixed');
			expect(header).toHaveClass(
				'fixed',
				'flex',
				'h-[83px]',
				'md:h-[93px]',
				'px-[20px]',
				'md:px-[56px]',
				'py-[10px]',
				'md:py-[20px]',
				'justify-between',
				'items-center',
				'bg-[#F79707]',
				'top-0',
				'left-0',
				'w-full',
				'z-[999]',
			);
		});

		it('should render exit button with correct styling', () => {
			render(<HeaderParticipantMode />);

			const button = screen.getByRole('button', {
				name: /sair do modo participante/i,
			});
			expect(button).toHaveAttribute('type', 'submit');
			expect(button).toHaveClass(
				'bt-dhedalos',
				'transition-all',
				'cursor-pointer',
			);
		});

		it('should not render loader overlay initially', () => {
			render(<HeaderParticipantMode />);

			expect(screen.queryByTestId('loader-overlay')).not.toBeInTheDocument();
		});
	});

	describe('Participant Data Display', () => {
		it('should display supervisor name from localStorage', () => {
			render(<HeaderParticipantMode />);

			expect(screen.getByText('Supervisor: João Silva')).toBeInTheDocument();
		});

		it('should handle empty participant data gracefully', () => {
			localStorageMock.getItem.mockReturnValue('{}');

			render(<HeaderParticipantMode />);

			expect(screen.getByText('Supervisor:')).toBeInTheDocument();
		});

		it('should handle malformed JSON in localStorage', () => {
			const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
			localStorageMock.getItem.mockReturnValue('invalid json');

			expect(() => render(<HeaderParticipantMode />)).toThrow(
				'Unexpected token',
			);

			consoleSpy.mockRestore();
		});
	});

	describe('Exit Participant Mode Functionality', () => {
		it('should call exitParticipantMode when button is clicked', async () => {
			mockSignOut.mockResolvedValue(undefined);
			mockSignIn.mockResolvedValue({ error: null });
			mockSendLog.mockResolvedValue(undefined);

			render(<HeaderParticipantMode />);

			const button = screen.getByRole('button', {
				name: /sair do modo participante/i,
			});
			fireEvent.click(button);

			await waitFor(() => {
				expect(mockSignOut).toHaveBeenCalledWith({ redirect: false });
			});
		});

		it('should show loader overlay during exit process', async () => {
			mockSignOut.mockResolvedValue(undefined);
			mockSignIn.mockResolvedValue({ error: null });
			mockSendLog.mockResolvedValue(undefined);

			render(<HeaderParticipantMode />);

			const button = screen.getByRole('button', {
				name: /sair do modo participante/i,
			});
			fireEvent.click(button);

			await waitFor(() => {
				expect(screen.getByTestId('loader-overlay')).toBeInTheDocument();
			});
		});

		it('should call signIn with supervisor credentials after signOut', async () => {
			mockSignOut.mockResolvedValue(undefined);
			mockSignIn.mockResolvedValue({ error: null });
			mockSendLog.mockResolvedValue(undefined);

			render(<HeaderParticipantMode />);

			const button = screen.getByRole('button', {
				name: /sair do modo participante/i,
			});
			fireEvent.click(button);

			await waitFor(() => {
				expect(mockSignIn).toHaveBeenCalledWith('credentials', {
					redirect: false,
					username: '12345678900', // CPF sem formatação
					password: '12345678900', // CPF sem formatação
				});
			});
		});

		it('should send participant mode log on successful exit', async () => {
			mockSignOut.mockResolvedValue(undefined);
			mockSignIn.mockResolvedValue({ error: null });
			mockSendLog.mockResolvedValue(undefined);

			render(<HeaderParticipantMode />);

			const button = screen.getByRole('button', {
				name: /sair do modo participante/i,
			});
			fireEvent.click(button);

			await waitFor(() => {
				expect(mockSendLog).toHaveBeenCalledWith(
					'123',
					'123.456.789-00',
					'456',
					'987.654.321-00',
					'Saiu do modo participante',
				);
			});
		});

		it('should clear localStorage items on successful exit', async () => {
			mockSignOut.mockResolvedValue(undefined);
			mockSignIn.mockResolvedValue({ error: null });
			mockSendLog.mockResolvedValue(undefined);

			render(<HeaderParticipantMode />);

			const button = screen.getByRole('button', {
				name: /sair do modo participante/i,
			});
			fireEvent.click(button);

			await waitFor(() => {
				expect(localStorageMock.removeItem).toHaveBeenCalledWith(
					'isParticipantMode',
				);
				expect(localStorageMock.removeItem).toHaveBeenCalledWith(
					'participantModeStorage',
				);
				expect(localStorageMock.removeItem).toHaveBeenCalledWith(
					'originalPage',
				);
			});
		});

		it('should navigate to original page on successful exit', async () => {
			mockSignOut.mockResolvedValue(undefined);
			mockSignIn.mockResolvedValue({ error: null });
			mockSendLog.mockResolvedValue(undefined);

			render(<HeaderParticipantMode />);

			const button = screen.getByRole('button', {
				name: /sair do modo participante/i,
			});
			fireEvent.click(button);

			await waitFor(() => {
				expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
				expect(mockRouter.refresh).toHaveBeenCalled();
			});
		});

		it('should navigate to /home if no original page in localStorage', async () => {
			localStorageMock.getItem.mockImplementation((key: string) => {
				switch (key) {
					case 'participantModeStorage':
						return JSON.stringify(mockParticipantData);
					case 'originalPage':
						return null;
					case 'isParticipantMode':
						return 'true';
					default:
						return null;
				}
			});

			mockSignOut.mockResolvedValue(undefined);
			mockSignIn.mockResolvedValue({ error: null });
			mockSendLog.mockResolvedValue(undefined);

			render(<HeaderParticipantMode />);

			const button = screen.getByRole('button', {
				name: /sair do modo participante/i,
			});
			fireEvent.click(button);

			await waitFor(() => {
				expect(mockRouter.push).toHaveBeenCalledWith('/home');
			});
		});
	});

	describe('Error Handling', () => {
		it('should handle signIn error gracefully', async () => {
			const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
			mockSignOut.mockResolvedValue(undefined);
			mockSignIn.mockResolvedValue({ error: 'Authentication failed' });

			render(<HeaderParticipantMode />);

			const button = screen.getByRole('button', {
				name: /sair do modo participante/i,
			});
			fireEvent.click(button);

			await waitFor(() => {
				expect(consoleSpy).toHaveBeenCalledWith('Authentication failed');
			});

			consoleSpy.mockRestore();
		});

		it('should handle sendParticipantModeLogBff error and hide loader', async () => {
			const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
			mockSignOut.mockResolvedValue(undefined);
			mockSignIn.mockResolvedValue({ error: null });
			mockSendLog.mockRejectedValue(new Error('Log failed'));

			render(<HeaderParticipantMode />);

			const button = screen.getByRole('button', {
				name: /sair do modo participante/i,
			});
			fireEvent.click(button);

			await waitFor(() => {
				expect(consoleSpy).toHaveBeenCalledWith(
					'Erro ao enviar log:',
					expect.any(Error),
				);
				expect(screen.queryByTestId('loader-overlay')).not.toBeInTheDocument();
			});

			consoleSpy.mockRestore();
		});

		it('should not proceed if not in participant mode', async () => {
			localStorageMock.getItem.mockImplementation((key: string) => {
				switch (key) {
					case 'participantModeStorage':
						return JSON.stringify(mockParticipantData);
					case 'originalPage':
						return '/dashboard';
					case 'isParticipantMode':
						return 'false'; // Not in participant mode
					default:
						return null;
				}
			});

			mockSignOut.mockResolvedValue(undefined);
			mockSignIn.mockResolvedValue({ error: null });

			render(<HeaderParticipantMode />);

			const button = screen.getByRole('button', {
				name: /sair do modo participante/i,
			});
			fireEvent.click(button);

			await waitFor(() => {
				expect(mockSendLog).not.toHaveBeenCalled();
				expect(localStorageMock.removeItem).not.toHaveBeenCalled();
				expect(mockRouter.push).not.toHaveBeenCalled();
			});
		});
	});

	describe('Responsive Design', () => {
		it('should render with mobile classes', () => {
			render(<HeaderParticipantMode />);

			const header = document.querySelector('div.fixed');
			expect(header).toHaveClass('h-[83px]', 'px-[20px]', 'py-[10px]');
		});

		it('should render text with responsive classes', () => {
			render(<HeaderParticipantMode />);

			const title = screen.getByText('Modo Participante Ativo');
			expect(title).toHaveClass('text-sm', 'sm:text-base', 'md:text-xl');

			const supervisor = screen.getByText('Supervisor: João Silva');
			expect(supervisor).toHaveClass('text-sm', 'sm:text-base', 'md:text-xl');
		});

		it('should render container with responsive gap classes', () => {
			render(<HeaderParticipantMode />);

			const container = document.querySelector(
				'.flex.items-center.gap-\\[8px\\]',
			);
			expect(container).toBeInTheDocument();
		});
	});
});
