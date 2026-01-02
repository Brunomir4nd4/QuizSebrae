import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NavigateAsParticipantIcon } from './NavigateAsParticipantIcon.component';

// Mocks
jest.mock('next-auth/react', () => ({
	useSession: jest.fn(),
	signOut: jest.fn(),
	signIn: jest.fn(),
}));

jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));

jest.mock('@/app/services/external/ClassService', () => ({
	getStudentCpf: jest.fn(),
}));

jest.mock('@/app/services/bff/ParticipantModeLogs', () => ({
	sendParticipantModeLogBff: jest.fn(),
}));

jest.mock('@/components/Loader', () => ({
	LoaderOverlay: () => <div data-testid='loader-overlay'>Loading...</div>,
}));

jest.mock('../BootstrapTooltip', () => ({
	BootstrapTooltip: ({
		children,
		title,
	}: {
		children: React.ReactNode;
		title: string;
	}) => (
		<div data-testid='bootstrap-tooltip' title={title}>
			{children}
		</div>
	),
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

// Mock do window.location
delete (global as unknown as { window: { location: unknown } }).window.location;
(global as unknown as { window: { location: Location } }).window.location = {
	pathname: '/current-path',
} as Location;

import { useSession, signOut, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getStudentCpf } from '@/app/services/external/ClassService';
import { sendParticipantModeLogBff } from '@/app/services/bff/ParticipantModeLogs';

const mockUseSession = useSession as jest.Mock;
const mockSignOut = signOut as jest.Mock;
const mockSignIn = signIn as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockGetStudentCpf = getStudentCpf as jest.Mock;
const mockSendParticipantModeLogBff = sendParticipantModeLogBff as jest.Mock;

describe('NavigateAsParticipantIcon', () => {
	const mockRouter = {
		push: jest.fn(),
		refresh: jest.fn(),
	};

	const mockSession = {
		user: {
			id: 123,
			token: 'mock-token',
			user_display_name: 'Test User',
			user_nicename: '12345678901',
			role: 'facilitator',
			cpf: '12345678901',
		},
	};

	beforeEach(() => {
		jest.clearAllMocks();
		mockUseRouter.mockReturnValue(mockRouter);
		localStorageMock.clear();
	});

	afterEach(() => {
		jest.clearAllTimers();
	});

	it('renders correctly with default props', () => {
		mockUseSession.mockReturnValue({ data: mockSession });

		render(<NavigateAsParticipantIcon studentId={456} />);

		expect(screen.getByTestId('bootstrap-tooltip')).toBeInTheDocument();
		expect(screen.getByTestId('bootstrap-tooltip')).toHaveAttribute(
			'title',
			'Navegar como esse participante',
		);
		expect(screen.getByText('Modo Participante')).toHaveClass('md:hidden');
	});

	it('renders with showLabel=true', () => {
		mockUseSession.mockReturnValue({ data: mockSession });

		render(<NavigateAsParticipantIcon studentId={456} showLabel={true} />);

		expect(screen.getByText('Modo Participante')).not.toHaveClass('md:hidden');
	});

	it('renders SVG icon', () => {
		mockUseSession.mockReturnValue({ data: mockSession });

		render(<NavigateAsParticipantIcon studentId={456} />);

		const svg = document.querySelector('svg');
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveAttribute('viewBox', '0 0 16 16');
	});

	it('does not execute enterParticipantMode when clicked without session', async () => {
		mockUseSession.mockReturnValue({ data: null });

		render(<NavigateAsParticipantIcon studentId={456} />);

		const button = screen.getByTestId('bootstrap-tooltip')
			.firstChild as HTMLElement;
		fireEvent.click(button);

		expect(mockGetStudentCpf).not.toHaveBeenCalled();
		expect(mockSignOut).not.toHaveBeenCalled();
		expect(mockSignIn).not.toHaveBeenCalled();
	});

	it('executes enterParticipantMode successfully', async () => {
		mockUseSession.mockReturnValue({ data: mockSession });
		mockGetStudentCpf.mockResolvedValue('98765432100');
		mockSignOut.mockResolvedValue(undefined);
		mockSignIn.mockResolvedValue({ error: null });
		mockSendParticipantModeLogBff.mockResolvedValue(undefined);

		render(<NavigateAsParticipantIcon studentId={456} />);

		const button = screen.getByTestId('bootstrap-tooltip')
			.firstChild as HTMLElement;
		fireEvent.click(button);

		// Should show loader
		expect(screen.getByTestId('loader-overlay')).toBeInTheDocument();

		await waitFor(() => {
			expect(mockGetStudentCpf).toHaveBeenCalledWith(456, 'mock-token');
			expect(mockSignOut).toHaveBeenCalledWith({ redirect: false });
			expect(mockSignIn).toHaveBeenCalledWith('credentials', {
				redirect: false,
				username: '98765432100',
				password: '98765432100',
			});
		});

		await waitFor(() => {
			expect(localStorageMock.setItem).toHaveBeenCalledWith(
				'isParticipantMode',
				'true',
			);
			expect(localStorageMock.setItem).toHaveBeenCalledWith(
				'participantModeStorage',
				JSON.stringify({
					id: 123,
					displayName: 'Test User',
					cpf: '12345678901',
					role: 'facilitator',
					participantId: 456,
					participantCpf: '98765432100',
				}),
			);
			expect(localStorageMock.setItem).toHaveBeenCalledWith(
				'originalPage',
				'/current-path',
			);
		});

		await waitFor(() => {
			expect(mockSendParticipantModeLogBff).toHaveBeenCalledWith(
				'123',
				'12345678901',
				'456',
				'98765432100',
				'Entrou no modo participante',
			);
			expect(mockRouter.push).toHaveBeenCalledWith('/home');
			expect(mockRouter.refresh).toHaveBeenCalled();
		});
	});

	it('handles getStudentCpf error', async () => {
		mockUseSession.mockReturnValue({ data: mockSession });
		mockGetStudentCpf.mockRejectedValue(new Error('API Error'));
		const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

		render(<NavigateAsParticipantIcon studentId={456} />);

		const button = screen.getByTestId('bootstrap-tooltip')
			.firstChild as HTMLElement;
		fireEvent.click(button);

		await waitFor(() => {
			expect(mockGetStudentCpf).toHaveBeenCalledWith(456, 'mock-token');
		});

		await waitFor(() => {
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'Erro no processo de entrar no modo participante:',
				expect.any(Error),
			);
			expect(screen.queryByTestId('loader-overlay')).not.toBeInTheDocument();
		});

		consoleErrorSpy.mockRestore();
	});

	it('handles signIn error', async () => {
		mockUseSession.mockReturnValue({ data: mockSession });
		mockGetStudentCpf.mockResolvedValue('98765432100');
		mockSignOut.mockResolvedValue(undefined);
		mockSignIn.mockResolvedValue({ error: 'Invalid credentials' });
		const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

		render(<NavigateAsParticipantIcon studentId={456} />);

		const button = screen.getByTestId('bootstrap-tooltip')
			.firstChild as HTMLElement;
		fireEvent.click(button);

		await waitFor(() => {
			expect(mockSignIn).toHaveBeenCalledWith('credentials', {
				redirect: false,
				username: '98765432100',
				password: '98765432100',
			});
		});

		await waitFor(() => {
			expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid credentials');
			expect(screen.queryByTestId('loader-overlay')).not.toBeInTheDocument();
		});

		consoleErrorSpy.mockRestore();
	});

	it('handles sendParticipantModeLogBff error gracefully', async () => {
		mockUseSession.mockReturnValue({ data: mockSession });
		mockGetStudentCpf.mockResolvedValue('98765432100');
		mockSignOut.mockResolvedValue(undefined);
		mockSignIn.mockResolvedValue({ error: null });
		mockSendParticipantModeLogBff.mockRejectedValue(new Error('Log error'));
		const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

		render(<NavigateAsParticipantIcon studentId={456} />);

		const button = screen.getByTestId('bootstrap-tooltip')
			.firstChild as HTMLElement;
		fireEvent.click(button);

		// Should log error but still complete the process
		await waitFor(() => {
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'Erro no processo de entrar no modo participante:',
				expect.any(Error),
			);
		});

		// Router should not be called when logging fails
		expect(mockRouter.push).not.toHaveBeenCalled();
		expect(mockRouter.refresh).not.toHaveBeenCalled();

		// Loader should be hidden
		await waitFor(() => {
			expect(screen.queryByTestId('loader-overlay')).not.toBeInTheDocument();
		});

		consoleErrorSpy.mockRestore();
	});

	it('cleans CPF by removing non-digits', async () => {
		mockUseSession.mockReturnValue({ data: mockSession });
		mockGetStudentCpf.mockResolvedValue('987.654.321-00');
		mockSignOut.mockResolvedValue(undefined);
		mockSignIn.mockResolvedValue({ error: null });
		mockSendParticipantModeLogBff.mockResolvedValue(undefined);

		render(<NavigateAsParticipantIcon studentId={456} />);

		const button = screen.getByTestId('bootstrap-tooltip')
			.firstChild as HTMLElement;
		fireEvent.click(button);

		await waitFor(() => {
			expect(mockSignIn).toHaveBeenCalledWith('credentials', {
				redirect: false,
				username: '98765432100',
				password: '98765432100',
			});
		});
	});

	it('does not show loader initially', () => {
		mockUseSession.mockReturnValue({ data: mockSession });

		render(<NavigateAsParticipantIcon studentId={456} />);

		expect(screen.queryByTestId('loader-overlay')).not.toBeInTheDocument();
	});

	it('has correct CSS classes for responsive design', () => {
		mockUseSession.mockReturnValue({ data: mockSession });

		render(<NavigateAsParticipantIcon studentId={456} />);

		// The outer wrapper div with 'relative' class
		const outerWrapper =
			screen.getByTestId('bootstrap-tooltip').parentElement?.parentElement;
		expect(outerWrapper).toHaveClass('relative');

		// The NavigateAsParticipantIconWrapper with transition classes (parent of bootstrap-tooltip)
		const navigateAsParticipantIconWrapper =
			screen.getByTestId('bootstrap-tooltip').parentElement;
		expect(navigateAsParticipantIconWrapper).toHaveClass(
			'transition',
			'duration-100',
			'ease-in',
		);

		// SVG icon responsive classes
		const svg = document.querySelector('svg');
		expect(svg).toHaveClass('w-4', 'h-4', 'md:w-5', 'md:h-5', 'shrink-0');

		// Text responsive classes
		const text = screen.getByText('Modo Participante');
		expect(text).toHaveClass('text-sm', 'leading-none', 'md:hidden');
	});
});
