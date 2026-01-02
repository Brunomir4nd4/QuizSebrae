import React from 'react';
import { Meta, StoryObj } from '@storybook/nextjs';
import { ActivityEvaluationSlider } from './ActivityEvaluationSlider.component';
import type { Props } from './ActivityEvaluationSlider.component';
import { ProvidersDecorator } from '../../../.storybook/decorators/ProvidersDecorator';

const meta: Meta<typeof ActivityEvaluationSlider> = {
	title: 'components/Organisms/ActivityEvaluation/ActivityEvaluationSlider',
	component: ActivityEvaluationSlider,
	decorators: [ProvidersDecorator],
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<typeof ActivityEvaluationSlider>;

const mockItems = [
	{
		id: 1,
		status: 'recebida',
		items: [
			{
				id: 'f1',
				name: 'documento.pdf',
				type: 'application/pdf',
				url: '/files/doc1.pdf',
			},
			{
				id: 'f2',
				name: 'documento2.pdf',
				type: 'application/pdf',
				url: '/files/doc2.pdf',
			},
		],
	},
	{
		id: 2,
		status: 'avaliada',
		items: [
			{
				id: 'f3',
				name: 'trabalho.pdf',
				type: 'application/pdf',
				url: '/files/doc2.pdf',
			},
		],
		feedback: { note: 8, comment: 'Boa entrega' },
	},
];

const Template = (args: Props) => (
	<div
		style={{
			width: '100vw',
			minWidth: 400,
			overflowX: 'auto',
			padding: 32,
			boxSizing: 'border-box',
		}}>
		<ActivityEvaluationSlider {...args} />
	</div>
);

export const Default: Story = {
	render: Template,
	args: {
		items: mockItems,
		selectedActivity: 1,
		selectedParticipant: 1,
		selectedStudentName: 'João Silva',
		selectedStudentEmail: 'joao.silva@example.com',
		onChange: () => {},
	},
	parameters: {
		turmaData: {
			activities: 2,
			students: [
				{
					id: '1',
					name: 'João Silva',
					cpf: '123.456.789-00',
					phone: '5511999999999',
					email: 'joao.silva@example.com',
					enrollment_id: 101,
					activities: [
						{ id: '1', activity_id: '1', status: 'recebida' },
						{ id: '2', activity_id: '2', status: 'avaliada' },
					],
				},
			],
		},
	},
};

export const WithNoFiles: Story = {
	render: Template,
	args: {
		items: [{ id: 3, status: 'recebida', items: [] }],
		selectedActivity: 1,
		selectedParticipant: 1,
		selectedStudentName: 'Maria Souza',
		selectedStudentEmail: 'maria.souza@example.com',
		onChange: () => {},
	},
	parameters: {
		turmaData: {
			activities: 1,
			students: [
				{
					id: '1',
					name: 'Maria Souza',
					cpf: '987.654.321-00',
					phone: '5511988888888',
					email: 'maria.souza@example.com',
					enrollment_id: 102,
					activities: [{ id: '3', activity_id: '1', status: 'recebida' }],
				},
			],
		},
	},
};
