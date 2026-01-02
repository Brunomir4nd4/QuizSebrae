'use client'
import { styled } from '@mui/system';

export const StyledButton = styled('a')(({theme}) => ({
    width: '100%',
    height: 'auto',
    display: 'flex',
    cursor: 'pointer',
    textTransform: 'none',
    position: 'relative',
    'div': {
        width: '100%',
        height: 'auto',
        padding: '17px 20px',
        borderRadius: '15px',
        background: '#ffffff',
        boxShadow: '0px 10px 20px 0px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        position: 'relative',
        transition: 'all 0.2s ease-out',
    },
    '&:before': {
        content: '""',
        width: '100%',
        height: '100%',
        position: 'absolute',
        background: 'rgba(0,0,0,0.05)',
        borderRadius: '18px',
        left: '0',
        bottom: '0',
        transition: 'all 0.2s ease-out',
    },
    'img': {
        maxWidth: '37px',
        marginRight: '10px'
    },
    '&:hover': {
        'div': {
            background: '#1EFF9D',
        },
        '&:before':{
            width: 'calc(100% + 10px)',
            height: 'calc(100% + 10px)',
            left: '-5px',
            bottom: '-5px',
        }
    },

    [theme.breakpoints.down('xl')]: {
        minHeight: '90px'
    },
    [theme.breakpoints.down('md')]: {
        minHeight: 'inherit'
    },
}));