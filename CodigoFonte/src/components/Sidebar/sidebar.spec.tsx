import { act, fireEvent, render, screen } from '@testing-library/react';
import { Sidebar } from '@/components/Sidebar';
import { Session } from 'next-auth';
import { WPImage } from '@/types/IWordpress';
import { useUserContext } from '@/app/providers/UserProvider';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { Sidebar as SidebarResponse } from '@/types/ISidebar';
import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn();

// Mock next/navigation
const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
	useRouter: jest.fn(() => ({
		push: mockPush,
		replace: mockReplace,
		pathname: '/',
		query: {},
		asPath: '/',
	})),
	usePathname: jest.fn(() => '/home'),
}));

// Mock UserProvider
jest.mock('@/app/providers/UserProvider', () => ({
	useUserContext: jest.fn(),
}));

// Mock js-cookie
jest.mock('js-cookie', () => ({
	remove: jest.fn(),
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
	signOut: jest.fn(() => Promise.resolve()),
}));

// Mock @datadog/browser-rum
jest.mock('@datadog/browser-rum', () => ({
	datadogRum: {
		clearUser: jest.fn(),
	},
}));

// Mock next/image
jest.mock('next/image', () => ({
	__esModule: true,
	default: ({
		src,
		alt,
		...props
	}: {
		src: string;
		alt: string;
		[key: string]: unknown;
	}) => {
		// eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
		return <img src={src} alt={alt} {...props} />;
	},
}));

const mockWPImage: WPImage = {
	ID: 23421,
	id: 23421,
	title: 'marca',
	filename: 'marca.webp',
	filesize: 133556,
	url: 'http://localhost:8082/wp-content/uploads/2024/04/marca.webp',
	link: 'http://localhost:8082/curso/marcadelas/marca/',
	alt: '',
	author: '2',
	description: '',
	caption: '',
	name: 'marca',
	status: 'inherit',
	uploaded_to: 20046,
	date: '2024-05-10 07:26:40',
	modified: '2024-05-10 07:26:40',
	menu_order: 0,
	mime_type: 'image/webp',
	type: 'image',
	subtype: 'webp',
	icon: 'http://localhost:8082/wp-includes/images/media/default.png',
	width: 1080,
	height: 1080,
	sizes: {
		thumbnail:
			'http://localhost:8082/wp-content/uploads/2024/04/marca-150x150.webp',
		'thumbnail-width': 150,
		'thumbnail-height': 150,
		medium:
			'http://localhost:8082/wp-content/uploads/2024/04/marca-300x300.webp',
		'medium-width': 300,
		'medium-height': 300,
		medium_large:
			'http://localhost:8082/wp-content/uploads/2024/04/marca-768x768.webp',
		'medium_large-width': 768,
		'medium_large-height': 768,
		large:
			'http://localhost:8082/wp-content/uploads/2024/04/marca-1024x1024.webp',
		'large-width': 1024,
		'large-height': 1024,
		'1536x1536': 'http://localhost:8082/wp-content/uploads/2024/04/marca.webp',
		'1536x1536-width': 1080,
		'1536x1536-height': 1080,
		'2048x2048': 'http://localhost:8082/wp-content/uploads/2024/04/marca.webp',
		'2048x2048-width': 1080,
		'2048x2048-height': 1080,
	},
};
const mockSidebar: SidebarResponse = {
	cycle_id: 1,
	course_id: 101,
	class_id: 151673,
	class_name: '2024',
	class_slug: '2024',
	cycle_name: '44',
	cycle_slug: '44',
	course_name: 'Matematica',
	course_slug: 'matematica',
	logo: mockWPImage,
	logo_b: mockWPImage,
};
const mockSession: Session = {
	user: {
		user_display_name: 'João Silva',
		user_email: 'joao@example.com',
		user_nicename: 'João',
		role: ['admin'],
		token: 'mock_token_12345',
		user_first_name: 'João',
		user_last_name: 'Silva',
		cpf: '99999999999',
		id: 1,
	},
	expires: '',
};

interface SidebarProps {
	role: boolean;
	session: Session;
	sidebar: SidebarResponse[];
	isParticipantMode: boolean;
}

const mockSidebarProps: SidebarProps = {
	role: true,
	session: mockSession,
	sidebar: [mockSidebar],
	isParticipantMode: false,
};

const mockClassId: string = '151673';
const mockClassesData: { [key: string]: object } | null = {
	[mockClassId]: {
		name: 'Matematica',
		teacher: 'João Silva',
		courses: {
			evaluate_course: 'https://example.com/evaluate',
			links_and_materials: [
				{
					icon: 'https://localhost:8082/wp-content/uploads/2024/04/git-repository-line.svg',
					link: 'http://localhost:8082/respositorioDelas',
					title: 'Biblioteca',
				},
			],
		},
		turno: {
			value: 'diurno',
		},
		logo: mockWPImage,
	},
};

function setUserContext(
	classesData: { [key: string]: object } | null,
	classId: string,
	coursesShowed: boolean,
) {
	(useUserContext as jest.Mock).mockReturnValue({
		classesData: classesData,
		classId: classId,
		coursesShowed: coursesShowed,
		setClassId: jest.fn(),
		setClassesData: jest.fn(),
		setOpenCourses: jest.fn(),
		setCoursesShowed: jest.fn(),
		setCourseLoading: jest.fn(),
	});
}

describe('Sidebar Component', () => {
	beforeEach(() => {
		// Reset all mocks before each test
		jest.clearAllMocks();

		// Mock fetch response
		(global.fetch as jest.Mock).mockResolvedValue({
			ok: true,
			json: async () => ({ appKey: 'sebrae_ingresse' }),
		});

		// Mock localStorage
		const localStorageMock = {
			getItem: jest.fn(),
			setItem: jest.fn(),
			removeItem: jest.fn(),
			clear: jest.fn(),
		};
		Object.defineProperty(window, 'localStorage', {
			value: localStorageMock,
			writable: true,
		});

		// Mock window.pageYOffset
		Object.defineProperty(window, 'pageYOffset', {
			value: 0,
			writable: true,
			configurable: true,
		});

		// Suppress console errors for act warnings in tests
		jest.spyOn(console, 'error').mockImplementation((message) => {
			if (
				typeof message === 'string' &&
				message.includes('Warning: An update to')
			) {
				return;
			}
			console.warn(message);
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe("correct props 'role, session, sidebar'", () => {
		it('should render all buttons', () => {
			setUserContext(mockClassesData, mockClassId, true);
			render(<Sidebar {...mockSidebarProps} />);

			const buttons = screen.getAllByRole('button');

			const menuButton = buttons.find((button) =>
				button.getAttribute('class')?.includes('MuiButtonBase-root'),
			);
			expect(menuButton).toBeInTheDocument();

			const logOutButton = buttons.find((button) =>
				button.classList.contains('css-g6e0b2'),
			);
			expect(logOutButton).toBeInTheDocument();
		});

		it('should render all links', () => {
			setUserContext(mockClassesData, mockClassId, true);
			render(<Sidebar {...mockSidebarProps} />);

			const links = screen.getAllByRole('link');

			const homeLink = links.find(
				(link) => link.getAttribute('href') === '/home',
			);
			expect(homeLink).toBeInTheDocument();

			const classLink = links.find(
				(link) => link.getAttribute('href') === '/trocar-turma',
			);
			expect(classLink).toBeInTheDocument();
		});

		it('should render whatsapp link when user role is subscriber', () => {
			const subscriberSession = {
				...mockSession,
				user: {
					...mockSession.user,
					role: ['subscriber'],
				},
			};

			// Add contact to the mock data
			const mockClassesDataWithContact = {
				[mockClassId]: {
					...mockClassesData[mockClassId],
					contact: {
						phone: '5511999999999',
						message: 'Olá, preciso de ajuda!',
					},
				},
			};

			setUserContext(mockClassesDataWithContact, mockClassId, true);
			render(<Sidebar {...mockSidebarProps} session={subscriberSession} />);

			const links = screen.getAllByRole('link');
			const whatsappButton = links.find((link) =>
				link.getAttribute('href')?.includes('https://api.whatsapp.com'),
			);
			expect(whatsappButton).toBeInTheDocument();
		});

		it('should render all images', () => {
			setUserContext(mockClassesData, mockClassId, true);
			render(<Sidebar {...mockSidebarProps} />);

			const imgs = screen.getAllByRole('presentation');

			const moreIcon = imgs.find(
				(img) => img.getAttribute('src') === '/icon-more.svg',
			);
			const imgLogo = imgs.find(
				(img) =>
					img.getAttribute('src') === mockSidebarProps.sidebar[0].logo.url,
			);

			expect(moreIcon).toBeInTheDocument();
			expect(imgLogo).toBeInTheDocument();
		});

		describe('logOut functionality', () => {
			it('should call logOut and perform all expected actions when StyledButton is clicked', async () => {
				setUserContext(mockClassesData, mockClassId, true);
				render(<Sidebar {...mockSidebarProps} />);

				const logOutButton = document.querySelector('button.css-g6e0b2');

				expect(logOutButton).toBeInTheDocument();

				if (logOutButton) {
					await act(async () => {
						fireEvent.click(logOutButton);
					});
				}

				expect(signOut).toHaveBeenCalledWith({ redirect: true });
				expect(Cookies.remove).toHaveBeenCalledWith('updRoomCredentials');
				expect(Cookies.remove).toHaveBeenCalledWith('updRoom1on1Credentials');
				expect(Cookies.remove).toHaveBeenCalledWith(
					'__Secure-next-auth.session-token',
				);
				expect(window.localStorage.removeItem).toHaveBeenCalledWith('class_id');
				expect(window.localStorage.removeItem).toHaveBeenCalledWith(
					'class_id_expiration',
				);
				expect(window.localStorage.removeItem).toHaveBeenCalledWith(
					'course_id',
				);
				expect(window.localStorage.removeItem).toHaveBeenCalledWith(
					'isParticipantMode',
				);
				expect(window.localStorage.removeItem).toHaveBeenCalledWith(
					'participantModeStorage',
				);
				expect(window.localStorage.removeItem).toHaveBeenCalledWith(
					'originalPage',
				);
			});
		});

		describe('handleScroll functionality', () => {
			it('should update scroll position on scroll events', () => {
				setUserContext(mockClassesData, mockClassId, true);
				render(<Sidebar {...mockSidebarProps} />);

				// Simulate scrolling down
				act(() => {
					Object.defineProperty(window, 'pageYOffset', {
						value: 100,
						writable: true,
						configurable: true,
					});
					window.dispatchEvent(new Event('scroll'));
				});

				// Verify scroll event was handled
				expect(window.pageYOffset).toBe(100);

				// Simulate scrolling up
				act(() => {
					Object.defineProperty(window, 'pageYOffset', {
						value: 50,
						writable: true,
						configurable: true,
					});
					window.dispatchEvent(new Event('scroll'));
				});

				// Verify scroll event was handled
				expect(window.pageYOffset).toBe(50);
			});
		});

		it('should handle coursesShowed timeout when on home page', async () => {
			jest.useFakeTimers();

			const setCoursesShowed = jest.fn();
			(usePathname as jest.Mock).mockReturnValue('/home');
			(useUserContext as jest.Mock).mockReturnValue({
				classesData: mockClassesData,
				classId: mockClassId,
				coursesShowed: false,
				setClassId: jest.fn(),
				setClassesData: jest.fn(),
				setOpenCourses: jest.fn(),
				setCoursesShowed: setCoursesShowed,
				setCourseLoading: jest.fn(),
			});

			render(<Sidebar {...mockSidebarProps} />);

			// The modal should open after 500ms timeout
			act(() => {
				jest.advanceTimersByTime(500);
			});

			// Wait for state updates
			await act(async () => {
				await Promise.resolve();
			});

			expect(setCoursesShowed).toHaveBeenCalledWith(true);

			jest.useRealTimers();
		});

		it('should render nothing if path includes restricted values', () => {
			const restrictedPaths = ['/saladereuniao', '/consultoria', '/grupo'];

			restrictedPaths.forEach((path) => {
				(usePathname as jest.Mock).mockReturnValue(path);
				setUserContext(mockClassesData, mockClassId, true);
				render(<Sidebar {...mockSidebarProps} />);
				expect(screen.queryByText(/Participante/i)).not.toBeInTheDocument();
			});
		});
	});
});
