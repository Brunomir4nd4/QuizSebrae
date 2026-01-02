export interface Props {
    /**
     * Elementos filhos a serem renderizados dentro do botão.
     */
    children: React.ReactNode;
    /**
     * URL de navegação ao clicar no botão.
     */
    href: string;
    /**
     * Define se o link abre em nova aba ou na mesma.
     */
    target?: "_blank" | "_self";
}