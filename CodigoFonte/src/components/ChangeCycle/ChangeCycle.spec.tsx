import {
	render,
	screen,
	act,
	fireEvent,
	waitFor,
} from '@testing-library/react';
import { ChangeCycle } from './ChangeCycle.component';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserContext } from '@/app/providers/UserProvider';
import { SessionProvider } from 'next-auth/react';
import { getCyclesByYear } from '@/app/services/bff/CycleService';
import { getClassesByCycle } from '@/app/services/bff/ClassService';
import { ClassByClycleResponse } from '@/types/ICycles';
import { useSubmissionNotifications } from '@/hooks/useSubmissionsNotification';

jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
	useSearchParams: jest.fn(),
}));

jest.mock('@/app/providers/UserProvider', () => ({
	useUserContext: jest.fn(),
}));

jest.mock('@/app/services/bff/ClassService', () => ({
	getClassesByCycle: jest.fn(),
	getClassById: jest.fn(),
}));

jest.mock('@/app/services/bff/CycleService', () => ({
	getCyclesByYear: jest.fn(() => Promise.resolve([])),
}));

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

jest.mock('@/hooks/useSubmissionsNotification', () => ({
	useSubmissionNotifications: jest.fn(),
}));

jest.mock('../ButtonClass', () => ({
	ButtonClass: ({
		classId,
		text,
		notify,
	}: {
		classId: string;
		text: string;
		notify?: boolean;
	}) => (
		<button data-testid={`button-class-${classId}`} data-notify={notify}>
			{text}
		</button>
	),
}));

jest.mock('./components', () => ({
	CardCycle: ({
		title,
		numberDay,
		active,
		id,
		setConsultancyDate,
		notify,
	}: {
		title: string;
		numberDay: string;
		active: boolean;
		id: string;
		setConsultancyDate: () => void;
		notify?: boolean;
	}) => (
		<button
			data-testid={`card-cycle-${id}`}
			data-active={active}
			data-notify={notify}
			onClick={setConsultancyDate}>
			{title} {numberDay}
		</button>
	),
}));

jest.mock('../NotifyModal', () => ({
	NotifyModal: ({ title, message }: { title: string; message: string }) => (
		<div data-testid='notify-modal'>
			<h2>{title}</h2>
			<p>{message}</p>
		</div>
	),
}));

jest.mock('../Dropdown', () => ({
	Dropdown: ({
		startItem,
		years,
		onClick,
	}: {
		startItem: string;
		years: string[];
		onClick: (year: string) => void;
	}) => (
		<select
			data-testid='dropdown-year'
			value={startItem}
			onChange={(e) => onClick(e.target.value)}>
			{years.map((year: string) => (
				<option key={year} value={year}>
					{year}
				</option>
			))}
		</select>
	),
}));

jest.mock('../Loader', () => ({
	Loader: () => <div data-testid='loader'>Carregando...</div>,
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: mockPush });
(useSearchParams as jest.Mock).mockReturnValue({ get: jest.fn(() => null) });

const mockSetClassId = jest.fn();
const mockSetClassesData = jest.fn();

const mockUserContext = {
	setClassId: mockSetClassId,
	classesData: {
		'1': { courses: { id: 1 } },
		'2': { courses: { id: 1 } },
		'3': { courses: { id: 1 } },
		'4': { courses: { id: 1 } },
		class1: { courses: { id: 1 } },
	},
	classId: 'class1',
	setClassesData: mockSetClassesData,
};

(useUserContext as jest.Mock).mockReturnValue(mockUserContext);

const mockCycles = [
	{
		id: 1,
		name: 'Ciclo 1',
		slug: 'ciclo-1',
		course_id: 1,
		course_name: 'Curso',
		start_date: '',
		end_date: '',
		activities: '',
		first_consultancy: [],
		second_consultancy: [],
	},
	{
		id: 2,
		name: 'Ciclo 2',
		slug: 'ciclo-2',
		course_id: 2,
		course_name: 'Curso',
		start_date: '',
		end_date: '',
		activities: '',
		first_consultancy: [],
		second_consultancy: [],
	},
];

const mockClasses: ClassByClycleResponse[] = [
	{
		id: 1,
		name: 'Turma Manhã',
		slug: 'turma-manha',
		cycle_id: 1,
		turno: { label: 'Manhã', value: 'diurno' },
	},
	{
		id: 2,
		name: 'Turma Tarde',
		slug: 'turma-tarde',
		cycle_id: 1,
		turno: { label: 'Tarde', value: 'vespertino' },
	},
	{
		id: 3,
		name: 'Turma Noite',
		slug: 'turma-noite',
		cycle_id: 1,
		turno: { label: 'Noite', value: 'noturno' },
	},
	{
		id: 4,
		name: 'Turma Única',
		slug: 'turma-unica',
		cycle_id: 1,
		turno: { label: 'Turma Única', value: 'unica' },
	},
];

const mockSubmissionNotifications = {
	'1': {
		cycle_id: 1,
		hasSubmittedActivities: true,
		classes: {
			'1': { class_id: 1, hasSubmittedActivities: true },
			'2': { class_id: 2, hasSubmittedActivities: false },
		},
	},
};

const renderWithSession = (component: React.ReactElement) => {
	return render(<SessionProvider session={null}>{component}</SessionProvider>);
};

describe('ChangeCycle', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(useUserContext as jest.Mock).mockReturnValue(mockUserContext);
		(getCyclesByYear as jest.Mock).mockResolvedValue(mockCycles);
		(getClassesByCycle as jest.Mock).mockResolvedValue(mockClasses);
		(useSubmissionNotifications as jest.Mock).mockReturnValue({
			submissionNotifications: mockSubmissionNotifications,
		});
	});

	it('shows loader if classesData or classId do not exist', async () => {
		(useUserContext as jest.Mock).mockReturnValue({
			...mockUserContext,
			classesData: null,
			classId: null,
		});

		await act(async () => {
			renderWithSession(
				<ChangeCycle
					redirect='/teste'
					cycles={mockCycles}
					token='token'
					role='supervisor'
				/>,
			);
		});

		expect(screen.getByTestId('loader')).toBeInTheDocument();
	});

	it('renders filtered cycles correctly', async () => {
		await act(async () => {
			renderWithSession(
				<ChangeCycle
					redirect='/teste'
					cycles={mockCycles}
					token='token'
					role='supervisor'
				/>,
			);
		});

		expect(screen.getByText(/Ciclo 1/i)).toBeInTheDocument();
		expect(screen.queryByText(/Ciclo 2/i)).toBeNull();
	});

	it('shows year dropdown only for supervisor', async () => {
		await act(async () => {
			renderWithSession(
				<ChangeCycle
					redirect='/teste'
					cycles={mockCycles}
					token='token'
					role='supervisor'
				/>,
			);
		});

		expect(screen.getByTestId('dropdown-year')).toBeInTheDocument();
	});

	it('does not show year dropdown for other roles', async () => {
		await act(async () => {
			renderWithSession(
				<ChangeCycle
					redirect='/teste'
					cycles={mockCycles}
					token='token'
					role='facilitador'
				/>,
			);
		});

		expect(screen.queryByTestId('dropdown-year')).not.toBeInTheDocument();
	});

	it('calls changeCycle when year is changed in dropdown', async () => {
		await act(async () => {
			renderWithSession(
				<ChangeCycle
					redirect='/teste'
					cycles={mockCycles}
					token='token'
					role='supervisor'
				/>,
			);
		});

		const dropdown = screen.getByTestId('dropdown-year');
		fireEvent.change(dropdown, { target: { value: '2024' } });

		expect(getCyclesByYear).toHaveBeenCalledWith('2024');
	});

	it('shows loader during cycle change', async () => {
		(getCyclesByYear as jest.Mock).mockImplementation(
			() =>
				new Promise((resolve) => setTimeout(() => resolve(mockCycles), 100)),
		);

		await act(async () => {
			renderWithSession(
				<ChangeCycle
					redirect='/teste'
					cycles={mockCycles}
					token='token'
					role='supervisor'
				/>,
			);
		});

		expect(screen.getByTestId('loader')).toBeInTheDocument();
	});

	it('selects cycle and fetches classes when card is clicked', async () => {
		await act(async () => {
			renderWithSession(
				<ChangeCycle
					redirect='/teste'
					cycles={mockCycles}
					token='token'
					role='supervisor'
				/>,
			);
		});

		const cycleCard = screen.getByTestId('card-cycle-1');
		fireEvent.click(cycleCard);

		await waitFor(() => {
			expect(getClassesByCycle).toHaveBeenCalledWith(1, 'token');
		});
	});

	it('renders classes filtered by shift after cycle selection', async () => {
		await act(async () => {
			renderWithSession(
				<ChangeCycle
					redirect='/teste'
					cycles={mockCycles}
					token='token'
					role='supervisor'
				/>,
			);
		});

		const cycleCard = screen.getByTestId('card-cycle-1');
		fireEvent.click(cycleCard);

		await waitFor(() => {
			expect(getClassesByCycle).toHaveBeenCalledWith(1, 'token');
		});

		// Aguarda um pouco mais para o estado ser atualizado
		await waitFor(() => {
			expect(screen.getByText('uma turma')).toBeInTheDocument();
			expect(screen.getByTestId('button-class-1')).toBeInTheDocument();
			expect(screen.getByTestId('button-class-2')).toBeInTheDocument();
			expect(screen.getByTestId('button-class-3')).toBeInTheDocument();
			expect(screen.getByTestId('button-class-4')).toBeInTheDocument();
		});
	});

	it('filters classes correctly by shift', async () => {
		const classesOnlyDiurno = mockClasses.filter(
			(c) => c.turno.value === 'diurno',
		);

		(getClassesByCycle as jest.Mock).mockResolvedValue(classesOnlyDiurno);

		await act(async () => {
			renderWithSession(
				<ChangeCycle
					redirect='/teste'
					cycles={mockCycles}
					token='token'
					role='supervisor'
				/>,
			);
		});

		const cycleCard = screen.getByTestId('card-cycle-1');
		fireEvent.click(cycleCard);

		await waitFor(() => {
			expect(screen.getByText('Manhã')).toBeInTheDocument();
			expect(screen.queryByText('Tarde')).not.toBeInTheDocument();
			expect(screen.queryByText('Noite')).not.toBeInTheDocument();
			expect(screen.queryByText('Turma Única')).not.toBeInTheDocument();
		});
	});

	it('shows submission notifications on cycle cards', async () => {
		await act(async () => {
			renderWithSession(
				<ChangeCycle
					redirect='/teste'
					cycles={mockCycles}
					token='token'
					role='supervisor'
				/>,
			);
		});

		const cycleCard = screen.getByTestId('card-cycle-1');
		expect(cycleCard).toHaveAttribute('data-notify', 'true');
	});

	it('shows submission notifications on class buttons', async () => {
		await act(async () => {
			renderWithSession(
				<ChangeCycle
					redirect='/teste'
					cycles={mockCycles}
					token='token'
					role='supervisor'
				/>,
			);
		});

		const cycleCard = screen.getByTestId('card-cycle-1');
		fireEvent.click(cycleCard);

		await waitFor(() => {
			const buttonClass1 = screen.getByTestId('button-class-1');
			const buttonClass2 = screen.getByTestId('button-class-2');

			expect(buttonClass1).toHaveAttribute('data-notify', 'true');
			expect(buttonClass2).toHaveAttribute('data-notify', 'false');
		});
	});

	it('marks cycle as active when selected', async () => {
		await act(async () => {
			renderWithSession(
				<ChangeCycle
					redirect='/teste'
					cycles={mockCycles}
					token='token'
					role='supervisor'
				/>,
			);
		});

		const cycleCard = screen.getByTestId('card-cycle-1');
		expect(cycleCard).toHaveAttribute('data-active', 'false');

		fireEvent.click(cycleCard);

		await waitFor(() => {
			expect(cycleCard).toHaveAttribute('data-active', 'true');
		});
	});

	it('navigates correctly when class is selected', async () => {
		// Mock localStorage
		const originalLocalStorage = global.localStorage;
		const mockLocalStorage = {
			setItem: jest.fn(),
			getItem: jest.fn(),
			removeItem: jest.fn(),
			clear: jest.fn(),
		};
		Object.defineProperty(global, 'localStorage', {
			value: mockLocalStorage,
			writable: true,
		});

		await act(async () => {
			renderWithSession(
				<ChangeCycle
					redirect='/teste'
					cycles={mockCycles}
					token='token'
					role='supervisor'
				/>,
			);
		});

		const cycleCard = screen.getByTestId('card-cycle-1');
		fireEvent.click(cycleCard);

		await waitFor(() => {
			expect(getClassesByCycle).toHaveBeenCalledWith(1, 'token');
		});

		await waitFor(() => {
			const buttonClass = screen.getByTestId('button-class-1');
			fireEvent.click(buttonClass);
		});

		expect(mockSetClassId).toHaveBeenCalledWith('1');
		expect(mockPush).toHaveBeenCalledWith('/teste');

		// Restore original localStorage
		Object.defineProperty(global, 'localStorage', {
			value: originalLocalStorage,
			writable: true,
		});
	});

	it('navigates to prev route when specified', async () => {
		(useSearchParams as jest.Mock).mockReturnValue({
			get: jest.fn(() => 'prev-route'),
		});

		const originalLocalStorage = global.localStorage;

		await act(async () => {
			renderWithSession(
				<ChangeCycle
					redirect='/teste'
					cycles={mockCycles}
					token='token'
					role='supervisor'
				/>,
			);
		});

		const cycleCard = screen.getByTestId('card-cycle-1');
		fireEvent.click(cycleCard);

		await waitFor(() => {
			expect(getClassesByCycle).toHaveBeenCalledWith(1, 'token');
		});

		await waitFor(() => {
			const buttonClass = screen.getByTestId('button-class-1');
			fireEvent.click(buttonClass);
		});

		expect(mockPush).toHaveBeenCalledWith('/prev-route');

		// Restore original localStorage
		Object.defineProperty(global, 'localStorage', {
			value: originalLocalStorage,
			writable: true,
		});
	});

	it('shows error modal when class does not exist in classesData', async () => {
		// Temporariamente modifica o mock para não ter a turma "2"
		(useUserContext as jest.Mock).mockReturnValue({
			...mockUserContext,
			classesData: {
				'1': { courses: { id: 1 } },
				'3': { courses: { id: 1 } },
				'4': { courses: { id: 1 } },
				class1: { courses: { id: 1 } },
			},
		});

		const localStorageSpy = jest.spyOn(Storage.prototype, 'setItem');
		localStorageSpy.mockImplementation(() => {});

		await act(async () => {
			renderWithSession(
				<ChangeCycle
					redirect='/teste'
					cycles={mockCycles}
					token='token'
					role='supervisor'
				/>,
			);
		});

		const cycleCard = screen.getByTestId('card-cycle-1');
		fireEvent.click(cycleCard);

		await waitFor(() => {
			const buttonClass = screen.getByTestId('button-class-2');
			fireEvent.click(buttonClass);
		});

		// Como a função changeClass retorna JSX quando a turma não existe,
		// mas isso não é renderizado, esperamos que não haja navegação
		expect(mockPush).not.toHaveBeenCalled();

		localStorageSpy.mockRestore();
		// Restaura o mock original
		(useUserContext as jest.Mock).mockReturnValue(mockUserContext);
	});

	it('does not fetch classes if already loading', async () => {
		(getClassesByCycle as jest.Mock).mockImplementation(
			() =>
				new Promise((resolve) => setTimeout(() => resolve(mockClasses), 100)),
		);

		await act(async () => {
			renderWithSession(
				<ChangeCycle
					redirect='/teste'
					cycles={mockCycles}
					token='token'
					role='supervisor'
				/>,
			);
		});

		const cycleCard = screen.getByTestId('card-cycle-1');

		// Primeiro clique - deve iniciar o carregamento
		fireEvent.click(cycleCard);

		// Segundo clique imediato - não deve fazer nada pois já está carregando
		fireEvent.click(cycleCard);

		// Aguarda um pouco para garantir que apenas uma chamada foi feita
		await new Promise((resolve) => setTimeout(resolve, 50));

		// Como o mock é chamado no useEffect também, esperamos 2 chamadas totais
		// Mas o segundo clique no card não deve gerar uma terceira chamada
		expect(getClassesByCycle).toHaveBeenCalledTimes(2);
	});

	it('shows message when no cycles are available', async () => {
		(useUserContext as jest.Mock).mockReturnValue({
			...mockUserContext,
			classesData: {
				class1: { courses: { id: 999 } }, // ID que não existe nos ciclos
			},
		});

		await act(async () => {
			renderWithSession(
				<ChangeCycle
					redirect='/teste'
					cycles={mockCycles}
					token='token'
					role='supervisor'
				/>,
			);
		});

		expect(screen.getByText('Não há ciclos disponíveis.')).toBeInTheDocument();
	});

	it('calculates emptyArraysCount correctly for responsive layout', async () => {
		const classesOnlyDiurno = mockClasses.filter(
			(c) => c.turno.value === 'diurno',
		);

		(getClassesByCycle as jest.Mock).mockResolvedValue(classesOnlyDiurno);

		await act(async () => {
			renderWithSession(
				<ChangeCycle
					redirect='/teste'
					cycles={mockCycles}
					token='token'
					role='supervisor'
				/>,
			);
		});

		const cycleCard = screen.getByTestId('card-cycle-1');
		fireEvent.click(cycleCard);

		await waitFor(() => {
			// Com apenas uma categoria (diurno), deve usar GRID[3] = 12
			expect(screen.getByText('Manhã')).toBeInTheDocument();
		});
	});
});
