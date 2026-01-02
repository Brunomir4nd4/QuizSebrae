/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import HomeFacilitador from '@/components/Home/HomeFacilitador.component';
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

jest.mock('@/components/HomeLinks', () => ({
	HomeLinks: ({ classData }: any) => (
		<div>
			{classData?.courses?.links_and_materials?.map(
				(item: any, index: number) => (
					<a key={index} href={item.link} id={`home_link_${index}`}>
						{/* eslint-disable-next-line @next/next/no-img-element */}
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

interface HomeFacilitadorProps {
	settings: ThemeSettings;
}

const mockSetThemeSettings = jest.fn();

const mockSettings: HomeFacilitadorProps = {
	settings: {
		facilitator: { enable_room: true, enable_calendar: true },
		participant: { enable_room: false, enable_calendar: false },
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
const mockCourseLoading = false;
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
		enable_strategic_activities: true,
		strategic_activities_number: 3,
	},
};

function setUserContext(classesData: any, classId: any, courseLoading: any) {
	(useUserContext as jest.Mock).mockReturnValue({
		classesData: classesData,
		classId: classId,
		courseLoading: courseLoading,
		setClassId: jest.fn(),
		setClassesData: jest.fn(),
		setCoursesShowed: jest.fn(),
		setCourseLoading: jest.fn(),
		setThemeSettings: mockSetThemeSettings,
	});
}

const renderWithSession = (component: React.ReactElement) => {
	return render(<SessionProvider session={null}>{component}</SessionProvider>);
};

describe('HomeFacilitador Component', () => {
	describe("correct prop 'settings'", () => {
		describe('participant', () => {
			it('render component', () => {
				setUserContext(mockClassesData, mockClassId, mockCourseLoading);
				renderWithSession(<HomeFacilitador {...mockSettings} />);

				const imgs = screen.getAllByRole('presentation');
				const imgMeeting = imgs.find(
					(img) => img.getAttribute('src') === '/online.svg',
				);
				const imgAgenda = imgs.find(
					(img) => img.getAttribute('src') === '/icon-agenda.svg',
				);
				const imgClasses = imgs.find(
					(img) => img.getAttribute('src') === '/icon-turmas.svg',
				);
				const linkMeeting = screen.getByRole('link', { name: /entrar/i });
				const linkAgenda = screen.getByRole('link', { name: /administrar/i });

				expect(linkMeeting).toHaveAttribute(
					'href',
					`/sala-de-reuniao/${mockClassId}`,
				);
				expect(linkAgenda).toHaveAttribute('href', `agenda`);
				expect(screen.getByText(/ao vivo/i)).toBeInTheDocument();
				expect(screen.getByText(/ENTRAR/i)).toBeInTheDocument();
				expect(screen.getByText(/Agenda/i)).toBeInTheDocument();
				expect(screen.getByText(/ADMINISTRAR/i)).toBeInTheDocument();
				expect(imgMeeting).toBeInTheDocument();
				expect(imgAgenda).toBeInTheDocument();
				expect(imgClasses).toBeInTheDocument();
			});

			it('call setThemeSettings when setMessage is invoked', () => {
				setUserContext(mockClassesData, mockClassId, mockCourseLoading);
				renderWithSession(<HomeFacilitador {...mockSettings} />);

				const classComponent = screen.getByText('Trocar turma');
				fireEvent.click(classComponent);

				expect(mockSetThemeSettings).toHaveBeenCalledWith(
					mockSettings.settings,
				);
			});

			describe('cards', () => {
				describe("renders 'Card Reunião' when enable_room is true", () => {
					it("with 'turno'", () => {
						setUserContext(mockClassesData, mockClassId, mockCourseLoading);
						renderWithSession(<HomeFacilitador {...mockSettings} />);

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
							...mockClassesData,
							[mockClassId]: {
								...mockClassesData[mockClassId],
								turno: null,
							},
						};

						setUserContext(updatedClassesData, mockClassId, mockCourseLoading);
						renderWithSession(<HomeFacilitador {...mockSettings} />);

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

				it("render 'Card Agenda' when enable_calendar is true", () => {
					setUserContext(mockClassesData, mockClassId, mockCourseLoading);
					renderWithSession(<HomeFacilitador {...mockSettings} />);

					const imgs = screen.getAllByRole('presentation');
					const img = imgs.find(
						(img) => img.getAttribute('src') === '/icon-agenda.svg',
					);
					const link = screen.getByRole('link', { name: /administrar/i });

					expect(link).toHaveAttribute('href', `agenda`);
					expect(screen.getByText(/Agenda/i)).toBeInTheDocument();
					expect(screen.getByText(/ADMINISTRAR/i)).toBeInTheDocument();
					expect(img).toBeInTheDocument();
				});

				it("don't render 'Card Reunião' when enable_room is false", () => {
					const updatedSettings = {
						...mockSettings,
						settings: {
							...mockSettings.settings,
							facilitator: {
								...mockSettings.settings.facilitator,
								enable_room: false,
							},
						},
					};

					setUserContext(mockClassesData, mockClassId, mockCourseLoading);
					renderWithSession(<HomeFacilitador {...updatedSettings} />);

					const imgs = screen.getAllByRole('presentation');
					const img = imgs.find(
						(img) => img.getAttribute('src') === '/online.svg',
					);

					expect(img).toBeUndefined();
					expect(() => screen.getByRole('link', { name: /entrar/i })).toThrow();
					expect(() => screen.getByText(/ao vivo/i)).toThrow();
					expect(() => screen.getByText(/ENTRAR/i)).toThrow();
				});

				it("don't render 'Card Agenda' when enable_calendar is false", () => {
					const updatedSettings = {
						...mockSettings,
						settings: {
							...mockSettings.settings,
							facilitator: {
								...mockSettings.settings.facilitator,
								enable_calendar: false,
							},
						},
					};

					setUserContext(mockClassesData, mockClassId, mockCourseLoading);
					renderWithSession(<HomeFacilitador {...updatedSettings} />);

					const imgs = screen.getAllByRole('presentation');
					const img = imgs.find(
						(img) => img.getAttribute('src') === '/icon-agenda.svg',
					);

					expect(img).toBeUndefined();
					expect(() => screen.getByText(/Agenda/i)).toThrow();
					expect(() => screen.getByText(/ADMINISTRAR/i)).toThrow();
					expect(() =>
						screen.getByRole('link', { name: /administrar/i }),
					).toThrow();
				});

				it("renders 'Card Turmas'", () => {
					setUserContext(mockClassesData, mockClassId, mockCourseLoading);
					renderWithSession(<HomeFacilitador {...mockSettings} />);

					const imgs = screen.getAllByRole('presentation');
					const img = imgs.find(
						(img) => img.getAttribute('src') === '/icon-turmas.svg',
					);
					const link = screen.getByRole('link', { name: /gerenciar/i });

					expect(link).toHaveAttribute(
						'href',
						expect.stringMatching(
							new RegExp(`participacao/${mockClassId}\\?time=\\d+`),
						),
					);
					expect(screen.getByText(/Turmas/i)).toBeInTheDocument();
					expect(screen.getByText(/GERENCIAR/i)).toBeInTheDocument();
					expect(img).toBeInTheDocument();
				});

				it("render 'Card Gestão Atividades'", () => {
					setUserContext(mockClassesData, mockClassId, mockCourseLoading);
					renderWithSession(<HomeFacilitador {...mockSettings} />);

					const imgs = screen.getAllByRole('presentation');
					const img = imgs.find(
						(img) => img.getAttribute('src') === '/icon-activities-verde.svg',
					);
					const link = screen.getByRole('link', { name: /Gestão/i });

					expect(link).toHaveAttribute('href', '/gestao-de-atividades');
					expect(screen.getByText(/Gestão de atividades/i)).toBeInTheDocument();
					expect(screen.getByText(/gerir/i)).toBeInTheDocument();
					expect(img).toBeInTheDocument();
				});
			});
		});
	});

	describe("incorrect prop 'settings'", () => {
		it("'settings' as null", () => {
			setUserContext(mockClassesData, mockClassId, mockCourseLoading);
			renderWithSession(
				<HomeFacilitador settings={null as unknown as ThemeSettings} />,
			);

			const imgs = screen.getAllByRole('presentation');
			const imgMeeting = imgs.find(
				(img) => img.getAttribute('src') === '/online.svg',
			);
			const imgAgenda = imgs.find(
				(img) => img.getAttribute('src') === '/icon-agenda.svg',
			);
			const imgClasses = imgs.find(
				(img) => img.getAttribute('src') === '/icon-turmas.svg',
			);

			expect(imgMeeting).toBeUndefined();
			expect(imgAgenda).toBeUndefined();
			expect(() => screen.getByRole('link', { name: /entrar/i })).toThrow();
			expect(() =>
				screen.getByRole('link', { name: /administrar/i }),
			).toThrow();
			expect(() => screen.getByText(/ao vivo/i)).toThrow();
			expect(() => screen.getByText(/ENTRAR/i)).toThrow();
			expect(() => screen.getByText(/Agenda/i)).toThrow();
			expect(() => screen.getByText(/ADMINISTRAR/i)).toThrow();
			expect(screen.getByText(/Turmas/i)).toBeInTheDocument();
			expect(screen.getByText(/GERENCIAR/i)).toBeInTheDocument();
			expect(imgClasses).toBeInTheDocument();
		});
	});

	it('render "Trocar turma" button', () => {
		setUserContext(mockClassesData, mockClassId, mockCourseLoading);
		renderWithSession(<HomeFacilitador {...mockSettings} />);

		const button = screen.getByRole('link', { name: /trocar turma/i });

		expect(button).toHaveAttribute('href', '/trocar-turma');
		expect(button).toHaveTextContent('Trocar turma');
	});

	it('classesData, classId and courseLoading as null', () => {
		setUserContext(null, null, null);
		renderWithSession(<HomeFacilitador {...mockSettings} />);

		expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
	});
});
