'use client';
import { styled } from '@mui/system';

export const Section = styled('section')({
	display: 'flex',
	width: '100%',
	height: '100vh',
	maxWidth: '2500px',
	opacity: '1',
	backgroundColor: '#ffffff',
	'@media (max-width: 1024px)': {
		flexDirection: 'column',
	},
	'.marca-produto': {
		position: 'absolute',
		top: '1.5rem',
		left: '1.25rem',
		'@media (min-width: 768px)': {
			top: '2.5rem',
			left: '2.5rem',
		},
	},
	'.marca-parceiro': {
		position: 'absolute',
		bottom: '2.5rem',
		left: '-8rem',
	},
});

export const ImageCover = styled('div')({
	position: 'relative',
	opacity: '1',
	backgroundColor: '#ffffff',
	boxShadow: '4px 0px 40px rgba(0, 0, 0, 0.25)',
	width: '58.333333%',
	clipPath: 'polygon(0 0, 100% 0, 70% 100%, 0% 100%)',
	'@media (max-width: 1024px)': {
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
	'@media (min-width: 1024px)': {
		flex: '1 1 0%',
		width: '41.666667%',
		paddingRight: '5rem',
		'&:after': {
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
	span: {
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
		boxShadow:
			'0px 2px 10px 0px rgba(30, 255, 157, 0.30), 0px 10px 50px 0px rgba(30, 255, 157, 0.30)',
	},
	h3: {
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
		boxShadow:
			'0px 2px 10px 0px rgba(0, 0, 0, 0.25), 0px 10px 50px 0px rgba(0, 0, 0, 0.10)',
	},
});
