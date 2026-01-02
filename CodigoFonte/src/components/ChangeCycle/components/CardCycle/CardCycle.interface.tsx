/**
 * Props do componente CardCycle
 * 
 * Card para seleção de ciclo específico dentro de um curso.
 */
export interface Props {
	/**
	 * Rótulo do card (ex: "Ciclo")
	 */
	title: string;
	/**
	 * Número ou identificador do ciclo a ser exibido
	 */
	numberDay: string | number;
	/**
	 * ID único do ciclo
	 */
	id: string;
	/**
	 * Indica se este ciclo está atualmente selecionado/ativo
	 */
	active?: boolean;
	/**
	 * Indica se o ciclo está desabilitado/indisponível para seleção
	 */
	disabled?: boolean;
	/**
	 * Data da consultoria (não utilizado atualmente)
	 * @deprecated
	 */
	consultancyDate?: string | null;
	/**
	 * Função executada ao clicar no ciclo (quando não está desabilitado)
	 */
	setConsultancyDate: () => void;
	/**
	 * Indica se há notificações/alertas para este ciclo (exibe ponto vermelho)
	 */
	notify?: boolean;
}
