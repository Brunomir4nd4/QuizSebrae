import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { WeekHeader } from './WeekHeader.component';
import { DateTime } from 'luxon';
import { ProvidersDecorator } from '../../../../../../.storybook/decorators/ProvidersDecorator';

export default {
  title: 'components/Molecules/Schedule/WeekHeader',
  component: WeekHeader,
  decorators: [ProvidersDecorator],
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} as Meta<typeof WeekHeader>;

const Template: StoryFn<StoryFn<React.ComponentProps<typeof WeekHeader>>> = () => {
  const now = DateTime.now();
  const weekStart = now.startOf('week');
  const weekEnd = now.endOf('week');

  return <div style={{ padding: 24 }}>{WeekHeader(weekStart, weekEnd)}</div>;
};

export const Default = Template.bind({});
