export interface Props {
    /** Texto placeholder do select */
    placeholder: string,
    /** Lista de opções do select */
    items: string[];
    /** Nome do campo select */
    name: string,
    /** Função chamada quando o valor muda */
    setValue: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    /** Valor selecionado */
    value: string,
    /** Variante do estilo do select */
    variant?: boolean
}