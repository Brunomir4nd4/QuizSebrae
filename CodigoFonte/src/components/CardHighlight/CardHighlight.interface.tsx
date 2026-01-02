/**
 * Props do componente CardHighlight
 * 
 * Card destacado para acesso rápido a sala de reunião/mentoria ao vivo.
 */
export interface Props {
    /**
     * Título do card (ex: "Ao Vivo")
     */
    title: string,
    /**
     * Texto do botão de ação (ex: "Entrar")
     */
    text: string,
    /**
     * URL de destino ao clicar no card
     */
    href: string,
    /**
     * URL da imagem/ícone exibido no card
     */
    image: string,
    /**
     * Turno da reunião para exibição do horário correspondente
     */
    turno: "diurno" | "noturno" | "vespertino" | "unica",
}