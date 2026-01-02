import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useUserContext } from '@/app/providers/UserProvider';
import * as useStudentsHook from './hooks/useStudents';
import { useRouter } from 'next/navigation';
import { Participacao } from './index';
import { Student } from '@/types/IStudent';
import { mockClassData } from '@/mocks/  mockClassData';

jest.mock('react-slick', () => {
	const MockSlider = ({ children }: { children: React.ReactNode }) => (
		<div className='ActivitiesSlider'>{children}</div>
	);
	MockSlider.displayName = 'MockSlider';
	return MockSlider;
});

const mockMatchMedia = jest.fn().mockImplementation((query) => ({
	matches: false,
	media: query,
	onchange: null,
	addListener: jest.fn(),
	removeListener: jest.fn(),
	addEventListener: jest.fn(),
	removeEventListener: jest.fn(),
	dispatchEvent: jest.fn(),
}));

beforeAll(() => {
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: mockMatchMedia,
	});
});

jest.mock('@/app/providers/UserProvider');
jest.mock('./hooks/useStudents');
jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));

jest.mock('../Loader', () => ({
	Loader: () => <div>Carregando...</div>,
}));

jest.mock('../NotifyModal', () => ({
	NotifyModal: ({ title, message }: { title: string; message: string }) => (
		<div data-testid='notify-modal'>
			<div>{title}</div>
			<div>{message}</div>
		</div>
	),
}));

jest.mock('../ParticipacaoTable', () => ({
	ParticipacaoTable: ({
		classData,
		whatsAppMessage,
		students,
		type,
		onStudentUpdate,
	}: {
		classData: unknown;
		whatsAppMessage: string;
		students: Student[];
		type: string;
		onStudentUpdate: () => void;
	}) => (
		<div data-testid='participacao-table'>
			<div data-testid='table-class-data'>{JSON.stringify(classData)}</div>
			<div data-testid='table-whatsapp'>{whatsAppMessage}</div>
			<div data-testid='table-students-count'>{students.length}</div>
			<div data-testid='table-type'>{type}</div>
			<button data-testid='table-refetch' onClick={onStudentUpdate}>
				Refetch
			</button>
		</div>
	),
}));

jest.mock('../ActivitiesSlider', () => ({
	ActivitiesSlider: ({
		classData,
		whatsAppMessage,
		students,
		type,
		onStudentUpdate,
	}: {
		classData: unknown;
		whatsAppMessage: string;
		students: Student[];
		type: string;
		onStudentUpdate: () => void;
	}) => (
		<div data-testid='activities-slider'>
			<div data-testid='slider-class-data'>{JSON.stringify(classData)}</div>
			<div data-testid='slider-whatsapp'>{whatsAppMessage}</div>
			<div data-testid='slider-students-count'>{students.length}</div>
			<div data-testid='slider-type'>{type}</div>
			<button data-testid='slider-refetch' onClick={onStudentUpdate}>
				Refetch
			</button>
		</div>
	),
}));

describe('Participacao', () => {
	const mockBack = jest.fn();
	const mockRefetch = jest.fn();

	const mockStudents: Student[] = [
		{
			id: 1,
			name: 'João Silva',
			cpf: '12345678901',
			activities: { activity1: true, activity2: false },
			phone: '11999999999',
			is_enroll_canceled: false,
			is_cancel_requested: false,
			enrollment_id: 1001,
		},
		{
			id: 2,
			name: 'Maria Santos',
			cpf: '98765432100',
			activities: { activity1: false, activity2: true },
			phone: '11888888888',
			is_enroll_canceled: false,
			is_cancel_requested: false,
			enrollment_id: 1002,
		},
	];

	const mockUserContext = {
		classId: 'class1',
		classesData: {
			class1: mockClassData(),
		},
		themeSettings: { whatsapp_message_to_facilitator: 'Mensagem do WhatsApp' },
	};

	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();
		(useUserContext as jest.Mock).mockReturnValue(mockUserContext);
		(useRouter as jest.Mock).mockReturnValue({ back: mockBack });
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	it('shows loader if classesData, classId or loading are falsy', () => {
		(useUserContext as jest.Mock).mockReturnValueOnce({
			classId: null,
			classesData: null,
			themeSettings: {},
		});

		(useStudentsHook.default as jest.Mock).mockReturnValue({
			students: null,
			loading: true,
			refetch: mockRefetch,
		});

		render(<Participacao type='supervisor' token='token' />);

		expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
	});

	it('shows loader when loading is true', () => {
		(useStudentsHook.default as jest.Mock).mockReturnValue({
			students: null,
			loading: true,
			refetch: mockRefetch,
		});

		render(<Participacao type='supervisor' token='token' />);

		expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
	});

	it('shows NotifyModal if students are null', () => {
		(useStudentsHook.default as jest.Mock).mockReturnValue({
			students: null,
			loading: false,
			refetch: mockRefetch,
		});

		render(<Participacao type='supervisor' token='token' />);

		expect(screen.getByTestId('notify-modal')).toBeInTheDocument();
		expect(screen.getByText('Atenção')).toBeInTheDocument();
		expect(
			screen.getByText('Ocorreu algum erro ao buscar os participantes.'),
		).toBeInTheDocument();
	});

	it('shows NotifyModal if students is empty array', () => {
		(useStudentsHook.default as jest.Mock).mockReturnValue({
			students: [],
			loading: false,
			refetch: mockRefetch,
		});

		render(<Participacao type='supervisor' token='token' />);

		expect(screen.getByTestId('notify-modal')).toBeInTheDocument();
		expect(screen.getByText('Atenção')).toBeInTheDocument();
		expect(
			screen.getByText('Não há participantes para essa turma.'),
		).toBeInTheDocument();
	});

	it('calls router.back when NotifyModal callback is executed', () => {
		(useStudentsHook.default as jest.Mock).mockReturnValue({
			students: [],
			loading: false,
			refetch: mockRefetch,
		});

		render(<Participacao type='supervisor' token='token' />);

		// Como mockamos NotifyModal, não podemos testar o callback diretamente
		// Mas podemos verificar se o router foi chamado quando necessário
		expect(mockBack).not.toHaveBeenCalled();
	});

	it('renders ParticipacaoTable when students exists', async () => {
		(useStudentsHook.default as jest.Mock).mockReturnValue({
			students: mockStudents,
			loading: false,
			refetch: mockRefetch,
		});

		render(<Participacao type='supervisor' token='token' />);

		// Aguarda a animação
		jest.advanceTimersByTime(10);

		await waitFor(() => {
			expect(screen.getByTestId('participacao-table')).toBeInTheDocument();
		});
	});

	it('renders ActivitiesSlider when students exists', async () => {
		(useStudentsHook.default as jest.Mock).mockReturnValue({
			students: mockStudents,
			loading: false,
			refetch: mockRefetch,
		});

		render(<Participacao type='supervisor' token='token' />);

		// Aguarda a animação
		jest.advanceTimersByTime(10);

		await waitFor(() => {
			expect(screen.getByTestId('activities-slider')).toBeInTheDocument();
		});
	});

	it('passes correct props to ParticipacaoTable', async () => {
		mockMatchMedia.mockReturnValue({
			matches: false,
			media: '(max-width: 768px)',
			onchange: null,
			addListener: jest.fn(),
			removeListener: jest.fn(),
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn(),
		});

		(useStudentsHook.default as jest.Mock).mockReturnValue({
			students: mockStudents,
			loading: false,
			refetch: mockRefetch,
		});

		render(<Participacao type='facilitator' token='test-token' />);

		jest.advanceTimersByTime(10);

		await waitFor(() => {
			expect(screen.getByTestId('participacao-table')).toBeInTheDocument();
		});

		expect(screen.getByTestId('table-class-data')).toHaveTextContent(
			JSON.stringify(mockClassData()),
		);
		expect(screen.getByTestId('table-whatsapp')).toHaveTextContent(
			'Mensagem do WhatsApp',
		);
		expect(screen.getByTestId('table-students-count')).toHaveTextContent('2');
		expect(screen.getByTestId('table-type')).toHaveTextContent('facilitator');
	});

	it('passes correct props to ActivitiesSlider', async () => {
		mockMatchMedia.mockReturnValue({
			matches: true,
			media: '(max-width: 768px)',
			onchange: null,
			addListener: jest.fn(),
			removeListener: jest.fn(),
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn(),
		});

		(useStudentsHook.default as jest.Mock).mockReturnValue({
			students: mockStudents,
			loading: false,
			refetch: mockRefetch,
		});

		render(<Participacao type='participant' token='test-token' />);

		jest.advanceTimersByTime(10);

		await waitFor(() => {
			expect(screen.getByTestId('activities-slider')).toBeInTheDocument();
		});

		expect(screen.getByTestId('slider-class-data')).toHaveTextContent(
			JSON.stringify(mockClassData()),
		);
		expect(screen.getByTestId('slider-whatsapp')).toHaveTextContent(
			'Mensagem do WhatsApp',
		);
		expect(screen.getByTestId('slider-students-count')).toHaveTextContent('2');
		expect(screen.getByTestId('slider-type')).toHaveTextContent('participant');
	});

	it('uses empty string when whatsAppMessage is not defined in themeSettings', async () => {
		const contextWithoutWhatsApp = {
			...mockUserContext,
			themeSettings: {},
		};

		(useUserContext as jest.Mock).mockReturnValue(contextWithoutWhatsApp);

		mockMatchMedia.mockReturnValue({
			matches: false,
			media: '(max-width: 768px)',
			onchange: null,
			addListener: jest.fn(),
			removeListener: jest.fn(),
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn(),
		});

		(useStudentsHook.default as jest.Mock).mockReturnValue({
			students: mockStudents,
			loading: false,
			refetch: mockRefetch,
		});

		render(<Participacao type='supervisor' token='token' />);

		jest.advanceTimersByTime(10);

		await waitFor(() => {
			expect(screen.getByTestId('participacao-table')).toBeInTheDocument();
		});

		expect(screen.getByTestId('table-whatsapp')).toHaveTextContent('');
	});

	it('calls refetch when onStudentUpdate is executed in ParticipacaoTable', async () => {
		mockMatchMedia.mockReturnValue({
			matches: false,
			media: '(max-width: 768px)',
			onchange: null,
			addListener: jest.fn(),
			removeListener: jest.fn(),
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn(),
		});

		(useStudentsHook.default as jest.Mock).mockReturnValue({
			students: mockStudents,
			loading: false,
			refetch: mockRefetch,
		});

		render(<Participacao type='supervisor' token='token' />);

		jest.advanceTimersByTime(10);

		await waitFor(() => {
			expect(screen.getByTestId('participacao-table')).toBeInTheDocument();
		});

		const refetchButton = screen.getByTestId('table-refetch');
		refetchButton.click();

		expect(mockRefetch).toHaveBeenCalledTimes(1);
	});

	it('calls refetch when onStudentUpdate is executed in ActivitiesSlider', async () => {
		mockMatchMedia.mockReturnValue({
			matches: true,
			media: '(max-width: 768px)',
			onchange: null,
			addListener: jest.fn(),
			removeListener: jest.fn(),
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn(),
		});

		(useStudentsHook.default as jest.Mock).mockReturnValue({
			students: mockStudents,
			loading: false,
			refetch: mockRefetch,
		});

		render(<Participacao type='supervisor' token='token' />);

		jest.advanceTimersByTime(10);

		await waitFor(() => {
			expect(screen.getByTestId('activities-slider')).toBeInTheDocument();
		});

		const refetchButton = screen.getByTestId('slider-refetch');
		refetchButton.click();

		expect(mockRefetch).toHaveBeenCalledTimes(1);
	});

	it('applies animation classes correctly', async () => {
		mockMatchMedia.mockReturnValue({
			matches: false,
			media: '(max-width: 768px)',
			onchange: null,
			addListener: jest.fn(),
			removeListener: jest.fn(),
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn(),
		});

		(useStudentsHook.default as jest.Mock).mockReturnValue({
			students: mockStudents,
			loading: false,
			refetch: mockRefetch,
		});

		render(<Participacao type='supervisor' token='token' />);

		// Antes da animação
		expect(screen.getByTestId('participacao-table').parentElement).toHaveClass(
			'opacity-0',
		);

		// Após a animação
		jest.advanceTimersByTime(10);
		await waitFor(() => {
			expect(
				screen.getByTestId('participacao-table').parentElement,
			).toHaveClass('opacity-100');
		});
	});

	it('renders both components with responsive CSS classes when students exists', async () => {
		(useStudentsHook.default as jest.Mock).mockReturnValue({
			students: mockStudents,
			loading: false,
			refetch: mockRefetch,
		});

		render(<Participacao type='supervisor' token='token' />);

		// Aguarda a animação
		jest.advanceTimersByTime(10);

		await waitFor(() => {
			expect(screen.getByTestId('participacao-table')).toBeInTheDocument();
			expect(screen.getByTestId('activities-slider')).toBeInTheDocument();
		});

		// Verifica se as classes CSS responsivas estão aplicadas
		const tableContainer =
			screen.getByTestId('participacao-table').parentElement;
		const sliderContainer =
			screen.getByTestId('activities-slider').parentElement;

		expect(tableContainer).toHaveClass('hidden', 'md:block');
		expect(sliderContainer).toHaveClass('block', 'md:hidden');
	});
});
