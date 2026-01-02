import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { Card } from './Card.component';
import { Props as CardProps } from './Card.interface';

export default {
  title: 'components/Molecules/Card/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    target: { control: 'text' },
  },
} as Meta;

const Template: StoryFn<CardProps> = (args) => <Card {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Título',
  text: 'Descrição',
  href: '/',
  image: '/icon-agenda.svg',
  target: '_self',
};

export const AdministrarAgenda = Template.bind({});
AdministrarAgenda.args = {
	title: 'Agenda',
	text: 'administrar',
	href: '/teste',
	image: '/icon-agenda.svg',
	target: '_self',
};

export const AgendarMentoria = Template.bind({});
AgendarMentoria.args = {
  title: 'Mentorias',
  text: 'agendar',
  href: '/teste',
  image: '/icon-consultoria-green.svg',
  target: '_self',
};

export const GerenciarTurmas = Template.bind({});
GerenciarTurmas.args = {
	title: 'Turmas',
	text: 'gerenciar',
	href: '/teste',
	image: '/icon-turmas.svg',
	target: '_self',
};

export const AvaliarJornada = Template.bind({});
AvaliarJornada.args = {
	title: 'Jornada',
	text: 'avaliar',
	href: '/teste',
	image: '/icon-jornada-green.svg',
	target: '_self',
};

