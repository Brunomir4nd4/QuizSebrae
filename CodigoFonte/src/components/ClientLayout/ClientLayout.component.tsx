'use client';

import { FunctionComponent, useEffect, useState } from 'react';
import { ClientLayoutProps } from './ClientLayout.interface';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { HeaderParticipantMode } from '@/components/HeaderParticipantMode';
import { ErrorBoundaryComponent } from '@/components/ErrorBoundaryComponent';
import UserProvider from '@/app/providers/UserProvider';
import { ClassResponse } from '@/types/IClass';
import { Sidebar as SidebarProps } from '@/types/ISidebar';
import { SubmissionsProvider } from '@/app/providers/SubmissionsProvider';
import { usePathname } from 'next/navigation';

/**
 * **ClientLayout**
 *
 * Layout principal da aplicação para usuários autenticados, incluindo navegação lateral, cabeçalho, controle de modo participante/facilitador e tratamento de erros.
 * Gerencia o contexto do usuário, exibe diferentes headers e sidebars conforme o modo, e encapsula o conteúdo principal da página.
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Controle de modo participante baseado em localStorage.
 * - Renderiza Sidebar, Header e ErrorBoundary.
 * - Suporte a modo participante com bordas amarelas.
 * - Mapeia dados da sidebar a partir de classData.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <ClientLayout
 *   session={userSession}
 *   role="student"
 *   classData={classes}
 * >
 *   <MainContent />
 * </ClientLayout>
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: (estilos inline no componente).
 *
 * ---
 *
 * @component
 */
export const ClientLayout: FunctionComponent<ClientLayoutProps> = ({
	children,
	session,
	role,
	classData,
}) => {
	const [isParticipantMode, setIsParticipantMode] = useState(false);
	const pathname = usePathname();
	
	const isAtendimentoRoute = pathname === '/atendimento';
	const isQuizRoute = pathname?.includes('/quiz');
	
	useEffect(() => {
		if (session?.user.role.includes('facilitator')) {
			localStorage.removeItem('isParticipantMode');
			setIsParticipantMode(false);
			return;
		}
		const flag = localStorage.getItem('isParticipantMode');
		setIsParticipantMode(flag === 'true');
	}, [session?.user?.id]);

	return (
		<UserProvider classData={classData}>
			<SubmissionsProvider>
				{isParticipantMode ? (
					<div className='border-0 border-[#F79707] relative md:border-r-8 md:border-l-8 height-full pt-[93px]'>
						<HeaderParticipantMode />
						<Sidebar
							session={session}
							role={role}
							sidebar={mapSidebarData(classData)}
							isParticipantMode={isParticipantMode}
						/>
						<ErrorBoundaryComponent />
						<Header
							session={session}
							title='Gerencie '
							highlight='suas atividades'
							cap='Boas vindas'
							showCap={!isAtendimentoRoute && !isQuizRoute}
							customMessage={
								isAtendimentoRoute ? (
									<><span className='font-bold'>Não fique</span> com dúvidas!</>
								) : isQuizRoute ? (
									<><span className='font-bold'>Quiz Encontro 03</span></>
								) : undefined
							}
							isTransparent={isAtendimentoRoute}
						/>
						{children}
						<div className='fixed bottom-0 left-0 w-full h-[8px] bg-[#F79707] z-[999] md:block hidden'></div>
					</div>
				) : (
					<>
						<Sidebar
							session={session}
							role={role}
							sidebar={mapSidebarData(classData)}
							isParticipantMode={isParticipantMode}
						/>
						<ErrorBoundaryComponent />
						<Header
							session={session}
							title='Gerencie '
							highlight='suas atividades'
							cap='Boas vindas'
							showCap={!isAtendimentoRoute && !isQuizRoute}
							customMessage={
								isAtendimentoRoute ? (
									<><span className='font-bold'>Não fique</span> com dúvidas!</>
								) : isQuizRoute ? (
									<><span className='font-bold'>Quiz Encontro 03</span></>
								) : undefined
							}
							isTransparent={isAtendimentoRoute}
						/>
						{children}
					</>
				)}
			</SubmissionsProvider>
		</UserProvider>
	);
};

const mapSidebarData = (classData: ClassResponse['data']): SidebarProps[] => {
	return classData
		?.map((item) => {
			return {
				course_name: item.courses.name,
				course_slug: item.courses.slug,
				course_id: item.courses.id,
				cycle_name: item.ciclos.name,
				cycle_slug: item.ciclos.slug,
				cycle_id: item.ciclos.id,
				class_name: item.title,
				class_slug: item.slug,
				class_id: item.id,
				logo: item.logo,
				logo_b: item?.logo_b,
			};
		})
		.filter(
			(course, index, self) =>
				index === self.findIndex((c) => c.course_id === course.course_id),
		);
};
