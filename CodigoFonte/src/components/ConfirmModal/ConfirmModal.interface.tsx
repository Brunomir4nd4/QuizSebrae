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
     * Dia da semana da mentoria confirmada.
     */
    week: string,
    /**
     * Horário de início da mentoria.
     */
    start: string,
    /**
     * Número do dia do mês.
     */
    number: string,
}