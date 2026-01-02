'use client';
import { FunctionComponent, useState } from 'react';
import { useUserContext } from '@/app/providers/UserProvider';
import { Loader } from '../Loader';
import { NotifyModal } from '../NotifyModal';
import { useRouter } from 'next/navigation';
import { ActivitiesSlider } from '../ActivitiesSlider';
import { ParticipacaoTable } from '../ParticipacaoTable';
import useStudents from './hooks/useStudents';

interface Props {
	/**
	 * Token de autenticação do usuário.
	 */
	token: string;
	/**
	 * Tipo de participação (ex: facilitator, subscriber).
	 */
	type: string;
}

/**
 * **Participacao**
 *
 * ### 🧩 Funcionalidade
 * - Exibe lista de participantes da turma.
 * - Alterna entre tabela (desktop) e slider (mobile).
 * - Integra notificações e contexto do usuário.
 * - Usa hook useStudents para buscar dados.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <Participacao token="authToken" type="facilitator" />
 * ```
 *
 * ### 🎨 Estilização
 * - Layout responsivo com hidden md:block e block md:hidden.
 * - Animação de opacidade.
 * - Renderiza ParticipacaoTable ou ActivitiesSlider.
 *
 * @component
 */
export const Participacao: FunctionComponent<Props> = ({ token, type }) => {
	const { classId, classesData, themeSettings } = useUserContext();
	const [animate, setAnimate] = useState(false);
	const router = useRouter();

	const { students, loading, refetch } = useStudents(classId, token);

	if (!classesData || !classId || loading) {
		return <Loader />;
	}
	const whatsAppMessage = themeSettings?.whatsapp_message_to_facilitator;

	if (students && students.length == 0) {
		return (
			<NotifyModal
				title={'Atenção'}
				message={'Não há participantes para essa turma.'}
				logout={false}
				callback={() => router.back()}
			/>
		);
	}

	if (students) {
		setTimeout(() => {
			setAnimate(true);
		}, 10);

		return (
			<>
				<div
					className={`hidden md:block transition-opacity duration-[500ms] ease-in-out w-full overflow-x-auto ${
						animate ? 'opacity-100' : 'opacity-0'
					}`}>
					<ParticipacaoTable
						classData={classesData[classId]}
						whatsAppMessage={whatsAppMessage || ''}
						students={students}
						type={type}
						onStudentUpdate={refetch}
					/>
				</div>
				<div
					className={`block md:hidden transition-opacity duration-[500ms] ease-in-out ${
						animate ? 'opacity-100' : 'opacity-0'
					}`}>
					<ActivitiesSlider
						classData={classesData[classId]}
						whatsAppMessage={whatsAppMessage || ''}
						students={students}
						type={type}
						onStudentUpdate={refetch}
					/>
				</div>
			</>
		);
	}

	return (
		<NotifyModal
			title={'Atenção'}
			message={'Ocorreu algum erro ao buscar os participantes.'}
			logout={false}
			callback={() => router.back()}
		/>
	);
};
