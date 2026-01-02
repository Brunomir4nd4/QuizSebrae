'use client';
import { styled } from '@mui/system';

export const ActiveMatriculaButton = styled('button')({
	display: 'flex',
	alignItems: 'center',
	borderRadius: '9999px',
	backgroundColor: 'transparent !important',
	border: '1px solid rgb(30 255 157 / var(--tw-bg-opacity)) !important',
	padding: '0.25rem',
	justifyContent: 'center',
	width: '272px',
	height: '48px',
	position: 'relative',
	fontSize: '1rem',
	lineHeight: '1.25rem',
	fontWeight: '600',
	textTransform: 'uppercase',
	color: 'rgb(28 29 35 / var(--tw-bg-opacity))',
	boxShadow:
		'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
	'&:not(:disabled):hover': {
		backgroundColor: 'rgb(220, 38, 38) !important',
		color: 'white',
		border: '1px solid rgb(220, 38, 38) !important',
		justifyContent: 'start',
		gap: '8px',

		span: {
			display: 'flex',
		},

		h3: {
			display: 'none',

			'&:nth-of-type(2)': {
				display: 'block',
			},
		},
	},
	span: {
		display: 'none',
		width: 'fit-content',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: '9999px',
		backgroundColor: 'rgb(28 29 35 / var(--tw-bg-opacity)) !important',
		padding: '0.55rem',
		boxShadow:
			'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
	},
	h3: {
		display: 'block',
		'&:nth-of-type(2)': {
			display: 'none',
		},
	},
});

export const RequestedMatriculaButton = styled('button')({
	display: 'flex',
	alignItems: 'center',
	borderRadius: '9999px',
	backgroundColor: '#999999',
	border: '1px solid #999999',
	padding: '0.25rem',
	justifyContent: 'center',
	width: '272px',
	height: '48px',
	position: 'relative',
	fontSize: '1rem',
	lineHeight: '1.25rem',
	fontWeight: '600',
	textTransform: 'uppercase',
	color: 'white',
	cursor: 'unset',
	boxShadow:
		'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
});

export const CanceledMatriculaButton = styled('button')({
	display: 'flex',
	alignItems: 'center',
	borderRadius: '9999px',
	backgroundColor: 'transparent',
	border: '1px solid rgb(220, 38, 38)',
	padding: '0.25rem',
	justifyContent: 'center',
	width: '272px',
	height: '48px',
	position: 'relative',
	fontSize: '1rem',
	lineHeight: '1.25rem',
	fontWeight: '600',
	textTransform: 'uppercase',
	color: 'rgb(220, 38, 38)',
	cursor: 'unset',
	boxShadow:
		'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
});
