import { render, screen } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { HomeLinks } from './index';
import { mockClassData } from '@/mocks/mockClassData';

const originalError = console.error;
beforeAll(() => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	console.error = (...args: any[]) => {
		if (typeof args[0] === 'string' && args[0].includes('validateDOMNesting')) {
			return;
		}
		originalError.call(console, ...args);
	};
});

afterAll(() => {
	console.error = originalError;
});

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
	useSubmissionNotifications: jest.fn(() => ({
		submissionNotifications: {},
		isLoading: false,
	})),
}));

jest.mock('@/app/services/bff/LogsService', () => ({
	sendLogBff: jest.fn(() => Promise.resolve({ status: 200 })),
}));

const renderWithSession = (component: React.ReactElement) => {
	return render(<SessionProvider session={null}>{component}</SessionProvider>);
};

describe('HomeLinks', () => {
	describe('facilitator userType', () => {
		it('renders all links for facilitator', () => {
			const classData = mockClassData({
				courses: {
					id: 1,
					name: 'Curso Exemplo',
					slug: 'curso-exemplo',
					description: 'Descrição',
					links_and_materials: [
						{
							title: 'Link 1',
							link: 'https://example.com/1',
							icon: '/icon1.svg',
						},
						{
							title: 'Link 2',
							link: 'https://example.com/2',
							icon: '/icon2.svg',
						},
					],
					evaluate_course: '',
					form_subjects: [],
					group_link: '',
					maintenance_mode_title: '',
					maintenance_mode_message: '',
					maintenance_mode_description: '',
					maintenance_mode_active: false,
				},
			});

			renderWithSession(
				<HomeLinks userType='facilitator' classData={classData} />,
			);

			expect(screen.getByText('Link 1')).toBeInTheDocument();
			expect(screen.getByText('Link 2')).toBeInTheDocument();
		});

		it('renders group link when group_link is present', () => {
			const classData = mockClassData({
				group_link: 'https://whatsapp.com/group',
				courses: {
					id: 1,
					name: 'Curso Exemplo',
					slug: 'curso-exemplo',
					description: 'Descrição',
					links_and_materials: [
						{
							title: 'Link 1',
							link: 'https://example.com/1',
							icon: '/icon1.svg',
						},
					],
					evaluate_course: '',
					form_subjects: [],
					group_link: '',
					maintenance_mode_title: '',
					maintenance_mode_message: '',
					maintenance_mode_description: '',
					maintenance_mode_active: false,
				},
			});

			renderWithSession(
				<HomeLinks userType='facilitator' classData={classData} />,
			);

			expect(screen.getByText('Comunidade no whatsapp')).toBeInTheDocument();
		});
	});

	describe('subscriber userType', () => {
		it('renders all links in Grid for subscriber', () => {
			const classData = mockClassData({
				courses: {
					id: 1,
					name: 'Curso Exemplo',
					slug: 'curso-exemplo',
					description: 'Descrição',
					links_and_materials: [
						{
							title: 'Link 1',
							link: 'https://example.com/1',
							icon: '/icon1.svg',
						},
						{
							title: 'Link 2',
							link: 'https://example.com/2',
							icon: '/icon2.svg',
						},
					],
					evaluate_course: '',
					form_subjects: [],
					group_link: '',
					maintenance_mode_title: '',
					maintenance_mode_message: '',
					maintenance_mode_description: '',
					maintenance_mode_active: false,
				},
			});

			renderWithSession(
				<HomeLinks userType='subscriber' classData={classData} />,
			);

			const link1 = screen.getByText('Link 1');
			const link2 = screen.getByText('Link 2');

			expect(link1).toBeInTheDocument();
			expect(link2).toBeInTheDocument();

			// Verifica se estão dentro de Grid items
			const gridItem1 = link1.closest('.MuiGrid-root');
			const gridItem2 = link2.closest('.MuiGrid-root');

			expect(gridItem1).toBeInTheDocument();
			expect(gridItem2).toBeInTheDocument();
		});

		it('renders group link when courses.group_link is present', () => {
			const classData = mockClassData({
				courses: {
					id: 1,
					name: 'Curso Exemplo',
					slug: 'curso-exemplo',
					description: 'Descrição',
					links_and_materials: [],
					evaluate_course: '',
					form_subjects: [],
					group_link: 'https://whatsapp.com/group',
					maintenance_mode_title: '',
					maintenance_mode_message: '',
					maintenance_mode_description: '',
					maintenance_mode_active: false,
				},
			});

			renderWithSession(
				<HomeLinks userType='subscriber' classData={classData} />,
			);

			expect(screen.getByText('Comunidade no whatsapp')).toBeInTheDocument();
		});
	});

	describe('edge cases', () => {
		it('renders nothing if there are no links', () => {
			const classData = mockClassData({
				courses: {
					id: 1,
					name: 'Curso Exemplo',
					slug: 'curso-exemplo',
					description: 'Descrição',
					links_and_materials: [],
					evaluate_course: '',
					form_subjects: [],
					group_link: '',
					maintenance_mode_title: '',
					maintenance_mode_message: '',
					maintenance_mode_description: '',
					maintenance_mode_active: false,
				},
				links_and_materials: {
					facilitator: [],
					subscriber: [],
				},
				group_link: '',
				enable_strategic_activities: false,
			});

			const { container } = renderWithSession(
				<HomeLinks userType='subscriber' classData={classData} />,
			);

			// Verifica se não há nenhum ButtonSimple renderizado
			expect(container.querySelector('a')).toBeNull();
		});
	});

	describe('link behavior', () => {
		it('all links should be present and clickable', () => {
			const classData = mockClassData({
				courses: {
					id: 1,
					name: 'Curso Exemplo',
					slug: 'curso-exemplo',
					description: 'Descrição',
					links_and_materials: [
						{
							title: 'Link Externo',
							link: 'https://example.com',
							icon: '/icon.svg',
						},
					],
					evaluate_course: '',
					form_subjects: [],
					group_link: '',
					maintenance_mode_title: '',
					maintenance_mode_message: '',
					maintenance_mode_description: '',
					maintenance_mode_active: false,
				},
			});

			renderWithSession(
				<HomeLinks userType='subscriber' classData={classData} />,
			);

			const linkText = screen.getByText('Link Externo');
			expect(linkText).toBeInTheDocument();

			// Verifica se o link está dentro de um elemento clicável
			const linkElement = linkText.closest('a');
			expect(linkElement).toBeInTheDocument();
		});

		it('renders multiple links correctly', () => {
			const classData = mockClassData({
				courses: {
					id: 1,
					name: 'Curso Exemplo',
					slug: 'curso-exemplo',
					description: 'Descrição',
					links_and_materials: [
						{
							title: 'Link 1',
							link: 'https://example.com/1',
							icon: '/icon1.svg',
						},
						{
							title: 'Link 2',
							link: 'https://example.com/2',
							icon: '/icon2.svg',
						},
						{
							title: 'Link 3',
							link: 'https://example.com/3',
							icon: '/icon3.svg',
						},
					],
					evaluate_course: '',
					form_subjects: [],
					group_link: '',
					maintenance_mode_title: '',
					maintenance_mode_message: '',
					maintenance_mode_description: '',
					maintenance_mode_active: false,
				},
			});

			renderWithSession(
				<HomeLinks userType='subscriber' classData={classData} />,
			);

			expect(screen.getByText('Link 1')).toBeInTheDocument();
			expect(screen.getByText('Link 2')).toBeInTheDocument();
			expect(screen.getByText('Link 3')).toBeInTheDocument();
		});
	});
});
