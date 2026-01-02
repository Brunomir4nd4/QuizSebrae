import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';

import { StyledInput } from './StyledInput.component';

const meta = {
  title: 'components/Atoms/Input/StyledInput',
  component: StyledInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
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
    placeholder: 'Digite algo',
    value: 'Texto de exemplo',
    setValue: fn(),
    name: 'input',
    variant: true,
  },
} satisfies Meta<typeof StyledInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const VariantFalse: Story = {
  args: {
    variant: false,
    value: 'Texto de exemplo',
  },
};