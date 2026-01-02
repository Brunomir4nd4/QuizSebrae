import { UrlObject } from 'url';

/**
 * Props do componente Card
 *
 * Card genérico de navegação para acesso a diferentes seções da aplicação.
 */
export interface Props {
	/**
	 * Título principal do card (ex: "Agenda", "Mentorias")
	 */
	title: string;
	/**
	 * Texto do botão de ação (ex: "administrar", "agendar")
	 */
	text: string;
	/**
	 * URL de destino ao clicar no card
	 */
	href: string | UrlObject;
	/**
	 * URL do ícone/imagem exibido no card
	 */
	image: string;
	/**
	 * Define onde o link será aberto ('_self' ou '_blank')
	 */
	target?: string;
	/**
	 * Define se terá um informativo de notificação ou não
	 */
	notify?: boolean;
}
