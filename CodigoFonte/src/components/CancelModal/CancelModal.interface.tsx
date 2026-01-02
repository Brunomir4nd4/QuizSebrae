/**
 * Props do componente CancelModal
 * 
 * Modal de confirmação para cancelamento de mentorias individuais ou agendamentos.
 * Permite cancelar um ou múltiplos agendamentos de uma vez.
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
   * Função chamada para fechar a modal principal (que abriu esta modal de confirmação)
   */
  mainModalClose: () => void;
  /**
   * ID da turma associada ao(s) agendamento(s)
   */
  class_id: string;
  /**
   * ID do agendamento a ser cancelado. Pode ser uma string única ou array de strings para cancelamentos múltiplos
   */
  booking_id: string | string[];
}