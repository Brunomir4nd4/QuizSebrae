import type { FunctionComponent } from 'react';
import { Box, Modal } from '@mui/material';
import { ModalClose, ModalContent } from './CarouselModal.styles';
import CloseIcon from '@mui/icons-material/Close';
import { CarouselModalProps } from './CarouselModal.interface';

/**
 * **CarouselModal**
 *
 * Modal reutilizável para exibição de conteúdos em carrossel ou visualização ampliada.
 * Suporta cabeçalho, rodapé, largura customizável e fechamento via botão ou overlay.
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Renderiza modal com Material-UI Modal.
 * - Botão de fechar no canto superior direito.
 * - Largura customizável (padrão sem largura fixa).
 * - Z-index alto para sobrepor outros elementos.
 * - Suporte a conteúdo customizável.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <CarouselModal
 *   open={isOpen}
 *   onClose={handleClose}
 * >
 *   <p>Conteúdo do modal</p>
 * </CarouselModal>
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: CarouselModal.styles.tsx.
 *
 * ---
 *
 * @component
 */
export const CarouselModal: FunctionComponent<CarouselModalProps> = ({
	open,
	onClose,
	children,
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
				<ModalContent>
					<ModalClose onClick={onClose}>
						<CloseIcon />
					</ModalClose>
					<Box
						sx={{
							height: '100%',
							overflow: 'hidden',
						}}>
						{children}
					</Box>
				</ModalContent>
			</Modal>
		</>
	);
};
