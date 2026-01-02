import { Session } from "next-auth";
import { ReactNode } from "react";

/**
 * Props do componente Header
 * 
 * Cabeçalho principal da aplicação que exibe informações contextuais baseadas
 * na página atual e no tipo de usuário logado.
 */
export interface Props {
    /**
     * Título principal da página (não utilizado quando customMessage está presente)
     */
    title: string,
    /**
     * Texto destacado em negrito que precede o título
     */
    highlight?: string,
    /**
     * Texto de boas-vindas exibido acima do título (ex: "Boas-vindas")
     */
    cap?: string,
    /**
     * Dados da sessão do usuário contendo informações de autenticação e perfil
     */
    session?: Session,
    /**
     * Define se o fundo do header deve ser transparente (padrão: false - fundo branco)
     */
    isTransparent?: boolean,
    /**
     * Define se deve exibir o texto de boas-vindas (cap)
     */
    showCap?: boolean,
    /**
     * Mensagem personalizada que substitui completamente o título padrão da página
     */
    customMessage?: ReactNode
}
