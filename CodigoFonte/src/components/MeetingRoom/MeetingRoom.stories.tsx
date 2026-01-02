import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { MeetingRoom } from './MeetingRoom.component';
import { ProvidersDecorator } from '../../../.storybook/decorators/ProvidersDecorator';
import { mockTurmaData } from '../../../.storybook/mocks/turmaData';

export default {
  title: 'components/Organisms/MeetingRoom/MeetingRoom',
  component: MeetingRoom,
  tags: ['autodocs'],
  decorators: [ProvidersDecorator],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof MeetingRoom>;

const Template: StoryFn<React.ComponentProps<typeof MeetingRoom>> = (args) => (
  <div style={{ padding: '40px', background: '#f3f4f6', minHeight: '100vh' }}>
    <MeetingRoom {...args} />
  </div>
);

export const WithCredentials = Template.bind({});
WithCredentials.args = {
  credentials: {
    updRootToken: 'fake-jwt',
    updRoomName: 'appId/roomName',
    updRoomTitle: 'Sala de Teste',
  },
  role: 'student',
  token: 'token-abc',
  classId: '1',
};

export const Facilitator = Template.bind({});
Facilitator.args = {
  credentials: {
    updRootToken: 'fake-jwt',
    updRoomName: 'appId/roomName',
    updRoomTitle: 'Sala de Teste',
  },
  role: 'facilitator',
  token: 'token-abc',
  classId: '1',
};
Facilitator.parameters = {
  turmaData: mockTurmaData,
};
