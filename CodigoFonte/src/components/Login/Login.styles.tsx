'use client'
import { styled } from '@mui/system';

export const Section = styled('section')({
    display: 'flex',
    width: '100%',
    height: '100vh',
    maxWidth: '2500px',
    opacity: '1',
    backgroundColor: '#ffffff',
    '@media (max-width: 1024px)' : {
        flexDirection: 'column'
    },
    '.marca-produto': {
        position: 'absolute', 
        top: '1.5rem', 
        left: '1.25rem', 
        '@media (min-width: 768px)': {
            top: '2.5rem', 
            left: '2.5rem', 
        }
    },
    '.marca-parceiro': {
        position: 'absolute', 
        bottom: '2.5rem', 
        left: '-8rem', 
    }
});

export const ImageCover = styled('div')({
    position: 'relative',
    opacity: '1',
    backgroundColor: '#ffffff',
    boxShadow: '4px 0px 40px rgba(0, 0, 0, 0.25)',
    width: '58.333333%', 
    clipPath: 'polygon(0 0, 100% 0, 70% 100%, 0% 100%)',
    '@media (max-width: 1024px)' : {
        width: '100%',
        clipPath: 'none',
    },
    '& > img': {
        height: '100%',
        width: '100%',
        objectFit: 'cover',
    },
});

export const Content = styled('div')({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    padding: '4rem 1.25rem',
    '&:after': {
        position: 'absolute',
        top: '2.5rem',
        right: '1.25rem',
        height: '0.125rem',
        width: '1.25rem',
        content: '" "',
        backgroundColor: 'rgb(34 35 37)',
    },
    '&:before': {
        position: 'absolute',
        bottom: '2.5rem',
        right: '1.25rem',
        height: '0.125rem',
        width: '1.25rem',
        content: '" "',
        backgroundColor: 'rgb(34 35 37)',
    },
    '@media (min-width: 1024px)' : {
        flex: '1 1 0%',
        width: '41.666667%',
        paddingRight: '5rem',
        '&:after' :{
          top: '3.5rem',
          content: 'var(--tw-content)',
          right: '5rem',
        },
        '&:before': {
          bottom: '3.5rem',
          content: 'var(--tw-content)',
          right: '5rem',
        },
    },
});

export const Label = styled('div')({
    display: 'flex',
    width: 'fit-content',
    alignItems: 'center',
    justifyContent: 'center',
    'span': {
        zIndex: '0',
        display: 'flex',
        width: 'fit-content',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '9999px',
        background: 'linear-gradient(166deg, #06EBBD -3.37%, #1EFF9D 104.04%)',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        paddingTop: '0.25rem',
        paddingBottom: '0.25rem',
        boxShadow: '0px 2px 10px 0px rgba(30, 255, 157, 0.30), 0px 10px 50px 0px rgba(30, 255, 157, 0.30)',
    },
    'h3': {
        position: 'relative',
        left: '-0.5rem',
        zIndex: '10',
        display: 'flex',
        width: 'fit-content',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '9999px',
        backgroundColor: '#222325',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        paddingTop: '0.25rem',
        paddingBottom: '0.25rem',
        fontSize: '0.75rem',
        lineHeight: '1rem',
        textTransform: 'uppercase',
        color: 'rgb(255 255 255)',
        boxShadow: '0px 2px 10px 0px rgba(0, 0, 0, 0.25), 0px 10px 50px 0px rgba(0, 0, 0, 0.10)',
    },
});

export const FieldWrapper = styled('div')({
    width: '100%',
    borderRadius: '15px',
    border: '1px solid #A8ACB3',
    padding: '28px 32px',
    marginBottom: '30px',
    'label': {
        marginBottom: '13px', 
        display: 'block', 
    },
    'input': {
        display: 'block', 
        width: '100%', 
        borderWidth: '0px', 
        backgroundColor: 'transparent', 
        padding: '0px', 
        fontSize: '1.25rem', 
        lineHeight: '1.75rem', 
        color: 'rgb(17 24 39)', 
        '&:focus, &:active': {
            outline: 'none',
            backgroundColor: 'transparent', 
        },
        '&:-webkit-autofill':  {
            boxShadow: '0 0 0 30px white inset',
        }
    },
    '@media (min-width: 640px)': {
        'input': {
            lineHeight: '1.5rem',
        }
    }
});

export const Submit = styled('button')({
    display: 'flex',
    width: 'fit-content',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: '9999px',
    backgroundColor: 'rgb(28 29 35 / var(--tw-bg-opacity)) !important',
    padding: '0.25rem',
    paddingLeft: '50px',
    fontSize: '1rem',
    lineHeight: '1.25rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    color: 'rgb(255 255 255 / var(--tw-text-opacity))',
    boxShadow: 'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
    '&:hover': {
        backgroundColor: 'rgb(30 255 157 / var(--tw-bg-opacity)) !important',
        color: 'rgb(28 29 35 / var(--tw-text-opacity))',
    },
    'span': {
        display: 'flex',
        width: 'fit-content',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '9999px',
        backgroundColor: 'rgb(30 255 157 / var(--tw-bg-opacity))',
        padding: '0.75rem',
        boxShadow: 'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
        marginLeft: '38px'
    },
    'h3': {
        paddingLeft: '1.25rem',
        paddingRight: '1.25rem',
    }
});