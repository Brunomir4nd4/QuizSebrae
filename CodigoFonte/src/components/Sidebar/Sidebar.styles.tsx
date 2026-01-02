'use client'
import { Box, Button } from '@mui/material';
import { styled } from '@mui/system';

interface StyledSidebarProps {
    isParticipantMode?: boolean;
}

export const StyledSidebar = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isParticipantMode',
})<StyledSidebarProps>(({ theme, isParticipantMode }) => ({
    position: 'fixed',
    top: isParticipantMode ? '93px' : '0',
    left: isParticipantMode ? '7px' : '0',
    width: '80px',
    height: isParticipantMode ? 'calc(100vh - 101px)' : '100vh',
    background: 'var(--medium-black)',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    padding: '40px 0',
    paddingBottom: '20px',
    zIndex: '999',
    [theme.breakpoints.down('md')]: {
        left: '0',
        top: isParticipantMode ? '83px' : '0',
        width: '100%',
        height: 'auto',
        flexDirection: 'row',
        padding: '10px 20px',
        '& > div': {
            flexDirection: 'row',
        }
    },
}));

export const Logo = styled(Box)(({ theme }) => ({
    width: '48px',
    marginBottom: '40px',
    cursor: 'pointer',
    [theme.breakpoints.down('md')]: {
        marginBottom: '0px',
        marginRight: '30px'
    },
}));

export const MoreButton = styled(Button)(({ theme }) => ({
    position: 'absolute',
    top: '14px',
    left: 'calc(100% - 4px)',
    width: '45px',
    height: '108px',
    background: 'url("/sidebar-angle.svg") no-repeat top left!important',
    'div': {
        position: 'absolute',
        top: '38px',
        left: '7px',
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #0ADDB3',
        background: 'linear-gradient(166deg, #00FFA3 -3.37%, #1EFF9D 104.04%)',
        boxShadow: '0px 1px 0px 0px #A1FFC7 inset, 0px 4px 4px 0px rgba(7, 13, 38, 0.20), 0px 10px 80px 0px rgba(30, 255, 157, 0.20)',
        cursor: 'pointer',
    },
    [theme.breakpoints.down('md')]: {
        left: 'initial',
        right: '30px',
        top: 'calc(100% - 36px)',
        transform: 'rotate(90deg)',
        'div': {
            top: '38px',
            left: '5px',
            width: '22px',
            height: '22px',
        }
    },
}));

export const StyledButton = styled('button')(({ theme }) => ({
    width: 'calc(100% - 20px)',
    minHeight: '50px',
    textAlign: 'center',
    borderRadius: '40px',
    background: 'none',
    boxShadow: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    'svg': {
        maxWidth: '50%'
    },
    'svg > path': {
        fill: '#1EFF9D'
    },
    'svg > g > path': {
        stroke: '#1EFF9D'
    },
    '&:hover, &.active': {
        background: 'linear-gradient(166deg, #00FFA3 -3.37%, #1EFF9D 104.04%)',
        boxShadow: '0px 1px 0px 0px #A1FFC7 inset, 0px 4px 4px 0px rgba(7, 13, 38, 0.50), 0px 10px 80px 0px rgba(30, 255, 157, 0.20)',
        'svg > path': {
            fill: 'var(--light-black)'
        },
        'svg > g > path': {
            stroke: 'var(--light-black)'
        }
    },
    [theme.breakpoints.down('md')]: {
        minHeight: 'inherit',
        width: '44px',
        height: '44px',
        'svg': {
            maxWidth: '28px'
        },
    },
}));
