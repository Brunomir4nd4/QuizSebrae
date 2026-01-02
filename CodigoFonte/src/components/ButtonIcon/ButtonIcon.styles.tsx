'use client'
import { Button } from '@mui/material';
import { styled } from '@mui/system';

export const StyledButton = styled(Button)({
    width: 'auto',
    height: 'auto',
    padding: '5px',
    paddingLeft: '50px',
    borderRadius: '50px',
    background: '#222325!important',
    boxShadow: '0px 2px 10px 0px rgba(0, 0, 0, 0.25), 0px 10px 50px 0px rgba(0, 0, 0, 0.10)',
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
        background: 'rgba(0,0,0,0.05)',
        borderRadius: '40px',
        left: '0',
        bottom: '0',
        transition: 'all 0.2s ease-out',
    },
    'div': {
        width: '60px',
        height: '60px',
        background: 'linear-gradient(166deg, #06EBBD -3.37%, #1EFF9D 104.04%)',
        boxShadow: '0px 1px 0px 0px #A1FFC7 inset',
        filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '21px',
        transition: 'all 0.1s ease-out',
    },
    '&:hover': {
        backgroundColor: 'var(--primary-color)!important',
        'div': {
            background: 'var(--primary-color)',
            boxShadow: 'none',
            filter: 'none',
        },
        '&:after': {
            width: 'calc(100% + 10px)',
            height: 'calc(100% + 10px)',
            left: '-5px',
            bottom: '-5px',
        }
    },
    '&:disabled': {
        backgroundColor: 'var(--grey)!important',
        'div': {
            background: 'var(--medium-black)',
            boxShadow: 'none',
            filter: 'none',
            '&> img': {
                filter: 'contrast(0)',
            }
        },
        'p': {
            color: 'var(--white)!important',
        }
    }
});