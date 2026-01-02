import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { AppointmentScheduling } from './AppointmentScheduling.component';
import type { Questions } from '@/components/Consultorias';
import { ProvidersDecorator } from '../../../.storybook/decorators/ProvidersDecorator';

const meta: Meta<typeof AppointmentScheduling> = {
  title: 'components/Organisms/Appointment/AppointmentScheduling',
  component: AppointmentScheduling,
  decorators: [ProvidersDecorator],
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    classId: {
      control: { type: 'text' },
      table: { defaultValue: { summary: '1' } },
    },
    drawerStep: {
      control: { type: 'radio' },
      options: [0, 1],
      table: { defaultValue: { summary: '0' } },
    },
    startTime: {
      control: { type: 'text' },
      table: { defaultValue: { summary: "''" } },
    },
    consultancyDate: {
      control: { type: 'text' },
      table: { defaultValue: { summary: 'null' } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof AppointmentScheduling>;

const baseQuestions: Questions = {
  social_network: '',
  main_topic: '',
  specific_questions: '',
};

interface WrapperProps {
  classId?: string;
  drawerStep?: 0 | 1;
  startTime?: string;
  consultancyDate?: string | null;
  questions?: Questions;
}

const Wrapper = (props: WrapperProps) => {
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [drawerStep, setDrawerStep] = React.useState<0 | 1>(props.drawerStep ?? 0);
  const [startTime, setStartTime] = React.useState<string>(props.startTime ?? '');
  const [consultancyDate, setConsultancyDate] = React.useState<string | null | undefined>(
    props.consultancyDate ?? null,
  );
  const [questions, setQuestions] = React.useState<Questions>(props.questions ?? baseQuestions);

  return (
    <div style={{ padding: 16, maxWidth: 900 }}>
      <AppointmentScheduling
        classId={props.classId ?? '1'}
        openModal={openModal}
        setOpenModal={setOpenModal}
        drawerStep={drawerStep}
        setDrawerStep={setDrawerStep}
        startTime={startTime}
        setStartTime={setStartTime}
        consultancyDate={consultancyDate}
        setConsultancyDate={setConsultancyDate}
        questions={questions}
        setQuestions={setQuestions}
        handleDrawerClose={() => setOpenModal(false)}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <Wrapper drawerStep={0} />,
};

export const WithStep1: Story = {
  render: () => <Wrapper drawerStep={1} startTime={'10:00'} consultancyDate={'2025-11-20'} />,
};

export const ModalOpen: Story = {
  render: () => <Wrapper drawerStep={0} />,
};
