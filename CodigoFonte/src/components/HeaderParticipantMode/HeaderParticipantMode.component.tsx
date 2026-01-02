'use client';

import { useState, type FunctionComponent } from 'react';
import { Button } from './HeaderParticipantMode.styles';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { sendParticipantModeLogBff } from '@/app/services/bff/ParticipantModeLogs';
import { LoaderOverlay } from '../Loader';

/**
 * **HeaderParticipantMode**
 *
 * ### 🧩 Funcionalidade
 * - Banner fixo indicando modo participante ativo.
 * - Permite sair do modo, fazendo logout/login automático do supervisor.
 * - Registra logs da ação.
 * - Mostra nome do supervisor e botão para encerrar.
 * - Redireciona para página original após saída.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <HeaderParticipantMode />
 * ```
 *
 * ### 🎨 Estilização
 * - Banner fixo no topo com fundo laranja.
 * - Layout flex responsivo.
 * - SVG para ícone.
 * - Botão customizado para sair.
 *
 * @component
 */
export const HeaderParticipantMode: FunctionComponent = () => {
	const router = useRouter();
	const [isRedirecting, setIsRedirecting] = useState(false);
	const getParticipantModeStorage = JSON.parse(
		localStorage.getItem('participantModeStorage') || '{}',
	);

	const exitParticipantMode = async (supervisorCpf: string) => {
		const originalPage = localStorage.getItem('originalPage') || '/home';

		setIsRedirecting(true);

		await signOut({ redirect: false });

		const result = await signIn('credentials', {
			redirect: false,
			username: supervisorCpf.replace(/\D/g, ''),
			password: supervisorCpf.replace(/\D/g, ''),
		});

		if (result?.error) {
			console.error(result.error);
			return;
		}

		const isParticipantMode =
			localStorage.getItem('isParticipantMode') === 'true';
		if (!isParticipantMode) return;
		try {
			await sendParticipantModeLogBff(
				getParticipantModeStorage.id,
				getParticipantModeStorage.cpf,
				getParticipantModeStorage.participantId,
				getParticipantModeStorage.participantCpf,
				`Saiu do modo participante`,
			);
		} catch (error) {
			setIsRedirecting(false);
			console.error('Erro ao enviar log:', error);
		}

		localStorage.removeItem('isParticipantMode');
		localStorage.removeItem('participantModeStorage');
		localStorage.removeItem('originalPage');

		router.push(originalPage);
		router.refresh();
	};
	return (
		<>
			{isRedirecting && <LoaderOverlay />}

			<div className='fixed flex h-[83px] md:h-[93px] px-[20px] md:px-[56px] py-[10px] md:py-[20px] justify-between items-center bg-[#F79707] top-0 left-0 w-full z-[999]'>
				<div className='flex items-center gap-[8px] md:gap-[24px]'>
					<span>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='36'
							height='36'
							viewBox='0 0 36 36'
							fill='none'>
							<g clip-path='url(#clip0_4702_498)'>
								<path
									d='M13.3305 10.122C13.086 10.122 12.825 10.146 12.5715 10.2075C12.3135 10.269 11.6985 10.455 11.3145 11.0505L11.2935 11.0805L10.383 12.6555C9.92252 12.963 9.58202 13.3455 9.34352 13.731L9.32252 13.761L5.46452 20.736C5.31026 20.973 5.17292 21.2206 5.05352 21.477L5.04452 21.492C4.6838 22.2788 4.49803 23.1345 4.50002 24C4.50002 25.5913 5.13216 27.1174 6.25737 28.2426C7.38259 29.3679 8.90872 30 10.5 30C12.0913 30 13.6174 29.3679 14.7427 28.2426C15.8679 27.1174 16.5 25.5913 16.5 24V22.5H19.5V24C19.5002 24.8967 19.7013 25.782 20.0886 26.5907C20.476 27.3995 21.0396 28.1111 21.7382 28.6733C22.4368 29.2355 23.2525 29.634 24.1254 29.8395C24.9983 30.0449 25.9061 30.0521 26.7821 29.8605C27.6581 29.6689 28.48 29.2833 29.1874 28.7323C29.8948 28.1812 30.4697 27.4785 30.8697 26.676C31.2698 25.8735 31.4849 24.9915 31.4993 24.0949C31.5136 23.1983 31.3268 22.3099 30.9525 21.495L30.9465 21.477C30.8271 21.2206 30.6898 20.973 30.5355 20.736L26.6775 13.761L26.6565 13.731C26.3913 13.3024 26.0367 12.9361 25.617 12.657L24.7065 11.0805L24.6855 11.0505C24.3015 10.455 23.685 10.2705 23.4285 10.2075C23.1022 10.1322 22.7665 10.1064 22.4325 10.131C22.0817 10.1504 21.7367 10.2296 21.4125 10.365C21.1365 10.4865 20.4555 10.8555 20.2815 11.6985L20.271 11.754L20.061 13.404C19.731 13.8285 19.5 14.364 19.5 15V16.5H16.5V15C16.5 14.364 16.269 13.8285 15.9405 13.404L15.7305 11.754L15.7185 11.6985C15.5445 10.8555 14.8635 10.4865 14.5875 10.365C14.2633 10.2296 13.9183 10.1504 13.5675 10.131C13.4886 10.1254 13.4096 10.1224 13.3305 10.122ZM10.5 21C11.1453 21.0003 11.7733 21.2088 12.2908 21.5943C12.8083 21.9799 13.1877 22.522 13.3726 23.1403C13.5575 23.7585 13.5382 24.42 13.3174 25.0263C13.0966 25.6327 12.6862 26.1518 12.1471 26.5064C11.6079 26.861 10.9688 27.0324 10.3246 26.995C9.68032 26.9576 9.06532 26.7134 8.57083 26.2988C8.07635 25.8842 7.72874 25.3211 7.57962 24.6933C7.43049 24.0654 7.48779 23.4062 7.74302 22.8135L8.02802 22.3005C8.56802 21.516 9.47402 21 10.5 21ZM25.5 21C26.526 21 27.432 21.516 27.972 22.3005L28.257 22.8135C28.5122 23.4062 28.5695 24.0654 28.4204 24.6933C28.2713 25.3211 27.9237 25.8842 27.4292 26.2988C26.9347 26.7134 26.3197 26.9576 25.6755 26.995C25.0312 27.0324 24.3921 26.861 23.853 26.5064C23.3138 26.1518 22.9034 25.6327 22.6826 25.0263C22.4619 24.42 22.4425 23.7585 22.6274 23.1403C22.8124 22.522 23.1917 21.9799 23.7092 21.5943C24.2267 21.2088 24.8547 21.0003 25.5 21Z'
									fill='black'
								/>
							</g>
							<defs>
								<clipPath id='clip0_4702_498'>
									<rect width='36' height='36' fill='white' />
								</clipPath>
							</defs>
						</svg>
					</span>
					<div className='flex flex-col md:flex-row md:items-center gap-[4px] md:gap-[24px]'>
						<p className='font-bold text-sm sm:text-base md:text-xl text-[#292B33]'>
							Modo Participante Ativo
						</p>
						<p className='text-sm sm:text-base md:text-xl text-[#292B33]'>
							Supervisor: {getParticipantModeStorage.displayName}
						</p>
					</div>
				</div>
				<div className='flex justify-end'>
					<Button
						type='submit'
						onClick={() => exitParticipantMode(getParticipantModeStorage.cpf)}
						className='bt-dhedalos transition-all cursor-pointer'>
						Sair do modo participante
					</Button>
				</div>
			</div>
		</>
	);
};
