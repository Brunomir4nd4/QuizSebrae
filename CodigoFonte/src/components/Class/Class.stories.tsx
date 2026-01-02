import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { Class } from './Class.component';

export default {
  title: 'components/Molecules/Class/Class',
  component: Class,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    href: { control: 'text' },
    buttonText: { control: 'text' },
    small: { control: 'boolean' },
    query: { control: 'text' },
  },
} as Meta<typeof Class>;

const Template: StoryFn<React.ComponentProps<typeof Class>> = (args) => (
  <div style={{ width: '60vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Class {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  name: 'Turma de Exemplo',
  href: '/turma/detalhes',
  buttonText: 'Ver Detalhes',
  small: false,
};

export const Small = Template.bind({});
Small.args = {
  ...Default.args,
  small: true,
};