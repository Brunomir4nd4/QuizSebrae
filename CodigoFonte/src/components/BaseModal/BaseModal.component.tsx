import type { FunctionComponent } from 'react';
import type { BaseModalProps } from './BaseModal.interface';
import { Box, Modal } from '@mui/material';
import { ModalClose, ModalContent } from './BaseModal.styles';
import CloseIcon from '@mui/icons-material/Close';

/**
 * **BaseModal**
 *
 * Componente modal básico construído com Material-UI que permite exibir conteúdo em uma janela sobreposta.
 * Suporta cabeçalho, rodapé e largura personalizável, com fechamento via botão ou clique fora.
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Renderiza modal com Material-UI Modal.
 * - Suporte a cabeçalho, corpo e rodapé customizáveis.
 * - Botão de fechar no canto superior direito.
 * - Largura configurável.
 * - Z-index alto para sobrepor outros elementos.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <BaseModal
 *   open={isOpen}
 *   onClose={handleClose}
 *   header={<h2>Título</h2>}
 *   footer={<button>OK</button>}
 *   width="600px"
 * >
 *   <p>Conteúdo do modal</p>
 * </BaseModal>
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: BaseModal.styles.tsx.
 *
 * ---
 *
 * @component
 */
export const BaseModal: FunctionComponent<BaseModalProps> = ({
	open,
	onClose,
	children,
	footer,
	header,
	width,
}) => {
	return (
		<>
			<Modal
				open={open}
				onClose={onClose}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
				style={{ transition: '2s ease-in-out all' }}
				sx={{ zIndex: '11111' }}>
				<ModalContent sx={{ width: width ? width : '850px' }}>
					<ModalClose id='modal-close-button' onClick={onClose}>
						<CloseIcon />
					</ModalClose>
					{header && <Box>{header}</Box>}
					<Box
						sx={{
							height: '100%',
							overflow: 'auto',
						}}>
						{children}
					</Box>
					{footer && (
						<Box
							sx={{
								position: 'relative',
								width: '100% !important',
								display: 'flex',
								justifyContent: 'center',
								gap: '8px',
								alignItems: 'center',
								mt: 4,
							}}>
							{footer}
						</Box>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};
