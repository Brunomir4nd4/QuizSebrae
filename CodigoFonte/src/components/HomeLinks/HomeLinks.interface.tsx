import { ClassData } from "@/types/IClass";

export interface Props {
  /**
   * Tipo de usuário (facilitador, aluno ou supervisor).
   */
  userType: 'facilitator' | 'subscriber' | 'supervisor';
  /**
   * Dados da turma para exibição dos links e materiais.
   */
  classData: ClassData;
}
