import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { WeekHeading } from './WeekHeading.component';
import { DateTime } from 'luxon';
import { ProvidersDecorator } from '../../../../../../.storybook/decorators/ProvidersDecorator';

export default {
  title: 'components/Atoms/Schedule/WeekHeading',
  component: WeekHeading,
  decorators: [ProvidersDecorator],
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} as Meta<typeof WeekHeading>;

const Template: StoryFn<React.ComponentProps<typeof WeekHeading>> = () => <div style={{ padding: 24 }}>{WeekHeading(DateTime.now())}</div>;

export const Default = Template.bind({});
