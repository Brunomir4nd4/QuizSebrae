'use client';
import { Box, IconButton } from '@mui/material';
import { styled } from '@mui/system';

export const ModalContent = styled(Box)(({ theme }) => ({
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '850px',
	maxWidth: '85vw',
	height: 'auto',
	padding: '43px 57px',
	borderRadius: '30px',
	background: '#1EFF9D',
	boxShadow:
		'-4px 4px 100px 0px rgba(0, 0, 0, 0.50), 0px 2px 10px 0px rgba(0, 0, 0, 0.25)',
	position: 'relative',
	display: 'flex',
	flexDirection: 'column',
	transition: 'ease-in-out 0.2s all',
	[theme.breakpoints.down('md')]: {
		padding: '35px 20px',
	},
	[theme.breakpoints.down('sm')]: {
		padding: '30px 20px',
		width: '90%',
		maxWidth: '90%',
		'& h3:first-of-type': {
			maxWidth: 'calc(100% - 60px)',
		},
	},
}));

export const ModalClose = styled(IconButton)({
	borderRadius: '100px',
	border: '1px solid #131616',
	background:
		'linear-gradient(149deg, #222325 12.57%, #131616 86.79%)!important',
	boxShadow:
		'0px 2px 10px 0px rgba(0, 0, 0, 0.50), 0px 10px 50px 0px rgba(0, 0, 0, 0.25)',
	position: 'absolute',
	width: '69px',
	height: '69px',
	top: '0',
	right: '0',
	transform: 'translate(35%, -35%)',
	color: '#1EFF9D',
	transition: 'all 0.2s ease-out',
	fontSize: '34px',
	'&:hover': {
		color: '#ffffff',
	},
	'@media (max-width: 600px)': {
		width: '58px',
		height: '58px',
		transform: 'translate(25%, -25%)',
	},
});
