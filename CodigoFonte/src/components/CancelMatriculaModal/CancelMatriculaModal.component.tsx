'use client';

import React from 'react';
import { FunctionComponent, useState } from 'react';
import { Modal, Box } from '@mui/material';
import {
	ModalContainer,
	CloseButton,
	CancelButton,
	ConfirmButton,
	StudentCard,
	ButtonContainer,
} from './CancelMatriculaModal.styles';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';

interface CancelMatriculaModalProps {
	/** Título do modal */
	title: string;
	/** Subtítulo opcional do modal */
	subtitle?: string;
	/** Mensagem principal exibida no modal */
	message: string;
	/** Nome do estudante */
	studentName: string;
	/** Telefone do estudante (opcional) */
	studentPhone?: string;
	/** Controla se o modal está aberto */
	modalOpen?: boolean;
	/** Função chamada ao confirmar o cancelamento */
	onConfirm: () => void;
	/** Função chamada ao cancelar/fechar o modal */
	onCancel?: () => void;
	/** Indica se está processando a ação de confirmação */
	isSubmitting?: boolean;
}

/**
 * **CancelMatriculaModal**
 *
 * Modal de confirmação para cancelamento de matrícula de um estudante.
 * Exibe detalhes do estudante, mensagem de aviso irreversível e botões de ação.
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Exibe modal com Material-UI Modal.
 * - Mostra nome, telefone e CPF do estudante.
 * - Aviso de ação irreversível.
 * - Botões para confirmar ou revisar.
 * - Estados de loading durante submissão.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <CancelMatriculaModal
 *   title="cancelamento de matrícula"
 *   message="Ao confirmar, a matrícula será cancelada..."
 *   studentName="João Silva"
 *   studentPhone="11999999999"
 *   modalOpen={true}
 *   onConfirm={handleConfirm}
 *   onCancel={handleCancel}
 *   isSubmitting={false}
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: CancelMatriculaModal.styles.tsx.
 *
 * ---
 *
 * @component
 */
export const CancelMatriculaModal: FunctionComponent<
	CancelMatriculaModalProps
> = ({
	title,
	subtitle,
	message,
	studentName,
	studentPhone,
	modalOpen = true,
	onConfirm,
	onCancel,
	isSubmitting = false,
}) => {
	const [open, setOpen] = useState<boolean>(modalOpen);

	const handleClose = () => {
		setOpen(false);
		if (onCancel) {
			onCancel();
		}
	};

	const handleConfirm = () => {
		setOpen(false);
		onConfirm();
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby='cancel-matricula-modal'
			sx={{ zIndex: 9999 }}>
			<ModalContainer>
				<CloseButton onClick={handleClose}>
					<CloseIcon sx={{ fontSize: 34 }} />
				</CloseButton>

				<Box sx={{ textAlign: 'left', mb: 4, mt: 1 }}>
					<h2 className='text-3xl font-normal text-[rgb(28 29 35 / var(--tw-bg-opacity))] m-0 leading-tight'>
						<strong className='font-bold'>Confirmar</strong> {title}
					</h2>
				</Box>

				<Box className='mb-2'>
					{subtitle && (
						<p className='text-base text-[rgb(28 29 35 / var(--tw-bg-opacity))] m-0 mb-2 font-medium'>
							{subtitle}
						</p>
					)}
					<p
						className='text-[16px] text-[rgb(28 29 35 / var(--tw-bg-opacity))] m-0 mb-4 leading-[1.4]'
						dangerouslySetInnerHTML={{ __html: message }}
					/>
					<p className='text-sm'>
						⚠ ️ Atenção! Esta ação não pode ser desfeita e o participante
						perderá permanentemente o progresso no curso.
					</p>
				</Box>

				<StudentCard>
					<Box>
						<p className='text-base font-semibold text-[rgb(28 29 35 / var(--tw-bg-opacity))] m-0 flex items-center gap-1'>
							<Image src='/icon-user.svg' width='24' height={24} alt='' />
							{studentName} (323)
						</p>
						{studentPhone && (
							<>
								<p className='text-sm font-semibold text-[rgb(28 29 35 / var(--tw-bg-opacity))] mt-1 mb-0 flex items-center gap-1'>
									<svg
										width='24'
										height='24'
										viewBox='0 0 24 24'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'>
										<path
											d='M18.3779 5.62793C16.6846 3.93457 14.4346 3 12.0381 3C7.09863 3 3.07617 7.01953 3.07617 11.959C3.07324 13.5381 3.48633 15.0791 4.27148 16.4385L3 21.082L7.75195 19.834C9.05859 20.5488 10.5352 20.9238 12.0352 20.9268H12.0381C16.9775 20.9268 20.9971 16.9072 21 11.9648C21 9.57129 20.0684 7.32129 18.3779 5.62793ZM12.0381 19.4121H12.0352C10.6992 19.4121 9.38672 19.0518 8.24414 18.375L7.97168 18.2139L5.15039 18.9521L5.90332 16.2041L5.72754 15.9229C4.98047 14.7363 4.58789 13.3652 4.58789 11.959C4.58789 7.85449 7.93066 4.51465 12.041 4.51465C14.0303 4.51465 15.8994 5.29102 17.3057 6.69727C18.7119 8.10645 19.4854 9.97559 19.4854 11.9648C19.4854 16.0723 16.1426 19.4121 12.0381 19.4121ZM16.1221 13.834C15.8994 13.7227 14.7979 13.1807 14.5928 13.1074C14.3877 13.0312 14.2383 12.9961 14.0889 13.2188C13.9395 13.4443 13.5117 13.9482 13.3799 14.0977C13.251 14.2441 13.1191 14.2646 12.8965 14.1533C12.6709 14.042 11.9502 13.8047 11.0947 13.04C10.4297 12.4482 9.97852 11.7129 9.84961 11.4902C9.71777 11.2646 9.83496 11.1445 9.94629 11.0332C10.0488 10.9336 10.1719 10.7725 10.2832 10.6406C10.3945 10.5117 10.4326 10.418 10.5088 10.2686C10.582 10.1191 10.5439 9.9873 10.4883 9.87598C10.4326 9.76465 9.98438 8.66016 9.79688 8.21191C9.61523 7.77539 9.43066 7.83691 9.29297 7.82812C9.16406 7.82227 9.01465 7.82227 8.86524 7.82227C8.71582 7.82227 8.47266 7.87793 8.26758 8.10352C8.0625 8.32617 7.48535 8.86816 7.48535 9.96973C7.48535 11.0713 8.28809 12.1377 8.39941 12.2871C8.51074 12.4336 9.97852 14.6953 12.2256 15.665C12.7588 15.8965 13.1748 16.0342 13.5 16.1367C14.0361 16.3066 14.5254 16.2832 14.9121 16.2275C15.3428 16.1631 16.2363 15.6855 16.4238 15.1611C16.6084 14.6396 16.6084 14.1914 16.5527 14.0977C16.4971 14.0039 16.3477 13.9482 16.1221 13.834Z'
											fill='rgb(28 29 35 / var(--tw-bg-opacity))'
										/>
									</svg>
									{studentPhone.replace(
										/^55(\d{2})(\d{1})(\d{4})(\d{4})$/,
										'$1 $2 $3-$4',
									)}
								</p>
							</>
						)}
					</Box>
				</StudentCard>

				<ButtonContainer className='flex justify-between mt-8 pt-2'>
					<CancelButton onClick={handleClose} disabled={isSubmitting}>
						Revisar
					</CancelButton>
					<ConfirmButton
						type='button'
						onClick={handleConfirm}
						disabled={isSubmitting}
						className='bt-dhedalos transition-all cursor-pointer'>
						<span>
							<Image src='/send.svg' width='22' height='22' alt='' />
						</span>
						<h3>
							{isSubmitting ? 'Processando...' : 'Confirmar cancelamento'}
						</h3>
					</ConfirmButton>
				</ButtonContainer>
			</ModalContainer>
		</Modal>
	);
};
