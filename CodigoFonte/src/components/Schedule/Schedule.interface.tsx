import { Session } from 'next-auth';
import { ScheduleEvent } from './models/ScheduleEvent';
import { ScheduleCalendarView } from './utils/ScheduleCalendarView';

/**
 * Props do componente Schedule
 * 
 * Agenda interativa para visualização e gerenciamento de mentorias, reuniões e bloqueios de horário.
 */
export interface ScheduleProps {
    /**
     * Tipo de visualização da agenda (Week para semana, Day para dia)
     */
    type: ScheduleCalendarView;
    /**
     * Data de foco inicial da agenda
     */
    focus: Date;
    /**
     * Dados da sessão do usuário autenticado
     */
    session: Session;
    /**
     * Lista de eventos a serem exibidos na agenda
     */
    events: Array<ScheduleEvent>;
    /**
     * Hora de início do expediente (padrão: 6)
     */
    workHourStart?: number;
    /**
     * Hora de término do expediente (padrão: 21)
     */
    workHourEnd?: number;
    /**
     * Callback ao passar o mouse sobre um slot de horário vazio
     */
    onSlotHover?: (date: Date) => void;
    /**
     * Callback ao clicar em um slot de horário vazio
     */
    onSlotClick?: (date: Date) => void;
    /**
     * Callback ao passar o mouse sobre um evento
     */
    onEventHover?: (event: ScheduleEvent) => void;
    /**
     * Callback ao clicar em um evento (mentoria, reunião, bloqueio)
     */
    onEventClick?: (event: ScheduleEvent) => void;
}