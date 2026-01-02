import { Divider } from '@mui/material';
import { ModalButton } from '../AppointmentModal/AppointmentModal.styles';
import { BaseModal } from '../BaseModal';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface ConfirmDeleteSubmissionModalInterface {
	/** Controla se o modal está aberto */
	open: boolean;
	/** Função chamada ao fechar o modal */
	handleClose: () => void;
	/** Função chamada para liberar o reenvio da atividade */
	deleteSubmission: () => void;
}

/**
 * Componente ConfirmDeleteSubmissionModal
 *
 * Modal de confirmação para liberar o reenvio de uma atividade. Exibe mensagem de alerta e opções para cancelar ou confirmar a liberação, informando que a ação é irreversível.
 */
export default function ConfirmDeleteSubmissionModal({
	open,
	handleClose,
	deleteSubmission,
}: ConfirmDeleteSubmissionModalInterface) {
	return (
		<>
			<BaseModal
				width='700px'
				open={open}
				onClose={handleClose}
				header={
					<h3 className='text-black-light text-3xl sm:text-32 lg:text-40 font-light mb-6 sm:text-center'>
						<strong className='font-bold'>Liberar reenvio</strong> da atividade?
					</h3>
				}
				footer={
					<>
						<ModalButton onClick={handleClose} className='!m-0'>
							<div className='w-[32px] min-w-[32px] h-[32px] rounded-full bg-[#1EFF9D] flex items-center justify-center'>
								<ArrowBackIcon className='text-black' />
							</div>
							<span className='text-base font-bold text-[#1EFF9D]'>
								Não, voltar
							</span>
						</ModalButton>
						<ModalButton onClick={deleteSubmission} className='!m-0'>
							<div className='!bg-none !shadow-none !bg-[#FF755B] w-[32px] min-w-[32px] h-[32px] rounded-full flex items-center justify-center'>
								<img
									src='/icon-lixeira-preto.svg'
									alt='Liberar envio de nova atividade'
									width={20}
								/>
							</div>
							<span className='text-base font-bold text-[#FF755B]'>
								Sim, liberar
							</span>
						</ModalButton>
					</>
				}>
				<Divider />
				<div className='sm:text-center mt-6 mb-6'>
					<p className='text-black-light text-lg md:text-2xl sm:text-base'>
						Tem certeza que deseja liberar o reenvio da atividade?
						<br />O participante precisará reenviá-la, e essa ação não poderá
						ser desfeita.
					</p>
				</div>
				<Divider />
			</BaseModal>
		</>
	);
}
