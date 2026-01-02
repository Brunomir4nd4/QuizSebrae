import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { Maintenance } from './Maintenance.component';
import { ProvidersDecorator } from '../../../.storybook/decorators/ProvidersDecorator';

export default {
  title: 'Pages/Maintenance',
  component: Maintenance,
  tags: ['autodocs'],
  decorators: [ProvidersDecorator],
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof Maintenance>;

const Template: StoryFn<React.ComponentProps<typeof Maintenance>> = (args) => (
  <div style={{ padding: 40 }}>
    <Maintenance {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  banner: '/bg-login2.jpg',
  title: 'Manutenção programada',
  message: 'Voltamos em breve',
  description: 'Estamos realizando melhorias no sistema. Em breve tudo estará disponível novamente.',
};
