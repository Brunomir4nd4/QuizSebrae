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
    backgroundColor: 'rgb(30 255 157)',
    backgroundSize: 'cover',
    padding: '0.625rem 0.5rem',
    textAlign: 'center',
    color: 'rgb(28 29 35)',
    boxShadow: '0px 1px 0px 0px #A1FFC7 inset, 0px 5px 20px 0px rgba(0, 0, 0, 0.10), 0px 10px 30px 0px rgba(0, 0, 0, 0.10) inset, 0px 0px 0px 10px #2DE695 inset, 0px 30px 100px 0px rgba(30, 255, 157, 0.20)',
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
    borderColor: 'rgb(34 35 37)',
    padding: '35px',
    paddingTop: '15px',
});

export const Circle = styled('div')(({theme}) => ({
    position: 'relative',
    marginTop: '1rem',
    display: 'flex',
    width: '100%',
    maxWidth: '220px',
    height: '250px',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.75rem',
    borderRadius: '9999px',
    background: 'linear-gradient(180deg, #2A2C2C 0%, #131616 100%), #222325',
    boxShadow: '0px 1px 0px 0px rgba(255, 255, 255, 0.20) inset, 0px 30px 50px 0px rgba(0, 0, 0, 0.25), 0px 5px 10px 0px rgba(0, 0, 0, 0.15)',
    
    'img': {
        margin: '0 auto',
    },
  
    '&:after': {
        position: 'absolute',
        inset: '10px',
        borderRadius: '9999px',
        borderWidth: '1px',
        borderColor: 'rgb(30 255 157)',
        content: '" "',
    },
}));

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
        borderTopColor: 'rgba(34, 35, 37, 0.2)',
    },
    '&:before': {
        position: 'absolute',
        top: '0px',
        bottom: '0px',
        right: '1.5rem',
        width: '30%',
        borderTopWidth: '1px',
        content: '""',
        borderTopColor: 'rgba(34, 35, 37, 0.2)',
    }
});