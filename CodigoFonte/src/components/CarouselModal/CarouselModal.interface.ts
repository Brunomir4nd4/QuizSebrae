import { ReactNode } from 'react';

export interface CarouselModalProps {
	/** Controla se o modal está aberto */
	open: boolean;
	/** Função chamada ao fechar o modal */
	onClose: () => void;
	/** Conteúdo principal exibido dentro do modal */
	children: ReactNode;
	/** Rodapé opcional do modal */
	footer?: ReactNode;
	/** Cabeçalho opcional do modal */
	header?: ReactNode;
	/** Largura personalizada do modal (ex: '80%') */
	width?: string;
}
