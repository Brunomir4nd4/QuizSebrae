import React from 'react';
import { Meta, StoryObj } from '@storybook/nextjs';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { SummaryOfActivities } from './SummaryOfActivities.component';

const meta: Meta<typeof SummaryOfActivities> = {
  title: 'components/Molecules/ActivityManagement/SummaryOfActivities',
  component: SummaryOfActivities,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof SummaryOfActivities>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const turmaBase = (students: any[]) => ({
  activities: 4,
  students,
});

export const Default: Story = {
  args: {
    data: turmaBase([
      {
        id: '1',
        name: 'João Silva',
        cpf: '123.456.789-00',
        phone: '5511999999999',
        email: 'joao.silva@example.com',
        activities: [
          { id: '11', activity_id: '1', status: 'avaliada' },
          { id: '12', activity_id: '2', status: 'recebida' },
          { id: '13', activity_id: '3', status: 'não recebida' },
          { id: '14', activity_id: '4', status: 'recebida em outro canal' },
        ],
      },
      {
        id: '2',
        name: 'Maria Souza',
        cpf: '987.654.321-00',
        phone: '5511988888888',
        email: 'maria.souza@example.com',
        activities: [
          { id: '21', activity_id: '1', status: 'avaliada' },
          { id: '22', activity_id: '2', status: 'avaliada' },
          { id: '23', activity_id: '3', status: 'recebida' },
          { id: '24', activity_id: '4', status: 'não recebida' },
        ],
      },
    ]),
  },
};

export const AllAvaliada: Story = {
  args: {
    data: turmaBase([
      {
        id: '1',
        name: 'Aluno 1',
        cpf: '000.000.000-00',
        phone: '5511999990000',
        email: 'a1@example.com',
        activities: [
          { id: '1', activity_id: '1', status: 'avaliada' },
          { id: '2', activity_id: '2', status: 'avaliada' },
          { id: '3', activity_id: '3', status: 'avaliada' },
          { id: '4', activity_id: '4', status: 'avaliada' },
        ],
      },
      {
        id: '2',
        name: 'Aluno 2',
        cpf: '111.111.111-11',
        phone: '5511999991111',
        email: 'a2@example.com',
        activities: [
          { id: '5', activity_id: '1', status: 'avaliada' },
          { id: '6', activity_id: '2', status: 'avaliada' },
          { id: '7', activity_id: '3', status: 'avaliada' },
          { id: '8', activity_id: '4', status: 'avaliada' },
        ],
      },
    ]),
  },
};
