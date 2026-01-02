'use client'
import { styled } from '@mui/system';
import Link from 'next/link';

export const ClassBox = styled('div')(({theme}) => ({
    borderRadius: '50px',
    background: '#FFF',
    boxShadow: '0px 10px 20px 0px rgba(0, 0, 0, 0.05)',
    width: '100%',
    height: '70px',
    padding: '20px 37px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    '&.small': {
        maxWidth: '500px',
        'a': {
            width: '170px',
            padding: '20px 30px',
        }
    },
    [theme.breakpoints.down('md')]: {
        padding: '20px 20px',
        paddingRight: '70px',
        height: '60px',
        '&.small': {
            maxWidth: '100%',
            'a': {
                width: '80px',
                padding: '20px 25px',
            }
        },
    },
}));

export const ClassButton = styled(Link)(({theme}) => ({
    borderRadius: '8px 50px 50px 8px',
    background: '#222325',
    boxShadow: '0px 10px 20px 0px rgba(0, 0, 0, 0.05)',
    width: '350px',
    height: '70px',
    padding: '20px 40px',
    position: 'absolute',
    top: '0',
    right: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
        width: '80px',
        height: '60px',
        padding: '20px 25px',
        'img': {
            width: '26px'
        }
    },
}));