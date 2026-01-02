/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import HomeAluno from '@/components/Home/HomeAluno.component';
import { useUserContext } from '@/app/providers/UserProvider';
import { ThemeSettings } from '@/types/IThemeSettings';
import { SessionProvider } from 'next-auth/react';

jest.mock('next/navigation', () => ({
	useRouter: jest.fn(() => ({
		push: jest.fn(),
		pathname: '/',
		query: {},
		asPath: '/',
	})),
	usePathname: jest.fn(() => '/home'),
}));

jest.mock('@/app/providers/UserProvider', () => ({
	useUserContext: jest.fn(),
}));

// Mock HomeLinks component to avoid its internal dependencies
jest.mock('@/components/HomeLinks', () => ({
	HomeLinks: ({ classData }: any) => (
		<div>
			{classData?.courses?.links_and_materials?.map(
				(item: any, index: number) => (
					<a key={index} href={item.link} id={`home_link_${index}`}>
						<img src={item.icon} alt={item.title} />
					</a>
				),
			)}
		</div>
	),
}));

// Mock next-auth's useSession
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

interface HomeAlunoProps {
	settings: ThemeSettings;
}

const mockSettings: HomeAlunoProps = {
	settings: {
		facilitator: { enable_room: false, enable_calendar: false },
		participant: { enable_room: true, enable_calendar: true },
		supervisor: { enable_room: true, enable_calendar: true },
		maintenance_mode: false,
		site_url: 'https://example.com',
		whatsapp_message_to_facilitator: 'Olá, Facilitador!',
		whatsapp_message_to_participant: 'Olá, Participante!',
		whatsapp_support_link: 'https://wa.me/1234567890?text=Preciso%20de%20ajuda',
		maintenance_mode_general_hub_active: false,
		maintenance_mode_general_hub_title: 'Modo de Manutenção',
		maintenance_mode_general_hub_message: 'O sistema está em manutenção.',
		maintenance_mode_general_hub_description:
			'Estamos realizando uma manutenção programada. Por favor, volte mais tarde.',
	},
};

const mockClassId = '151673';
const mockClassesData = {
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
		ciclos: {
			id: 1,
		},
		enable_strategic_activities: true,
		strategic_activities_number: 3,
	},
};

function setUserContext(classesData: any, classId: any) {
	(useUserContext as jest.Mock).mockReturnValue({
		classesData: classesData,
		classId: classId,
		setClassId: jest.fn(),
		setClassesData: jest.fn(),
		setCoursesShowed: jest.fn(),
		setCourseLoading: jest.fn(),
	});
}

const renderWithSession = (component: React.ReactElement) => {
	return render(<SessionProvider session={null}>{component}</SessionProvider>);
};

describe('HomeAluno Component', () => {
	describe("correct prop 'settings'", () => {
		describe('participant', () => {
			it('render component', () => {
				setUserContext(mockClassesData, mockClassId);
				renderWithSession(<HomeAluno {...mockSettings} />);

				const imgs = screen.getAllByRole('presentation');
				const imgMeeting = imgs.find(
					(img) => img.getAttribute('src') === '/online.svg',
				);
				const imgAgenda = imgs.find(
					(img) => img.getAttribute('src') === '/icon-consultoria-green.svg',
				);
				const imgJourney = imgs.find(
					(img) => img.getAttribute('src') === '/icon-jornada-green.svg',
				);
				const linkMeeting = screen.getByRole('link', { name: /entrar/i });
				const linkAgenda = screen.getByRole('link', { name: /agendar/i });
				const linkJourney = screen.getByRole('link', { name: /avaliar/i });

				expect(linkMeeting).toHaveAttribute(
					'href',
					`/sala-de-reuniao/${mockClassId}`,
				);
				expect(linkAgenda).toHaveAttribute('href', `agendar/${mockClassId}`);
				expect(linkJourney).toHaveAttribute(
					'href',
					mockClassesData[mockClassId]?.courses?.evaluate_course || '',
				);
				expect(screen.getByText(/ao vivo/i)).toBeInTheDocument();
				expect(screen.getByText(/ENTRAR/i)).toBeInTheDocument();
				expect(screen.getByText(/Mentorias/i)).toBeInTheDocument();
				expect(screen.getByText(/AGENDAR/i)).toBeInTheDocument();
				expect(screen.getByText(/Jornada/i)).toBeInTheDocument();
				expect(screen.getByText(/AVALIAR/i)).toBeInTheDocument();
				expect(imgMeeting).toBeInTheDocument();
				expect(imgAgenda).toBeInTheDocument();
				expect(imgJourney).toBeInTheDocument();
			});

			describe('cards', () => {
				describe("render 'Card Reunião' when enable_room is true", () => {
					it("with 'turno'", () => {
						setUserContext(mockClassesData, mockClassId);
						renderWithSession(<HomeAluno {...mockSettings} />);

						const imgs = screen.getAllByRole('presentation');
						const img = imgs.find(
							(img) => img.getAttribute('src') === '/online.svg',
						);
						const link = screen.getByRole('link', { name: /entrar/i });

						expect(link).toHaveAttribute(
							'href',
							`/sala-de-reuniao/${mockClassId}`,
						);
						expect(screen.getByText(/ao vivo/i)).toBeInTheDocument();
						expect(screen.getByText(/ENTRAR/i)).toBeInTheDocument();
						expect(img).toBeInTheDocument();
					});

					it("without 'turno'", () => {
						const updatedClassesData = {
							[mockClassId]: {
								...mockClassesData[mockClassId],
								turno: null,
							},
						};

						setUserContext(updatedClassesData, mockClassId);
						renderWithSession(<HomeAluno {...mockSettings} />);

						const imgs = screen.getAllByRole('presentation');
						const img = imgs.find(
							(img) => img.getAttribute('src') === '/online.svg',
						);
						const link = screen.getByRole('link', { name: /entrar/i });

						expect(link).toHaveAttribute(
							'href',
							`/sala-de-reuniao/${mockClassId}`,
						);
						expect(() => screen.getByText(/ao vivo/i)).toThrow();
						expect(screen.getByText(/ENTRAR/i)).toBeInTheDocument();
						expect(img).toBeInTheDocument();
					});
				});

				it("render 'Card Mentorias' when enable_calendar is true", () => {
					setUserContext(mockClassesData, mockClassId);
					renderWithSession(<HomeAluno {...mockSettings} />);

					const imgs = screen.getAllByRole('presentation');
					const img = imgs.find(
						(img) => img.getAttribute('src') === '/icon-consultoria-green.svg',
					);
					const link = screen.getByRole('link', { name: /agendar/i });

					expect(link).toHaveAttribute('href', `agendar/${mockClassId}`);
					expect(screen.getByText(/Mentorias/i)).toBeInTheDocument();
					expect(screen.getByText(/AGENDAR/i)).toBeInTheDocument();
					expect(img).toBeInTheDocument();
				});

				it("don't render 'Card Reunião' when enable_room is false", () => {
					const updatedSettings = {
						...mockSettings,
						settings: {
							...mockSettings.settings,
							participant: {
								...mockSettings.settings.participant,
								enable_room: false,
							},
						},
					};

					setUserContext(mockClassesData, mockClassId);
					renderWithSession(<HomeAluno {...updatedSettings} />);
					const imgs = screen.getAllByRole('presentation');
					const img = imgs.find(
						(img) => img.getAttribute('src') === '/online.svg',
					);

					expect(img).toBeUndefined();
					expect(() => screen.getByRole('link', { name: /entrar/i })).toThrow();
					expect(() => screen.getByText(/ao vivo/i)).toThrow();
					expect(() => screen.getByText(/ENTRAR/i)).toThrow();
				});

				it("don't render 'Card Mentorias' when enable_calendar is false", () => {
					const updatedSettings = {
						...mockSettings,
						settings: {
							...mockSettings.settings,
							participant: {
								...mockSettings.settings.participant,
								enable_calendar: false,
							},
						},
					};

					setUserContext(mockClassesData, mockClassId);
					renderWithSession(<HomeAluno {...updatedSettings} />);

					const imgs = screen.getAllByRole('presentation');
					const img = imgs.find(
						(img) => img.getAttribute('src') === '/icon-consultoria-green.svg',
					);

					expect(img).toBeUndefined();
					expect(() => screen.getByText(/Mentorias/i)).toThrow();
					expect(() => screen.getByText(/AGENDAR/i)).toThrow();
				});

				it("render 'Card Jornada'", () => {
					setUserContext(mockClassesData, mockClassId);
					renderWithSession(<HomeAluno {...mockSettings} />);

					const imgs = screen.getAllByRole('presentation');
					const img = imgs.find(
						(img) => img.getAttribute('src') === '/icon-jornada-green.svg',
					);
					const link = screen.getByRole('link', { name: /avaliar/i });

					expect(link).toHaveAttribute(
						'href',
						mockClassesData[mockClassId]?.courses?.evaluate_course || '',
					);
					expect(screen.getByText(/Jornada/i)).toBeInTheDocument();
					expect(screen.getByText(/AVALIAR/i)).toBeInTheDocument();
					expect(img).toBeInTheDocument();
				});

				it("render 'Card Atividades Estratégicas'", () => {
					setUserContext(mockClassesData, mockClassId);
					renderWithSession(<HomeAluno {...mockSettings} />);

					const imgs = screen.getAllByRole('presentation');
					const img = imgs.find(
						(img) => img.getAttribute('src') === '/icon-activities-verde.svg',
					);
					const link = screen.getByRole('link', { name: /atividades/i });

					expect(link).toHaveAttribute('href', '/atividades-estrategicas');
					expect(
						screen.getByText(/Atividades estratégicas/i),
					).toBeInTheDocument();
					expect(screen.getByText(/ENVIAR/i)).toBeInTheDocument();
					expect(img).toBeInTheDocument();
				});
			});

			describe('homelinks renders', () => {
				it('with links_and_materials', () => {
					setUserContext(mockClassesData, mockClassId);
					renderWithSession(<HomeAluno {...mockSettings} />);

					const links = screen.getAllByRole('link');
					const link = links.find(
						(link) =>
							link.getAttribute('href') ===
							mockClassesData[mockClassId].courses.links_and_materials[0].link,
					);
					const img = screen.getByAltText(
						mockClassesData[mockClassId].courses.links_and_materials[0].title,
					);

					expect(link).toBeInTheDocument();
					expect(img).toHaveAttribute(
						'src',
						mockClassesData[mockClassId].courses.links_and_materials[0].icon,
					);
				});

				it('without links_and_materials', () => {
					const updatedClassesData = {
						[mockClassId]: {
							...mockClassesData[mockClassId],
							courses: {
								...mockClassesData[mockClassId].courses,
								links_and_materials: [],
							},
						},
					};

					setUserContext(updatedClassesData, mockClassId);
					renderWithSession(<HomeAluno {...mockSettings} />);

					const links = screen.getAllByRole('link');
					const link = links.find(
						(link) => link.getAttribute('id') === 'home_link_0',
					);

					expect(link).toBeUndefined();
				});
			});
		});
	});

	describe("incorrect prop 'settings'", () => {
		it("'settings' as null", () => {
			setUserContext(mockClassesData, mockClassId);
			renderWithSession(
				<HomeAluno settings={null as unknown as ThemeSettings} />,
			);

			const imgs = screen.getAllByRole('presentation');
			const imgMeeting = imgs.find(
				(img) => img.getAttribute('src') === '/online.svg',
			);
			const imgAgenda = imgs.find(
				(img) => img.getAttribute('src') === '/icon-consultoria-green.svg',
			);
			const imgJourney = imgs.find(
				(img) => img.getAttribute('src') === '/icon-jornada-green.svg',
			);
			const linkJourney = screen.getByRole('link', { name: /avaliar/i });

			expect(imgMeeting).toBeUndefined();
			expect(imgAgenda).toBeUndefined();
			expect(linkJourney).toHaveAttribute(
				'href',
				mockClassesData[mockClassId]?.courses?.evaluate_course || '',
			);
			expect(() => screen.getByRole('link', { name: /entrar/i })).toThrow();
			expect(() => screen.getByText(/ao vivo/i)).toThrow();
			expect(() => screen.getByText(/ENTRAR/i)).toThrow();
			expect(() => screen.getByText(/Mentorias/i)).toThrow();
			expect(() => screen.getByText(/AGENDAR/i)).toThrow();
			expect(screen.getByText(/Jornada/i)).toBeInTheDocument();
			expect(screen.getByText(/AVALIAR/i)).toBeInTheDocument();
			expect(imgJourney).toBeInTheDocument();
		});
	});

	it('classesData and classId as null', () => {
		setUserContext(null, null);
		renderWithSession(<HomeAluno {...mockSettings} />);

		expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
	});
});
