import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { CardHighlight } from './CardHighlight.component';
import { Props } from './CardHighlight.interface';

export default {
  title: 'components/Molecules/Card/CardHighlight',
  component: CardHighlight,
  tags: ['autodocs'],
  argTypes: {
    turno: {
      control: {
        type: 'select',
        options: ['diurno', 'noturno', 'vespertino', 'unica'],
      },
    },
  },
} as Meta;

const Template: StoryFn<Props> = (args) => <CardHighlight {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Ao Vivo',
  text: 'Entrar',
  href: '/sala-de-reuniao/1',
  image: '/online.svg',
  turno: 'diurno',
};
