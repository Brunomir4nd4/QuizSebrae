'use client';
import { styled } from '@mui/system';

interface NavigateAsParticipantIconWrapperProps {
	showLabel?: boolean;
}

export const NavigateAsParticipantIconWrapper = styled(
	'a',
)<NavigateAsParticipantIconWrapperProps>(({ theme, showLabel }) => ({
	padding: '0',
	borderRadius: '100%',
	cursor: 'pointer',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	...(!showLabel && {
		[theme.breakpoints.up('md')]: {
			padding: '9px',
		},
	}),
	a: {
		display: 'flex',
		minHeight: '90px',
		padding: '20px 0',
		justifyContent: 'center',
		alignItems: 'center',
	},
	img: {
		minWidth: '25px',
		minHeight: '25px',
		width: '25px',
		height: '25px',
	},
	...(!showLabel && {
		'&:hover, &.active': {
			background: 'linear-gradient(166deg, #00FFA3 -3.37%, #1EFF9D 104.04%)',
			boxShadow:
				'0px 1px 0px 0px #A1FFC7 inset, 0px 4px 4px 0px rgba(7, 13, 38, 0.50), 0px 10px 80px 0px rgba(30, 255, 157, 0.20)',
		},
	}),
}));
