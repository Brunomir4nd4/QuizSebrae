export interface Props {
	/** Caminho do ícone exibido no botão */
	icon: string;
	/** Texto exibido no botão */
	text: string;
	/** Função chamada ao clicar no botão */
	onClick: () => void;
}
