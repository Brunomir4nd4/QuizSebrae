import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { Participacao } from './Participacao.component';
import { ProvidersDecorator } from '../../../.storybook/decorators/ProvidersDecorator';
import { mockTurmaData } from '../../../.storybook/mocks/turmaData';

export default {
  title: 'components/Organisms/Participacao/Participacao',
  tags: ['autodocs'],
  component: Participacao,
  decorators: [ProvidersDecorator],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof Participacao>;

const Template: StoryFn<React.ComponentProps<typeof Participacao>> = (args) => (
  <div style={{ padding: 24, background: '#f3f4f6' }}>
    <Participacao {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  token: 'fake-token',
  type: 'facilitator',
};
Default.parameters = {
  turmaData: mockTurmaData,
};
