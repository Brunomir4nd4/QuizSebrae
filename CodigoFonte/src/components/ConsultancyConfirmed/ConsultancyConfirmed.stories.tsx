import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { ConsultancyConfirmed } from './ConsultancyConfirmed.component';
import { ProvidersDecorator } from '../../../.storybook/decorators/ProvidersDecorator';

export default {
  title: 'components/Molecules/Consultancy/ConsultancyConfirmed',
  component: ConsultancyConfirmed,
  tags: ['autodocs'],
  decorators: [ProvidersDecorator],
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof ConsultancyConfirmed>;

const Template: StoryFn<React.ComponentProps<typeof ConsultancyConfirmed>> = (args) => (
  <div style={{ padding: 40, background: '#f3f4f6', minHeight: '100vh' }}>
    <ConsultancyConfirmed {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  start_datetime: '2025-11-20 14:00:00',
  classId: 'class-1',
  is_group_meetings_enabled: false,
  meeting_id: '',
};

export const GroupMeeting = Template.bind({});
GroupMeeting.args = {
  start_datetime: '2025-11-20 14:00:00',
  classId: 'class-1',
  is_group_meetings_enabled: true,
  meeting_id: 'meeting-1',
};
