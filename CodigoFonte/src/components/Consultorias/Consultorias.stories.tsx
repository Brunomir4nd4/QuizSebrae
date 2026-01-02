import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { Consultorias } from './Consultorias.component';
import { ProvidersDecorator } from '../../../.storybook/decorators/ProvidersDecorator';
import { Appointment } from '@/types/IAppointment';

export default {
  title: 'components/Organisms/Consultorias/Consultorias',
  component: Consultorias,
  tags: ['autodocs'],
  decorators: [ProvidersDecorator],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof Consultorias>;

const Template: StoryFn<React.ComponentProps<typeof Consultorias>> = (args) => (
  <div style={{ padding: 40, background: '#f3f4f6', width: '100vw' }}>
    <Consultorias {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  userAppointmentsByClass: [] as Appointment[],
  meetingType: {
    is_group_meetings_enabled: false,
    facilitator: {
      ID: 1,
      user_firstname: 'Facilitador',
      user_lastname: 'Exemplo',
      user_email: 'facilitador@example.com',
      display_name: 'Facilitador Exemplo',
      phone: '123-456-7890',
      whatsapp_message: 'Olá, gostaria de agendar uma consultoria.',
    },
  },
};

export const WithGroupMeetings = Template.bind({});
WithGroupMeetings.args = {
  userAppointmentsByClass: [] as Appointment[],
  meetingType: {
    is_group_meetings_enabled: true,
    facilitator: {
      ID: 1,
      user_firstname: 'Facilitador',
      user_lastname: 'Exemplo',
      user_email: 'facilitador@example.com',
      display_name: 'Facilitador Exemplo',
      phone: '123-456-7890',
      whatsapp_message: 'Olá, gostaria de agendar uma consultoria.',
    },
  },
};
