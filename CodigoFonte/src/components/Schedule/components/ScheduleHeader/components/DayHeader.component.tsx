'use client'

import { styled } from '@mui/material';
import { DateTime } from 'luxon';

import { DayDisplay } from '.';
import { useScheduleContext } from '@/app/providers/ScheduleProvider';

const WeekHeaderStyled = styled('div')({
    position: 'relative',
    '& .days': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        '& div': {
            width: 'calc(100% / 7)',
            textAlign: 'center',
        },
    }
});

/**
 * **DayHeader**
 *
 * ### 🧩 Funcionalidade
 * - Cabeçalho de dias no calendário, permite seleção.
 * - Destaque no dia atual, clique para mudar.
 * - Usa ScheduleContext para dayViewDate.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <DayHeader weekStart={start} weekEnd={end} />
 * ```
 *
 * ### 🎨 Estilização
 * - WeekHeaderStyled com days flex.
 * - Clickable para seleção.
 *
 * @component
 */
export const DayHeader = (weekStart: DateTime, weekEnd: DateTime) => {
    const isToday = (date: DateTime) => date.hasSame(dayViewDate, 'day');
    const daysCount = weekEnd.diff(weekStart, 'days').days;
    const days = [];

    const { dayViewDate, setDayViewDate } = useScheduleContext()

    for (let i = 0; i < daysCount; i++) {
        const date = weekStart.plus({ days: i });

        days.push(
            <div key={i} onClick={() => setDayViewDate(date)} className={isToday(date) ? 'today' : ''}>
                <DayDisplay isHeader={true} date={date} isToday={isToday(date)} onClick={() => { }} />
            </div>
        );
    }

    return (
        <WeekHeaderStyled>
            <div className='days'>
                {days}
            </div>
        </WeekHeaderStyled>
    );
};