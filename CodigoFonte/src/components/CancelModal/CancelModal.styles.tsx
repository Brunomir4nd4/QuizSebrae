'use client'
import { Box, Button, IconButton, Stack } from '@mui/material';
import { styled } from '@mui/system';

export const ModalButton = styled(Button)({
    width: 'auto',
    height: 'auto',
    padding: '5px',
    paddingRight: '40px',
    borderRadius: '30px',
    background: '#222325!important',
    boxShadow: '0px 2px 10px 0px rgba(0, 0, 0, 0.25), 0px 10px 50px 0px rgba(0, 0, 0, 0.10)',
    margin: '0 auto',
    marginTop: '28px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    cursor: 'pointer',
    textTransform: 'none',
    position: 'relative',
    '&:after': {
        content: '""',
        width: '100%',
        height: '100%',
        position: 'absolute',
        background: 'rgba(0,0,0,0.1)',
        borderRadius: '40px',
        left: '0',
        bottom: '0',
        transition: 'all 0.2s ease-out',
    },
    'div': {
        width: '42px',
        height: '42px',
        background: 'linear-gradient(166deg, #06EBBD -3.37%, #1EFF9D 104.04%)',
        boxShadow: '0px 1px 0px 0px #A1FFC7 inset',
        filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '21px'
    },
    '&:hover': {
        background: '#222325',
        '&:after': {
            width: 'calc(100% + 10px)',
            height: 'calc(100% + 10px)',
            left: '-5px',
            bottom: '-5px',
        }
    }
});