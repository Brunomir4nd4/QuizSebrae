import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { DayNavigation } from './DayNavigation.component';
import { DateTime } from 'luxon';
import { ProvidersDecorator } from '../../../../../../.storybook/decorators/ProvidersDecorator';

export default {
  title: 'components/Molecules/Schedule/DayNavigation',
  component: (DayNavigation as unknown) as React.ComponentType<unknown>,
  decorators: [ProvidersDecorator],
  parameters: { layout: 'centered' },
} as Meta<unknown>;

const Template: StoryFn<unknown> = () => {
  const now = DateTime.now();
  const weekStart = now.startOf('week');
  const weekEnd = now.endOf('week');

  return (
    <div style={{ padding: 24 }}>
      {DayNavigation(weekStart, weekEnd, () => alert('previous'), () => alert('next'))}
    </div>
  );
};

export const Default = Template.bind({});
