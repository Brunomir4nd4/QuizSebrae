import { Button, styled } from '@mui/material';

export const DownloadButton = styled(Button)({
	width: '44px',
	minWidth: '44px',
	height: '44px',
	padding: '1px',
	borderRadius: '30px',
	background: '#222325!important',
	boxShadow:
		'0px 2px 10px 0px rgba(0, 0, 0, 0.25), 0px 10px 50px 0px rgba(0, 0, 0, 0.10)',
	cursor: 'pointer',
	textTransform: 'none',
	position: 'absolute',
	left: 0,
	bottom: '-50px',
	'&:after': {
		content: '""',
		width: '100%',
		height: '100%',
		position: 'absolute',
		background: '#FFB31E',
		borderRadius: '40px',
		opacity: '0.2',
		left: '0',
		bottom: '0',
		transition: 'all 0.2s ease-out',
	},
	div: {
		width: '42px',
		height: '42px',
		background: 'linear-gradient(166deg, #EBD406 -3.37%, #FFB21E 104.04%)',
		borderRadius: '50%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	'&:hover': {
		background: '#222325',
		'&:after': {
			width: 'calc(100% + 10px)',
			height: 'calc(100% + 10px)',
			left: '-5px',
			bottom: '-5px',
		},
	},
	'@media (max-width: 600px)': {
		marginTop: '0px',
		margin: '0',
	},
});
