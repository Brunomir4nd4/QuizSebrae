import { ReactNode } from 'react';
export interface BaseModalProps {
	/**
	 * Controla se o modal está aberto ou fechado.
	 */
	open: boolean;
	/**
	 * Função chamada quando o modal é fechado pelo usuário.
	 */
	onClose: () => void;
	/**
	 * Conteúdo principal exibido dentro do modal.
	 */
	children: ReactNode;
	/**
	 * Conteúdo opcional exibido no rodapé do modal.
	 */
	footer?: ReactNode;
	/**
	 * Conteúdo opcional exibido no cabeçalho do modal.
	 */
	header?: ReactNode;
	/**
	 * Largura personalizada do modal (ex.: "500px").
	 */
	width?: string;
}
