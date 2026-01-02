import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { DayDisplay } from './DayDisplay.component';
import { DateTime } from 'luxon';
import { ProvidersDecorator } from '../../../../../../.storybook/decorators/ProvidersDecorator';

export default {
	title: 'components/Atoms/Schedule/DayDisplay',
	component: DayDisplay,
	decorators: [ProvidersDecorator],
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
} as Meta<typeof DayDisplay>;

const Template: StoryFn<React.ComponentProps<typeof DayDisplay>> = (args) => {
	return (
		<div style={{ background: '#f8f8f8' }}>
			<DayDisplay {...args} />
		</div>
	);
};

export const Default = Template.bind({});
Default.args = { date: DateTime.now(), isHeader: false, isToday: false };

export const Today = Template.bind({});
Today.args = { date: DateTime.now(), isHeader: false, isToday: true };

export const Clickable = Template.bind({});
Clickable.args = { date: DateTime.now(), onClick: () => alert('clicked') };
