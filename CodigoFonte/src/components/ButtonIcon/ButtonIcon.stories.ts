import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';

import { ButtonIcon } from './ButtonIcon.component';

const meta = {
  title: 'components/Atoms/Button/ButtonIcon',
  component: ButtonIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Texto exibido no botão',
    },
    icon: {
      control: 'text',
      description: 'URL da imagem usada como ícone',
    },
    onClick: {
      action: 'clicked',
      description: 'Função chamada ao clicar no botão',
    },
    disabled: {
      control: 'boolean',
      description: 'Desativa o botão',
    },
  },
  args: {
    text: 'Entrar',
    icon: '/icon-arrow-right.svg',
    onClick: fn(),
    disabled: false,
  },
} satisfies Meta<typeof ButtonIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
