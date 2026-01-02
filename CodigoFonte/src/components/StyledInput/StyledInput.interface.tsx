export interface Props {
    /** Texto placeholder do input */
    placeholder: string,
    /** Valor atual do input */
    value: string,
    /** Função chamada quando o valor muda */
    setValue: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    /** Nome do campo input */
    name: string,
    /** Variante do estilo do input */
    variant?: boolean
}