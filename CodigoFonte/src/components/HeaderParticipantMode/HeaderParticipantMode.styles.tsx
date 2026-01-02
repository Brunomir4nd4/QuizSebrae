'use client'
import { styled } from '@mui/system';

export const Button = styled('button')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '50px',
  backgroundColor: 'rgb(28 29 35 / var(--tw-bg-opacity)) !important',
  padding: '16px 40px;',
  fontSize: '18px',
  lineHeight: 'normal',
  fontWeight: '700',
  color: '#1EFF9D',
  boxShadow: '0px 10px 50px 0px rgba(0, 0, 0, 0.10), 0px 2px 10px 0px rgba(0, 0, 0, 0.25)',
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
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '14px',
    padding: '16px 30px;',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '10px 18px;',
  },
  '@media (max-width: 450px)': {
    fontSize: '12px',
    fontWeight: '600',
    padding: '6px 10px',
  },
}));