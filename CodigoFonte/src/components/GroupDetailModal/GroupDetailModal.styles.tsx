'use client'
import { Box, Button, IconButton, Stack } from '@mui/material';
import { margin, styled } from '@mui/system';
import Link from 'next/link';

export const ModalContent = styled(Box)(({ theme }) => ({
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '850px',
  maxWidth: '90vw',
  height: 'auto',
  padding: '43px 57px',
  borderRadius: '30px',
  background: '#774CF3',
  boxShadow: '-4px 4px 100px 0px rgba(0, 0, 0, 0.50), 0px 2px 10px 0px rgba(0, 0, 0, 0.25)',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    maxWidth: 'calc(100% - 60px)',
    padding: '0px',
    height: '90%',
    '& > div': {
      borderRadius: '30px',
      padding: '35px 20px',
      height: '100%',
      overflow: 'auto',
    }
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    borderRadius: '0px',
    padding: '20px 20px',
    height: '100%',
    '& > div': {
      padding: '0',
      borderRadius: '0',
    }
  }
}));

export const ModalClose = styled(IconButton)(({ theme }) => ({
  borderRadius: '100px',
  border: '1px solid #131616',
  background: 'linear-gradient(149deg, #222325 12.57%, #131616 86.79%)!important',
  boxShadow: '0px 2px 10px 0px rgba(0, 0, 0, 0.50), 0px 10px 50px 0px rgba(0, 0, 0, 0.25)',
  position: 'absolute',
  width: '69px',
  height: '69px',
  top: '0',
  right: '0',
  transform: 'translate(35%, -35%)',
  color: '#774CF3',
  transition: 'all 0.2s ease-out',
  fontSize: '34px',
  '&:hover': {
    color: '#ffffff',
  },
  [theme.breakpoints.down('sm')]: {
    width: '49px',
    height: '49px',
    top: '5px',
    right: '5px',
    transform: 'translate(0%, 0%)',
  }
}));

export const ModalInfo = styled(Stack)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  padding: '34px 32px',
  borderRadius: '10px',
  background: '#6237DE',
  marginTop: '24px',
  marginBottom: '40px',
  flexDirection: 'row',
  justifyContent: 'space-between',
  'p img': {
    marginRight: '11px'
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    padding: '20px',
  },
}));

export const ModalClientsWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'row',
  gap: '12px',
  flexWrap: 'wrap',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column'
  },
}));


export const ModalClient = styled(Stack)(({ theme }) => ({
  width: `100%`,
  height: '64px',
  padding: '0 0 0 24px',
  borderRadius: '10px',
  background: '#6237DE',
  flexDirection: 'row',
  justifyContent: 'space-between',
  'p img': {
    marginRight: '11px'
  },
  [theme.breakpoints.down('md')]: {
    height: '80px',
  },
}));

export const ModalLink = styled(Link)(({ theme }) => ({
  width: "auto",
  height: "auto",
  padding: "5px",
  paddingRight: "40px",
  borderRadius: "30px",
  background: "#222325!important",
  boxShadow:
    "0px 2px 10px 0px rgba(0, 0, 0, 0.25), 0px 10px 50px 0px rgba(0, 0, 0, 0.10)",
  marginTop: "28px",
  display: "flex",
  alignItems: "center",
  flexDirection: "row",
  cursor: "pointer",
  textTransform: "none",
  position: "relative",
  "&:after": {
    content: '""',
    width: "100%",
    height: "100%",
    position: "absolute",
    background: "rgba(0,0,0,0.1)",
    borderRadius: "40px",
    left: "0",
    bottom: "0",
    transition: "all 0.2s ease-out",
  },
  'div': {
    width: "42px",
    height: "42px",
    background: "linear-gradient(166deg, #E372FF -3.37%, #FF56F8 104.04%)",
    boxShadow: "0px 1px 0px 0px #EF8CFF inset",
    filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "21px",
    img: {
      maxHeight: "60%",
    },
  },
  "&:hover": {
    background: "#222325",
    "&:after": {
      width: "calc(100% + 10px)",
      height: "calc(100% + 10px)",
      left: "-5px",
      bottom: "-5px",
    },
  },
  [theme.breakpoints.down('md')]: {
    marginTop: '16px',
    width: '100%',
  },
}));

export const ModalButton = styled(Button)(({ theme }) => ({
  width: 'auto',
  height: 'auto',
  padding: '5px',
  paddingRight: '40px',
  borderRadius: '30px',
  background: '#222325!important',
  boxShadow: '0px 2px 10px 0px rgba(0, 0, 0, 0.25), 0px 10px 50px 0px rgba(0, 0, 0, 0.10)',
  marginTop: '28px',
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
    background: 'rgba(0,0,0,0.1)',
    borderRadius: '40px',
    left: '0',
    bottom: '0',
    transition: 'all 0.2s ease-out',
  },
  'div': {
    width: '42px',
    height: '42px',
    background: "linear-gradient(166deg, #9672FF -3.37%, #8156FF 104.04%)",
    boxShadow: "0px 1px 0px 0px #AA8CFF inset",
    filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '21px'
  },
  '&:hover': {
    background: '#222325',
    '&:after': {
      width: 'calc(100% + 10px)',
      height: 'calc(100% + 10px)',
      left: '-5px',
      bottom: '-5px',
    }
  },
  [theme.breakpoints.down('md')]: {
    marginTop: '16px',
    width: '100%',
    justifyContent: 'flex-start',
  },
}));