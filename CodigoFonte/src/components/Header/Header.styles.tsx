'use client'
import { Box } from '@mui/material';
import { styled } from '@mui/system';

export const Avatar = styled(Box)(({theme}) => ({
    width: '110px',
    height: '110px',
    borderRadius: '50%',
    border: '1px solid rgba(0,0,0,0.02)',
    background: 'rgba(113, 118, 127, 0.20)',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:before': {
        content: '""',
        width: 'calc(100% - 14px)',
        height: 'calc(100% - 14px)',
        borderRadius: '50%',
        border: '3px solid var(--primary-color)',
        background: 'var(--light-black)',
        position: 'absolute',
        top: '7px',
        left: '7px'
    },
    'img': {
        position: 'relative',
    },
    [theme.breakpoints.down('xl')]: {
        width: '80px',
        height: '80px',
        '&:before': {
            width: 'calc(100% - 4px)',
            height: 'calc(100% - 4px)',
            top: '2px',
            left: '2px'
        }
    },
    [theme.breakpoints.down('md')]: {
        width: '65px',
        height: '65px',
        '&:before': {
            width: 'calc(100% - 4px)',
            height: 'calc(100% - 4px)',
            top: '2px',
            left: '2px'
        },
        'img': {
            maxWidth: '16px'
        },
    },
}));