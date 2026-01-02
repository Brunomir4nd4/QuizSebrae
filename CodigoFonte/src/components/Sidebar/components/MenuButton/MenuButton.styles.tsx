'use client'
import { Box } from '@mui/material';
import { styled } from '@mui/system';

export const Button = styled(Box)(({theme}) => ({
    width: 'calc(100% - 20px)',
    textAlign: 'center',
    borderRadius: '40px',
    background: 'none',
    boxShadow: 'none',
    'a': {
        display: 'flex',
        minHeight: '90px',
        padding: '20px 0',
        justifyContent: 'center',
        alignItems: 'center',
        'svg': {
            maxWidth: '45%'
        },
        'svg > path':{
            fill: '#1EFF9D'
        },
        'svg > g > path': {
            stroke: '#1EFF9D'
        }
    },
    '&:hover, &.active': {
        background: 'linear-gradient(166deg, #00FFA3 -3.37%, #1EFF9D 104.04%)',
        boxShadow: '0px 1px 0px 0px #A1FFC7 inset, 0px 4px 4px 0px rgba(7, 13, 38, 0.50), 0px 10px 80px 0px rgba(30, 255, 157, 0.20)',
        'a': {
            textAlign: 'center',
            'svg > path':{
                fill: 'var(--light-black)'
            },
            'svg > g > path': {
                stroke: 'var(--light-black)'
            }
        },
    },

    [theme.breakpoints.down('md')]: {
        minHeight: 'inherit',
        width: '54px',
        height: '44px',
        marginRight: '15px',
        'a': {
            minHeight: '44px',
            padding: '5px 10px',
            'svg': {
                maxWidth: '24px'
            },
        }
    },
}));
