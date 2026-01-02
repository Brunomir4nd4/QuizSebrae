import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import ActivityEvaluation from './ ActivityEvaluation.component';
import type { ActivityEvaluationProps } from './ ActivityEvaluation.component';

const meta: Meta<typeof ActivityEvaluation> = {
	title: 'components/Molecules/ActivityEvaluation/ActivityEvaluation',
	component: ActivityEvaluation,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<typeof ActivityEvaluation>;

const baseItems = [
	{ id: '1', name: 'Imagem.png', type: 'image', url: '/logo-up-marketing.svg' },
	{ id: '2', name: 'Documento.pdf', type: 'pdf', url: '#' },
];

const Template = (args: ActivityEvaluationProps) => (
	<div
		style={{
			width: '100vw',
			minWidth: 400,
			overflowX: 'auto',
			padding: 32,
			boxSizing: 'border-box',
		}}>
		<ActivityEvaluation {...args} />
	</div>
);

export const ReceivedWithItems: Story = {
	render: Template,
	args: {
		id: 1,
		status: 'recebida',
		items: baseItems,
		selectedParticipant: 123,
		selectedStudentName: 'João Silva',
		selectedStudentEmail: 'joao@example.com',
		selectedActivity: 1,
		onChange: () => console.log('changed'),
	},
};

export const Evaluated: Story = {
	render: Template,
	args: {
		id: 2,
		status: 'avaliada',
		items: baseItems,
		feedback: { note: 4, comment: 'Muito bom!' },
		selectedParticipant: 456,
		selectedStudentName: 'Maria Souza',
		selectedStudentEmail: 'maria@example.com',
		selectedActivity: 2,
		onChange: () => console.log('changed'),
	},
};

export const NotReceived: Story = {
	render: Template,
	args: {
		id: 3,
		status: 'não recebida',
		items: [],
		selectedParticipant: 0,
		selectedStudentName: 'Aluno',
		selectedStudentEmail: 'aluno@example.com',
		selectedActivity: 1,
		onChange: () => console.log('changed'),
	},
};

export const ReceivedOtherChannel: Story = {
	render: Template,
	args: {
		id: 4,
		status: 'recebida em outro canal',
		items: [],
		selectedParticipant: 789,
		selectedStudentName: 'Pedro Santos',
		selectedStudentEmail: 'pedro@example.com',
		selectedActivity: 1,
		onChange: () => console.log('changed'),
	},
};
