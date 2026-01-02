export interface Props {
    /** Controla se o modal está aberto */
    open: boolean;
    /** Função chamada ao fechar o modal */
    onClose: () => void;
}