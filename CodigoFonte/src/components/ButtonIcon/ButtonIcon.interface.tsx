/**
 * Props do componente ButtonIcon
 * 
 * Botão com ícone e texto, utilizado para ações principais da interface.
 * Suporta diferentes tamanhos, estados desabilitados e efeitos de hover.
 */
export interface Props {
	/**
	 * URL do ícone a ser exibido no botão
	 */
	icon: string;
	/**
	 * Texto exibido no botão
	 */
	text: string;
	/**
	 * Função executada ao clicar no botão
	 */
	onClick: () => void;
	/**
	 * Define se o botão está desabilitado (não clicável)
	 */
	disabled?: boolean;
	/**
	 * Tamanho do botão: 'large' para largura completa, ou padrão para tamanho automático
	 */
	size?: string;
	/**
	 * Tamanho customizado do ícone (sobrescreve o tamanho padrão baseado em 'size')
	 */
	iconSize?: string;
	/**
	 * Ativa borda ao passar o mouse sobre o botão
	 */
	hoverBorder?: boolean;
	/**
	 * Adapta o layout para dispositivos móveis (oculta ícone e ajusta tamanho em telas menores)
	 */
	mobile?: boolean;
}
