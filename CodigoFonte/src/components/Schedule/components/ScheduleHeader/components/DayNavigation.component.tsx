'use client'

import { styled } from '@mui/material';
import { DateTime } from 'luxon';

import { DayDisplay } from '.';
import { IconArrowLeft, IconArrowRight } from '@/resources/icons';

const WeekNavigationStyled = styled('nav')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 7px',
    backgroundColor: '#fff',
    borderRadius: '100px',
    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.04), 0 10px 20px 0 rgba(0,0,0,0.05)',
    '& button': {
        '--size': '60px',
        '--button-spacing': '30px',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 'var(--size)',
        height: 'var(--size)',
        backgroundColor: '#222325',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '0px',
        color: '#333',
        zIndex: 99,
        transition: 'background-color 0.3s, transform 0.3s',
        '&:nth-of-type(1)': {
            marginRight: 'var(--button-spacing)',
        },
        '&:nth-last-of-type(1)': {
            marginLeft: 'var(--button-spacing)',
        },
        '&:hover': {
            backgroundColor: 'var(--primary-color)',
            transform: 'scale3d(1.2, 1.2, 1)',

            '& svg path': {
                stroke: 'var(--foreground-hex)',
            },
        },
    },
    '& > div': {
        minWidth: 'auto',
        width: 'auto',
        height: 'auto',
    },
    '& > span': {
        alignSelf: 'flex-end',
        textTransform: 'uppercase',
        margin: '0 26px 6px',
    },
});

/**
 * **DayNavigation**
 *
 * ### 🧩 Funcionalidade
 * - Controles de navegação para alternar semanas no calendário diário.
 * - Avança/retrode semanas, destaca início e fim.
 * - Similar a WeekNavigation.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <DayNavigation
 *   weekStart={start}
 *   weekEnd={end}
 *   onPrevious={prev}
 *   onNext={next}
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - Mesmo estilo que WeekNavigation.
 * - Botões com hover scale.
 *
 * @component
 */
export const DayNavigation = (
    weekStart: DateTime,
    weekEnd: DateTime,
    onPrevious: () => void,
    onNext: () => void
) => {
    return (
        <WeekNavigationStyled>
            <button onClick={onPrevious} title='Semana anterior'>
                <IconArrowLeft />
            </button>
            <DayDisplay date={weekStart} />
            <span>à</span>
            <DayDisplay date={weekEnd} />
            <button onClick={onNext} title='Próxima semana'>
                <IconArrowRight />
            </button>
        </WeekNavigationStyled>
    );
};