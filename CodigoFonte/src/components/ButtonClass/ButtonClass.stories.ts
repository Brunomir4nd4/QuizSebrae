import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';

import { ButtonClass } from './index';

const meta = {
  title: 'components/Atoms/Button/ButtonClass',
  component: ButtonClass,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Texto exibido dentro do botão',
    },
    classId: {
      control: 'text',
      description: 'ID da turma (usado no atributo id do botão)',
    },
    onClick: {
      action: 'clicked',
      description: 'Função chamada ao clicar no botão',
    },
  },
  args: {
    text: 'Acessar turma',
    classId: '123',
    onClick: fn(),
  },
} satisfies Meta<typeof ButtonClass>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TextoPersonalizado: Story = {
  args: {
    text: 'Up Digital Marketing 19h T200',
  },
};
