import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { ScheduleSlot } from './ScheduleSlot.component';
import { ProvidersDecorator } from '../../../../../.storybook/decorators/ProvidersDecorator';
import { ScheduleEvent, ScheduleEventType } from '../../models/ScheduleEvent';

export default {
  title: 'components/Molecules/Schedule/ScheduleSlot',
  component: ScheduleSlot,
  decorators: [ProvidersDecorator],
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} as Meta<typeof ScheduleSlot>;

const makeEvent = (type: ScheduleEventType, id = '1') => {
  const start = new Date();
  start.setHours(9, 0, 0, 0);
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  return new ScheduleEvent(
    id,
    type,
    start,
    end,
    'Cliente Exemplo',
    'Título',
    { main_topic: 'Tópico', social_network: 'Grupo', specific_questions: 'Nenhuma' },
    { cpf: '00000000000', email: 'cliente@example.com', phone_number: null, name: 'Cliente', id: 123 },
    { cpf: '', email: null, phone_number: null, name: 'Facilitador', id: 1 },
    '1',
  );
};

const Template: StoryFn<React.ComponentProps<typeof ScheduleSlot>> = (args) => {
  return (
    <div style={{ padding: 24 }}>
      <ScheduleSlot {...args} />
    </div>
  );
};

export const Appointment = Template.bind({});
Appointment.args = { event: makeEvent(ScheduleEventType.Appointment), spanCol: 1, spanRow: 1, bookingId: '1' };

export const Group = Template.bind({});
Group.args = { event: makeEvent(ScheduleEventType.Group, '2'), spanCol: 1, spanRow: 1, bookingId: '2' };

export const Block = Template.bind({});
Block.args = { event: makeEvent(ScheduleEventType.Block, '3'), spanCol: 1, spanRow: 1, bookingId: '3' };
