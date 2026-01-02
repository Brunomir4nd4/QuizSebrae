'use client';
import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const ModalContainer = styled(Box)(({ theme }) => ({
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '650px',
	maxWidth: '85vw',
	height: 'auto',
	padding: '43px 57px',
	borderRadius: '30px',
	backgroundColor: '#FFDCDC',
	outline: 'none',
	boxShadow:
		'-4px 4px 100px 0px rgba(0, 0, 0, 0.50), 0px 2px 10px 0px rgba(0, 0, 0, 0.25)',
	display: 'flex',
	flexDirection: 'column',
	transition: 'ease-in-out 0.2s all',
	[theme.breakpoints.down('md')]: {
		padding: '35px 20px',
	},
	[theme.breakpoints.down('sm')]: {
		padding: '30px 20px',
		width: '85%',
		maxWidth: '85%',
	},
}));

export const CloseButton = styled('button')({
	borderRadius: '100px',
	border: '1px solid #131616',
	background: 'linear-gradient(149deg, #222325 12.57%, #131616 86.79%)',
	boxShadow:
		'0px 2px 10px 0px rgba(0, 0, 0, 0.50), 0px 10px 50px 0px rgba(0, 0, 0, 0.25)',
	position: 'absolute',
	width: '69px',
	height: '69px',
	top: '0',
	right: '0',
	transform: 'translate(35%, -35%)',
	color: '#FFDCDC',
	transition: 'all 0.2s ease-out',
	fontSize: '34px',
	cursor: 'pointer',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	'&:hover': {
		color: '#ffffff',
	},
	'@media (max-width: 600px)': {
		width: '58px',
		height: '58px',
		transform: 'translate(25%, -25%)',
	},
});

export const CancelButton = styled('button')({
	display: 'flex',
	width: 'fit-content',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: '9999px',
	minWidth: '236px',
	backgroundColor: 'transparent !important',
	border: '2px solid rgb(28 29 35 / var(--tw-bg-opacity))',
	padding: '0.25rem',
	fontSize: '1rem',
	lineHeight: '1.25rem',
	fontWeight: '600',
	color: 'rgb(28 29 35 / var(--tw-bg-opacity))',
	boxShadow:
		'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
});

export const ConfirmButton = styled('button')({
	display: 'flex',
	width: 'fit-content',
	alignItems: 'center',
	justifyContent: 'space-between',
	borderRadius: '9999px',
	backgroundColor: 'rgb(28 29 35 / var(--tw-bg-opacity)) !important',
	padding: '0.25rem',
	paddingRight: '25px',
	fontSize: '1rem',
	lineHeight: '1.25rem',
	fontWeight: '600',
	color: '#FFDCDC',
	boxShadow:
		'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
	span: {
		width: 'fit-content',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: '9999px',
		backgroundColor: '#FFDCDC !important',
		padding: '0.55rem',
		boxShadow:
			'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
		marginRight: '13px',
	},
});

export const StudentCard = styled('div')({
	backgroundColor: '#22232514',
	borderRadius: '16px',
	padding: '20px',
	margin: '24px 0',
	display: 'flex',
	alignItems: 'center',
	gap: '16px',
});

export const ButtonContainer = styled('div')({
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	marginTop: '2rem',
	paddingTop: '0.5rem',

	'@media (max-width: 600px)': {
		flexDirection: 'column',
		gap: '12px',
		alignItems: 'stretch',
		'& > button': {
			width: '100%',
			minWidth: '0',
			height: '48px',
			position: 'relative',

			'& h3': {
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
			},
		},
	},
});
