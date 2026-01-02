import { Meta, StoryObj } from '@storybook/nextjs';
import { ActivitiesSlider } from './ActivitiesSlider.component';
import { classDataWithProgressiveCertification } from '../../../../../.storybook/mocks/classData';

const meta: Meta<typeof ActivitiesSlider> = {
  title: 'components/Molecules/Sliders/ActivitiesSliderManagement',
  component: ActivitiesSlider,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ActivitiesSlider>;

export const Default: Story = {
  args: {
    classData: classDataWithProgressiveCertification,
    whatsAppMessage: 'Olá! Como posso ajudá-lo com sua atividade?',
    students: [
      {
        id: '1',
        name: 'João Silva',
        cpf: '123.456.789-00',
        phone: '5511999999999',
        email: 'joao.silva@example.com',
        activities: [
          { id: '11', activity_id: '1', status: 'recebida' },
          { id: '12', activity_id: '2', status: 'avaliada' },
          { id: '13', activity_id: '3', status: 'não recebida' },
          { id: '14', activity_id: '4', status: 'não recebida' },
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
          { id: '22', activity_id: '2', status: 'recebida' },
          { id: '23', activity_id: '3', status: 'recebida em outro canal' },
          { id: '24', activity_id: '4', status: 'não recebida' },
        ],
      },
      {
        id: '3',
        name: 'Pedro Costa',
        cpf: '456.789.123-00',
        phone: '5511977777777',
        email: 'pedro.costa@example.com',
        activities: [
          { id: '31', activity_id: '1', status: 'não recebida' },
          { id: '32', activity_id: '2', status: 'não recebida' },
          { id: '33', activity_id: '3', status: 'não recebida' },
          { id: '34', activity_id: '4', status: 'não recebida' },
        ],
      },
    ],
  },
  parameters: {
    turmaData: {
      activities: 4,
      students: [
        {
          id: '1',
          name: 'João Silva',
          cpf: '123.456.789-00',
          phone: '5511999999999',
          email: 'joao.silva@example.com',
          enrollment_id: 101,
          activities: [
            { id: '11', activity_id: '1', status: 'recebida' },
            { id: '12', activity_id: '2', status: 'avaliada' },
            { id: '13', activity_id: '3', status: 'não recebida' },
            { id: '14', activity_id: '4', status: 'não recebida' },
          ],
        },
        {
          id: '2',
          name: 'Maria Souza',
          cpf: '987.654.321-00',
          phone: '5511988888888',
          email: 'maria.souza@example.com',
          enrollment_id: 102,
          activities: [
            { id: '21', activity_id: '1', status: 'avaliada' },
            { id: '22', activity_id: '2', status: 'recebida' },
            { id: '23', activity_id: '3', status: 'recebida em outro canal' },
            { id: '24', activity_id: '4', status: 'não recebida' },
          ],
        },
        {
          id: '3',
          name: 'Pedro Costa',
          cpf: '456.789.123-00',
          phone: '5511977777777',
          email: 'pedro.costa@example.com',
          enrollment_id: 103,
          activities: [
            { id: '31', activity_id: '1', status: 'não recebida' },
            { id: '32', activity_id: '2', status: 'não recebida' },
            { id: '33', activity_id: '3', status: 'não recebida' },
            { id: '34', activity_id: '4', status: 'não recebida' },
          ],
        },
      ],
    },
  },
};

export const ComUmEstudante: Story = {
  args: {
    classData: classDataWithProgressiveCertification,
    whatsAppMessage: 'Precisa de ajuda?',
    students: [
      {
        id: '1',
        name: 'Ana Lima',
        cpf: '111.222.333-44',
        phone: '5511966666666',
        email: 'ana.lima@example.com',
        activities: [
          { id: '41', activity_id: '1', status: 'avaliada' },
          { id: '42', activity_id: '2', status: 'avaliada' },
          { id: '43', activity_id: '3', status: 'avaliada' },
          { id: '44', activity_id: '4', status: 'avaliada' },
        ],
      },
    ],
  },
  parameters: {
    turmaData: {
      activities: 4,
      students: [
        {
          id: '1',
          name: 'Ana Lima',
          cpf: '111.222.333-44',
          phone: '5511966666666',
          email: 'ana.lima@example.com',
          enrollment_id: 104,
          activities: [
            { id: '41', activity_id: '1', status: 'avaliada' },
            { id: '42', activity_id: '2', status: 'avaliada' },
            { id: '43', activity_id: '3', status: 'avaliada' },
            { id: '44', activity_id: '4', status: 'avaliada' },
          ],
        },
      ],
    },
  },
};

export const SemEstudantes: Story = {
  args: {
    classData: classDataWithProgressiveCertification,
    whatsAppMessage: 'Olá!',
    students: [],
  },
  parameters: {
    turmaData: {
      activities: 4,
      students: [],
    },
  },
};

export const StatusVariados: Story = {
  args: {
    classData: classDataWithProgressiveCertification,
    whatsAppMessage: 'Entre em contato!',
    students: [
      {
        id: '5',
        name: 'Carlos Oliveira',
        cpf: '555.666.777-88',
        phone: '5511955555555',
        email: 'carlos@example.com',
        activities: [
          { id: '51', activity_id: '1', status: 'recebida em outro canal' },
          { id: '52', activity_id: '2', status: 'recebida' },
          { id: '53', activity_id: '3', status: 'avaliada' },
          { id: '54', activity_id: '4', status: 'não recebida' },
        ],
      },
      {
        id: '6',
        name: 'Fernanda Santos',
        cpf: '999.888.777-66',
        phone: '5511944444444',
        email: 'fernanda@example.com',
        activities: [
          { id: '61', activity_id: '1', status: 'não recebida' },
          { id: '62', activity_id: '2', status: 'recebida em outro canal' },
          { id: '63', activity_id: '3', status: 'recebida' },
          { id: '64', activity_id: '4', status: 'avaliada' },
        ],
      },
    ],
  },
  parameters: {
    turmaData: {
      activities: 4,
      students: [
        {
          id: '5',
          name: 'Carlos Oliveira',
          cpf: '555.666.777-88',
          phone: '5511955555555',
          email: 'carlos@example.com',
          enrollment_id: 105,
          activities: [
            { id: '51', activity_id: '1', status: 'recebida em outro canal' },
            { id: '52', activity_id: '2', status: 'recebida' },
            { id: '53', activity_id: '3', status: 'avaliada' },
            { id: '54', activity_id: '4', status: 'não recebida' },
          ],
        },
        {
          id: '6',
          name: 'Fernanda Santos',
          cpf: '999.888.777-66',
          phone: '5511944444444',
          email: 'fernanda@example.com',
          enrollment_id: 106,
          activities: [
            { id: '61', activity_id: '1', status: 'não recebida' },
            { id: '62', activity_id: '2', status: 'recebida em outro canal' },
            { id: '63', activity_id: '3', status: 'recebida' },
            { id: '64', activity_id: '4', status: 'avaliada' },
          ],
        },
      ],
    },
  },
};
