'use client'
import { Box, Button } from '@mui/material';
import { styled } from '@mui/system';

export const SliderHeader = styled(Box)(({theme}) => ({
    display: 'block',
    width: '100%',
    height: 'auto',
    padding: '0 60px',
    [theme.breakpoints.down('md')]: { 
        padding: '0px',
    },
}));

export const SliderArrows = styled(Box)({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'var(--light-black)',
    height: '70px',
    borderRadius: '70px',
    padding: '5px'
});

export const SliderArrow = styled(Button)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(166deg, #06EBBD -3.37%, #1EFF9D 104.04%)!important',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    padding: '0',
    minWidth: 'inherit',
    transition: 'all 0.2s ease-out',
    '&:hover': {
        transform: 'scale(1.08)'
    }
});