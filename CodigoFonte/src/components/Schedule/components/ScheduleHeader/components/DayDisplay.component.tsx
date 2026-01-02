'use client'

import { DrawableScheduleToday } from '@/resources/drawables';
import { styled } from '@mui/material';
import { DateTime } from 'luxon';

const DayDisplayStyled = styled('div')({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '100px',
    height: '100px',
    margin: '0 auto',
    color: '#333',
    boxSizing: 'border-box',
    '&.on-header': {
        marginBottom: '-20px',
    },
    '&.today': {
        '--dot-size': '8px',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: '6px',
            left: 'calc(50% - 4px)',
            width: 'var(--dot-size)',
            height: 'var(--dot-size)',
            backgroundColor: 'var(--primary-color)',
            borderRadius: '50%',
            zIndex: 1,
        },
        '& > svg': {
            position: 'absolute',
            top: 'calc(-100% + 20px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 0,
            userSelect: 'none',
            pointerEvents: 'none',
            '@media (max-width: 900px)' : {
                display: 'none',
            },
        },
        '& span': {
            zIndex: 2,
        },
        '& span:last-child': {
            color: 'var(--primary-color)',
            '@media (max-width: 900px)' : {
                color: '#131616',
            },
        },
    },
    '&.clickable': {
        cursor: 'pointer',
    },
    '& span': {
        lineHeight: '1',
    },
    '& span:nth-of-type(1)': {
        fontSize: '14px',
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        color: '#6E707A',
    },
    '& span:nth-last-of-type(1)': {
        fontSize: '32px',
        color: '#131616',
    },

    '@media (max-width: 900px)' : {
        minWidth: 'initial',
    },
    '@media (min-width: 900px)' : {
        '&.clickable:not(.today):hover': {
            backgroundColor: '#fff',
            borderRadius: '15px',
            boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.04), 0 10px 20px 0 rgba(0, 0, 0, 0.05)',
            transition: 'background-color 0.6s ease, border-color 0.6s ease, box-shadow 1.2s ease',
        },
    }
});

export interface DayDisplayProps {
    /**
     * Data a ser exibida no componente.
     */
    date: DateTime;
    /**
     * Indica se o componente está no cabeçalho.
     */
    isHeader?: boolean;
    /**
     * Destaca o componente se for o dia atual.
     */
    isToday?: boolean;
    /**
     * Função chamada ao clicar no componente.
     */
    onClick?: () => void;
}

function IfTodayDrawable(isToday: boolean) {
    return isToday ? (
        <DrawableScheduleToday />
    ) : (
        <div />
    );
}

/**
 * **DayDisplay**
 *
 * ### 🧩 Funcionalidade
 * - Exibe dia do calendário, destaque se atual.
 * - Suporte a clique, tooltip.
 * - Estilos dinâmicos para header, today, clickable.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <DayDisplay
 *   date={date}
 *   isHeader={true}
 *   isToday={true}
 *   onClick={handleClick}
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - DayDisplayStyled com flex column.
 * - Pseudo-before para dot today.
 * - Hover box-shadow.
 * - Responsive minWidth.
 *
 * @component
 */
export const DayDisplay = (
    { date, isHeader = false, isToday = false, onClick = undefined }: DayDisplayProps
) => {
    const styleClasses = [];

    if (isHeader) {
        styleClasses.push('on-header');
    }

    if (isToday) {
        styleClasses.push('today');
    }

    if (onClick !== undefined) {
        styleClasses.push('clickable');
    }

    return (
        <DayDisplayStyled onClick={onClick} className={styleClasses.join(' ')}>
            {IfTodayDrawable(isToday)}
            <span>{date.toFormat('ccc').replace('.', '')}</span>
            <span>{date.toFormat('d')}</span>
        </DayDisplayStyled>
    );
};