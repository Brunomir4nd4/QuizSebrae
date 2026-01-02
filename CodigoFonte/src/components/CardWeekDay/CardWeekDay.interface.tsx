export interface Props {
    /** Data disponível para seleção (formato ISO) */
    availableDate: string,
    /** Indica se o card está ativo/selecionado */
    active?: boolean,
    /** Indica se o card está desabilitado (indisponível) */
    disabled?: boolean,
    /** Data de consultoria atualmente selecionada */
    consultancyDate?: string | null,
    /** Função para alterar a data de consultoria selecionada */
    setConsultancyDate: React.Dispatch<React.SetStateAction<string | null | undefined>>
    /** Exibe o card em modo drawer (layout responsivo) */
    isDrawerView?: boolean
}