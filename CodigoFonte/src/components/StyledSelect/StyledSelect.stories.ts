import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';

import { StyledSelect } from './StyledSelect.component';

const meta = {
  title: 'components/Atoms/Select/StyledSelect',
  component: StyledSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
    },
    items: {
      control: 'object',
    },
    value: {
      control: 'text',
    },
    setValue: {
      action: 'value changed',
    },
    name: {
      control: 'text',
    },
    variant: {
      control: 'boolean',
    },
  },
  args: {
    placeholder: 'Selecione uma opção',
    items: ['Opção 1', 'Opção 2', 'Opção 3'],
    value: '',
    setValue: fn(),
    name: 'select',
    variant: true,
  },
} satisfies Meta<typeof StyledSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const VariantFalse: Story = {
  args: {
    variant: false,
  },
};