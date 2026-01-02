'use client';

import * as React from 'react';
import type { FunctionComponent } from 'react';
import type { Props } from './HomeLinks.interface';
import { ButtonSimple } from '../ButtonSimple';
import { Grid } from '@mui/material';
import { sendLogBff } from '@/app/services/bff/LogsService';
import { useSubmissionNotifications } from '@/hooks/useSubmissionsNotification';
import { useSession } from 'next-auth/react';

/**
 * **HomeLinks**
 *
 * ### 🧩 Funcionalidade
 * - Exibe links úteis e materiais complementares baseados em userType e classData.
 * - Adiciona dinamicamente botões para grupos, atividades estratégicas.
 * - Registra logs de acesso aos links.
 * - Mostra notificações para facilitadores (submissões pendentes).
 * - Layout diferente para alunos e facilitadores.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <HomeLinks
 *   userType="subscriber"
 *   classData={classInfo}
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - ButtonSimple para cada link.
 * - Grid para alunos, divs marginadas para facilitadores.
 * - Ícones customizados.
 *
 * @component
 */
export const HomeLinks: FunctionComponent<Props> = ({
	userType,
	classData,
}) => {
	if (!classData) {
		return null;
	}

	let materials =
		classData.courses?.links_and_materials ??
		classData?.links_and_materials.facilitator;
	if (
		(classData.group_link || classData.courses.group_link) &&
		!materials.some((item) => item.link === classData.group_link)
	) {
		materials = [
			...materials,
			{
				icon: '/icon-whats-big.svg',
				link: classData.group_link
					? classData.group_link
					: classData.courses.group_link,
				title: 'Comunidade no whatsapp',
			},
		];
	}

	// if (
	// 	classData?.enable_strategic_activities &&
	// 	classData.strategic_activities_number > 0
	// ) {
	// 	if (userType === 'subscriber') {
	// 		materials = [
	// 			...materials,
	// 			{
	// 				icon: '/icon-activities.svg',
	// 				link: '/atividades-estrategicas',
	// 				title: 'Atividades estratégicas',
	// 				target: '_self',
	// 			},
	// 		];
	// 	} else {
	// 		const btn_gestao_de_atividades = {
	// 			icon: '/icon-activities.svg',
	// 			link: '/gestao-de-atividades',
	// 			title: 'Gestão de atividades',
	// 			target: '_self',
	// 			notify: false,
	// 		};

	// 		if (session?.user) {
	// 			btn_gestao_de_atividades.notify =
	// 				submissionNotifications?.[classData.ciclos.id]?.classes?.[
	// 					classData.id
	// 				].hasSubmittedActivities || false;
	// 		}

	// 		materials = [...materials, btn_gestao_de_atividades];
	// 	}
	// }

	const handleLinkClick = async (title: string) => {
		const enrollId = classData?.enroll_id;
		if (enrollId) {
			try {
				const res = await sendLogBff(enrollId, `Acessou: ${title}`);
				if (res.status !== 200) {
					console.error(
						'Erro ao enviar log:',
						res.error || 'Erro desconhecido',
					);
				}
			} catch (error) {
				console.error('Erro ao enviar log:', error);
			}
		}
	};

	return (
		<>
			{materials.length > 0
				? materials.map(({ link, title, icon, target, notify }, index) => (
						<React.Fragment key={`links_uteis_${title}`}>
							{userType !== 'subscriber' ? (
								<div className='mt-[24px] mb-6 md:mb-[30px]'>
									<ButtonSimple
										text={title}
										href={link}
										icon={icon}
										target={target ?? '_blank'}
										index={index}
										notify={notify}
									/>
								</div>
							) : (
								<Grid item xs={12} md={3}>
									<div className='mt-[0px] md:mt-[50px]'>
										<ButtonSimple
											text={title}
											href={link}
											icon={icon}
											target={target ?? '_blank'}
											index={index}
											onClick={() => handleLinkClick(title)}
										/>
									</div>
								</Grid>
							)}
						</React.Fragment>
					))
				: null}
		</>
	);
};
