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
});

export const CardHeader = styled('div')(({theme}) => ({
    position: 'relative',
    zIndex: '60',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    height: '463px',
    width: '100%',
    borderRadius: '9999px',
    borderWidth: '1px',
    borderColor: 'rgb(34 35 37)',
    padding: '45px',
    paddingTop: '52px',
    [theme.breakpoints.down('md')]: {
        height: '220px',
        padding: '20px 30px',
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