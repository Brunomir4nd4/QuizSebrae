'use client';

import * as React from 'react';
import { useState, type FunctionComponent, useEffect } from 'react';
import {
	Logo,
	MoreButton,
	StyledButton,
	StyledSidebar,
} from './Sidebar.styles';
import { signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { MenuButton } from './components/MenuButton/MenuButton.component';
import { CoursesModal } from '../CoursesModal';
import { useUserContext } from '@/app/providers/UserProvider';
import { Session } from 'next-auth';
import Cookies from 'js-cookie';
import { Sidebar as SidebarResponse } from '@/types/ISidebar';
import { datadogRum } from '@datadog/browser-rum';

interface SidebarProps {
	/**
	 * Define se o usuário tem privilégios de administrador (supervisor/facilitador)
	 */
	role: boolean;
	/**
	 * Dados da sessão do usuário autenticado
	 */
	session: Session;
	/**
	 * Lista de cursos/turmas disponíveis para o usuário
	 */
	sidebar: SidebarResponse[];
	/**
	 * Indica se o usuário está no modo participante (para supervisores/facilitadores)
	 */
	isParticipantMode: boolean;
}

/**
 * **Sidebar**
 *
 * ### 🧩 Funcionalidade
 * - Barra lateral de navegação principal.
 * - Adapta ao perfil (participante, facilitador, supervisor).
 * - Mostra logo, menu, troca de turma, logout.
 * - Oculta em certas rotas (sala, atividades, etc.).
 * - Scroll behavior para hide/show.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <Sidebar
 *   role={true}
 *   session={session}
 *   sidebar={courses}
 *   isParticipantMode={false}
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - StyledSidebar com position fixed.
 * - MenuButton para links.
 * - Logo e contact dinâmicos.
 * - Responsive hide on scroll.
 *
 * @component
 */
export const Sidebar: FunctionComponent<SidebarProps> = ({
	role,
	session,
	sidebar,
	isParticipantMode = false,
}) => {
	const router = useRouter();
	const { classesData, classId, coursesShowed, setCoursesShowed } =
		useUserContext();

	const [prevScrollPos, setPrevScrollPos] = useState(0);

	useEffect(() => {
		setPrevScrollPos(window.pageYOffset);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollPos = window.pageYOffset;

			if (prevScrollPos > currentScrollPos) {
				setPrevScrollPos(currentScrollPos);
			} else {
				setPrevScrollPos(currentScrollPos);
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [prevScrollPos]);

	const [openCourses, setOpenCourses] = React.useState(false);
	const pathname = usePathname();
	const path = pathname.replace(/\//g, '').replace(/-/g, '');

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (path === 'home' && !coursesShowed) {
				handleOpenCourses();
			}
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [path, coursesShowed, sidebar?.length]);

	const [projectName, setProjectName] = useState<string | null>(null);

	useEffect(() => {
		const fetchProjectName = async () => {
			try {
				const res = await fetch('/api/project-name/config');
				if (!res.ok) throw new Error('Erro ao buscar PROJECT_NAME');
				const data = await res.json();
				setProjectName(data.appKey);
			} catch (err) {
				console.error(err);
			}
		};

		fetchProjectName();
	}, []);

	if (
		path.includes('saladereuniao') ||
		path.includes('atividades-estrategicas') ||
		path.includes('gestao-de-atividades') ||
		path.includes('avaliar-atividade') ||
		path.includes('consultoria') ||
		path.includes('grupo')
	) {
		return <></>;
	}

	const logOut = (event: React.SyntheticEvent) => {
		event.preventDefault();

		Cookies.remove('updRoomCredentials');
		Cookies.remove('updRoom1on1Credentials');
		Cookies.remove('__Secure-next-auth.session-token');

		localStorage.removeItem('class_id');
		localStorage.removeItem('class_id_expiration');
		localStorage.removeItem('course_id');
		localStorage.removeItem('isParticipantMode');
		localStorage.removeItem('participantModeStorage');
		localStorage.removeItem('originalPage');

		signOut({
			redirect: true,
		})
			.then(() => {
				datadogRum.clearUser();

				router.replace('/');
			})
			.catch((error) => {
				console.error('Error during logout:', error);
				// Handle the error as needed
			});
	};

	const handleOpenCourses = () => setOpenCourses(true);
	const handleCloseCourses = () => {
		setOpenCourses(false);
		setCoursesShowed(true);
	};

	const logo = classesData && classId ? classesData[classId]?.logo : null;
	const contact = classesData && classId ? classesData[classId]?.contact : null;

	return (
		<StyledSidebar isParticipantMode={isParticipantMode}>
			<MoreButton id='coursesButton' disableRipple onClick={handleOpenCourses}>
				<div>
					<img src='/icon-more.svg' alt='' />
				</div>
			</MoreButton>
			<div className='flex flex-col items-center'>
				<Logo onClick={handleOpenCourses}>
					{logo && (
						<img className='h-[48px] md:h-auto w-auto' src={logo.url} alt='' />
					)}
				</Logo>
				<MenuButton href='/home'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='33'
						height='30'
						viewBox='0 0 33 30'
						fill='none'>
						<path d='M28.5 28C28.5 28.3978 28.342 28.7794 28.0607 29.0607C27.7794 29.342 27.3978 29.5 27 29.5H6C5.60218 29.5 5.22064 29.342 4.93934 29.0607C4.65804 28.7794 4.5 28.3978 4.5 28V14.5H0L15.4905 0.418002C15.7667 0.166719 16.1266 0.0274658 16.5 0.0274658C16.8734 0.0274658 17.2333 0.166719 17.5095 0.418002L33 14.5H28.5V28ZM9.75 17.5C9.75 19.2902 10.4612 21.0071 11.727 22.273C12.9929 23.5388 14.7098 24.25 16.5 24.25C18.2902 24.25 20.0071 23.5388 21.273 22.273C22.5388 21.0071 23.25 19.2902 23.25 17.5H20.25C20.25 18.4946 19.8549 19.4484 19.1516 20.1517C18.4484 20.8549 17.4946 21.25 16.5 21.25C15.5054 21.25 14.5516 20.8549 13.8483 20.1517C13.1451 19.4484 12.75 18.4946 12.75 17.5H9.75Z' />
					</svg>
				</MenuButton>
				{contact && contact.phone && session.user.role[0] === 'subscriber' && (
					<MenuButton
						href={`https://api.whatsapp.com/send?phone=${contact.phone}&text=${contact.message}`}
						target='_blank'>
						<svg
							width='34'
							height='34'
							viewBox='0 0 34 34'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<path d='M8.92946 28.0405L10.1615 28.7589C12.2198 29.9591 14.559 30.6 17 30.6C24.5111 30.6 30.6 24.5111 30.6 17C30.6 9.48892 24.5111 3.4 17 3.4C9.48892 3.4 3.4 9.48892 3.4 17C3.4 19.4417 4.04129 21.7818 5.24225 23.8405L5.9603 25.0713L4.84936 29.154L8.92946 28.0405ZM0.00710632 34L2.30544 25.5536C0.839731 23.0411 0 20.1187 0 17C0 7.61116 7.61115 0 17 0C26.3888 0 34 7.61116 34 17C34 26.3888 26.3888 34 17 34C13.8824 34 10.9608 33.1609 8.44879 31.696L0.00710632 34ZM10.8653 9.02416C11.0929 9.00816 11.3212 9.00572 11.5491 9.01683C11.6412 9.02289 11.7328 9.03353 11.8245 9.04412C12.0953 9.07538 12.393 9.24027 12.4931 9.4672C13.0002 10.6171 13.4923 11.7736 13.9693 12.9364C14.0745 13.1931 14.0111 13.5258 13.8108 13.8477C13.7092 14.0128 13.5495 14.2443 13.3645 14.4811C13.1723 14.7271 12.7585 15.1795 12.7585 15.1795C12.7585 15.1795 12.5909 15.3804 12.6541 15.6305C12.6787 15.725 12.7572 15.8627 12.8284 15.9785C12.8678 16.0426 12.9044 16.0999 12.9281 16.1395C13.3632 16.8659 13.948 17.6023 14.6623 18.2947C14.867 18.4931 15.0656 18.6956 15.2791 18.8836C16.0752 19.5855 16.9759 20.1591 17.9486 20.5839L17.9573 20.5879C18.1009 20.6497 18.1747 20.6836 18.385 20.7728C18.4911 20.8177 18.5995 20.8565 18.7109 20.8859C18.7512 20.8964 18.7925 20.9024 18.834 20.9052C19.1089 20.9217 19.2678 20.7454 19.3356 20.6644C20.5656 19.1743 20.6781 19.0771 20.6866 19.0777V19.0805C20.8483 18.9101 21.1025 18.851 21.3292 18.8649C21.4328 18.8712 21.5358 18.8911 21.63 18.9341C22.534 19.3465 24.0122 19.9898 24.0122 19.9898L25.0007 20.4342C25.1663 20.5141 25.3174 20.7023 25.3247 20.8852C25.3292 20.9989 25.3414 21.1825 25.3008 21.5184C25.2476 21.9582 25.1138 22.4878 24.9808 22.7652C24.8873 22.9599 24.7663 23.1326 24.6255 23.2788C24.4346 23.477 24.2928 23.5974 24.0633 23.7684C23.9236 23.8724 23.8512 23.9214 23.8512 23.9214C23.615 24.0703 23.4819 24.1448 23.2006 24.2945C22.763 24.5276 22.2795 24.6616 21.7843 24.6871C21.4686 24.7032 21.1538 24.726 20.8384 24.709C20.8245 24.7081 19.8725 24.5619 19.8725 24.5619C17.4553 23.9261 15.2198 22.7351 13.3439 21.0834C12.9604 20.7458 12.6047 20.3805 12.2416 20.019C10.7302 18.5144 9.58602 16.8919 8.8922 15.3571C8.55006 14.6003 8.33341 13.7897 8.32999 12.9557C8.32372 11.9239 8.66151 10.9194 9.29 10.1012C9.41389 9.93985 9.53148 9.77254 9.73438 9.58096C9.94924 9.37807 10.086 9.26915 10.2333 9.19379C10.4296 9.09333 10.6453 9.03961 10.8653 9.02416Z' />
						</svg>
					</MenuButton>
				)}
				{role && (
					<MenuButton href='/trocar-turma'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='36'
							height='36'
							viewBox='0 0 36 36'
							fill='none'>
							<g>
								<path
									d='M3 27H5.1C7.05 27 8.85 26.1 10.05 24.45L19.2 11.55C20.25 9.9 22.2 9 24.15 9H33'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
								<path
									d='M27 3L33 9L27 15'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
								<path
									d='M3 9H5.85C8.1 9 10.2 10.35 11.25 12.3'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
								<path
									d='M33 27H24.15C22.2 27 20.25 25.95 19.2 24.3L18.45 23.1'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
								<path
									d='M27 21L33 27L27 33'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</g>
						</svg>
					</MenuButton>
				)}
				{session.user.role[0] === 'subscriber' &&
					(projectName === 'sebrae_ingresse' || !projectName) && (
						<MenuButton href='/atendimento'>
							<svg
								width='30'
								height='30'
								viewBox='0 0 30 30'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'>
								<path
									d='M30 17.8125C30.0019 16.6477 29.6422 15.5111 28.9705 14.5595C28.2987 13.6079 27.3482 12.8883 26.25 12.5V11.5625C26.25 8.57881 25.0647 5.71733 22.955 3.60755C20.8452 1.49776 17.9837 0.3125 15 0.3125C12.0163 0.3125 9.15483 1.49776 7.04505 3.60755C4.93527 5.71733 3.75 8.57881 3.75 11.5625V12.5C2.65558 12.8891 1.70845 13.6075 1.03867 14.5564C0.36889 15.5054 0.00931168 16.6385 0.00931168 17.8C0.00931168 18.9615 0.36889 20.0946 1.03867 21.0436C1.70845 21.9925 2.65558 22.7109 3.75 23.1C4.03325 23.1985 4.33558 23.2294 4.6329 23.1903C4.93022 23.1513 5.21431 23.0433 5.4625 22.875C5.7035 22.6997 5.9002 22.4706 6.03693 22.2058C6.17366 21.941 6.24662 21.648 6.25 21.35V11.5625C6.25 9.24186 7.17187 7.01626 8.81282 5.37532C10.4538 3.73437 12.6794 2.8125 15 2.8125C17.3206 2.8125 19.5462 3.73437 21.1872 5.37532C22.8281 7.01626 23.75 9.24186 23.75 11.5625V21.35C23.7524 21.6101 23.8092 21.8669 23.9169 22.1037C24.0245 22.3405 24.1806 22.5522 24.375 22.725V23.4375C24.375 25.2875 22.7625 25.9375 21.25 25.9375H19.025C18.8053 25.5569 18.4891 25.241 18.1083 25.0215C17.7275 24.8021 17.2956 24.6869 16.8562 24.6875C16.4167 24.6882 15.9852 24.8047 15.6051 25.0253C15.225 25.2459 14.9097 25.5628 14.6911 25.9441C14.4725 26.3253 14.3583 26.7575 14.36 27.197C14.3616 27.6364 14.4791 28.0677 14.7006 28.4473C14.922 28.8269 15.2396 29.1414 15.6214 29.3592C16.0031 29.5769 16.4355 29.6901 16.875 29.6875C17.3113 29.6849 17.7393 29.5681 18.1165 29.3488C18.4936 29.1295 18.8069 28.8153 19.025 28.4375H21.25C24.5625 28.4375 26.875 26.3875 26.875 23.4375V22.8375C27.8113 22.373 28.5997 21.6567 29.1517 20.7691C29.7037 19.8815 29.9974 18.8577 30 17.8125Z'
									fill='#222325'
								/>
							</svg>
						</MenuButton>
					)}
			</div>
			<div className='flex flex-col items-center'>
				<StyledButton onClick={(e) => logOut(e)}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='36'
						height='36'
						viewBox='0 0 36 36'
						fill='none'>
						<path d='M18 33C9.7155 33 3 26.2845 3 18C3 9.7155 9.7155 3 18 3C20.329 2.99825 22.6263 3.53966 24.7094 4.58122C26.7925 5.62277 28.604 7.13577 30 9H25.935C24.2028 7.47264 22.0668 6.47754 19.7831 6.1341C17.4994 5.79067 15.1651 6.11349 13.0603 7.06382C10.9556 8.01416 9.16972 9.55165 7.9171 11.4918C6.66449 13.4319 5.9983 15.6923 5.9985 18.0017C5.99869 20.311 6.66525 22.5713 7.91819 24.5112C9.17113 26.4512 10.9572 27.9883 13.0622 28.9383C15.1671 29.8883 17.5014 30.2107 19.785 29.8669C22.0687 29.5231 24.2046 28.5277 25.9365 27H30.0015C28.6054 28.8644 26.7936 30.3776 24.7102 31.4191C22.6268 32.4607 20.3292 33.002 18 33ZM28.5 24V19.5H16.5V16.5H28.5V12L36 18L28.5 24Z' />
					</svg>
				</StyledButton>
			</div>
			<CoursesModal
				sidebar={sidebar}
				open={openCourses}
				onClose={() => handleCloseCourses()}
				session={session}
			/>
		</StyledSidebar>
	);
};
