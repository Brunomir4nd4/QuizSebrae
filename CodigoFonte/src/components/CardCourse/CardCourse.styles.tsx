'use client'
import { styled } from '@mui/system';

export const StyledCard = styled('div')({
    position: 'relative',
    display: 'flex',
    width: '100%',
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
    '&.active': {
        borderColor: 'rgb(0 0 0)',
    }
});

export const CardHeader = styled('div')(({theme}) => ({
    position: 'relative',
    zIndex: '60',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '463px',
    width: '100%',
    borderRadius: '9999px',
    borderWidth: '1px',
    borderColor: 'rgb(34 35 37)',
    padding: '45px',
    paddingTop: '52px',
    [theme.breakpoints.down('md')]: {
        height: '220px',
        padding: '10px 20px',
        paddingTop: '20px'
    },
}));

export const CardText = styled('div')(({theme}) => ({
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
    },
    [theme.breakpoints.down('md')]: {
        padding: '25px 0',
        paddingBottom: '35px',
        '&:after, &:before':{ 
            width: '17%',
        }
    },
}));

export const CardCheck = styled('div')(({theme}) => ({
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    position: 'absolute',
    top: '5px',
    right: '-15px',
    zIndex: '1',
    opacity: '0',
    visibility: 'hidden',
    transition: 'all -.2s ease-out',
    '&.active': {
        opacity: '1',
        visibility: 'visible',
    },
    '&:before': {
        content: '""',
        width: '62px',
        height: '62px',
        borderRadius: '50%',
        position: 'absolute',
        top: '-4px',
        right: '-4px',
        background: 'rgba(30, 255, 157, 0.2)',
    },
    'div': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        width: '100%',
        height: '100%',
        position: 'relative',
        borderRadius: '50%',
        'img': {
            width: '50%',
        }
    },
    [theme.breakpoints.down('md')]: {
        width: '34px',
        height: '34px',
        right: '-5px',
        '&:before': {
            width: '42px',
            height: '42px',
        },
    },
}));