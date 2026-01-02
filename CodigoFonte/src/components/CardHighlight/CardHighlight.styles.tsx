'use client'
import { styled } from '@mui/system';

export const StyledCard = styled('div')({
    position: 'relative',
    display: 'flex',
    width: '100%',
    maxWidth: '300px',
    flex: '1 1 0%',
    borderRadius: '9999px',
    borderWidth: '8px',
    borderColor: 'rgb(255 255 255)',
    background: 'linear-gradient(180deg, #373A3A 0%, #222325 100%), #222325',
    padding: '0.625rem 0.5rem',
    textAlign: 'center',
    color: 'rgb(28 29 35)',
    boxShadow: '0px 1px 0px 0px #A1FFC7 inset, 0px 5px 20px 0px rgba(0, 0, 0, 0.10), 0px 10px 30px 0px #000 inset, 0px 0px 0px 10px rgba(0, 0, 0, 0.25) inset, 0px 30px 100px 0px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.2s ease-out',
    margin: '0 auto',
    '&:hover': {
        transform: 'scale(1.02)'
    }
});

export const CardHeader = styled('div')({
    position: 'relative',
    zIndex: '60',
    display: 'flex',
    height: '500px',
    width: '100%',
    justifyContent: 'center',
    borderRadius: '9999px',
    borderWidth: '1px',
    borderColor: '#1EFF9D',
    padding: '45px',
    paddingTop: '35px',
    '.label-reuniao': {
        position: 'absolute', 
        inset: '0px', 
        padding: '0.75rem', 
    }
});

export const Circle = styled('div')({
    position: 'relative',
    marginTop: '1rem',
    display: 'flex',
    width: '183px',
    height: '183px',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '9999px',
    background: 'linear-gradient(166deg, #06EBBD -3.37%, #1EFF9D 104.04%)',
    boxShadow: 'box-shadow: 0px 1px 0px 0px #A1FFC7 inset',
    'img': {
        margin: '0 auto'
    },
    'span': {
        position: 'absolute',
        bottom: '-45px',
        display: 'flex',
        height: '66px',
        width: '66px',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '9999px',
        backgroundColor: 'rgb(255 255 255 / var(--tw-bg-opacity))',
        padding: '1.25rem',
        boxShadow: 'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
        '&:before': {
            position: 'absolute',
            inset: '-7px',
            borderRadius: '9999px',
            borderWidth: '7px',
            content: '" "',
            borderColor: 'rgb(34 35 37 / 0.25)',
        }
    }
});

export const CardText = styled('div')({
    position: 'absolute',
    left: '0.5rem',
    right: '0.5rem',
    bottom: '0.625rem',
    zIndex: '10',
    borderTopLeftRadius: '0.5rem',
    borderTopRightRadius: '0.5rem',
    borderBottomRightRadius: '9999px',
    borderBottomLeftRadius: '9999px',
    padding: '0 20px',
    paddingTop: '60px',
    paddingBottom: '90px',
    textTransform: 'uppercase',
    'img': {
        position: 'absolute',
        left: '50%',
        top: '0',
        transform: 'translate(-50%, -50%)'
    },
    '&:after': {
        position: 'absolute',
        top: '0px',
        bottom: '0px',
        left: '1.5rem',
        width: '30%',
        borderTopWidth: '1px',
        content: '""',
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:before': {
        position: 'absolute',
        top: '0px',
        bottom: '0px',
        right: '1.5rem',
        width: '30%',
        borderTopWidth: '1px',
        content: '""',
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    }
});