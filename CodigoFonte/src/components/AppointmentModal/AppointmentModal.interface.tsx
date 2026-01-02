import { Appointment, CreateAppointment } from "@/types/IAppointment";

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
   * Função opcional para fechar o drawer (opcional).
   */
  closeDrawer?: () => void;
  /**
   * Dados do agendamento a ser criado.
   */
  appointment: CreateAppointment;
  /**
   * Nome do facilitador da mentoria.
   */
  facilitator: string;
  /**
   * Função para atualizar a lista de agendamentos.
   */
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[] | null>>
}

/**
 * Props para o componente ConfirmMentorship.
 */
export interface ConfirmMentorshipProps {
  /**
   * Nome do facilitador da mentoria.
   */
  facilitator: string, 
  /**
   * Horário de início da mentoria.
   */
  startTime: string, 
  /**
   * Tipo de agendamento (ID).
   */
  AppointmentType: number, 
  /**
   * Função chamada ao confirmar a mentoria individual.
   */
  setIndividualMentorship: () => void;
}

/**
 * Props para o componente MentorshipConfirmed.
 */
export interface MentorshipConfirmedProps {
  /**
   * Dia da semana ou número da semana.
   */
  week: string | number, 
  /**
   * Dia do mês.
   */
  day: string | number, 
  /**
   * Horário de início da mentoria.
   */
  startTime: string, 
}