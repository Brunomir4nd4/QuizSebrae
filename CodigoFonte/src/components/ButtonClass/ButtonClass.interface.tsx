/**
 * Props do componente ButtonClass
 * 
 * Botão específico para navegação e acesso a turmas (classes).
 * Exibe o nome da turma com um ícone de seta e opcionalmente um indicador de notificação.
 */
export interface Props {
	/**
	 * Nome ou título da turma a ser exibido no botão
	 */
	text: string;
	/**
	 * ID único da turma, usado para gerar o atributo 'id' do botão (formato: class_{classId})
	 */
	classId?: string;
	/**
	 * Função executada ao clicar no botão
	 */
	onClick?: () => void;
	/**
	 * Define se deve exibir um ponto de notificação no canto superior esquerdo do botão
	 */
	notify?: boolean;
}
