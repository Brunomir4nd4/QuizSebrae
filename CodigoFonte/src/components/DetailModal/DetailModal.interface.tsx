export interface Props {
	/**
	 * Controla se o modal está aberto ou fechado.
	 */
	open: boolean;
	/**
	 * Função chamada quando o modal é fechado pelo usuário.
	 */
	onClose: () => void;
	/**
	 * Título exibido no cabeçalho do modal.
	 */
	title: string;
	/**
	 * Nome do participante da mentoria.
	 */
	name: string;
	/**
	 * Horário de início da mentoria.
	 */
	start: string;
	/**
	 * Horário de término da mentoria.
	 */
	end: string;
	/**
	 * Duração da mentoria em minutos.
	 */
	interval: string;
	/**
	 * Assunto principal da mentoria.
	 */
	subject: string;
	/**
	 * Redes sociais relacionadas à mentoria.
	 */
	social: string;
	/**
	 * Descrição ou questões específicas da mentoria.
	 */
	description: string;
	/**
	 * ID da reserva (opcional).
	 */
	booking_id?: string;
	/**
	 * E-mail do cliente (opcional).
	 */
	client_email?: string;
	/**
	 * CPF do cliente.
	 */
	client_cpf: string;
	/**
	 * Token de autenticação.
	 */
	token: string;
	/**
	 * Nome da turma (opcional).
	 */
	className?: string;
	/**
	 * Função do usuário (opcional).
	 */
	role?: string;
}
