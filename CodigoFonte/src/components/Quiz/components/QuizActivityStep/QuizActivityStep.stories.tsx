import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from '@storybook/test';
import { QuizActivityStep } from './QuizActivityStep.component';

const meta = {
	title: 'components/Quiz/QuizActivityStep',
	component: QuizActivityStep,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		currentQuestion: {
			control: 'number',
			description: 'Número da pergunta atual',
		},
		totalQuestions: {
			control: 'number',
			description: 'Total de perguntas no quiz',
		},
		activityTitle: {
			control: 'text',
			description: 'Título da atividade',
		},
		activityDescription: {
			control: 'text',
			description: 'Descrição da atividade',
		},
		onSubmit: {
			action: 'files submitted',
			description: 'Callback quando arquivos são enviados',
		},
	},
	args: {
		currentQuestion: 1,
		totalQuestions: 5,
		activityTitle: 'Orçamento pessoal: equilibrando receitas e despesas',
		activityDescription: 'Organize suas receitas e despesas mensais para ter um melhor controle financeiro.',
		suggestionLabel: 'Confira nossa sugestão:',
		downloadButtonText: 'Baixar template',
		downloadUrl: 'https://example.com/template.pdf',
		onSubmit: fn(),
	},
} satisfies Meta<typeof QuizActivityStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutDownload: Story = {
	args: {
		downloadButtonText: undefined,
		downloadUrl: undefined,
	},
};

export const LastQuestion: Story = {
	args: {
		currentQuestion: 5,
		totalQuestions: 5,
	},
};

