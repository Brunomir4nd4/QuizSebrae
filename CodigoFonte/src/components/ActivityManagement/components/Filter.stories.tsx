import React from 'react';
import { Meta, StoryObj } from '@storybook/nextjs';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Filter } from './Filter.component';

const meta: Meta<typeof Filter> = {
  title: 'components/Molecules/ActivityManagement/Filter',
  component: Filter,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Filter>;

// Wrapper to make the Select interactive in the story
const ControlledTemplate = (props: { initial?: string }) => {
  const [value, setValue] = React.useState(props.initial ?? 'todas');

  return (
    <div style={{ width: 540 }}>
      <Filter filter={value} onChange={(v) => setValue(v)} />
      <div data-testid='current-filter' style={{ marginTop: 12 }}>
        Valor atual: {value}
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <ControlledTemplate initial='todas' />,
  name: 'Default (controlled)',
};

export const Static: Story = {
  args: {
    filter: 'todas',
    onChange: () => {},
  },
  name: 'Static (uncontrolled args)',
};
