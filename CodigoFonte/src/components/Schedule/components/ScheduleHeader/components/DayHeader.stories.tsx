import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { DayHeader } from './DayHeader.component';
import { DateTime } from 'luxon';
import { ProvidersDecorator } from '../../../../../../.storybook/decorators/ProvidersDecorator';

export default {
  title: 'components/Molecules/Schedule/DayHeader',
  component: DayHeader,
  decorators: [ProvidersDecorator],
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} as Meta<typeof DayHeader>;

const Template: StoryFn<React.ComponentProps<typeof DayHeader>> = () => {
  const now = DateTime.now();
  const weekStart = now.startOf('week');
  const weekEnd = now.endOf('week');

  return <div style={{ padding: 24 }}>{DayHeader(weekStart, weekEnd)}</div>;
};

export const Default = Template.bind({});
