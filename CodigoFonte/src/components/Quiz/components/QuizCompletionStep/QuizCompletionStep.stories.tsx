import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from '@storybook/test';
import { QuizCompletionStep } from './QuizCompletionStep.component';
import { QuizAnswer } from '../../Quiz.interface';

const meta = {
	title: 'components/Quiz/QuizCompletionStep',
	component: QuizCompletionStep,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		quizTitle: {
			control: 'text',
			description: 'Título do quiz',
		},
		onPrevious: {
			action: 'previous clicked',
			description: 'Callback para encontro anterior',
		},
		onNext: {
			action: 'next clicked',
			description: 'Callback para próximo encontro',
		},
	},
	args: {
		answers: [
			{
				questionId: 1,
				question: {
					id: 1,
					question: 'Qual é uma vantagem de divulgar seu negócio nas redes sociais?',
					type: 'multiple-choice',
					options: [
						{ id: 'option1', text: 'Você alcança mais pessoas sem gastar muito.' },
						{ id: 'option2', text: 'Você precisa pagar muito para ser visto.' },
					],
				},
				selectedOptionId: 'option1',
				isCorrect: true,
			},
			{
				questionId: 2,
				question: {
					id: 2,
					question: 'Qual é uma vantagem de divulgar seu negócio nas redes sociais?',
					type: 'multiple-choice',
					options: [
						{ id: 'option1', text: 'Você alcança mais pessoas sem gastar muito.' },
						{ id: 'option2', text: 'Você precisa pagar muito para ser visto.' },
					],
				},
				selectedOptionId: 'option2',
				isCorrect: false,
				correctAnswerId: 'option1',
			},
			{
				questionId: 3,
				question: {
					id: 3,
					question: 'Conte em poucas palavras como você divulga hoje o seu trabalho ou serviço para outras pessoas.',
					type: 'subjective',
				},
				subjectiveAnswer: 'Eu mando mensagem no WhatsApp pros meus clientes quando tenho bolo novo e posto foto no meu Facebook pra mostrar os bolos que faço.',
			},
		],
		quizTitle: 'Quiz Encontro 03',
		onPrevious: fn(),
		onNext: fn(),
	},
} satisfies Meta<typeof QuizCompletionStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActivity: Story = {
	args: {
		answers: [
			{
				questionId: 1,
				question: {
					id: 1,
					question: 'Qual é uma vantagem de divulgar seu negócio nas redes sociais?',
					type: 'multiple-choice',
					options: [
						{ id: 'option1', text: 'Você alcança mais pessoas sem gastar muito.' },
					],
				},
				selectedOptionId: 'option1',
				isCorrect: true,
			},
			{
				questionId: 4,
				question: {
					id: 4,
					question: 'Orçamento pessoal: equilibrando receitas e despesas',
					type: 'subjective',
				},
				submittedFiles: [
					new File(['content'], 'documento.pdf', { type: 'application/pdf' }),
				],
			},
		],
	},
};

