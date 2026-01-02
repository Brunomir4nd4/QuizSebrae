export interface Props {
	/**
	 * Mensagem pré-preenchida para envio no WhatsApp.
	 */
	whatsAppMessage: string;
	/**
	 * Número de telefone do destinatário.
	 */
	phone: string;
	/**
	 * Exibe o texto "Whatsapp" ao lado do ícone.
	 */
	showLabel?: boolean;
}
