import { Dispatch, SetStateAction } from 'react';
import { DateTime } from 'luxon';

import { ScheduleCalendarView } from '../../utils/ScheduleCalendarView';

export interface ScheduleHeaderProps {
    /**
     * Tipo de visualização do calendário (dia ou semana).
     */
    type: ScheduleCalendarView;
    /**
     * Data atualmente selecionada no calendário.
     */
    date: DateTime;
    /**
     * Data de início da semana exibida.
     */
    weekStart: DateTime;
    /**
     * Data de término da semana exibida.
     */
    weekEnd: DateTime;
    /**
     * Função para atualizar a data selecionada.
     */
    setDate: Dispatch<SetStateAction<DateTime<true> | DateTime<false>>>;
}