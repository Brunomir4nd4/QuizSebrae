'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Session } from 'next-auth';
import { ClientLayout } from '@/components/ClientLayout';
import { NotifyModal } from '@/components/NotifyModal';
import { ClassResponse } from '@/types/IClass';

interface QuizLayoutWrapperProps {
	children: ReactNode;
	session: Session;
	role: boolean;
	classData: ClassResponse;
	notifyError: ReactNode;
}

/**
 * Wrapper que verifica se é uma rota de quiz e permite acesso mesmo sem turma
 */
export function QuizLayoutWrapper({
	children,
	session,
	role,
	classData,
	notifyError,
}: QuizLayoutWrapperProps) {
	const pathname = usePathname();
	const isQuizRoute = pathname?.includes('/quiz');

	// Permite acesso ao quiz mesmo sem turma
	if (isQuizRoute) {
		// Para quiz, usa dados vazios se não houver turma
		const emptyClassData = classData?.status === 200 ? classData.data : [];
		return (
			<ClientLayout session={session} role={role} classData={emptyClassData}>
				{children}
			</ClientLayout>
		);
	}

	// Para outras rotas, verifica turma normalmente
	if (classData && classData.status === 200) {
		return (
			<ClientLayout session={session} role={role} classData={classData.data}>
				{children}
			</ClientLayout>
		);
	}

	if (notifyError) {
		return <>{notifyError}</>;
	}

	return (
		<NotifyModal
			title={''}
			highlight='Atenção'
			message={
				'Ocorreu um erro ao obter as informações. Faça o login novamente.'
			}
			logout={true}
		/>
	);
}

