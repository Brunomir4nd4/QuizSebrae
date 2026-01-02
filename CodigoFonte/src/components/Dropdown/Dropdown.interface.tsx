export interface Props {
    /**
     * Texto ou elemento exibido como item inicial do dropdown.
     */
    startItem: string;
    /**
     * Função chamada ao selecionar um ano.
     */
    onClick: (year: string) => void;
    /**
     * Lista de anos disponíveis para seleção.
     */
    years: string[];
}