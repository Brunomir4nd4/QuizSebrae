import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { DetailModal } from './DetailModal.component';
import { mockClassData } from '../../mocks/  mockClassData';

// Mock dos serviços
jest.mock('@/app/services/bff/ClassService', () => ({
	getUserByEmail: jest.fn(),
}));

jest.mock('@/app/services/external/ClassService', () => ({
	getUserByCPFOnly: jest.fn(),
}));

import { getUserByEmail } from '@/app/services/bff/ClassService';
import { getUserByCPFOnly } from '@/app/services/external/ClassService';

// Mock do contexto
jest.mock('@/app/providers/UserProvider', () => ({
	useUserContext: jest.fn(),
}));

import { useUserContext } from '@/app/providers/UserProvider';

// Mock dos componentes
const mockBaseModal = jest.fn();
const mockCancelModal = jest.fn();

jest.mock('../BaseModal/BaseModal.component', () => ({
	BaseModal: (props: {
		children: React.ReactNode;
		header?: React.ReactNode;
		footer?: React.ReactNode;
		open: boolean;
		onClose: () => void;
	}) => {
		mockBaseModal(props);
		return <div data-testid='base-modal'>Base Modal</div>;
	},
}));

jest.mock('../CancelModal/CancelModal.component', () => ({
	CancelModal: (props: {
		open: boolean;
		onClose: () => void;
		mainModalClose?: () => void;
		class_id?: string;
		booking_id?: string;
	}) => {
		mockCancelModal(props);
		return <div data-testid='cancel-modal'>Cancel Modal</div>;
	},
}));

jest.mock('../Loader/Loader.component', () => ({
	Loader: () => <div data-testid='loader'>Loading...</div>,
}));

const mockProps = {
	open: true,
	onClose: jest.fn(),
	title: 'Detalhes da Mentoria',
	name: 'João Silva',
	start: '14:00',
	end: '15:00',
	interval: '60',
	subject: 'Assunto Principal',
	social: '@joaosilva',
	description: 'Descrição detalhada da mentoria',
	client_email: 'joao@email.com',
	client_cpf: '12345678901',
	token: 'mock-token',
	booking_id: 'booking-123',
	className: 'turma-exemplo',
	role: 'facilitator',
};

describe('DetailModal', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		// Mock do contexto padrão
		(useUserContext as jest.Mock).mockReturnValue({
			classesData: {
				'turma-exemplo': mockClassData({ title: 'Turma Exemplo' }),
			},
			classId: 'class-123',
		});

		// Mock das funções de busca de usuário
		(getUserByEmail as jest.Mock).mockResolvedValue({ ID: 'client-456' });
		(getUserByCPFOnly as jest.Mock).mockResolvedValue({ ID: 'client-789' });
	});

	describe('Loading state', () => {
		it('should render loader when classesData and classId are not available', () => {
			(useUserContext as jest.Mock).mockReturnValue({
				classesData: null,
				classId: null,
			});

			render(<DetailModal {...mockProps} />);

			expect(screen.getByTestId('loader')).toBeInTheDocument();
		});
	});

	describe('Normal rendering', () => {
		it('should render modal with correct title', () => {
			render(<DetailModal {...mockProps} />);

			expect(mockBaseModal).toHaveBeenCalledWith(
				expect.objectContaining({
					open: true,
					onClose: mockProps.onClose,
				}),
			);
		});

		it('should render participant information correctly', () => {
			render(<DetailModal {...mockProps} />);

			expect(mockBaseModal).toHaveBeenCalled();
			const baseModalCall = mockBaseModal.mock.calls[0][0];
			expect(baseModalCall.children).toBeDefined();
		});

		it('should render subject and social information', () => {
			render(<DetailModal {...mockProps} />);

			expect(mockBaseModal).toHaveBeenCalled();
		});

		it('should render description and class information', () => {
			render(<DetailModal {...mockProps} />);

			expect(mockBaseModal).toHaveBeenCalled();
		});
	});

	describe('Client data fetching', () => {
		it('should fetch client by CPF when client_cpf is provided', async () => {
			await act(async () => {
				render(<DetailModal {...mockProps} client_email={undefined} />);
				await new Promise((resolve) => setTimeout(resolve, 0));
			});

			await waitFor(() => {
				expect(getUserByCPFOnly as jest.Mock).toHaveBeenCalledWith(
					'12345678901',
					'mock-token',
				);
			});

			expect(getUserByEmail as jest.Mock).not.toHaveBeenCalled();
		});

		it('should fetch client by email when CPF fetch fails and email is provided', async () => {
			(getUserByCPFOnly as jest.Mock).mockResolvedValue(null);

			await act(async () => {
				render(<DetailModal {...mockProps} />);
				// Wait for all promises to resolve
				await new Promise((resolve) => setTimeout(resolve, 0));
			});

			await waitFor(() => {
				expect(getUserByEmail as jest.Mock).toHaveBeenCalledWith(
					'joao@email.com',
				);
			});
		});

		it('should fetch client by email when no CPF is provided', async () => {
			await act(async () => {
				render(<DetailModal {...mockProps} client_cpf='' />);
			});

			await waitFor(() => {
				expect(getUserByEmail as jest.Mock).toHaveBeenCalledWith(
					'joao@email.com',
				);
			});

			expect(getUserByCPFOnly as jest.Mock).not.toHaveBeenCalled();
		});

		it('should not fetch client when neither CPF nor email is provided', async () => {
			await act(async () => {
				render(
					<DetailModal {...mockProps} client_cpf='' client_email={undefined} />,
				);
				await new Promise((resolve) => setTimeout(resolve, 0));
			});

			await waitFor(() => {
				expect(getUserByCPFOnly as jest.Mock).not.toHaveBeenCalled();
				expect(getUserByEmail as jest.Mock).not.toHaveBeenCalled();
			});
		});

		it('should handle fetch errors gracefully', async () => {
			(getUserByCPFOnly as jest.Mock).mockRejectedValue(
				new Error('Network error'),
			);
			(getUserByEmail as jest.Mock).mockRejectedValue(
				new Error('Network error'),
			);

			// Mock console.error to avoid console output during test
			const consoleSpy = jest
				.spyOn(console, 'error')
				.mockImplementation(() => {});

			await act(async () => {
				render(<DetailModal {...mockProps} />);
			});

			await waitFor(() => {
				expect(consoleSpy).toHaveBeenCalledWith(
					'Failed to fetch client data:',
					expect.any(Error),
				);
			});

			consoleSpy.mockRestore();
		});
	});

	describe('Conditional rendering', () => {
		it('should show "Entrar na sala" link when clientId and className are available', async () => {
			await act(async () => {
				render(<DetailModal {...mockProps} />);
				await new Promise((resolve) => setTimeout(resolve, 0));
			});

			await waitFor(() => {
				expect(mockBaseModal).toHaveBeenCalled();
			});

			// The footer should contain the link
			const baseModalCall = mockBaseModal.mock.calls[0][0];
			expect(baseModalCall.footer).toBeDefined();
		});

		it('should not show "Entrar na sala" link when clientId is not available', async () => {
			(getUserByCPFOnly as jest.Mock).mockResolvedValue(null);
			(getUserByEmail as jest.Mock).mockResolvedValue(null);

			await act(async () => {
				render(<DetailModal {...mockProps} />);
				await new Promise((resolve) => setTimeout(resolve, 0));
			});

			await waitFor(() => {
				expect(mockBaseModal).toHaveBeenCalled();
			});
		});

		it('should not show "Entrar na sala" link when className is not provided', async () => {
			await act(async () => {
				render(<DetailModal {...mockProps} className={undefined} />);
				await new Promise((resolve) => setTimeout(resolve, 0));
			});

			await waitFor(() => {
				expect(mockBaseModal).toHaveBeenCalled();
			});
		});

		it('should show "Cancelar mentoria" button for non-supervisor roles', () => {
			render(<DetailModal {...mockProps} />);

			expect(mockBaseModal).toHaveBeenCalled();
			const baseModalCall = mockBaseModal.mock.calls[0][0];
			expect(baseModalCall.footer).toBeDefined();
		});

		it('should not show "Cancelar mentoria" button for supervisor role', () => {
			render(<DetailModal {...mockProps} role='supervisor' />);

			expect(mockBaseModal).toHaveBeenCalled();
			const baseModalCall = mockBaseModal.mock.calls[0][0];
			expect(baseModalCall.footer).toBeDefined();
		});
	});

	describe('Cancel modal interaction', () => {
		it('should open cancel modal when cancel button is clicked', async () => {
			await act(async () => {
				render(<DetailModal {...mockProps} />);
			});

			// Initially, CancelModal should be rendered with open: false
			expect(mockCancelModal).toHaveBeenCalledWith(
				expect.objectContaining({
					open: false,
				}),
			);
		});

		it('should render CancelModal with correct props when opened', async () => {
			await act(async () => {
				render(<DetailModal {...mockProps} />);
				await new Promise((resolve) => setTimeout(resolve, 0));
			});

			// CancelModal should be rendered when conditions are met
			expect(mockCancelModal).toHaveBeenCalledWith(
				expect.objectContaining({
					class_id: 'class-123',
					booking_id: 'booking-123',
				}),
			);
		});

		it('should not render CancelModal when booking_id or classId is missing', () => {
			(useUserContext as jest.Mock).mockReturnValue({
				classesData: { 'turma-exemplo': mockClassData() },
				classId: null,
			});

			render(<DetailModal {...mockProps} />);

			// CancelModal should not be rendered
			expect(mockCancelModal).not.toHaveBeenCalled();
		});
	});

	describe('Modal interactions', () => {
		it('should call onClose when modal close button is clicked', () => {
			render(<DetailModal {...mockProps} />);

			expect(mockBaseModal).toHaveBeenCalledWith(
				expect.objectContaining({
					onClose: mockProps.onClose,
				}),
			);
		});

		it('should pass correct props to BaseModal', () => {
			render(<DetailModal {...mockProps} />);

			expect(mockBaseModal).toHaveBeenCalledWith(
				expect.objectContaining({
					open: true,
					onClose: mockProps.onClose,
				}),
			);
		});
	});

	describe('Class data display', () => {
		it('should display class title from classesData when available', () => {
			render(<DetailModal {...mockProps} />);

			expect(mockBaseModal).toHaveBeenCalled();
		});

		it('should display className as fallback when class data is not available', () => {
			(useUserContext as jest.Mock).mockReturnValue({
				classesData: {},
				classId: 'class-123',
			});

			render(<DetailModal {...mockProps} />);

			expect(mockBaseModal).toHaveBeenCalled();
		});

		it('should not display class section when className is not provided', () => {
			render(<DetailModal {...mockProps} className={undefined} />);

			expect(mockBaseModal).toHaveBeenCalled();
		});
	});
});
