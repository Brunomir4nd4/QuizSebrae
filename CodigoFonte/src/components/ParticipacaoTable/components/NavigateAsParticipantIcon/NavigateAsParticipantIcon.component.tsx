'use client';

import { FunctionComponent, useState } from 'react';
import { signOut, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { NavigateAsParticipantIconWrapper } from './NavigateAsParticipantIcon.styles';
import { BootstrapTooltip } from '../BootstrapTooltip';
import { Props } from './NavigateAsParticipantIcon.interface';
import { getStudentCpf } from '@/app/services/external/ClassService';
import { sendParticipantModeLogBff } from '@/app/services/bff/ParticipantModeLogs';
import { LoaderOverlay } from '@/components/Loader';

/**
 * **NavigateAsParticipantIcon**
 *
 * ### 🧩 Funcionalidade
 * - Permite supervisor navegar como participante específico.
 * - Realiza login automático, armazena contexto e logs.
 * - Mostra LoaderOverlay durante transição.
 * - Redireciona para home após sucesso.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <NavigateAsParticipantIcon studentId={123} showLabel={true} />
 * ```
 *
 * ### 🎨 Estilização
 * - NavigateAsParticipantIconWrapper com hover.
 * - SVG inline de seta.
 * - Tooltip "Navegar como esse participante".
 *
 * @component
 */
export const NavigateAsParticipantIcon: FunctionComponent<Props> = ({
	studentId,
	showLabel = false,
}) => {
	const router = useRouter();
	const { data: session } = useSession();
	const [isRedirecting, setIsRedirecting] = useState(false);

	const enterParticipantMode = async () => {
		if (!session?.user) return;

		setIsRedirecting(true);

		try {
			const cpf: string = await getStudentCpf(studentId, session.user.token);

			await signOut({ redirect: false });

			const result = await signIn('credentials', {
				redirect: false,
				username: cpf.replace(/\D/g, ''),
				password: cpf.replace(/\D/g, ''),
			});

			if (result?.error) {
				console.error(result.error);
				setIsRedirecting(false);
				return;
			}

			localStorage.setItem('isParticipantMode', 'true');
			localStorage.setItem(
				'participantModeStorage',
				JSON.stringify({
					id: session.user.id,
					displayName: session.user.user_display_name,
					cpf: session.user.user_nicename,
					role: session.user.role,
					participantId: studentId,
					participantCpf: cpf,
				}),
			);
			localStorage.setItem('originalPage', window.location.pathname);

			await sendParticipantModeLogBff(
				session.user.id.toString(),
				session.user.cpf,
				studentId.toString(),
				cpf,
				`Entrou no modo participante`,
			);

			router.push('/home');
			router.refresh();
		} catch (error) {
			console.error('Erro no processo de entrar no modo participante:', error);
			setIsRedirecting(false);
		}
	};

	return (
		<div className='relative'>
			{isRedirecting && <LoaderOverlay />}

			<NavigateAsParticipantIconWrapper
				className='transition duration-100 ease-in'
				onClick={enterParticipantMode}
				showLabel={showLabel}>
				<BootstrapTooltip
					title={'Navegar como esse participante'}
					placement='right'
					arrow>
					<div className='flex items-center justify-center gap-1'>
						<svg
							className='w-4 h-4 md:w-5 md:h-5 shrink-0'
							viewBox='0 0 16 16'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<g clipPath='url(#clip0_4913_781)'>
								<path
									d='M8.10967 0.160733C3.70087 0.101166 0.101568 3.70047 0.161102 8.1093C0.219902 12.3376 3.66277 15.7804 7.8911 15.8393C12.3007 15.8996 15.8992 12.3003 15.8389 7.89143C15.7808 3.6624 12.338 0.219533 8.10967 0.160733ZM11.5808 4.95627L8.4813 11.9859C8.30073 12.3805 7.69813 12.2498 7.69813 11.8141V8.45223C7.69813 8.41223 7.6822 8.37393 7.65393 8.34563C7.62567 8.31737 7.58733 8.3015 7.54737 8.3015H4.1863C3.7521 8.3015 3.62093 7.70337 4.01403 7.52247L11.0441 4.41957C11.1192 4.38483 11.2032 4.37407 11.2846 4.38857C11.3661 4.40307 11.4411 4.44223 11.4996 4.50073C11.5581 4.55923 11.5973 4.63427 11.6118 4.71573C11.6263 4.79717 11.6155 4.88113 11.5808 4.95627Z'
									fill='#070D26'
								/>
							</g>
							<defs>
								<clipPath id='clip0_4913_781'>
									<rect width='16' height='16' fill='white' />
								</clipPath>
							</defs>
						</svg>
						<span
							className={`text-sm leading-none ${showLabel ? '' : 'md:hidden'}`}>
							Modo Participante
						</span>
					</div>
				</BootstrapTooltip>
			</NavigateAsParticipantIconWrapper>
		</div>
	);
};
