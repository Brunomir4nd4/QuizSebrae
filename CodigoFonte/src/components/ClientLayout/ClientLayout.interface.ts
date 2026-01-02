import { ClassResponse } from "@/types/IClass";

export interface ClientLayoutProps {
  /** Elementos filhos a serem renderizados dentro do layout */
  children: React.ReactNode;
  /** Sessão do usuário autenticado */
  session: any;
  /** Indica se o usuário tem papel de participante/facilitador */
  role: boolean;
  /** Dados das turmas do usuário */
  classData: ClassResponse['data'];
};
