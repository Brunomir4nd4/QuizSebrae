export interface Props {
    /**
     * Controla se o modal está aberto ou fechado.
     */
    open: boolean;
    /**
     * Função chamada quando o modal é fechado pelo usuário.
     */
    onClose: () => void;
}