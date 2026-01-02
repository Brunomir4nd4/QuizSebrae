'use client'
import { Box, Button, IconButton, Stack } from '@mui/material';
import { styled } from '@mui/system';

export const ModalContent = styled(Box)(({theme}) => ({
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '1140px',
    height: 'auto',
    position: 'relative',
    [theme.breakpoints.down('md')]: {
        width: '100%',    
        padding: '32px 20px',
        overflow: 'auto'
    },
}));

export const CloseButton = styled(Button)(({theme}) => ({
    width: 'auto',
    height: 'auto',
    padding: '5px!important',
    paddingLeft: '30px!important',
    borderRadius: '50px',
    background: '#222325!important',
    boxShadow: '0px 2px 10px 0px rgba(0, 0, 0, 0.25), 0px 10px 50px 0px rgba(0, 0, 0, 0.10)',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    cursor: 'pointer',
    textTransform: 'none',
    position: 'fixed',
    top: '36px',
    right: '36px',
    border: '2px solid transparent',
    transition: 'all 0.2s ease-out',
    opacity: '1!important',
    zIndex: '9999',
    textShadow: 'none!important',
    '&:after': {
        content: '""',
        width: '100%',
        height: '100%',
        position: 'absolute',
        background: 'rgba(0,0,0,0.05)',
        borderRadius: '40px',
        left: '0',
        bottom: '0',
        transition: 'all 0.2s ease-out',
    },
    'div': {
        width: '60px',
        height: '60px',
        background: 'linear-gradient(166deg, #06EBBD -3.37%, #1EFF9D 104.04%)', 
        boxShadow: '0px 1px 0px 0px #A1FFC7 inset', 
        filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))', 
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '21px',
        transition: 'all 0.1s ease-out',
    },
    '&:hover': {
        backgroundColor: 'var(--primary-color)!important',
        'div': {
            background: 'var(--primary-color)',
            boxShadow: 'none', 
            filter: 'none', 
        },
        '&:after':{
            width: 'calc(100% + 10px)',
            height: 'calc(100% + 10px)',
            left: '-5px',
            bottom: '-5px',
        }
    },
    [theme.breakpoints.down('md')]: { 
        height: '70px',
        bottom: '30px',
        left: '50%',
        top: 'initial',
        right: 'initial',
        transform: 'translateX(-50%)'
    },
}));