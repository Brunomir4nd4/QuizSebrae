import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { ConsultancySecondStep } from './ConsultancySecondStep.component';
import { ProvidersDecorator } from '../../../../../.storybook/decorators/ProvidersDecorator';

export default {
	title: 'components/Molecules/Consultorias/ConsultancySecondStep',
	component: ConsultancySecondStep,
	tags: ['autodocs'],
	decorators: [ProvidersDecorator],
	parameters: {
		layout: 'fullscreen',
	},
} as Meta<typeof ConsultancySecondStep>;

const Template: StoryFn<React.ComponentProps<typeof ConsultancySecondStep>> = (
	args,
) => (
	<div
		style={{
			padding: 32,
			boxSizing: 'border-box',
			background: '#f3f4f6',
			overflowX: 'auto',
			minWidth: 400,
			width: '100vw',
		}}>
		<ConsultancySecondStep {...args} />
	</div>
);

const bookingMock = {
	date: '9999-11-20',
	slots: [
		{ id: '1', date: '9999-11-20', time: '09:00:00', appointment_count: 0 },
		{ id: '2', date: '9999-11-20', time: '10:00:00', appointment_count: 1 },
		{ id: '3', date: '9999-11-20', time: '14:00:00', appointment_count: 2 },
	],
};

export const Default = Template.bind({});
Default.args = {
	dateWithSlots: bookingMock,
	consultancyDate: '9999-11-20',
	setStartTime: (time: string) => console.log('setStartTime', time),
	startTime: '',
	is_group_meetings_enabled: false,
	groupLimit: 5,
};
