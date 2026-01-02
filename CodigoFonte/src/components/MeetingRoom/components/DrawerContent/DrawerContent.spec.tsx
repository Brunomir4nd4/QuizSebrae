import React from 'react';
import { render, screen } from '@testing-library/react';
import { DrawerContent } from '../index';
import { ClassData } from '@/types/IClass';
import { ThemeSettings } from '@/types/IThemeSettings';
import { Student } from '@/types/IStudent';
import { mockClassData } from '@/mocks/  mockClassData';

// Mock dos componentes externos
jest.mock('@/components/ActivitiesSlider', () => ({
	ActivitiesSlider: ({
		meetingRoomClassId,
		classData,
		whatsAppMessage,
		students,
		type,
	}: {
		meetingRoomClassId: string;
		classData: ClassData;
		whatsAppMessage: string;
		students: Student[];
		type: string;
	}) => (
		<div data-testid='activities-slider'>
			<span data-testid='meeting-room-class-id'>{meetingRoomClassId}</span>
			<span data-testid='class-title'>{classData.title}</span>
			<span data-testid='whatsapp-message'>{whatsAppMessage}</span>
			<span data-testid='students-count'>{students.length}</span>
			<span data-testid='component-type'>{type}</span>
		</div>
	),
}));

jest.mock('@/components/AppointmentScheduling', () => ({
	AppointmentScheduling: ({
		classId,
		openModal,
		drawerStep,
		consultancyDate,
		startTime,
		questions,
	}: {
		classId: string;
		openModal: boolean;
		drawerStep: number;
		consultancyDate: string | null;
		startTime: string;
		questions: Record<string, unknown>;
	}) => (
		<div data-testid='appointment-scheduling'>
			<span data-testid='appointment-class-id'>{classId}</span>
			<span data-testid='appointment-open-modal'>{openModal.toString()}</span>
			<span data-testid='appointment-drawer-step'>{drawerStep}</span>
			<span data-testid='appointment-consultancy-date'>{consultancyDate}</span>
			<span data-testid='appointment-start-time'>{startTime}</span>
			<span data-testid='appointment-questions'>
				{JSON.stringify(questions)}
			</span>
		</div>
	),
}));

jest.mock('@/components/Loader', () => ({
	Loader: () => <div data-testid='loader'>Loading...</div>,
}));

// Mock do hook useStudents
jest.mock('@/components/Participacao/hooks/useStudents', () => ({
	__esModule: true,
	default: jest.fn(),
}));

import useStudents from '@/components/Participacao/hooks/useStudents';

const mockUseStudents = useStudents as jest.MockedFunction<typeof useStudents>;

describe('DrawerContent Component', () => {
	const mockClassDataInstance: ClassData = mockClassData({
		id: 1,
		title: 'Test Class',
		slug: 'test-class',
		enable_strategic_activities: true,
		strategic_activities_number: 5,
		enroll_id: 'enroll-123',
		links_and_materials: {
			facilitator: [],
			subscriber: [],
		},
		ciclos: {
			id: 1,
			name: 'Test Cycle',
			slug: 'test-cycle',
			description: 'Test Description',
			activities: 10,
			activity_titles: ['Activity 1', 'Activity 2'],
		},
		start_date: '2024-01-01',
		end_date: '2024-12-31',
		courses: {
			id: 1,
			name: 'Test Course',
			slug: 'test-course',
			description: 'Test Course Description',
			links_and_materials: [],
			evaluate_course: 'evaluate',
			form_subjects: ['subject1', 'subject2'],
			maintenance_mode_title: 'Maintenance',
			maintenance_mode_message: 'Under maintenance',
			maintenance_mode_description: 'Description',
			maintenance_mode_active: false,
			group_limit: 10,
			group_link: 'group-link',
		},
		logo: {
			ID: 1,
			id: 1,
			title: 'Test Logo',
			filename: 'test-logo.png',
			filesize: 1024,
			url: 'https://example.com/logo.png',
			link: 'https://example.com/logo.png',
			alt: 'Test Logo Alt',
			author: 'Test Author',
			description: 'Test Description',
			caption: 'Test Caption',
			name: 'test-logo',
			status: 'publish',
			uploaded_to: 1,
			date: '2023-01-01T00:00:00.000Z',
			modified: '2023-01-01T00:00:00.000Z',
			menu_order: 0,
			mime_type: 'image/png',
			type: 'image',
			subtype: 'png',
			icon: 'https://example.com/icon.png',
			width: 100,
			height: 100,
			sizes: {
				thumbnail: 'https://example.com/thumbnail.png',
				'thumbnail-width': 50,
				'thumbnail-height': 50,
				medium: 'https://example.com/medium.png',
				'medium-width': 75,
				'medium-height': 75,
				medium_large: 'https://example.com/medium_large.png',
				'medium_large-width': 85,
				'medium_large-height': 85,
				large: 'https://example.com/large.png',
				'large-width': 90,
				'large-height': 90,
				'1536x1536': 'https://example.com/1536x1536.png',
				'1536x1536-width': 95,
				'1536x1536-height': 95,
				'2048x2048': 'https://example.com/2048x2048.png',
				'2048x2048-width': 100,
				'2048x2048-height': 100,
			},
		},
		logo_b: {
			ID: 2,
			id: 2,
			title: 'Test Logo B',
			filename: 'test-logo-b.png',
			filesize: 2048,
			url: 'https://example.com/logo-b.png',
			link: 'https://example.com/logo-b.png',
			alt: 'Test Logo B Alt',
			author: 'Test Author B',
			description: 'Test Description B',
			caption: 'Test Caption B',
			name: 'test-logo-b',
			status: 'publish',
			uploaded_to: 2,
			date: '2023-01-02T00:00:00.000Z',
			modified: '2023-01-02T00:00:00.000Z',
			menu_order: 0,
			mime_type: 'image/png',
			type: 'image',
			subtype: 'png',
			icon: 'https://example.com/icon-b.png',
			width: 200,
			height: 200,
			sizes: {
				thumbnail: 'https://example.com/thumbnail-b.png',
				'thumbnail-width': 50,
				'thumbnail-height': 50,
				medium: 'https://example.com/medium-b.png',
				'medium-width': 75,
				'medium-height': 75,
				medium_large: 'https://example.com/medium_large-b.png',
				'medium_large-width': 85,
				'medium_large-height': 85,
				large: 'https://example.com/large-b.png',
				'large-width': 90,
				'large-height': 90,
				'1536x1536': 'https://example.com/1536x1536-b.png',
				'1536x1536-width': 95,
				'1536x1536-height': 95,
				'2048x2048': 'https://example.com/2048x2048-b.png',
				'2048x2048-width': 100,
				'2048x2048-height': 100,
			},
		},
		individual_meetings: [['meeting1'], ['meeting2']],
		collective_meetings: ['collective1'],
		label_configuration: {
			label_configuration_regular: 'regular',
			label_configuration_strong: 'strong',
			label_configuration_suffix: 'suffix',
		},
		enable_room: true,
		enable_calendar: true,
		turno: {
			value: 'diurno',
			label: 'Diurno',
		},
		facilitator: 1,
		facilitator_name: 'Test Facilitator',
		facilitator_email: 'facilitator@test.com',
		group_link: 'group-link',
		enable_certificacao_progressiva: true,
		contact: {
			phone: '123456789',
			message: 'Test Message',
		},
	});

	const mockThemeSettings: ThemeSettings = {
		facilitator: {
			enable_room: true,
			enable_calendar: true,
		},
		participant: {
			enable_room: true,
			enable_calendar: true,
		},
		supervisor: {
			enable_room: true,
			enable_calendar: true,
		},
		maintenance_mode: false,
		site_url: 'https://test.com',
		whatsapp_message_to_facilitator: 'Test WhatsApp Message',
		whatsapp_message_to_participant: 'Participant Message',
		whatsapp_support_link: 'support-link',
		maintenance_mode_general_hub_active: false,
		maintenance_mode_general_hub_title: 'Hub Title',
		maintenance_mode_general_hub_message: 'Hub Message',
		maintenance_mode_general_hub_description: 'Hub Description',
	};

	const mockStudents: Student[] = [
		{
			id: 1,
			name: 'Student 1',
			cpf: '12345678901',
			activities: { activity1: true },
			phone: '123456789',
			is_enroll_canceled: false,
			is_cancel_requested: false,
			enrollment_id: 1,
		},
		{
			id: 2,
			name: 'Student 2',
			cpf: '98765432109',
			activities: { activity1: false },
			phone: '987654321',
			is_enroll_canceled: false,
			is_cancel_requested: false,
			enrollment_id: 2,
		},
	];

	const defaultProps = {
		classId: 'class-1',
		token: 'test-token',
		isAdmin: true,
		themeSettings: mockThemeSettings,
		classesData: {
			'class-1': mockClassDataInstance,
		},
		openModal: false,
		setOpenModal: jest.fn(),
		drawerStep: 0 as 0 | 1,
		setDrawerStep: jest.fn(),
		startTime: '',
		setStartTime: jest.fn(),
		consultancyDate: null,
		setConsultancyDate: jest.fn(),
		setQuestions: jest.fn(),
		questions: {
			social_network: '',
			main_topic: '',
			specific_questions: '',
		},
		handleDrawerClose: jest.fn(),
		type: 'facilitator',
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Admin User Rendering', () => {
		it('should render Loader when data is loading', () => {
			mockUseStudents.mockReturnValue({
				students: null,
				loading: true,
				refetch: jest.fn(),
			});

			render(<DrawerContent {...defaultProps} />);

			expect(screen.getByTestId('loader')).toBeInTheDocument();
		});

		it('should render Loader when classesData is null', () => {
			mockUseStudents.mockReturnValue({
				students: mockStudents,
				loading: false,
				refetch: jest.fn(),
			});

			render(<DrawerContent {...defaultProps} classesData={null} />);

			expect(screen.getByTestId('loader')).toBeInTheDocument();
		});

		it('should render Loader when students is null', () => {
			mockUseStudents.mockReturnValue({
				students: null,
				loading: false,
				refetch: jest.fn(),
			});

			render(<DrawerContent {...defaultProps} />);

			expect(screen.getByTestId('loader')).toBeInTheDocument();
		});

		it('should render class title and ActivitiesSlider when admin has data', () => {
			mockUseStudents.mockReturnValue({
				students: mockStudents,
				loading: false,
				refetch: jest.fn(),
			});

			render(<DrawerContent {...defaultProps} />);

			expect(screen.getByTestId('activities-slider')).toBeInTheDocument();
		});

		it('should pass correct props to ActivitiesSlider', () => {
			mockUseStudents.mockReturnValue({
				students: mockStudents,
				loading: false,
				refetch: jest.fn(),
			});

			render(<DrawerContent {...defaultProps} />);

			expect(screen.getByTestId('meeting-room-class-id')).toHaveTextContent(
				'class-1',
			);
			expect(screen.getByTestId('class-title')).toHaveTextContent('Test Class');
			expect(screen.getByTestId('whatsapp-message')).toHaveTextContent(
				'Test WhatsApp Message',
			);
			expect(screen.getByTestId('students-count')).toHaveTextContent('2');
			expect(screen.getByTestId('component-type')).toHaveTextContent(
				'facilitator',
			);
		});

		it('should handle null themeSettings gracefully', () => {
			mockUseStudents.mockReturnValue({
				students: mockStudents,
				loading: false,
				refetch: jest.fn(),
			});

			render(<DrawerContent {...defaultProps} themeSettings={null} />);

			expect(screen.getByTestId('whatsapp-message')).toHaveTextContent('');
		});
	});

	describe('Non-Admin User Rendering', () => {
		it('should render AppointmentScheduling for non-admin users', () => {
			render(<DrawerContent {...defaultProps} isAdmin={false} />);

			expect(screen.getByTestId('appointment-scheduling')).toBeInTheDocument();
		});

		it('should pass correct props to AppointmentScheduling', () => {
			const customQuestions = {
				social_network: 'facebook',
				main_topic: 'Test Topic',
				specific_questions: 'Test Questions',
			};

			render(
				<DrawerContent
					{...defaultProps}
					isAdmin={false}
					openModal={true}
					drawerStep={1}
					consultancyDate='2024-01-01'
					startTime='10:00'
					questions={customQuestions}
				/>,
			);

			expect(screen.getByTestId('appointment-class-id')).toHaveTextContent(
				'class-1',
			);
			expect(screen.getByTestId('appointment-open-modal')).toHaveTextContent(
				'true',
			);
			expect(screen.getByTestId('appointment-drawer-step')).toHaveTextContent(
				'1',
			);
			expect(
				screen.getByTestId('appointment-consultancy-date'),
			).toHaveTextContent('2024-01-01');
			expect(screen.getByTestId('appointment-start-time')).toHaveTextContent(
				'10:00',
			);
			expect(screen.getByTestId('appointment-questions')).toHaveTextContent(
				JSON.stringify(customQuestions),
			);
		});

		it('should render AppointmentScheduling regardless of loading state for non-admin', () => {
			mockUseStudents.mockReturnValue({
				students: null,
				loading: true,
				refetch: jest.fn(),
			});

			render(<DrawerContent {...defaultProps} isAdmin={false} />);

			expect(screen.getByTestId('appointment-scheduling')).toBeInTheDocument();
			expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
		});
	});

	describe('Hook Integration', () => {
		it('should call useStudents with correct parameters for admin', () => {
			mockUseStudents.mockReturnValue({
				students: mockStudents,
				loading: false,
				refetch: jest.fn(),
			});

			render(<DrawerContent {...defaultProps} />);

			expect(mockUseStudents).toHaveBeenCalledWith(
				'class-1',
				'test-token',
				true,
			);
		});

		it('should call useStudents with correct parameters for non-admin', () => {
			render(<DrawerContent {...defaultProps} isAdmin={false} />);

			expect(mockUseStudents).toHaveBeenCalledWith(
				'class-1',
				'test-token',
				false,
			);
		});
	});

	describe('WhatsApp Message Extraction', () => {
		it('should extract whatsapp_message_to_facilitator from themeSettings', () => {
			mockUseStudents.mockReturnValue({
				students: mockStudents,
				loading: false,
				refetch: jest.fn(),
			});

			render(<DrawerContent {...defaultProps} />);

			expect(screen.getByTestId('whatsapp-message')).toHaveTextContent(
				'Test WhatsApp Message',
			);
		});

		it('should handle undefined whatsapp_message_to_facilitator', () => {
			const themeSettingsWithoutMessage = {
				...mockThemeSettings,
				whatsapp_message_to_facilitator: '',
			};

			mockUseStudents.mockReturnValue({
				students: mockStudents,
				loading: false,
				refetch: jest.fn(),
			});

			render(
				<DrawerContent
					{...defaultProps}
					themeSettings={themeSettingsWithoutMessage}
				/>,
			);

			expect(screen.getByTestId('whatsapp-message')).toHaveTextContent('');
		});
	});
});
