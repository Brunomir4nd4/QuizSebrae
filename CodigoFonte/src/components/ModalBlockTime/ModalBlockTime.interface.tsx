import { AppointmentDeleteResponse } from "@/types/IAppointment";

export interface Props {
  /**
   * Controla se o modal está aberto ou fechado.
   */
  open: boolean;
  /**
   * Função chamada quando o modal é fechado pelo usuário.
   */
  onClose: () => void;
  /**
   * Função de callback executada ao bloquear ou desbloquear um horário.
   */
  blockCallback: () => Promise<AppointmentDeleteResponse>;
  /**
   * Dados do horário a ser bloqueado/desbloqueado.
   */
  blockTime?: {
    start_date_time: string;
    end_date_time: string;
    time_blocked: string;
  };
  /**
   * Tipo de ação: 'block' para bloquear ou 'unblock' para desbloquear.
   */
  type: "block" | "unblock";
  /**
   * ID da turma (opcional).
   */
  classId?: string;
  /**
   * ID da reserva (opcional).
   */
  bookingId?: string;
}
