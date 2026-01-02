import { styled } from '@mui/material';

export const ScheduleSlotHolder = styled('button')({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    pointerEvents: 'auto',
    fontSize: '16px',
    color: 'var(--text-color)',
    backgroundColor: 'var(--background-color)',
    padding: '8px 8px 8px 16px',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    zIndex: 10,
    overflow: 'auto',
    textAlign: 'left',
    transition: 'all 0.2s ease-out',
    '&:hover': {
        zIndex: 20,
        transform: 'scale(1.04)',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.2)!important'
    },
    '&.appointment': {
        '--background-color': '#1EFF9D',
        '--border-color': '#14E48A',
        '--text-color': '#222325',
        boxShadow: '0 10px 10px rgba(30, 255, 157, 0.2), 0 4px 8px rgba(7, 13, 38, 0.1), 0 1px 0 rgba(161, 255, 199, 1.0)',
    },
    '&.group': {
        '--background-color': '#774CF3',
        '--border-color': '#5B22D5',
        '--text-color': '#FFFFFF',
        boxShadow: '0 10px 10px rgba(118, 76, 243, 0.2), 0 4px 8px rgba(7, 13, 38, 0.1), 0 1px 0 #774CF3',
    },
    '&.meeting': {
        '--background-color': '#222325',
        '--border-color': '#131616',
        '--text-color': '#1EFF9D',
        boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
    },
    '&.block': {
        '--background-color': '#6E707A',
        '--border-color': 'transparent',
        '--text-color': 'rgba(255, 255, 255, 0.5)',
    },
});

export const ScheduleSlotInterval = styled('h2')({
    fontSize: '12px',
    fontWeight: 'bold',
});

export const ScheduleSlotContent = styled('div')({
    display: 'flex',
    alignItems: 'center',
    margin: 'auto 0',
    lineHeight: '1',
    '& svg': {
        marginRight: '8px',
    },
    '@media (max-width: 1200px)': {
        '& svg': {
            display: 'none',
        },
        '& h1': {
            fontSize: '14px',
        },
    },
});