import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { ConsultancyFirstStep } from './ConsultancyFirstStep.component';
import { ProvidersDecorator } from '../../../../../.storybook/decorators/ProvidersDecorator';

export default {
	title: 'components/Molecules/Consultorias/ConsultancyFirstStep',
	component: ConsultancyFirstStep,
	tags: ['autodocs'],
	decorators: [ProvidersDecorator],
	parameters: {
		layout: 'fullscreen',
	},
} as Meta<typeof ConsultancyFirstStep>;

const Template: StoryFn<React.ComponentProps<typeof ConsultancyFirstStep>> = (
	args,
) => (
	<div style={{ background: '#f3f4f6' }}>
		<div style={{ padding: '40px', width: 'fit-content', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '20px' }}>
			<ConsultancyFirstStep {...args} />
		</div>
	</div>
);

export const Default = Template.bind({});
Default.args = {
	labelConfiguration: {
		label_configuration_regular: 'Individual',
		label_configuration_strong: 'Mentoria',
		label_configuration_suffix: 'ª',
	},
	consultancyDates: [
		['9999-11-20', '9999-11-21', '9999-11-22'],
		['9999-11-27', '9999-11-28', '9999-11-29'],
	],
	currentDateSelected: null,
	classId: '1',
	userAppointments: null,
	chooseConsultancyDate: async (date: string) =>
		console.log('chooseConsultancyDate', date),
	is_group_meetings_enabled: false,
};
