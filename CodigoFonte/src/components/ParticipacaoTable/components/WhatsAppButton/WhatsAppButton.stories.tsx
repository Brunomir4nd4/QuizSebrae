import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { WhatsAppButton } from './WhatsAppButton.component';
import { ProvidersDecorator } from '../../../../../.storybook/decorators/ProvidersDecorator';

export default {
  title: 'components/Atoms/Button/WhatsAppButton',
  component: WhatsAppButton,
  decorators: [ProvidersDecorator],
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} as Meta<typeof WhatsAppButton>;

const Template: StoryFn<React.ComponentProps<typeof WhatsAppButton>> = (args) => (
  <div style={{ padding: 24 }}>
    <WhatsAppButton {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  phone: '5511999999999',
  whatsAppMessage: 'Olá! Gostaria de falar sobre a turma.',
  showLabel: false,
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  phone: '5511988888888',
  whatsAppMessage: 'Olá, tudo bem?',
  showLabel: true,
};
