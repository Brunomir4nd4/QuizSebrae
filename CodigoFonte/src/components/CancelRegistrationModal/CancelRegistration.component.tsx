'use client';

import React, { FunctionComponent, useEffect, useState } from 'react';
import {
	Divider,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
} from '@mui/material';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { datadogRum } from '@datadog/browser-rum';
import { BaseModal } from '../BaseModal';
import { cancelEnroll } from '@/app/services/external/EnrollService';
import { ButtonIcon } from '../ButtonIcon';

interface CancelRegistrationModalProps {
	/** Controla se o modal está aberto */
	modalOpen?: boolean;
	/** Função chamada ao fechar o modal */
	callback?: () => void;
	/** Se verdadeiro, volta para a página anterior ao fechar */
	backOnClose?: boolean;
	/** Id da matrícula a ser cancelada */
	enrollId: string;
	/** Token de autenticação para o cancelamento */
	token: string;
}

/**
 * **CancelRegistrationModal**
 *
 * Modal para confirmação e execução do cancelamento de matrícula.
 * Inclui etapas de confirmação, seleção de motivo e logout automático após cancelamento.
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Etapas: confirmação inicial, seleção de motivo, sucesso.
 * - Countdown para logout automático.
 * - Validação de motivo obrigatório.
 * - Logout e limpeza de dados após cancelamento.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <CancelRegistrationModal
 *   modalOpen={true}
 *   callback={handleClose}
 *   backOnClose={false}
 *   enrollId="123"
 *   token="abc123"
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: CancelRegistrationModal.styles.tsx.
 *
 * ---
 *
 * @component
 */
export const CancelRegistrationModal: FunctionComponent<
	CancelRegistrationModalProps
> = ({ callback, backOnClose, modalOpen = true, enrollId, token }) => {
	const [open, setOpen] = useState<boolean>(modalOpen);
	const router = useRouter();
	const [confirmCancel, setConfirmCancel] = useState(false);
	const [loading, setLoading] = useState(false);
	const [confirmedCancel, setConfirmedCancel] = useState(false);

	const [reason, setReason] = useState<string>('');

	/**
	 * Executa o logout do usuário, limpando dados locais e redirecionando para a página inicial.
	 */
	const logOut = () => {
		localStorage.removeItem('class_id');
		localStorage.removeItem('class_id_expiration');
		localStorage.removeItem('course_id');

		signOut({ redirect: true })
			.then(() => {
				datadogRum.clearUser();
				router.replace('/');
			})
			.catch((error) => {
				console.error('Error during logout:', error);
			});
	};

	const handleClose = () => {
		setOpen(false);
		if (confirmedCancel) {
			logOut();
		}
		if (callback) {
			callback();
		}
		if (backOnClose) {
			router.back();
		}
	};

	/**
	 * Executa o cancelamento da matrícula via API e atualiza o estado.
	 */
	const cancel = async () => {
		setLoading(true);
		const response: any = await cancelEnroll(enrollId, reason, token);
		if (response?.status == 'cancelled') {
			setConfirmedCancel(true);
		}
		setLoading(false);
	};

	const [countdown, setCountdown] = useState<number>(30);

	useEffect(() => {
		if (!confirmedCancel) return;

		const interval = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					logOut();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [confirmedCancel]);
	return (
		<BaseModal
			open={open}
			onClose={handleClose}
			width='718px'
			header={
				<div
					className='flex items-center'
					style={{
						marginBottom: '29px',
						justifyContent: confirmedCancel ? 'center' : 'start',
					}}>
					{!confirmCancel && (
						<img
							src='/document-icon.svg'
							alt='Icone'
							className='mr-3'
							style={{ width: '44px', marginTop: '8px' }}
						/>
					)}
					<h3
						className='text-black-light text-3xl sm:text-32 lg:text-40 font-light sm:text-start'
						style={{
							fontFamily: "'__ampleAlt_76416d', '__ampleAlt_Fallback_76416d'",
						}}>
						{confirmedCancel ? (
							<>
								<strong className='font-bold'>Matrícula</strong> cancelada
							</>
						) : (
							<>
								{confirmCancel ? (
									<strong className='font-bold'>Confirmar cancelamento</strong>
								) : (
									<>
										<strong className='font-bold'>Cancelar</strong> matrícula
									</>
								)}
							</>
						)}
					</h3>
				</div>
			}
			footer={
				confirmedCancel ? (
					<>
						<div
							className='flex mt-4'
							style={{
								fontSize: '18px',
								fontFamily: "'__ampleAlt_76416d', '__ampleAlt_Fallback_76416d'",
								marginBottom: '32px',
								textAlign: 'center',
								justifyContent: 'center',
							}}>
							<span className='font-bold'>Esperamos ver você novamente!</span>
						</div>
					</>
				) : (
					<div className='flex w-full justify-center mt-3 mb-3'>
						<div className={`w-full flex justify-center`}>
							<ButtonIcon
								hoverBorder={true}
								icon='/icon-arrow-next.svg'
								text={
									confirmCancel
										? 'CONFIRMAR CANCELAMENTO'
										: 'CONTINUAR CANCELAMENTO'
								}
								onClick={() =>
									confirmCancel ? cancel() : setConfirmCancel(true)
								}
								size='medium'
								iconSize='50px'
								disabled={loading || reason == ''}
							/>
						</div>
					</div>
				)
			}>
			{confirmedCancel ? (
				<>
					<div
						className='flex mt-4'
						style={{
							fontSize: '18px',
							fontFamily: "'__ampleAlt_76416d', '__ampleAlt_Fallback_76416d'",
							marginBottom: '32px',
							textAlign: 'center',
							justifyContent: 'center',
						}}>
						<span>
							Você será deslogado em 00:00:{String(countdown).padStart(2, '0')}{' '}
							seg
						</span>
					</div>
					<div
						className='flex mt-4'
						style={{
							fontSize: '18px',
							fontFamily: "'__ampleAlt_76416d', '__ampleAlt_Fallback_76416d'",
							marginBottom: '32px',
							textAlign: 'center',
							justifyContent: 'center',
						}}>
						<div style={{ width: '80%' }}>
							<span>
								Sentimos muito pela{' '}
								<span className='font-bold'>
									sua decisão de cancelar a sua matrícula.
								</span>{' '}
								Lembramos que, para realizar um novo cadastro, será necessário
								aguardar o prazo de <span className='font-bold'> 1 ano.</span>
							</span>
						</div>
					</div>
				</>
			) : (
				<>
					{confirmCancel ? (
						<>
							<div
								className='flex w-3/4'
								style={{
									lineHeight: 1,
									fontFamily:
										"'__ampleAlt_76416d', '__ampleAlt_Fallback_76416d'",
								}}>
								<span className='font-bold' style={{ fontSize: '28px' }}>
									Deseja continuar com cancelamento sua matrícula?
								</span>
							</div>
							<div
								className='flex mt-4'
								style={{
									fontSize: '18px',
									fontFamily:
										"'__ampleAlt_76416d', '__ampleAlt_Fallback_76416d'",
									marginBottom: '32px',
								}}>
								<span>
									Ao cancelar a sua matrícula voluntariamente você entende que
									só poderá se cadastrar novamente neste curso em{' '}
									<span className='font-bold'>
										1 ano após o cancelamento. Essa ação não poderá ser
										desfeita.
									</span>
								</span>
							</div>
						</>
					) : (
						<>
							<div className='flex w-full mt-3'>
								<FormControl fullWidth>
									<InputLabel
										sx={{
											pointerEvents: 'none',
											transition: 'none !important',
											color: '#000000',
											fontSize: 18,
											'&.Mui-focused': {
												color: '#000000',
											},
											fontWeight: '700',
											'&.MuiInputLabel-shrink': {
												top: '1.2rem',
												fontSize: '18px !important',
												transform: 'translate(14px, -9px) scale(1)',
											},
											position: 'absolute',
											top: '-0.4rem',
										}}
										id='cancel-select-label'>
										Motivo do cancelamento
									</InputLabel>
									<Select
										labelId='cancel-select-label'
										id='cancel-select'
										value={reason}
										onFocus={() => { }}
										onBlur={() => { }}
										label={''}
										displayEmpty
										onChange={(e) => {
											setReason(e.target.value);
											console.log(e.target.value);
										}}
										inputProps={{ notched: false }}
										sx={{
											paddingTop: '1.2rem',
											borderRadius: '15px',
											textAlign: 'left',
											fontSize: 20,
											height: '80px',
											// Se quiser remover o contorno azul ao focar (opcional):
											'& .MuiOutlinedInput-notchedOutline': {
												border: '1px solid #000000',
											},
											'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
												border: '1px solid #000000',
											},
										}}
										MenuProps={{
											// garante que o Paper/Popover do menu tenha z-index bem alto
											sx: { zIndex: 99999 },
											PaperProps: { sx: { zIndex: 99999 } },

											// forçar origem de ancoragem para evitar menus "soltos"
											anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
											transformOrigin: { vertical: 'top', horizontal: 'left' },

											// se quiser forçar a renderização DENTRO do modal (testar se portal dá problema)
											// disablePortal: true,
											MenuListProps: {
												sx: {
													paddingTop: 0,
													paddingBottom: 0,
												},
											},
										}}>
										<MenuItem
											sx={{
												paddingTop: '1.06rem',
												paddingBottom: '1.06rem',
											}}
											value=''
											disabled>
											<span style={{ color: '#070D26' }}>
												Indique o motivo do cancelamento
											</span>
										</MenuItem>
										{[
											'Doença',
											'Conciliação de tempo',
											'A proposta do curso não agradou',
										].map((item) => (
											<MenuItem
												key={item}
												value={item}
												sx={{
													backgroundColor:
														reason === item ? '#222325' : 'transparent',
													color: reason === item ? '#1EFF9D' : 'inherit',
													'&:hover': {
														backgroundColor: '#222325',
														color: '#1EFF9D',
														'& .icon-option': { opacity: '1 !important' },
													},
													'&.Mui-selected': {
														backgroundColor: '#222325 !important',
													},
													paddingTop: '1.06rem',
													paddingBottom: '1.06rem',
												}}>
												<div className='flex w-full justify-between'>
													<div className='w-auto'>{item}</div>
													<div
														className='w-auto flex items-center icon-option'
														style={{ opacity: 0, transition: 'opacity 0.1s' }}>
														<svg
															width='20'
															height='10'
															viewBox='0 0 20 10'
															fill='none'
															xmlns='http://www.w3.org/2000/svg'>
															<path
																d='M15.25 1.25L19 5M19 5L15.25 8.75M19 5H1'
																stroke='#1EFF9D'
																strokeWidth='1.5'
																strokeLinecap='round'
																strokeLinejoin='round'
															/>
														</svg>
													</div>
												</div>
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</div>

							<div className='flex mt-6 mb-6'>
								<div
									className='w-full p-3'
									style={{
										borderRadius: '8px',
										background: '#fff',
										color: '#a40000',
										fontFamily:
											"'__ampleAlt_76416d', '__ampleAlt_Fallback_76416d'",
									}}>
									<div className='flex w-full m-0'>
										<div className='flex-none'>
											<img
												src='/warning-icon.svg'
												alt='Icone'
												className='mr-3'
												style={{ width: '24px', marginTop: '4px' }}
											/>
										</div>
										<div className='flex-1'>
											<div className='font-bold text-xl'>Atenção!</div>
										</div>
									</div>
									<div className='mt-2' style={{ fontSize: '18px' }}>
										Ao cancelar a sua matrícula voluntariamente você entende que
										só poderá se cadastrar novamente neste curso em{' '}
										<span className='font-bold'>
											1 ano após o cancelamento. Essa ação não poderá ser
											desfeita.
										</span>
									</div>
								</div>
							</div>
						</>
					)}
				</>
			)}
			<Divider />
		</BaseModal>
	);
};
