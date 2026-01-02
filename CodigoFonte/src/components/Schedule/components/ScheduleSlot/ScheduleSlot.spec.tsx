import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { ScheduleSlot } from './ScheduleSlot.component';
import { ScheduleEvent, ScheduleEventType } from '../../models/ScheduleEvent';

// Mock next-auth
const mockUseSession = jest.fn();
jest.mock('next-auth/react', () => ({
	useSession: () => mockUseSession(),
	SessionProvider: ({ children }: { children: React.ReactNode }) => (
		<>{children}</>
	),
}));

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
	useRouter: () => ({
		push: mockPush,
	}),
}));

// Mock BFF service
const mockUnblockScheduleTimeBff = jest.fn();
jest.mock('@/app/services/bff/ScheduleService', () => ({
	unblockScheduleTimeBff: mockUnblockScheduleTimeBff,
}));

// Mock modals
jest.mock('@/components/DetailModal', () => ({
	DetailModal: ({ open, title }: { open: boolean; title: string }) =>
		open ? <div data-testid='detail-modal'>{title}</div> : null,
}));

jest.mock('@/components/GroupDetailModal', () => ({
	GroupDetailModal: ({ open }: { open: boolean }) =>
		open ? <div data-testid='group-detail-modal'>Group Modal</div> : null,
}));

jest.mock('@/components/ModalBlockTime', () => ({
	ModalBlockTime: ({ open }: { open: boolean }) =>
		open ? <div data-testid='block-time-modal'>Block Time Modal</div> : null,
}));

// Mock icons
jest.mock('@/resources/icons', () => ({
	IconEventAppointment: () => <svg data-testid='icon-appointment' />,
	IconEventBlock: () => <svg data-testid='icon-block' />,
	IconEventMeeting: () => <svg data-testid='icon-meeting' />,
}));

const theme = createTheme();

const mockSession = {
	user: {
		user_first_name: 'João',
		user_last_name: 'Silva',
		user_display_name: 'João Silva',
		user_email: 'joao@example.com',
		user_nicename: 'joao-silva',
		role: ['user'],
		token: 'mock-token',
		cpf: '12345678901',
		id: 1,
	},
	expires: '2025-12-31T23:59:59.999Z',
};

const createMockEvent = (
	overrides: Partial<ScheduleEvent> = {},
): ScheduleEvent => ({
	id: '1',
	type: ScheduleEventType.Appointment,
	start: new Date('2025-08-13T10:00:00'),
	end: new Date('2025-08-13T11:00:00'),
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

describe('ScheduleSlot Component', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockUseSession.mockReturnValue({ data: mockSession });
	});

	it('should render nothing when session is not available', () => {
		mockUseSession.mockReturnValue({ data: null });

		const event = createMockEvent();
		const { container } = renderWithProviders(
			<ScheduleSlot event={event} spanCol={1} spanRow={1} bookingId='1' />,
		);

		// When session is null, component returns <></> which renders as empty fragment
		expect(container.children).toHaveLength(0);
	});

	it('should render appointment slot with correct time format', () => {
		const event = createMockEvent({
			start: new Date('2025-08-13T09:30:00'),
			end: new Date('2025-08-13T10:45:00'),
		});

		renderWithProviders(
			<ScheduleSlot event={event} spanCol={1} spanRow={1} bookingId='1' />,
		);

		expect(screen.getByText('09:30 - 10:45')).toBeInTheDocument();
		expect(screen.getByText('João Silva')).toBeInTheDocument();
	});

	it('should render appointment icon for appointment type', () => {
		const event = createMockEvent({ type: ScheduleEventType.Appointment });

		renderWithProviders(
			<ScheduleSlot event={event} spanCol={1} spanRow={1} bookingId='1' />,
		);

		expect(screen.getByTestId('icon-appointment')).toBeInTheDocument();
	});

	it('should render appointment icon for group type', () => {
		const event = createMockEvent({ type: ScheduleEventType.Group });

		renderWithProviders(
			<ScheduleSlot event={event} spanCol={1} spanRow={1} bookingId='1' />,
		);

		expect(screen.getByTestId('icon-appointment')).toBeInTheDocument();
	});

	it('should render meeting icon for meeting type', () => {
		const event = createMockEvent({ type: ScheduleEventType.Meeting });

		renderWithProviders(
			<ScheduleSlot event={event} spanCol={1} spanRow={1} bookingId='1' />,
		);

		expect(screen.getByTestId('icon-meeting')).toBeInTheDocument();
	});

	it('should render block icon and "Bloqueado" text for block type', () => {
		const event = createMockEvent({ type: ScheduleEventType.Block });

		renderWithProviders(
			<ScheduleSlot event={event} spanCol={1} spanRow={1} bookingId='1' />,
		);

		expect(screen.getByTestId('icon-block')).toBeInTheDocument();
		expect(screen.getByText('Bloqueado')).toBeInTheDocument();
	});

	it('should apply correct CSS class based on event type', () => {
		const event = createMockEvent({ type: ScheduleEventType.Appointment });

		const { container } = renderWithProviders(
			<ScheduleSlot event={event} spanCol={1} spanRow={1} bookingId='1' />,
		);

		const slotHolder = container.querySelector('.appointment');
		expect(slotHolder).toBeInTheDocument();
	});

	it('should apply correct grid positioning styles', () => {
		const event = createMockEvent();

		const { container } = renderWithProviders(
			<ScheduleSlot event={event} spanCol={2} spanRow={3} bookingId='1' />,
		);

		const slotHolder = container.querySelector('button');
		expect(slotHolder).toHaveStyle({
			gridColumnStart: '2',
			gridRowStart: '3',
			gridRowEnd: 'span 2', // 1 hour * 2 = 2
		});
	});

	it('should open DetailModal when clicking appointment with client data', () => {
		const event = createMockEvent({ type: ScheduleEventType.Appointment });

		renderWithProviders(
			<ScheduleSlot event={event} spanCol={1} spanRow={1} bookingId='1' />,
		);

		const slotButton = screen.getByRole('button');
		fireEvent.click(slotButton);

		expect(screen.getByTestId('detail-modal')).toBeInTheDocument();
		expect(screen.getByText('Mentoria Individual')).toBeInTheDocument();
	});

	it('should open GroupDetailModal when clicking group event', () => {
		const event = createMockEvent({ type: ScheduleEventType.Group });

		renderWithProviders(
			<ScheduleSlot event={event} spanCol={1} spanRow={1} bookingId='1' />,
		);

		const slotButton = screen.getByRole('button');
		fireEvent.click(slotButton);

		expect(screen.getByTestId('group-detail-modal')).toBeInTheDocument();
	});

	it('should navigate to meeting room when clicking meeting event', () => {
		const event = createMockEvent({ type: ScheduleEventType.Meeting });

		renderWithProviders(
			<ScheduleSlot event={event} spanCol={1} spanRow={1} bookingId='1' />,
		);

		const slotButton = screen.getByRole('button');
		fireEvent.click(slotButton);

		expect(mockPush).toHaveBeenCalledWith('/sala-de-reuniao');
	});

	it('should open block time modal when clicking block event', () => {
		const event = createMockEvent({ type: ScheduleEventType.Block });

		renderWithProviders(
			<ScheduleSlot event={event} spanCol={1} spanRow={1} bookingId='1' />,
		);

		const slotButton = screen.getByRole('button');
		fireEvent.click(slotButton);

		expect(screen.getByTestId('block-time-modal')).toBeInTheDocument();
	});

	it('should not open DetailModal for appointment without client data', () => {
		const event = createMockEvent({
			type: ScheduleEventType.Appointment,
			client: null,
		});

		renderWithProviders(
			<ScheduleSlot event={event} spanCol={1} spanRow={1} bookingId='1' />,
		);

		const slotButton = screen.getByRole('button');
		fireEvent.click(slotButton);

		expect(screen.queryByTestId('detail-modal')).not.toBeInTheDocument();
	});

	it('should calculate correct duration span for different time ranges', () => {
		const event = createMockEvent({
			start: new Date('2025-08-13T10:00:00'),
			end: new Date('2025-08-13T12:30:00'), // 2.5 hours
		});

		const { container } = renderWithProviders(
			<ScheduleSlot event={event} spanCol={1} spanRow={1} bookingId='1' />,
		);

		const slotHolder = container.querySelector('button');
		expect(slotHolder).toHaveStyle({
			gridRowEnd: 'span 5', // 2.5 hours * 2 = 5
		});
	});

	it('should set correct title attribute with ISO date', () => {
		const event = createMockEvent();

		const { container } = renderWithProviders(
			<ScheduleSlot event={event} spanCol={1} spanRow={1} bookingId='1' />,
		);

		const slotHolder = container.querySelector('button');
		expect(slotHolder).toHaveAttribute('title', '2025-08-13T13:00:00.000Z');
	});

	it('should handle events without additional fields', () => {
		const event = createMockEvent({
			additional_fields: null,
		});

		renderWithProviders(
			<ScheduleSlot event={event} spanCol={1} spanRow={1} bookingId='1' />,
		);

		expect(screen.getByText('João Silva')).toBeInTheDocument();
	});
});
