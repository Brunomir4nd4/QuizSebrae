'use client'
import { styled } from '@mui/system';

export const StyledButton = styled('button')(({theme}) => ({
    width: '100%',
    height: 'auto',
    padding: '27px 40px',
    background: 'transparent',
    borderRadius: '0px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    textTransform: 'inherit',
    cursor: 'pointer',
    transition: 'all 0.2s ease-out',
    '&:hover': {
        background: 'var(--light-black)!important',
        color: 'var(--primary-color)!important',
        cursor: 'pointer',
        'svg path': {
            stroke: 'var(--primary-color)',
        },
    },
    [theme.breakpoints.down('md')]: {
        padding: '27px 25px',
    },
}));