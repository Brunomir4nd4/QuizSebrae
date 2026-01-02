'use client'
import { Box, IconButton, Stack } from '@mui/material';
import { styled } from '@mui/system';

export const ModalContent = styled(Box)(({theme}) => ({
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '570px',
    height: 'auto',
    position: 'relative',
    [theme.breakpoints.down('md')]: {
        width: '100%',        
        height: '100vh',
        top: '0',
        left: '0',
        transform: 'none',
        padding: '32px 20px',
        overflow: 'auto'
    },
}));

export const ModalClose = styled(IconButton)({
    borderRadius: '100px',
    border: '1px solid #131616',
    background: 'linear-gradient(149deg, #222325 12.57%, #131616 86.79%)!important',
    boxShadow: '0px 2px 10px 0px rgba(0, 0, 0, 0.50), 0px 10px 50px 0px rgba(0, 0, 0, 0.25)',
    position: 'absolute',
    width: '69px',
    height: '69px',
    top: '0',
    right: '0',
    transform: 'translate(35%, -35%)',
    color: '#1EFF9D',
    transition: 'all 0.2s ease-out',
    fontSize: '34px',
    '&:hover': {
        color: '#ffffff',
    }
});