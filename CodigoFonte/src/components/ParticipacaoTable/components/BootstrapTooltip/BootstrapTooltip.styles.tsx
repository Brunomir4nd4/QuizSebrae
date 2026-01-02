'use client';
import { Tooltip, TooltipProps, tooltipClasses } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';

interface TooltipParticipation extends TooltipProps {
	whatsapp?: boolean;
}

const StyledTooltip = styled(
	({ className, whatsapp, ...props }: TooltipParticipation) => {
		void whatsapp;
		return (
			<Tooltip
				{...props}
				arrow
				classes={{ popper: className }}
				style={{
					marginLeft: '10px !important',
				}}
			/>
		);
	},
)(({ theme }) => ({
	[`& .${tooltipClasses.arrow}`]: {
		color: theme.palette.common.black,
	},
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.common.black,
	},
}));

export const BootstrapTooltip: React.FC<TooltipParticipation> = (props) => {
	return <StyledTooltip {...props} />;
};
