import { ScheduleEvent } from "../Schedule/models/ScheduleEvent";

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
     * Evento de agendamento com detalhes da roda de conversa.
     */
    appointment: ScheduleEvent;
    /**
     * Papel do usuário (ex: supervisor, participante).
     */
    role?: string;
}