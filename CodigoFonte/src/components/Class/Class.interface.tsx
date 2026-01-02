export interface Props {
    /** Nome da classe (fallback se não houver dados no contexto) */
    name?: string,
    /** URL de destino ao clicar no botão */
    href: string,
    /** Texto exibido no botão */
    buttonText: string,
    /** Se true, exibe versão compacta do componente */
    small?: boolean,
    /** Query string adicional para navegação (prev) */
    query?: string
}