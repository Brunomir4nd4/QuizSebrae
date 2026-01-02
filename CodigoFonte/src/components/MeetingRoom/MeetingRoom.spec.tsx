import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/app/providers/UserProvider';
import { MeetingRoom } from './index';
import { setAutoPresenceByClassId } from '@/app/services/bff/ClassService';
import { userIsAdmin } from '@/utils/userIsAdmin';

// Mock das dependências externas
jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));

jest.mock('@/app/providers/UserProvider', () => ({
	useUserContext: jest.fn(),
}));

jest.mock('@/app/services/bff/ClassService', () => ({
	setAutoPresenceByClassId: jest.fn(),
}));

jest.mock('@/utils/userIsAdmin', () => ({
	userIsAdmin: jest.fn(),
}));

jest.mock('@/hooks/useRunOnce', () => ({
	__esModule: true,
	default: ({ fn }: { fn: () => void }) => {
		fn();
	},
}));

jest.mock('@jitsi/react-sdk', () => ({
	JaaSMeeting: ({ onReadyToClose }: { onReadyToClose: () => void }) => (
		<div data-testid='jaas-meeting'>
			<button onClick={onReadyToClose} data-testid='close-meeting'>
				Close Meeting
			</button>
		</div>
	),
}));

jest.mock('../NotifyModal', () => ({
	NotifyModal: ({
		title,
		message,
		callback,
	}: {
		title: string;
		message: string;
		callback: () => void;
	}) => (
		<div data-testid='notify-modal'>
			<h2>{title}</h2>
			<p>{message}</p>
			<button onClick={callback} data-testid='modal-callback'>
				Close
			</button>
		</div>
	),
}));

jest.mock('./components', () => ({
	DrawerContent: () => <div data-testid='drawer-content'>Drawer Content</div>,
}));

jest.mock('../ActivityManagement/components/ActivitiesSlider', () => ({
	ActivitiesSlider: () => <div data-testid='activities-slider'>Activities</div>,
}));

describe('MeetingRoom Component', () => {
	const mockRouter = {
		push: jest.fn(),
		back: jest.fn(),
		forward: jest.fn(),
		refresh: jest.fn(),
		replace: jest.fn(),
		prefetch: jest.fn(),
	};

	const mockCredentials = {
		updRootToken: 'mock-root-token',
		updRoomName: 'appId/roomName',
		updRoomTitle: 'Test Room',
	};

	const mockClassesData = {
		'class-1': {
			id: 'class-1',
			name: 'Test Class',
			enable_strategic_activities: true,
		},
	};

	const mockThemeSettings = {
		primaryColor: '#000000',
	};

	const defaultProps = {
		credentials: mockCredentials,
		role: 'student',
		token: 'mock-token',
		classId: 'class-1',
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(useRouter as jest.Mock).mockReturnValue(mockRouter);
		(useUserContext as jest.Mock).mockReturnValue({
			classesData: mockClassesData,
			themeSettings: mockThemeSettings,
		});
		(userIsAdmin as jest.Mock).mockReturnValue(false);
		(setAutoPresenceByClassId as jest.Mock).mockResolvedValue({ status: 200 });
	});

	describe('Credentials Validation', () => {
		it('should render NotifyModal when updRootToken is missing', () => {
			const invalidCredentials = {
				updRoomName: 'appId/roomName',
				updRoomTitle: 'Test Room',
			};

			render(
				<MeetingRoom {...defaultProps} credentials={invalidCredentials} />,
			);

			expect(screen.getByTestId('notify-modal')).toBeInTheDocument();
			expect(screen.getByText('Atenção')).toBeInTheDocument();
			expect(
				screen.getByText(/Não foi possível obter suas credenciais/),
			).toBeInTheDocument();
		});

		it('should render NotifyModal when updRoomName is missing', () => {
			const invalidCredentials = {
				updRootToken: 'mock-token',
				updRoomTitle: 'Test Room',
			};

			render(
				<MeetingRoom {...defaultProps} credentials={invalidCredentials} />,
			);

			expect(screen.getByTestId('notify-modal')).toBeInTheDocument();
		});

		it('should call router.back when NotifyModal callback is clicked', () => {
			const invalidCredentials = {
				updRoomName: 'appId/roomName',
			};

			render(
				<MeetingRoom {...defaultProps} credentials={invalidCredentials} />,
			);

			const callbackButton = screen.getByTestId('modal-callback');
			fireEvent.click(callbackButton);

			expect(mockRouter.back).toHaveBeenCalled();
		});
	});

	describe('JaaSMeeting Integration', () => {
		it('should render JaaSMeeting with valid credentials', () => {
			render(<MeetingRoom {...defaultProps} />);

			expect(screen.getByTestId('jaas-meeting')).toBeInTheDocument();
		});

		it('should navigate to /home when meeting is closed', () => {
			render(<MeetingRoom {...defaultProps} />);

			const closeButton = screen.getByTestId('close-meeting');
			fireEvent.click(closeButton);

			expect(mockRouter.push).toHaveBeenCalledWith('/home');
		});

		it('should parse appId and roomName correctly from credentials', () => {
			const credentials = {
				updRootToken: 'token',
				updRoomName: 'myAppId/myRoomName',
				updRoomTitle: 'My Room',
			};

			render(<MeetingRoom {...defaultProps} credentials={credentials} />);

			expect(screen.getByTestId('jaas-meeting')).toBeInTheDocument();
		});
	});

	describe('Attendance Drawer', () => {
		it('should open attendance drawer when open button is clicked', () => {
			render(<MeetingRoom {...defaultProps} role='facilitator' />);

			const openButton = screen.getByText('Participantes');
			fireEvent.click(openButton);

			expect(screen.getByTestId('drawer-content')).toBeInTheDocument();
		});

		it('should show "Participantes" button for facilitator role', () => {
			render(<MeetingRoom {...defaultProps} role='facilitator' />);

			expect(screen.getByText('Participantes')).toBeInTheDocument();
		});

		it('should show "Agendar" button for student role', () => {
			render(<MeetingRoom {...defaultProps} role='student' />);

			expect(screen.getByText('Agendar')).toBeInTheDocument();
		});

		it('should show close button when drawer is open', () => {
			render(<MeetingRoom {...defaultProps} />);

			const openButton = screen.getByText('Agendar');
			fireEvent.click(openButton);

			expect(screen.getByText('Fechar')).toBeInTheDocument();
		});

		it('should close drawer when close button is clicked', () => {
			render(<MeetingRoom {...defaultProps} />);

			// Open drawer
			const openButton = screen.getByText('Agendar');
			fireEvent.click(openButton);

			// Close drawer
			const closeButton = screen.getByText('Fechar');
			fireEvent.click(closeButton);

			// Drawer should be closed (close button should not be visible)
			expect(screen.queryByText('Fechar')).not.toBeInTheDocument();
		});
	});

	describe('Auto Presence Feature', () => {
		it('should call autoPresence for non-admin student in ClassRoom', () => {
			(userIsAdmin as jest.Mock).mockReturnValue(false);

			render(
				<MeetingRoom {...defaultProps} role='student' roomType='ClassRoom' />,
			);

			// Auto presence is called via useRunOnce
			expect(userIsAdmin).toHaveBeenCalledWith(['student']);
		});

		it('should not call autoPresence for admin users', () => {
			(userIsAdmin as jest.Mock).mockReturnValue(true);

			render(
				<MeetingRoom
					{...defaultProps}
					role='facilitator'
					roomType='ClassRoom'
				/>,
			);

			expect(userIsAdmin).toHaveBeenCalledWith(['facilitator']);
		});

		it('should not call autoPresence when roomType is not ClassRoom', () => {
			(userIsAdmin as jest.Mock).mockReturnValue(false);

			render(<MeetingRoom {...defaultProps} role='student' />);

			// Auto presence should only be called for ClassRoom type
			expect(userIsAdmin).toHaveBeenCalledWith(['student']);
		});
	});

	describe('Role-based Rendering', () => {
		it('should render correctly for facilitator role', () => {
			render(<MeetingRoom {...defaultProps} role='facilitator' />);

			expect(screen.getByText('Participantes')).toBeInTheDocument();
			expect(screen.queryByText('Agendar')).not.toBeInTheDocument();
		});

		it('should render correctly for student role', () => {
			render(<MeetingRoom {...defaultProps} role='student' />);

			expect(screen.getByText('Agendar')).toBeInTheDocument();
			expect(screen.queryByText('Participantes')).not.toBeInTheDocument();
		});

		it('should render correctly for teacher role', () => {
			render(<MeetingRoom {...defaultProps} role='teacher' />);

			expect(screen.getByText('Agendar')).toBeInTheDocument();
		});
	});

	describe('Button Visibility Logic', () => {
		it('should show main open button when both drawers are closed', () => {
			render(<MeetingRoom {...defaultProps} />);

			expect(screen.getByText('Agendar')).toBeInTheDocument();
		});

		it('should hide main open button when attendance drawer is open', () => {
			render(<MeetingRoom {...defaultProps} />);

			const openButton = screen.getByText('Agendar');
			fireEvent.click(openButton);

			// Main button should be hidden when drawer is open
			const agendarButtons = screen.queryAllByText('Agendar');
			// Should not find the main "Agendar" button (only close button visible)
			expect(agendarButtons).toHaveLength(0);
		});

		it('should hide activity button when attendance drawer is open', () => {
			render(<MeetingRoom {...defaultProps} />);

			// Open attendance drawer
			const openButton = screen.getByText('Agendar');
			fireEvent.click(openButton);

			expect(screen.queryByText('Atividades')).not.toBeInTheDocument();
		});
	});

	describe('Props Handling', () => {
		it('should accept and use classId prop', () => {
			render(<MeetingRoom {...defaultProps} classId='custom-class-id' />);

			expect(screen.getByTestId('jaas-meeting')).toBeInTheDocument();
		});

		it('should accept and use token prop', () => {
			render(<MeetingRoom {...defaultProps} token='custom-token' />);

			expect(screen.getByTestId('jaas-meeting')).toBeInTheDocument();
		});

		it('should accept and use roomType prop', () => {
			render(<MeetingRoom {...defaultProps} roomType='ClassRoom' />);

			expect(screen.getByTestId('jaas-meeting')).toBeInTheDocument();
		});

		it('should handle missing roomType prop', () => {
			render(<MeetingRoom {...defaultProps} />);

			expect(screen.getByTestId('jaas-meeting')).toBeInTheDocument();
		});
	});

	describe('UserContext Integration', () => {
		it('should use classesData from context', () => {
			const customClassesData = {
				'test-class': {
					id: 'test-class',
					name: 'Custom Class',
					enable_strategic_activities: true,
				},
			};

			(useUserContext as jest.Mock).mockReturnValue({
				classesData: customClassesData,
				themeSettings: mockThemeSettings,
			});

			render(<MeetingRoom {...defaultProps} classId='test-class' />);

			expect(screen.getByTestId('jaas-meeting')).toBeInTheDocument();
		});

		it('should use themeSettings from context', () => {
			const customTheme = {
				primaryColor: '#FF0000',
			};

			(useUserContext as jest.Mock).mockReturnValue({
				classesData: mockClassesData,
				themeSettings: customTheme,
			});

			render(<MeetingRoom {...defaultProps} />);

			expect(screen.getByTestId('jaas-meeting')).toBeInTheDocument();
		});

		it('should handle null classesData gracefully', () => {
			(useUserContext as jest.Mock).mockReturnValue({
				classesData: null,
				themeSettings: mockThemeSettings,
			});

			render(<MeetingRoom {...defaultProps} />);

			expect(screen.getByTestId('jaas-meeting')).toBeInTheDocument();
		});
	});

	describe('Credentials Parsing', () => {
		it('should parse room name with single slash correctly', () => {
			const credentials = {
				updRootToken: 'token',
				updRoomName: 'app/room',
				updRoomTitle: 'Room',
			};

			render(<MeetingRoom {...defaultProps} credentials={credentials} />);

			expect(screen.getByTestId('jaas-meeting')).toBeInTheDocument();
		});

		it('should use updRoomTitle as meeting subject', () => {
			const credentials = {
				updRootToken: 'token',
				updRoomName: 'app/room',
				updRoomTitle: 'Custom Meeting Title',
			};

			render(<MeetingRoom {...defaultProps} credentials={credentials} />);

			expect(screen.getByTestId('jaas-meeting')).toBeInTheDocument();
		});

		it('should handle missing updRoomTitle', () => {
			const credentials = {
				updRootToken: 'token',
				updRoomName: 'app/room',
			};

			render(<MeetingRoom {...defaultProps} credentials={credentials} />);

			expect(screen.getByTestId('jaas-meeting')).toBeInTheDocument();
		});
	});

	describe('Multiple Drawers State Management', () => {
		it('should allow only one drawer to be open at a time', () => {
			render(<MeetingRoom {...defaultProps} />);

			// Open attendance drawer
			const agendarButton = screen.getByText('Agendar');
			fireEvent.click(agendarButton);

			expect(screen.getByTestId('drawer-content')).toBeInTheDocument();

			// Activities button should be hidden when attendance drawer is open
			expect(screen.queryByText('Atividades')).not.toBeInTheDocument();
		});
	});
});
