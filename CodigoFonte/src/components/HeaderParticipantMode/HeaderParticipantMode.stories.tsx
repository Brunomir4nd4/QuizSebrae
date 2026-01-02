import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { HeaderParticipantMode } from './HeaderParticipantMode.component';
import { ProvidersDecorator } from '../../../.storybook/decorators/ProvidersDecorator';

export default {
  title: 'components/Molecules/Header/HeaderParticipantMode',
  component: HeaderParticipantMode,
  tags: ['autodocs'],
  decorators: [ProvidersDecorator],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof HeaderParticipantMode>;

const Template: StoryFn = () => {
  React.useEffect(() => {
    localStorage.setItem(
      'participantModeStorage',
      JSON.stringify({
        id: 'supervisor-1',
        cpf: '123.456.789-00',
        participantId: 'participant-1',
        participantCpf: '987.654.321-00',
        displayName: 'Supervisor Exemplo',
      }),
    );
    localStorage.setItem('isParticipantMode', 'true');
    localStorage.setItem('originalPage', '/home');
  }, []);

  return (
    <div style={{ paddingTop: 120 }}>
      <HeaderParticipantMode />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {};
