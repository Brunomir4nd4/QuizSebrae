import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { mockSubmissions, mockSubmissionResponse } from '../../../.storybook/mocks/submissionData';
import { ProvidersDecorator } from '../../../.storybook/decorators/ProvidersDecorator';
import { StrategicActivitiesSlider } from './StrategicActivitiesSlider.component';

export default {
  title: 'components/Organisms/StrategicActivitiesSlider/StrategicActivitiesSlider',
  component: StrategicActivitiesSlider,
  tags: ['autodocs'],
  decorators: [ProvidersDecorator],
  parameters: {
    initialSubmissions: mockSubmissions,
    layout: 'fullscreen',
    mockData: [
      {
        url: '/api/proxy/submissions*',
        method: 'GET',
        status: 200,
        response: mockSubmissionResponse,
      },
    ],
  },
  argTypes: {
    userId: { control: 'number' },
  },
} as Meta<typeof StrategicActivitiesSlider>;

const Template: StoryFn<React.ComponentProps<typeof StrategicActivitiesSlider>> = (args) => (
  <div style={{ width: '100vw', background: '#f3f4f6' }}>
    <StrategicActivitiesSlider {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  userId: 1,
};
