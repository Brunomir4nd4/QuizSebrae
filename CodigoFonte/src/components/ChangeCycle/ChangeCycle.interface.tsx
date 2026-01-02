import { Cycle } from "@/types/ICycles"

/**
 * Props do componente ChangeCycle
 * 
 * Interface de seleção de ciclo e turma, permitindo que usuários naveguem
 * entre diferentes ciclos e escolham uma turma específica dentro do ciclo selecionado.
 */
export interface ChangeCycleProps {
  /**
   * URL de redirecionamento após a seleção da turma
   */
  redirect: string
  /**
   * Lista de ciclos disponíveis para seleção
   */
  cycles: Cycle[]
  /**
   * Token de autenticação do usuário
   */
  token: string
  /**
   * Tipo de usuário ('supervisor' ou 'participante'), afeta permissões e funcionalidades disponíveis
   */
  role:string
}