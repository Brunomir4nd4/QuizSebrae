import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { DayHeading } from './DayHeading.component';
import { DateTime } from 'luxon';
import { ProvidersDecorator } from '../../../../../../.storybook/decorators/ProvidersDecorator';

export default {
  title: 'components/Atoms/Schedule/DayHeading',
  component: DayHeading,
  decorators: [ProvidersDecorator],
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} as Meta<typeof DayHeading>;

const Template: StoryFn<React.ComponentProps<typeof DayHeading>> = () => <div style={{ padding: 24 }}>{DayHeading(DateTime.now())}</div>;

export const Default = Template.bind({});
