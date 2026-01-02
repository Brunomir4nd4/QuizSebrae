import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { CoursesModal } from './CoursesModal.component';
import { Props as CoursesModalProps } from './CoursesModal.interface';
import { Session } from 'next-auth';
import { Sidebar } from '@/types/ISidebar';
import { mockWPImage } from '../../../.storybook/mocks/classData';

export default {
  title: 'components/Molecules/Modal/CoursesModal',
  component: CoursesModal,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
  },
  parameters: {
		layout: 'centered',
		docs: {
			story: {
				inline: false,
				iframeHeight: '700px',
			},
		},
	},
} as Meta<CoursesModalProps>;

const mockSession: Session = {
    user: {
        user_first_name: 'João',
        user_last_name: 'Silva',
        user_display_name: 'João Silva',
        user_email: 'joao@example.com',
        user_nicename: 'joaosilva',
        role: ['user'],
        token: 'dummy-token',
        cpf: '123.456.789-00',
        id: 1,
    },
    expires: '2099-12-31',
};

const mockSidebar: Sidebar[] = [
  {
    class_id: 10,
    course_id: 99,
    course_name: 'Up digital marketing',
    logo: mockWPImage,
    logo_b: mockWPImage,
    cycle_id: 1,
    class_name: 'Turma 1',
    class_slug: 'turma-1',
    cycle_name: 'Ciclo 1',
    cycle_slug: 'ciclo-1',
    course_slug: 'up-digital-marketing',
  },
  {
    class_id: 11,
    course_id: 100,
    course_name: 'Gestão Estratégica',
    logo: mockWPImage,
    logo_b: mockWPImage,
    cycle_id: 2,
    class_name: 'Turma 2',
    class_slug: 'turma-2',
    cycle_name: 'Ciclo 2',
    cycle_slug: 'ciclo-2',
    course_slug: 'gestao-estrategica',
  },
];

const Template: StoryFn<CoursesModalProps> = (args) => (
    <CoursesModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  open: true,
  onClose: () => console.log('Fechar modal'),
  session: mockSession,
  sidebar: mockSidebar,
};

export const UmCursoApenas = Template.bind({});
UmCursoApenas.args = {
  open: true,
  onClose: () => console.log('Fechar modal'),
  session: mockSession,
  sidebar: [
    {
      class_id: 10,
      course_id: 99,
      course_name: 'Curso Único',
      logo: mockWPImage,
      logo_b: mockWPImage,
      cycle_id: 1,
      class_name: 'Turma Única',
      class_slug: 'turma-unica',
      cycle_name: 'Ciclo Único',
      cycle_slug: 'ciclo-unico',
      course_slug: 'curso-unico',
    },
  ],
};
