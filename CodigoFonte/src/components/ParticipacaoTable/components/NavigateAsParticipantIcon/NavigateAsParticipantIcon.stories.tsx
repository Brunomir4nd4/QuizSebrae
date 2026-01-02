import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { NavigateAsParticipantIcon } from './NavigateAsParticipantIcon.component';
import { ProvidersDecorator } from '../../../../../.storybook/decorators/ProvidersDecorator';

export default {
  title: 'components/Atoms/Button/NavigateAsParticipantIcon',
  tags: ['autodocs'],
  component: NavigateAsParticipantIcon,
  decorators: [ProvidersDecorator],
  parameters: { layout: 'centered' },
} as Meta<typeof NavigateAsParticipantIcon>;

const Template: StoryFn<React.ComponentProps<typeof NavigateAsParticipantIcon>> = (args) => (
  <div style={{ padding: 24 }}>
    <NavigateAsParticipantIcon {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  studentId: 1,
  showLabel: false,
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  studentId: 2,
  showLabel: true,
};
