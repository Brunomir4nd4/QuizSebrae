import { ScheduleEvent } from '../../models/ScheduleEvent';

export interface ScheduleSlotProps {
    /**
     * Evento de agendamento a ser exibido no slot.
     */
    event: ScheduleEvent;
    /**
     * Coluna inicial do slot na grade.
     */
    spanCol?: number;
    /**
     * Linha inicial do slot na grade.
     */
    spanRow?: number;
    /**
     * Função chamada ao clicar no slot.
     */
    onClick?: (event: ScheduleEvent) => void;
    /**
     * ID da reserva associada ao slot.
     */
    bookingId: string;
}