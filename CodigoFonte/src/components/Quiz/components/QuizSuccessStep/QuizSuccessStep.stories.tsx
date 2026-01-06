import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from '@storybook/test';
import { QuizSuccessStep, QuizAnswer } from './QuizSuccessStep.component';

const meta = {
	title: 'components/Quiz/QuizSuccessStep',
	component: QuizSuccessStep,
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
				id: 1,
				question: 'Qual é uma vantagem de divulgar seu negócio nas redes sociais?',
				type: 'multiple-choice',
				isCorrect: true,
				selectedAnswer: 'Você alcança mais pessoas sem gastar muito.',
			},
			{
				id: 2,
				question: 'Qual é uma vantagem de divulgar seu negócio nas redes sociais?',
				type: 'multiple-choice',
				isCorrect: false,
				selectedAnswer: 'Você precisa pagar muito para ser visto.',
				correctAnswer: 'Você alcança mais pessoas sem gastar muito.',
			},
			{
				id: 3,
				question: 'Conte em poucas palavras como você divulga hoje o seu trabalho ou serviço para outras pessoas.',
				type: 'text',
				textAnswer: 'Eu mando mensagem no WhatsApp pros meus clientes quando tenho bolo novo e posto foto no meu Facebook pra mostrar os bolos que faço.',
			},
			{
				id: 4,
				question: 'Orçamento pessoal: equilibrando receitas e despesas',
				type: 'activity',
				activityFiles: 2,
			},
		],
		quizTitle: 'Quiz Encontro 03',
		onPrevious: fn(),
		onNext: fn(),
	},
} satisfies Meta<typeof QuizSuccessStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllCorrect: Story = {
	args: {
		answers: [
			{
				id: 1,
				question: 'Qual é uma vantagem de divulgar seu negócio nas redes sociais?',
				type: 'multiple-choice',
				isCorrect: true,
				selectedAnswer: 'Você alcança mais pessoas sem gastar muito.',
			},
			{
				id: 2,
				question: 'Qual é uma vantagem de divulgar seu negócio nas redes sociais?',
				type: 'multiple-choice',
				isCorrect: true,
				selectedAnswer: 'Você alcança mais pessoas sem gastar muito.',
			},
		],
	},
};

export const WithActivity: Story = {
	args: {
		answers: [
			{
				id: 1,
				question: 'Qual é uma vantagem de divulgar seu negócio nas redes sociais?',
				type: 'multiple-choice',
				isCorrect: true,
				selectedAnswer: 'Você alcança mais pessoas sem gastar muito.',
			},
			{
				id: 4,
				question: 'Orçamento pessoal: equilibrando receitas e despesas',
				type: 'activity',
				activityFiles: 3,
			},
		],
	},
};

