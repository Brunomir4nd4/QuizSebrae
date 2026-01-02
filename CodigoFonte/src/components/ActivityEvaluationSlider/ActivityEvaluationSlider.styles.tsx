'use client';
import { Box, Button, Drawer } from '@mui/material';
import { styled } from '@mui/system';

const drawerWidth = 579;

export const SliderHeader = styled(Box)(({ theme }) => ({
	display: 'block',
	width: '100%',
	maxWidth: '390px',
	height: 'auto',
	padding: '0',
	marginBottom: '40px',
	[theme.breakpoints.down('md')]: {
		marginBottom: '30px',
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
	padding: '5px',
});

export const SliderArrow = styled(Button)({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	background:
		'linear-gradient(166deg, #06EBBD -3.37%, #1EFF9D 104.04%)!important',
	width: '60px',
	height: '60px',
	borderRadius: '50%',
	padding: '0',
	minWidth: 'inherit',
	transition: 'all 0.2s ease-out',
	'&:hover': {
		transform: 'scale(1.08)',
	},
});

export const StyledDrawer = styled(Drawer)(({ theme }) => ({
	width: drawerWidth,
	maxWidth: '100vw',
	height: '100%',
	flexShrink: 0,
	'& .MuiDrawer-paper': {
		width: drawerWidth,
		maxWidth: '100vw',
		background: 'var(--primary-color)',
		padding: '65px 35px',
		paddingBottom: '130px',
		[theme.breakpoints.down('md')]: {
			padding: '40px 25px',
			paddingBottom: '140px',
		},
	},
}));

export const CloseButton = styled(Button)(({ theme }) => ({
	width: 'auto',
	height: 'auto',
	padding: '5px',
	paddingRight: '50px',
	borderRadius: '50px',
	background: '#222325!important',
	boxShadow:
		'0px 2px 10px 0px rgba(0, 0, 0, 0.25), 0px 10px 50px 0px rgba(0, 0, 0, 0.10)',
	display: 'flex',
	alignItems: 'center',
	flexDirection: 'row',
	cursor: 'pointer',
	textTransform: 'none',
	position: 'fixed',
	bottom: '36px',
	right: '415px',
	border: '2px solid transparent',
	transition: 'all 0.2s ease-out',
	zIndex: '9999',
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
	div: {
		width: '60px',
		height: '60px',
		background: 'linear-gradient(166deg, #06EBBD -3.37%, #1EFF9D 104.04%)',
		boxShadow: '0px 1px 0px 0px #A1FFC7 inset',
		filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
		borderRadius: '50%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: '21px',
		transition: 'all 0.1s ease-out',
	},
	'&:hover': {
		backgroundColor: 'var(--primary-color)!important',
		div: {
			background: 'var(--primary-color)',
			boxShadow: 'none',
			filter: 'none',
		},
		'&:after': {
			width: 'calc(100% + 10px)',
			height: 'calc(100% + 10px)',
			left: '-5px',
			bottom: '-5px',
		},
	},
	[theme.breakpoints.down('md')]: {
		left: '20px',
		right: 'inherit',
		paddingRight: '5px',
		div: {
			marginRight: '0px',
		},
		p: {
			display: 'none',
		},
	},
}));

export const ActionButton = styled(Button)(({ theme }) => ({
	width: 'auto',
	height: 'auto',
	padding: '5px',
	paddingRight: '50px',
	borderRadius: '50px',
	background: '#222325!important',
	boxShadow:
		'0px 2px 10px 0px rgba(0, 0, 0, 0.25), 0px 10px 50px 0px rgba(0, 0, 0, 0.10)',
	display: 'flex',
	alignItems: 'center',
	flexDirection: 'row',
	cursor: 'pointer',
	textTransform: 'none',
	position: 'fixed',
	bottom: '36px',
	border: '2px solid transparent',
	transition: 'all 0.2s ease-out',
	zIndex: '9999',
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
	div: {
		width: '60px',
		height: '60px',
		background: 'linear-gradient(166deg, #06EBBD -3.37%, #1EFF9D 104.04%)',
		boxShadow: '0px 1px 0px 0px #A1FFC7 inset',
		filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
		borderRadius: '50%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: '21px',
		transition: 'all 0.1s ease-out',
	},
	'&:hover': {
		backgroundColor: 'var(--primary-color)!important',
		div: {
			background: 'var(--primary-color)',
			boxShadow: 'none',
			filter: 'none',
		},
		'&:after': {
			width: 'calc(100% + 10px)',
			height: 'calc(100% + 10px)',
			left: '-5px',
			bottom: '-5px',
		},
	},
	[theme.breakpoints.down('md')]: {
		left: '20px',
		right: 'inherit',
		paddingRight: '5px',
		div: {
			marginRight: '0px',
		},
		p: {
			display: 'none',
		},
	},
}));

export const OpenButton = styled(Button)(({ theme }) => ({
	width: 'auto',
	height: 'auto',
	padding: '5px',
	paddingRight: '50px',
	borderRadius: '50px',
	background: 'var(--primary-color)!important',
	boxShadow:
		'0px 2px 10px 0px rgba(0, 0, 0, 0.25), 0px 10px 50px 0px rgba(0, 0, 0, 0.10)',
	display: 'flex',
	alignItems: 'center',
	flexDirection: 'row',
	cursor: 'pointer',
	textTransform: 'none',
	position: 'fixed',
	bottom: '36px',
	right: '36px',
	border: '2px solid transparent',
	transition: 'all 0.2s ease-out',
	zIndex: '9999',
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
	div: {
		width: '60px',
		height: '60px',
		background: '#131616',
		boxShadow: '0px 1px 0px 0px #A1FFC7 inset',
		filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
		borderRadius: '50%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: '21px',
		transition: 'all 0.1s ease-out',
	},
	'&:hover': {
		background: '#131616!important',
		borderColor: 'var(--primary-color)',
		div: {
			boxShadow: 'none',
			filter: 'none',
		},
		'&:after': {
			width: 'calc(100% + 10px)',
			height: 'calc(100% + 10px)',
			left: '-5px',
			bottom: '-5px',
		},
	},
	[theme.breakpoints.down('md')]: {
		bottom: '80px',
		right: '16px',
		paddingRight: '5px',
		p: {
			display: 'none',
		},
		div: {
			marginRight: '0px',
		},
	},
}));
