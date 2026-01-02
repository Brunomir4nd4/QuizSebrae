import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DateTime } from 'luxon';

import { ScheduleSlots } from './ScheduleSlots.component';
import { ScheduleEvent, ScheduleEventType } from '../../models/ScheduleEvent';
import { ScheduleCalendarView } from '../../utils/ScheduleCalendarView';

// Mock useScheduleContext
const mockUseScheduleContext = jest.fn();
jest.mock('@/app/providers/ScheduleProvider', () => ({
	useScheduleContext: () => mockUseScheduleContext(),
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
	useSession: () => ({
		data: {
			user: {
				id: 1,
				name: 'Test User',
				role: ['user'], // Add role property to fix ModalBlockTime error
			},
		},
		status: 'authenticated',
	}),
}));

// Mock useUserContext
jest.mock('@/app/providers/UserProvider', () => ({
	useUserContext: () => ({
		classId: 'test-class-id',
	}),
}));

// Mock ModalBlockTime
jest.mock('@/components/ModalBlockTime', () => ({
	ModalBlockTime: ({
		open,
		onClose,
	}: {
		open: boolean;
		onClose: () => void;
	}) =>
		open ? (
			<div data-testid='modal-block-time' onClick={onClose}>
				Modal Content
			</div>
		) : null,
}));

// Mock blockScheduleTimeBff
jest.mock('@/app/services/bff/ScheduleService', () => ({
	blockScheduleTimeBff: jest.fn().mockResolvedValue({ success: true }),
}));

// Mock Loader
jest.mock('@/components/Loader', () => ({
	Loader: () => <div data-testid='loader'>Loading...</div>,
}));

// Mock ScheduleSlot component
jest.mock('../ScheduleSlot/ScheduleSlot.component', () => ({
	ScheduleSlot: (props: {
		event: ScheduleEvent;
		spanCol?: number;
		spanRow?: number;
		bookingId: string;
	}) => (
		<div
			data-testid={`schedule-slot-${props.event.id}`}
			data-span-col={props.spanCol}
			data-span-row={props.spanRow}
			data-booking-id={props.bookingId}>
			{props.event.title}
		</div>
	),
}));

const theme = createTheme();

const mockScheduleContext = {
	dayViewDate: DateTime.fromObject({ year: 2025, month: 10, day: 27 }),
};

const createMockEvent = (
	overrides: Partial<ScheduleEvent> = {},
): ScheduleEvent => ({
	id: '1',
	type: ScheduleEventType.Appointment,
	start: new Date('2025-10-27T10:00:00'),
	end: new Date('2025-10-27T11:00:00'),
	client_name: 'João Silva',
	title: 'Mentoria Individual',
	additional_fields: {
		main_topic: 'React',
		social_network: 'LinkedIn',
		specific_questions: 'Como melhorar performance?',
	},
	client: {
		cpf: '12345678901',
		email: 'joao@example.com',
		phone_number: '11999999999',
		name: 'João Silva',
		id: 1,
	},
	employee: {
		cpf: '98765432100',
		email: 'mentor@example.com',
		phone_number: '11888888888',
		name: 'Mentor Silva',
		id: 2,
	},
	class_id: 'class-123',
	...overrides,
});

const renderWithProviders = (component: React.ReactElement) => {
	return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('ScheduleSlots Component', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockUseScheduleContext.mockReturnValue(mockScheduleContext);
	});

	it('should render DaySlots when type is Day', () => {
		const events = [createMockEvent()];
		const props = {
			type: ScheduleCalendarView.Day,
			weekStart: DateTime.fromObject({ year: 2025, month: 10, day: 20 }),
			weekEnd: DateTime.fromObject({ year: 2025, month: 10, day: 26 }),
			workHourStart: 8,
			workHourEnd: 18,
			events,
			selectedDay: 1,
		};

		renderWithProviders(<ScheduleSlots {...props} />);

		// Check if DaySlots table is rendered (has class "w-full")
		const tables = screen.getAllByRole('table');
		expect(tables.length).toBeGreaterThan(0);
		expect(tables[0]).toHaveClass('w-full');
	});

	it('should render WeekSlots when type is Week', () => {
		const events = [createMockEvent()];
		const props = {
			type: ScheduleCalendarView.Week,
			weekStart: DateTime.fromObject({ year: 2025, month: 10, day: 20 }),
			weekEnd: DateTime.fromObject({ year: 2025, month: 10, day: 26 }),
			workHourStart: 8,
			workHourEnd: 18,
			events,
			selectedDay: 1,
		};

		renderWithProviders(<ScheduleSlots {...props} />);

		// Check if WeekSlots table is rendered (has class "w-full")
		const tables = screen.getAllByRole('table');
		expect(tables.length).toBeGreaterThan(0);
		expect(tables[0]).toHaveClass('w-full');
	});

	it('should filter events for day view based on dayViewDate', () => {
		const dayEvent = createMockEvent({
			id: '1',
			start: new Date('2025-10-27T10:00:00'), // Same day as dayViewDate
		});
		const otherDayEvent = createMockEvent({
			id: '2',
			start: new Date('2025-10-28T10:00:00'), // Different day
		});
		const events = [dayEvent, otherDayEvent];

		const props = {
			type: ScheduleCalendarView.Day,
			weekStart: DateTime.fromObject({ year: 2025, month: 10, day: 20 }),
			weekEnd: DateTime.fromObject({ year: 2025, month: 10, day: 26 }),
			workHourStart: 8,
			workHourEnd: 18,
			events,
			selectedDay: 1,
		};

		renderWithProviders(<ScheduleSlots {...props} />);

		// Should only render the event from the same day
		expect(screen.getByTestId('schedule-slot-1')).toBeInTheDocument();
		expect(screen.queryByTestId('schedule-slot-2')).not.toBeInTheDocument();
	});

	it('should render all events for week view', () => {
		const event1 = createMockEvent({
			id: '1',
			start: new Date('2025-10-27T10:00:00'),
		});
		const event2 = createMockEvent({
			id: '2',
			start: new Date('2025-10-28T10:00:00'),
		});
		const events = [event1, event2];

		const props = {
			type: ScheduleCalendarView.Week,
			weekStart: DateTime.fromObject({ year: 2025, month: 10, day: 20 }),
			weekEnd: DateTime.fromObject({ year: 2025, month: 10, day: 26 }),
			workHourStart: 8,
			workHourEnd: 18,
			events,
			selectedDay: 1,
		};

		renderWithProviders(<ScheduleSlots {...props} />);

		// Should render both events
		expect(screen.getByTestId('schedule-slot-1')).toBeInTheDocument();
		expect(screen.getByTestId('schedule-slot-2')).toBeInTheDocument();
	});

	it('should calculate correct spanCol and spanRow for day view', () => {
		const event = createMockEvent({
			start: new Date('2025-10-27T10:00:00'), // 10 AM
		});
		const events = [event];

		const props = {
			type: ScheduleCalendarView.Day,
			weekStart: DateTime.fromObject({ year: 2025, month: 10, day: 20 }),
			weekEnd: DateTime.fromObject({ year: 2025, month: 10, day: 26 }),
			workHourStart: 8, // Work starts at 8 AM
			workHourEnd: 18,
			events,
			selectedDay: 1,
		};

		renderWithProviders(<ScheduleSlots {...props} />);

		const slotElement = screen.getByTestId('schedule-slot-1');
		// spanCol should be 1 for day view
		expect(slotElement).toHaveAttribute('data-span-col', '1');
		// spanRow = ((10 - 8) * 2) + 1 = (2 * 2) + 1 = 5
		expect(slotElement).toHaveAttribute('data-span-row', '5');
	});

	it('should calculate correct spanCol and spanRow for week view', () => {
		const event = createMockEvent({
			start: new Date('2025-10-22T10:00:00'), // Wednesday (3rd day of week)
		});
		const events = [event];

		const props = {
			type: ScheduleCalendarView.Week,
			weekStart: DateTime.fromObject({ year: 2025, month: 10, day: 20 }), // Monday
			weekEnd: DateTime.fromObject({ year: 2025, month: 10, day: 26 }),
			workHourStart: 8, // Work starts at 8 AM
			workHourEnd: 18,
			events,
			selectedDay: 1,
		};

		renderWithProviders(<ScheduleSlots {...props} />);

		const slotElement = screen.getByTestId('schedule-slot-1');
		// spanCol = Math.floor(2 days diff) + 1 = 3 (Wednesday is 3rd day)
		expect(slotElement).toHaveAttribute('data-span-col', '3');
		// spanRow = ((10 - 8) * 2) + 1 = (2 * 2) + 1 = 5
		expect(slotElement).toHaveAttribute('data-span-row', '5');
	});

	it('should pass correct props to ScheduleSlot components', () => {
		const event = createMockEvent();
		const events = [event];
		const mockOnEventClick = jest.fn();

		const props = {
			type: ScheduleCalendarView.Day,
			weekStart: DateTime.fromObject({ year: 2025, month: 10, day: 20 }),
			weekEnd: DateTime.fromObject({ year: 2025, month: 10, day: 26 }),
			workHourStart: 8,
			workHourEnd: 18,
			events,
			onEventClick: mockOnEventClick,
			selectedDay: 1,
		};

		renderWithProviders(<ScheduleSlots {...props} />);

		const slotElement = screen.getByTestId('schedule-slot-1');
		expect(slotElement).toHaveAttribute('data-booking-id', '1');
		expect(slotElement).toHaveTextContent('Mentoria Individual');
	});

	it('should handle multiple events correctly', () => {
		const event1 = createMockEvent({
			id: '1',
			start: new Date('2025-10-27T09:00:00'),
		});
		const event2 = createMockEvent({
			id: '2',
			start: new Date('2025-10-27T14:00:00'),
		});
		const events = [event1, event2];

		const props = {
			type: ScheduleCalendarView.Day,
			weekStart: DateTime.fromObject({ year: 2025, month: 10, day: 20 }),
			weekEnd: DateTime.fromObject({ year: 2025, month: 10, day: 26 }),
			workHourStart: 8,
			workHourEnd: 18,
			events,
			selectedDay: 1,
		};

		renderWithProviders(<ScheduleSlots {...props} />);

		// Both events should be rendered
		expect(screen.getByTestId('schedule-slot-1')).toBeInTheDocument();
		expect(screen.getByTestId('schedule-slot-2')).toBeInTheDocument();

		// Check spanRow calculations
		const slot1 = screen.getByTestId('schedule-slot-1');
		const slot2 = screen.getByTestId('schedule-slot-2');

		// Event 1: 9 AM -> spanRow = ((9 - 8) * 2) + 1 = 3
		expect(slot1).toHaveAttribute('data-span-row', '3');
		// Event 2: 2 PM -> spanRow = ((14 - 8) * 2) + 1 = 13
		expect(slot2).toHaveAttribute('data-span-row', '13');
	});

	it('should handle events at work hour boundaries', () => {
		const event = createMockEvent({
			start: new Date('2025-10-27T08:00:00'), // Exactly at work start
		});
		const events = [event];

		const props = {
			type: ScheduleCalendarView.Day,
			weekStart: DateTime.fromObject({ year: 2025, month: 10, day: 20 }),
			weekEnd: DateTime.fromObject({ year: 2025, month: 10, day: 26 }),
			workHourStart: 8,
			workHourEnd: 18,
			events,
			selectedDay: 1,
		};

		renderWithProviders(<ScheduleSlots {...props} />);

		const slotElement = screen.getByTestId('schedule-slot-1');
		// spanRow = ((8 - 8) * 2) + 1 = 1
		expect(slotElement).toHaveAttribute('data-span-row', '1');
	});
});
