import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { CardCourse } from './CardCourse.component';
import type { Props } from './CardCourse.interface';

export default {
  title: 'components/Molecules/Card/CardCourse',
  component: CardCourse,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    text: { control: 'text' },
    image: { control: 'text' },
    width: { control: 'number' },
    height: { control: 'number' },
    active: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
} as Meta<Props>;

const Template: StoryFn<Props> = (args) => <CardCourse {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Up Digital Finanças',
  text: 'Entrar',
  image: '/logo-up-marketing.svg',
  width: 100,
  height: 100,
  active: false,
  classId: 1,
};

export const Active = Template.bind({});
Active.args = {
  ...Default.args,
  active: true,
};

export const OutroCurso = Template.bind({});
OutroCurso.args = {
  title: 'Up Digital Marketing',
  text: 'Entrar',
  image: '/logo-up-financas.svg',
  width: 100,
  height: 100,
  active: false,
  classId: 2,
};
