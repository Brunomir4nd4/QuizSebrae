import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';

import { ButtonSimple } from './ButtonSimple.component';

const meta = {
  title: 'components/Atoms/Button/ButtonSimple',
  component: ButtonSimple,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Texto do botão',
    },
    icon: {
      control: 'text',
      description: 'URL do ícone',
    },
    href: {
      control: 'text',
      description: 'Link de redirecionamento',
    },
    target: {
      control: {
        type: 'inline-radio',
        options: [ '_blank','_self'],
      },
      description: 'Onde abrir o link',
    },
    index: {
      control: 'number',
      description: 'Índice único para gerar o id do botão',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback ao clicar',
    },
  },
  args: {
    text: 'Acessar conteúdo',
    href: 'http://www.google.com',
    icon: '/icon-whats.svg',
    target: '_blank',
    index: 1,
    onClick: fn(),
  },
} satisfies Meta<typeof ButtonSimple>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TargetSelf: Story = {
  args: {
    target: '_self',
  },
};
