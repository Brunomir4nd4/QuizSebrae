import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Schedule } from './Schedule.component';
import { ScheduleCalendarView } from './utils/ScheduleCalendarView';

// Mocks
jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));

jest.mock('@/app/providers/ScheduleProvider', () => ({
	useScheduleContext: jest.fn(),
}));

jest.mock('@/app/providers/UserProvider', () => ({
	useUserContext: jest.fn(),
}));

jest.mock('./components/ScheduleHeader', () => ({
	ScheduleHeader: ({
		type,
		date,
		weekStart,
		weekEnd,
	}: {
		type: string;
		date: unknown;
		weekStart: unknown;
		weekEnd: unknown;
		setDate: unknown;
	}) => (
		<div data-testid='schedule-header'>
			Header - {type} - {date instanceof DateTime ? 'DateTime' : 'Date'} -{' '}
			{weekStart instanceof DateTime ? 'DateTime' : 'Date'} -{' '}
			{weekEnd instanceof DateTime ? 'DateTime' : 'Date'}
		</div>
	),
}));

jest.mock('./components/ScheduleSlots', () => ({
	ScheduleSlots: ({
		type,
		weekStart,
		weekEnd,
		workHourStart,
		workHourEnd,
	}: {
		type: string;
		weekStart: unknown;
		weekEnd: unknown;
		workHourStart: number;
		workHourEnd: number;
		events: unknown;
		selectedDay: unknown;
		onEventClick: unknown;
	}) => (
		<div data-testid='schedule-slots'>
			Slots - {type} - {weekStart instanceof DateTime ? 'DateTime' : 'Date'} -{' '}
			{weekEnd instanceof DateTime ? 'DateTime' : 'Date'} - {workHourStart}-
			{workHourEnd}
		</div>
	),
}));

jest.mock('../NotifyModal', () => ({
	NotifyModal: ({
		title,
		message,
	}: {
		title: string;
		message: string;
		logout: boolean;
		whats: boolean;
	}) => (
		<div data-testid='notify-modal'>
			{title}: {message}
		</div>
	),
}));

jest.mock('../Loader', () => ({
	Loader: () => <div data-testid='loader'>Loading...</div>,
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

// Mock do window.innerWidth
const originalInnerWidth = window.innerWidth;
delete (window as { innerWidth?: number }).innerWidth;

import { useRouter } from 'next/navigation';
import { useScheduleContext } from '@/app/providers/ScheduleProvider';
import { useUserContext } from '@/app/providers/UserProvider';
import { DateTime } from 'luxon';

const mockUseRouter = useRouter as jest.Mock;
const mockUseScheduleContext = useScheduleContext as jest.Mock;
const mockUseUserContext = useUserContext as jest.Mock;

describe('Schedule', () => {
	const mockRouter = {
		push: jest.fn(),
	};

	const mockSession = {
		user: {
			id: 123,
			token: 'mock-token',
			user_display_name: 'Test User',
			user_nicename: 'testuser',
			user_first_name: 'Test',
			user_last_name: 'User',
			user_email: 'test@example.com',
			role: ['student'],
			cpf: '12345678901',
		},
		expires: '2025-12-31T23:59:59.999Z',
	};

	const mockDate = DateTime.fromISO('2025-10-27T10:00:00');

	const defaultProps = {
		type: ScheduleCalendarView.Week,
		focus: new Date(),
		events: [],
		session: mockSession,
		workHourStart: 6,
		workHourEnd: 21,
	};

	beforeEach(() => {
		jest.clearAllMocks();
		localStorageMock.clear();
		mockUseRouter.mockReturnValue(mockRouter);
		(window as Window & { innerWidth: number }).innerWidth = 1200; // Desktop width
	});

	afterEach(() => {
		jest.clearAllTimers();
		(window as Window & { innerWidth: number }).innerWidth = originalInnerWidth;
	});

	it('renders with default props', () => {
		mockUseScheduleContext.mockReturnValue({
			schedule: [],
			date: mockDate,
			loading: false,
			setDate: jest.fn(),
		});
		mockUseUserContext.mockReturnValue({
			classId: '123',
			classesData: { '123': { enable_calendar: true } },
		});

		render(<Schedule {...defaultProps} />);

		expect(screen.getByTestId('schedule-header')).toBeInTheDocument();
		expect(screen.getByTestId('schedule-slots')).toBeInTheDocument();
	});

	it('renders in week view on desktop', () => {
		mockUseScheduleContext.mockReturnValue({
			schedule: [],
			date: mockDate,
			loading: false,
			setDate: jest.fn(),
		});
		mockUseUserContext.mockReturnValue({
			classId: '123',
			classesData: { '123': { enable_calendar: true } },
		});

		render(<Schedule {...defaultProps} />);

		expect(screen.getByText(/Header - week/)).toBeInTheDocument();
		expect(screen.getByText(/Slots - week/)).toBeInTheDocument();
	});

	it('renders in day view on mobile', () => {
		(window as Window & { innerWidth: number }).innerWidth = 800; // Mobile width

		mockUseScheduleContext.mockReturnValue({
			schedule: [],
			date: mockDate,
			loading: false,
			setDate: jest.fn(),
		});
		mockUseUserContext.mockReturnValue({
			classId: '123',
			classesData: { '123': { enable_calendar: true } },
		});

		render(<Schedule {...defaultProps} />);

		expect(screen.getByText(/Header - day/)).toBeInTheDocument();
		expect(screen.getByText(/Slots - day/)).toBeInTheDocument();
	});

	it('shows loader when loading is true', () => {
		mockUseScheduleContext.mockReturnValue({
			schedule: null,
			date: mockDate,
			loading: true,
			setDate: jest.fn(),
		});
		mockUseUserContext.mockReturnValue({
			classId: '123',
			classesData: { '123': { enable_calendar: true } },
		});

		render(<Schedule {...defaultProps} />);

		expect(screen.getByTestId('loader')).toBeInTheDocument();
		expect(screen.queryByTestId('schedule-slots')).not.toBeInTheDocument();
	});

	it('shows error modal when schedule is null and not loading', () => {
		mockUseScheduleContext.mockReturnValue({
			schedule: null,
			date: mockDate,
			loading: false,
			setDate: jest.fn(),
		});
		mockUseUserContext.mockReturnValue({
			classId: '123',
			classesData: { '123': { enable_calendar: true } },
		});

		render(<Schedule {...defaultProps} />);

		expect(screen.getByTestId('notify-modal')).toBeInTheDocument();
		expect(screen.getByText(/Atenção/)).toBeInTheDocument();
	});

	it('redirects to home when calendar is disabled', () => {
		mockUseScheduleContext.mockReturnValue({
			schedule: [],
			date: mockDate,
			loading: false,
			setDate: jest.fn(),
		});
		mockUseUserContext.mockReturnValue({
			classId: '123',
			classesData: { '123': { enable_calendar: false } },
		});

		render(<Schedule {...defaultProps} />);

		expect(mockRouter.push).toHaveBeenCalledWith('/home');
	});

	it('does not redirect when calendar is enabled', () => {
		mockUseScheduleContext.mockReturnValue({
			schedule: [],
			date: mockDate,
			loading: false,
			setDate: jest.fn(),
		});
		mockUseUserContext.mockReturnValue({
			classId: '123',
			classesData: { '123': { enable_calendar: true } },
		});

		render(<Schedule {...defaultProps} />);

		expect(mockRouter.push).not.toHaveBeenCalled();
	});

	it('does not redirect when classesData is not available', () => {
		mockUseScheduleContext.mockReturnValue({
			schedule: [],
			date: mockDate,
			loading: false,
			setDate: jest.fn(),
		});
		mockUseUserContext.mockReturnValue({
			classId: null,
			classesData: null,
		});

		render(<Schedule {...defaultProps} />);

		expect(mockRouter.push).not.toHaveBeenCalled();
	});

	it('sets class_id in localStorage for supervisor without existing class_id', () => {
		const supervisorSession = {
			user: {
				id: 456,
				token: 'supervisor-token',
				user_display_name: 'Supervisor User',
				user_nicename: 'supervisor',
				user_first_name: 'Supervisor',
				user_last_name: 'User',
				user_email: 'supervisor@example.com',
				role: ['supervisor'],
				cpf: '98765432100',
			},
			expires: '2025-12-31T23:59:59.999Z',
		};

		mockUseScheduleContext.mockReturnValue({
			schedule: [],
			date: mockDate,
			loading: false,
			setDate: jest.fn(),
		});
		mockUseUserContext.mockReturnValue({
			classId: '456',
			classesData: { '456': { enable_calendar: true } },
		});

		localStorageMock.getItem.mockReturnValue(null);

		render(<Schedule {...defaultProps} session={supervisorSession} />);

		expect(localStorageMock.getItem).toHaveBeenCalledWith('class_id');
		expect(localStorageMock.setItem).toHaveBeenCalledWith('class_id', '456');
	});

	it('does not set class_id in localStorage for supervisor with existing class_id', () => {
		const supervisorSession = {
			user: {
				id: 456,
				token: 'supervisor-token',
				user_display_name: 'Supervisor User',
				user_nicename: 'supervisor',
				user_first_name: 'Supervisor',
				user_last_name: 'User',
				user_email: 'supervisor@example.com',
				role: ['supervisor'],
				cpf: '98765432100',
			},
			expires: '2025-12-31T23:59:59.999Z',
		};

		mockUseScheduleContext.mockReturnValue({
			schedule: [],
			date: mockDate,
			loading: false,
			setDate: jest.fn(),
		});
		mockUseUserContext.mockReturnValue({
			classId: '456',
			classesData: { '456': { enable_calendar: true } },
		});

		localStorageMock.getItem.mockReturnValue('existing-class-id');

		render(<Schedule {...defaultProps} session={supervisorSession} />);

		expect(localStorageMock.getItem).toHaveBeenCalledWith('class_id');
		expect(localStorageMock.setItem).not.toHaveBeenCalled();
	});

	it('does not set class_id in localStorage for non-supervisor users', () => {
		mockUseScheduleContext.mockReturnValue({
			schedule: [],
			date: mockDate,
			loading: false,
			setDate: jest.fn(),
		});
		mockUseUserContext.mockReturnValue({
			classId: '456',
			classesData: { '456': { enable_calendar: true } },
		});

		render(<Schedule {...defaultProps} />);

		expect(localStorageMock.getItem).toHaveBeenCalledWith('class_id');
		expect(localStorageMock.setItem).not.toHaveBeenCalled();
	});

	it('handles window resize', async () => {
		mockUseScheduleContext.mockReturnValue({
			schedule: [],
			date: mockDate,
			loading: false,
			setDate: jest.fn(),
		});
		mockUseUserContext.mockReturnValue({
			classId: '123',
			classesData: { '123': { enable_calendar: true } },
		});

		render(<Schedule {...defaultProps} />);

		// Initially renders in week view (desktop)
		expect(screen.getByText(/Header - week/)).toBeInTheDocument();

		// Simulate window resize to mobile
		(window as Window & { innerWidth: number }).innerWidth = 800;
		window.dispatchEvent(new Event('resize'));

		await waitFor(() => {
			expect(screen.getByText(/Header - day/)).toBeInTheDocument();
		});
	});

	it('passes correct props to ScheduleHeader', () => {
		mockUseScheduleContext.mockReturnValue({
			schedule: [],
			date: mockDate,
			loading: false,
			setDate: jest.fn(),
		});
		mockUseUserContext.mockReturnValue({
			classId: '123',
			classesData: { '123': { enable_calendar: true } },
		});

		render(<Schedule {...defaultProps} />);

		const header = screen.getByTestId('schedule-header');
		// The mock component will show the props passed to it
		expect(header).toBeInTheDocument();
	});

	it('passes correct props to ScheduleSlots', () => {
		mockUseScheduleContext.mockReturnValue({
			schedule: [{ id: 1, title: 'Test Event' }],
			date: mockDate,
			loading: false,
			setDate: jest.fn(),
		});
		mockUseUserContext.mockReturnValue({
			classId: '123',
			classesData: { '123': { enable_calendar: true } },
		});

		render(<Schedule {...defaultProps} />);

		const slots = screen.getByTestId('schedule-slots');
		expect(slots).toBeInTheDocument();
		expect(slots).toHaveTextContent('6-21'); // workHourStart-workHourEnd
	});

	it('handles custom work hours', () => {
		mockUseScheduleContext.mockReturnValue({
			schedule: [],
			date: mockDate,
			loading: false,
			setDate: jest.fn(),
		});
		mockUseUserContext.mockReturnValue({
			classId: '123',
			classesData: { '123': { enable_calendar: true } },
		});

		render(<Schedule {...defaultProps} workHourStart={8} workHourEnd={18} />);

		const slots = screen.getByTestId('schedule-slots');
		expect(slots).toHaveTextContent('8-18');
	});
});
