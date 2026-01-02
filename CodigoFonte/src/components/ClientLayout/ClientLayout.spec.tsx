import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ClientLayout } from './index';
import { ClassData } from '@/types/IClass';
import { mockClassData } from '@/mocks/  mockClassData';

// Mock all dependencies
/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/components/Sidebar', () => ({
	Sidebar: ({
		isParticipantMode,
	}: {
		session: any;
		role: boolean;
		sidebar: any;
		isParticipantMode: boolean;
	}) => (
		<div data-testid='sidebar'>
			Sidebar - {isParticipantMode ? 'Participant' : 'Normal'} Mode
		</div>
	),
}));

jest.mock('@/components/Header', () => ({
	Header: ({
		title,
		highlight,
		cap,
		showCap,
		customMessage,
		isTransparent,
	}: {
		session: any;
		title: string;
		highlight: string;
		cap: string;
		showCap: boolean;
		customMessage: any;
		isTransparent: boolean;
	}) => (
		<div data-testid='header'>
			Header - {title} {highlight} - Cap: {cap} - ShowCap:{' '}
			{showCap ? 'true' : 'false'} - Transparent:{' '}
			{isTransparent ? 'true' : 'false'}
			{customMessage && <div data-testid='custom-message'>{customMessage}</div>}
		</div>
	),
}));

jest.mock('@/components/HeaderParticipantMode', () => ({
	HeaderParticipantMode: () => (
		<div data-testid='header-participant-mode'>HeaderParticipantMode</div>
	),
}));

jest.mock('@/components/ErrorBoundaryComponent', () => ({
	ErrorBoundaryComponent: () => (
		<div data-testid='error-boundary'>ErrorBoundaryComponent</div>
	),
}));

jest.mock('@/app/providers/UserProvider', () => ({
	__esModule: true,
	default: ({ children }: { children: React.ReactNode }) => (
		<div data-testid='user-provider'>{children}</div>
	),
}));

jest.mock('@/app/providers/SubmissionsProvider', () => ({
	SubmissionsProvider: ({ children }: { children: React.ReactNode }) => (
		<div data-testid='submissions-provider'>{children}</div>
	),
}));

jest.mock('next/navigation', () => ({
	usePathname: jest.fn(),
}));

import { usePathname } from 'next/navigation';

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

// Mock localStorage
const localStorageMock = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
});

describe('ClientLayout', () => {
	const mockSession = {
		user: {
			id: '1',
			role: ['subscriber'],
		},
	};

	const classData: ClassData[] = [mockClassData()];

	const mockChildren = <div data-testid='children'>Test Children</div>;

	beforeEach(() => {
		jest.clearAllMocks();
		localStorageMock.getItem.mockClear();
		localStorageMock.setItem.mockClear();
		localStorageMock.removeItem.mockClear();
	});

	describe('Normal Mode (not participant mode)', () => {
		beforeEach(() => {
			mockUsePathname.mockReturnValue('/dashboard');
			localStorageMock.getItem.mockReturnValue(null);
		});

		it('should render normally when user is not in participant mode', () => {
			render(
				<ClientLayout session={mockSession} role={false} classData={classData}>
					{mockChildren}
				</ClientLayout>,
			);

			expect(screen.getByTestId('sidebar')).toBeInTheDocument();
			expect(screen.getByTestId('header')).toBeInTheDocument();
			expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
			expect(screen.getByTestId('user-provider')).toBeInTheDocument();
			expect(screen.getByTestId('submissions-provider')).toBeInTheDocument();
			expect(screen.getByTestId('children')).toBeInTheDocument();

			expect(
				screen.queryByTestId('header-participant-mode'),
			).not.toBeInTheDocument();
		});

		it('should render header with correct props for non-atendimento route', () => {
			render(
				<ClientLayout session={mockSession} role={false} classData={classData}>
					{mockChildren}
				</ClientLayout>,
			);

			const header = screen.getByTestId('header');
			expect(header).toHaveTextContent('Gerencie');
			expect(header).toHaveTextContent('suas atividades');
			expect(header).toHaveTextContent('Cap: Boas vindas');
			expect(header).toHaveTextContent('ShowCap: true');
			expect(header).toHaveTextContent('Transparent: false');
		});

		it('should render header with custom message for atendimento route', () => {
			mockUsePathname.mockReturnValue('/atendimento');

			render(
				<ClientLayout session={mockSession} role={false} classData={classData}>
					{mockChildren}
				</ClientLayout>,
			);

			const header = screen.getByTestId('header');
			expect(header).toHaveTextContent('ShowCap: false');
			expect(header).toHaveTextContent('Transparent: true');
			expect(screen.getByTestId('custom-message')).toHaveTextContent(
				'Não fique',
			);
			expect(screen.getByTestId('custom-message')).toHaveTextContent(
				'com dúvidas!',
			);
		});
	});

	describe('Participant Mode', () => {
		beforeEach(() => {
			mockUsePathname.mockReturnValue('/dashboard');
			localStorageMock.getItem.mockReturnValue('true');
		});

		it('should render in participant mode when localStorage flag is set', async () => {
			render(
				<ClientLayout session={mockSession} role={false} classData={classData}>
					{mockChildren}
				</ClientLayout>,
			);

			await waitFor(() => {
				expect(screen.getByTestId('sidebar')).toHaveTextContent(
					'Participant Mode',
				);
			});

			expect(screen.getByTestId('header-participant-mode')).toBeInTheDocument();
			expect(screen.getByTestId('header')).toBeInTheDocument();
			expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
			expect(screen.getByTestId('children')).toBeInTheDocument();
		});

		it('should render participant mode styling', async () => {
			render(
				<ClientLayout session={mockSession} role={false} classData={classData}>
					{mockChildren}
				</ClientLayout>,
			);

			await waitFor(() => {
				const participantContainer = screen.getByTestId(
					'header-participant-mode',
				).parentElement;
				expect(participantContainer).toHaveClass('border-[#F79707]');
				expect(participantContainer).toHaveClass('pt-[93px]');
			});
		});

		it('should render bottom border in participant mode', async () => {
			render(
				<ClientLayout session={mockSession} role={false} classData={classData}>
					{mockChildren}
				</ClientLayout>,
			);

			await waitFor(() => {
				const bottomBorder = document.querySelector('.fixed.bottom-0');
				expect(bottomBorder).toBeInTheDocument();
				expect(bottomBorder).toHaveClass('bg-[#F79707]');
			});
		});
	});

	describe('useEffect behavior', () => {
		it('should remove participant mode flag for facilitator users', async () => {
			const facilitatorSession = {
				...mockSession,
				user: {
					...mockSession.user,
					role: ['facilitator'],
				},
			};

			localStorageMock.getItem.mockReturnValue('true');

			render(
				<ClientLayout
					session={facilitatorSession}
					role={false}
					classData={classData}>
					{mockChildren}
				</ClientLayout>,
			);

			await waitFor(() => {
				expect(localStorageMock.removeItem).toHaveBeenCalledWith(
					'isParticipantMode',
				);
			});

			expect(
				screen.queryByTestId('header-participant-mode'),
			).not.toBeInTheDocument();
		});

		it('should check localStorage for participant mode flag on mount', async () => {
			localStorageMock.getItem.mockReturnValue('true');

			render(
				<ClientLayout session={mockSession} role={false} classData={classData}>
					{mockChildren}
				</ClientLayout>,
			);

			await waitFor(() => {
				expect(localStorageMock.getItem).toHaveBeenCalledWith(
					'isParticipantMode',
				);
			});
		});

		it('should not set participant mode when localStorage returns null', async () => {
			localStorageMock.getItem.mockReturnValue(null);

			render(
				<ClientLayout session={mockSession} role={false} classData={classData}>
					{mockChildren}
				</ClientLayout>,
			);

			await waitFor(() => {
				expect(
					screen.queryByTestId('header-participant-mode'),
				).not.toBeInTheDocument();
			});
		});

		it('should not set participant mode when localStorage returns false string', async () => {
			localStorageMock.getItem.mockReturnValue('false');

			render(
				<ClientLayout session={mockSession} role={false} classData={classData}>
					{mockChildren}
				</ClientLayout>,
			);

			await waitFor(() => {
				expect(
					screen.queryByTestId('header-participant-mode'),
				).not.toBeInTheDocument();
			});
		});
	});

	describe('Props handling', () => {
		it('should pass correct props to Sidebar', () => {
			render(
				<ClientLayout session={mockSession} role={true} classData={classData}>
					{mockChildren}
				</ClientLayout>,
			);

			const sidebar = screen.getByTestId('sidebar');
			expect(sidebar).toHaveTextContent('Normal Mode');
		});

		it('should render children correctly', () => {
			render(
				<ClientLayout session={mockSession} role={false} classData={classData}>
					{mockChildren}
				</ClientLayout>,
			);

			expect(screen.getByTestId('children')).toBeInTheDocument();
		});
	});
});
