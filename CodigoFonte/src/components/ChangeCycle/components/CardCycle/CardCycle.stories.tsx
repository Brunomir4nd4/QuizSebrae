import type { Meta, StoryObj } from '@storybook/nextjs';
import { CardCycle } from './CardCycle.component';

const meta: Meta<typeof CardCycle> = {
  title: 'components/Molecules/Card/CardCycle',
  component: CardCycle,
  tags: ['autodocs'],
  argTypes: {
    setConsultancyDate: { action: 'clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof CardCycle>;

export const Active: Story = {
  args: {
    title: 'Ativo',
    numberDay: 15,
    id: '1',
    active: true,
    disabled: false,
    setConsultancyDate: () => {},
  },
};

export const Disabled: Story = {
  args: {
    title: 'Indisponível',
    numberDay: 22,
    id: '2',
    active: false,
    disabled: true,
    setConsultancyDate: () => {},
  },
};

export const Clickable: Story = {
  args: {
    title: 'Disponível',
    numberDay: 5,
    id: '3',
    active: false,
    disabled: false,
    setConsultancyDate: () => console.log('Cycle clicked!'),
  },
};
