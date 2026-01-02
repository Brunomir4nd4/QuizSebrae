/**
 * Props do componente ButtonSimple
 * 
 * Botão simples com ícone e texto, geralmente usado para navegação entre páginas.
 * Renderiza como um link (Next.js Link) e suporta notificações visuais.
 */
export interface Props {
	/**
	 * URL do ícone a ser exibido no botão
	 */
	icon?: string;
	/**
	 * Texto exibido abaixo do ícone
	 */
	text: string;
	/**
	 * URL de destino do link
	 */
	href?: string;
	/**
	 * Define onde o link será aberto: '_self' (mesma aba) ou '_blank' (nova aba)
	 */
	target?: string;
	/**
	 * Índice único usado para gerar o atributo 'id' do link (formato: home_link_{index})
	 */
	index: number;
	/**
	 * Função executada ao clicar no botão
	 */
	onClick?: () => void;
	/**
	 * Define se deve exibir um ponto de notificação sobre o ícone
	 */
	notify?: boolean;
}
