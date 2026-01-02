import { Button, styled } from '@mui/material';

export const HeaderContent = styled('div')(({theme}) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '58px',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column'
    },
}));

export const Header = styled('div')({
    '--transition-time': '0.6s',
    backgroundColor: 'rgb(var(--background-rgb))',
    transition: 'background-color var(--transition-time) ease, border-bottom var(--transition-time) ease, box-shadow var(--transition-time) ease, backdrop-filter var(--transition-time) ease',
    zIndex: 100,
    '&.sticky': {
        position: 'fixed',
        top: '66px',
        backgroundColor: 'rgba(var(--background-rgb), 0.9)',
        borderBottom: '1px solid var(--schedule-slots-horizontal-border-color)',
        boxShadow: '0 25px 20px -20px rgba(0, 0, 0, 0.16)',
        backdropFilter: 'blur(10px)',

        '@media (min-width: 900px)' : {
            top: '0px',
        },
    },
});

export const DayButton = styled(Button)(({theme}) => ({
    height: '70px',
    width: '136px',
    borderRadius: '50px',
    backgroundColor: '#ffffff!important',
    transition: 'all 0.2s ease-out',
    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.04),0 10px 20px 0 rgba(0,0,0,0.05)',
    textTransform: 'none',
    '&:hover': {
        backgroundColor: 'var(--primary-color)!important',
    }
}));
