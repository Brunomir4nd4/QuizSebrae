import type { StoryFn } from '@storybook/nextjs';
import React, { useState } from 'react';
import { CardTime } from './CardTime.component';
import type { Props } from './CardTime.interface';

const meta = {
	title: 'components/Atoms/Card/CardTime',
	tags: ['autodocs'],
	component: CardTime,
	argTypes: {
		time: { control: 'text' },
		active: { control: 'boolean' },
		available: { control: 'boolean' },
		variant: { control: { type: 'select' }, options: ['default', 'black'] },
		group: { control: 'number' },
		is_group_meetings_enabled: { control: 'boolean' },
		groupLimit: { control: 'number' },
	},
};
export default meta;

const Template: StoryFn<Omit<Props, 'setStartTime'>> = (args) => {
	const [, setStartTime] = useState('');
	return (
		<div style={{ maxWidth: 340 }}>
			<CardTime {...args} setStartTime={setStartTime} />
		</div>
	);
};

export const Default = Template.bind({});
Default.args = {
	id: '1',
	time: '14:00',
	active: false,
	available: true,
	variant: 'default',
	group: 2,
	is_group_meetings_enabled: true,
	groupLimit: 5,
};
