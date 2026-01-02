import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { ActivityManagement } from './ActivityManagement.component';
import { ProvidersDecorator } from '../../../.storybook/decorators/ProvidersDecorator';
import { mockTurmaData } from '../../../.storybook/mocks/turmaData';

export default {
  title: 'components/Organisms/ActivityManagement/ActivityManagement',
  component: ActivityManagement,
  tags: ['autodocs'],
  decorators: [ProvidersDecorator],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof ActivityManagement>;

const Template: StoryFn<React.ComponentProps<typeof ActivityManagement>> = (args) => (
  <div style={{ padding: '40px', background: '#f3f4f6', minHeight: '100vh' }}>
    <ActivityManagement {...args} />
  </div>
);

export const Default = Template.bind({});
Default.parameters = {
  turmaData: mockTurmaData,
};
