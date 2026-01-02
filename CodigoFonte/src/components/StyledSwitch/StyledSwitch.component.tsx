'use client';
import { FunctionComponent, useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { setParticipacaoByIdBff } from '@/app/services/bff/ClassService';
import { useSession } from 'next-auth/react';
import { BootstrapTooltip } from '../ParticipacaoTable/components';
import { Typography } from '@mui/material';

function classNames(...classes: (string | undefined | null | boolean)[]) {
	return classes.filter(Boolean).join(' ');
}

interface StyledSwitchProps {
	/** Estado ativo do switch (ligado/desligado) */
	active: boolean;
	/** ID da classe */
	classId: string | number;
	/** ID do estudante */
	studentId: string | number;
	/** ID da atividade */
	activityId: string;
	/** Se a edição é permitida */
	isEditingAllowed?: boolean;
	/** Se a inscrição foi cancelada */
	isEnrollCanceled?: boolean;
}

/**
 * **StyledSwitch**
 *
 * ### 🧩 Funcionalidade
 * - Switch estilizado para marcar presença em atividades.
 * - Usa Headless UI Switch com tooltip.
 * - Alterna estado, chama API para atualizar.
 * - Desabilitado se edição não permitida ou inscrição cancelada.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <StyledSwitch
 *   active={true}
 *   classId="123"
 *   studentId="456"
 *   activityId="act1"
 *   isEditingAllowed={true}
 *   isEnrollCanceled={false}
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - Switch com classes Tailwind.
 * - Translate-x para toggle.
 * - Ícones check/cross.
 * - BootstrapTooltip.
 *
 * @component
 */
export const StyledSwitch: FunctionComponent<StyledSwitchProps> = ({
	active,
	classId,
	studentId,
	activityId,
	isEditingAllowed,
	isEnrollCanceled,
}) => {
	const [enabled, setEnabled] = useState<boolean>(active);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setEnabled(active);
	}, [active]);

	const session = useSession();

	const handleChange = () => {
		if (!session.data?.user.token || isLoading) return;

		setIsLoading(true);

		setParticipacaoByIdBff(classId, studentId, activityId)
			.then((res) => {
				if (res.message === 'Presença registrada com sucesso') {
					setEnabled(true);
				} else if (res.message === 'Presença removida com sucesso') {
					setEnabled(false);
				}
			})
			.catch((error) => {
				console.error(error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<BootstrapTooltip
			title={
				<Typography color='inherit'>
					{isEditingAllowed
						? `Presente?`
						: isEnrollCanceled
							? `Inscrição cancelada`
							: `Fora do período permitido para gerenciamento.`}
				</Typography>
			}
			arrow
			placement='right'>
			<span>
				<Switch
					checked={enabled}
					onChange={handleChange}
					disabled={isLoading || !isEditingAllowed}
					className={classNames(
						enabled
							? 'bg-black-light border-black-light'
							: 'bg-transparent border-[#6E707A]',
						'relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-black-light focus:ring-offset-2',
						(isLoading || !isEditingAllowed) && 'opacity-50 cursor-not-allowed',
					)}>
					<span className='sr-only'>Use setting</span>
					<span
						className={classNames(
							enabled
								? 'translate-x-6 bg-green-light'
								: 'translate-x-0 bg-[#6E707A]',
							'pointer-events-none relative inline-block mt-[1px] ml-[1px] h-7 w-7 transform rounded-full shadow ring-0 transition duration-200 ease-in-out',
						)}>
						<span
							className={classNames(
								enabled
									? 'opacity-0 duration-100 ease-out'
									: 'opacity-100 duration-200 ease-in',
								'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
							)}
							aria-hidden='true'>
							<svg
								className='h-5 w-5 text-white'
								fill='none'
								viewBox='0 0 12 12'>
								<path
									d='M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2'
									stroke='currentColor'
									strokeWidth={1}
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
						</span>
						<span
							className={classNames(
								enabled
									? 'opacity-100 duration-200 ease-in'
									: 'opacity-0 duration-100 ease-out',
								'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
							)}
							aria-hidden='true'>
							<svg
								className='h-5 w-5 text-black-light'
								fill='currentColor'
								viewBox='0 0 12 12'>
								<path d='M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z' />
							</svg>
						</span>
					</span>
				</Switch>
			</span>
		</BootstrapTooltip>
	);
};
