import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from '@storybook/test';
import { QuizQuestionStep } from './QuizQuestionStep.component';
import { QuizQuestion } from '../../Quiz.interface';

const meta = {
	title: 'components/Quiz/QuizQuestionStep',
	component: QuizQuestionStep,
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
		selectedAnswer: {
			control: 'text',
			description: 'ID da opção selecionada',
		},
		onAnswerSelect: {
			action: 'answer selected',
			description: 'Callback quando uma opção é selecionada',
		},
		onConfirmAnswer: {
			action: 'answer confirmed',
			description: 'Callback quando a resposta é confirmada',
		},
	},
	args: {
		question: {
			id: 1,
			question: 'Qual é uma vantagem de divulgar seu negócio nas redes sociais?',
			type: 'multiple-choice',
			options: [
				{
					id: 'option1',
					text: 'Você alcança mais pessoas sem gastar muito.',
				},
				{
					id: 'option2',
					text: 'Você precisa pagar muito para ser visto.',
				},
				{
					id: 'option3',
					text: 'Não ajuda em nada no seu negócio.',
				},
			],
		},
		currentQuestion: 1,
		totalQuestions: 5,
		selectedAnswer: undefined,
		onAnswerSelect: fn(),
		onConfirmAnswer: fn(),
	},
} satisfies Meta<typeof QuizQuestionStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSelectedAnswer: Story = {
	args: {
		selectedAnswer: 'option1',
	},
};

export const LastQuestion: Story = {
	args: {
		currentQuestion: 5,
		totalQuestions: 5,
		selectedAnswer: 'option2',
	},
};

export const MiddleQuestion: Story = {
	args: {
		currentQuestion: 3,
		totalQuestions: 5,
	},
};

