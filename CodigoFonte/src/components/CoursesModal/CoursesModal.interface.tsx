
import { Sidebar } from "@/types/ISidebar";
import { Session } from "next-auth";

export interface Props {
    /**
     * Indica se o modal está aberto.
     */
    open: boolean;
    /**
     * Função chamada ao fechar o modal.
     */
    onClose: () => void;
    /**
     * Sessão do usuário autenticado.
     */
    session: Session;
    /**
     * Lista de cursos disponíveis para seleção.
     */
    sidebar: Sidebar[];
}