'use client'

import { styled } from '@mui/material';
import { DateTime } from 'luxon';

const WeekHeadingStyled = styled('h1')(({theme}) => ({
    fontSize: '36px',
    'strong': {
        marginRight: '10px',
        textTransform: 'capitalize',
    },
    [theme.breakpoints.down('md')]: {
        marginBottom: '25px'
    },
}));

/**
 * **WeekHeading**
 *
 * ### 🧩 Funcionalidade
 * - Título do mês e ano no calendário semanal.
 * - Destaque no mês.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <WeekHeading date={currentDate} />
 * ```
 *
 * ### 🎨 Estilização
 * - WeekHeadingStyled h1.
 * - Strong para mês.
 * - Responsive margin.
 *
 * @component
 */
export const WeekHeading = (date: DateTime) => {
    return (
        <WeekHeadingStyled>
            <strong>
                {date.toLocaleString({ month: 'long' })}
            </strong>
            {date.toLocaleString({ year: 'numeric' })}
        </WeekHeadingStyled>
    );
};