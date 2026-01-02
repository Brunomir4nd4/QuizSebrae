/**
 * Props do componente RemoveParticipantModal
 * 
 * Modal de confirmação para remoção de participante de uma mentoria em grupo.
 * Remove um participante específico sem cancelar toda a mentoria.
 */
export interface Props {
  /**
   * Define se a modal está aberta ou fechada
   */
  open: boolean;
  /**
   * Função chamada ao fechar esta modal de confirmação
   */
  onClose: () => void;
  /**
   * Função chamada para fechar a modal principal GroupDetailModal
   */
  mainModalClose: () => void;
  /**
   * ID da turma associada ao grupo
   */
  class_id: string;
  /**
   * ID do agendamento (booking) do participante a ser removido
   */
  booking_id: string | number;
  /**
   * ID do grupo do qual o participante será removido
   */
  group_id: string
}