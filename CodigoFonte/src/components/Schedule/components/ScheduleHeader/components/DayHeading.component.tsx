'use client'

import { styled } from '@mui/material';
import { DateTime } from 'luxon';

const WeekHeadingStyled = styled('h1')(({theme}) => ({
    fontSize: '36px',
    fontWeight: '300',
    'strong': {
        fontWeight: '600',
        marginRight: '10px',
        textTransform: 'capitalize',
    },
    [theme.breakpoints.down('md')]: {
        marginBottom: '25px'
    },
}));

/**
 * **DayHeading**
 *
 * ### 🧩 Funcionalidade
 * - Título do dia selecionado, mostra dia, mês e ano.
 * - Destaque no mês.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <DayHeading date={selectedDate} />
 * ```
 *
 * ### 🎨 Estilização
 * - WeekHeadingStyled h1.
 * - Strong para mês.
 * - Responsive margin.
 *
 * @component
 */
export const DayHeading = (date: DateTime) => {
    return (
        <WeekHeadingStyled>
            {date.toLocaleString({ day: 'numeric' })} de <strong>{date.toLocaleString({ month: 'long' })}</strong>{date.toLocaleString({ year: 'numeric' })}
        </WeekHeadingStyled>
    );
};