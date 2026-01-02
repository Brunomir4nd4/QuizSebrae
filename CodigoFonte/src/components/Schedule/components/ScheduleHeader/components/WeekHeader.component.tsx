'use client'

import { styled } from '@mui/material';
import { DateTime } from 'luxon';

import { DayDisplay } from '.';

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
    },
    '& .hour-spacer': {
        minWidth: 'var(--schedule-first-slot-width)',
        width: 'var(--schedule-first-slot-width)',
        maxWidth: 'var(--schedule-first-slot-width)',
    },
});

const WeekHeaderDividers = styled('div')({
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    '& div:nth-of-type(n+2)': {
        width: 'calc(100% / 7)',
        height: '16px',
        borderLeft: '1px solid var(--schedule-slots-vertical-border-color)',
        boxSizing: 'border-box',
    },
});

/**
 * **WeekHeader**
 *
 * ### 🧩 Funcionalidade
 * - Cabeçalho semanal, mostra dias da semana.
 * - Destaque no dia atual, divisores visuais.
 * - DayDisplay para cada dia.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <WeekHeader weekStart={start} weekEnd={end} />
 * ```
 *
 * ### 🎨 Estilização
 * - WeekHeaderStyled com days e dividers.
 * - Position relative, flex.
 * - Bordas verticais.
 *
 * @component
 */
export const WeekHeader = (weekStart: DateTime, weekEnd: DateTime) => {
    const today = DateTime.now().setLocale(weekStart.locale ?? 'en');
    const isToday = (date: DateTime) => date.hasSame(today, 'day');
    const daysCount = weekEnd.diff(weekStart, 'days').days;
    const days = [];

    for (let i = 0; i < daysCount; i++) {
        const date = weekStart.plus({ days: i });

        days.push(
            <div key={i} className={isToday(date) ? 'today' : ''}>
                <DayDisplay isHeader={true} date={date} isToday={isToday(date)} onClick={() => { }} />
            </div>
        );
    }

    return (
        <WeekHeaderStyled>
            <WeekHeaderDividers>
                <div className='hour-spacer'></div>
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i}></div>
                ))}
            </WeekHeaderDividers>
            <div className='days'>
                <span className='hour-spacer'></span>
                {days}
            </div>
        </WeekHeaderStyled>
    );
};