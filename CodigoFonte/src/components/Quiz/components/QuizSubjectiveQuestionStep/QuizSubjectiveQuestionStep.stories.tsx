import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from '@storybook/test';
import { QuizSubjectiveQuestionStep } from './QuizSubjectiveQuestionStep.component';
import { QuizQuestion } from '../../Quiz.interface';

const meta = {
	title: 'components/Quiz/QuizSubjectiveQuestionStep',
	component: QuizSubjectiveQuestionStep,
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
		answer: {
			control: 'text',
			description: 'Resposta de texto do usuário',
		},
		onAnswerChange: {
			action: 'answer changed',
			description: 'Callback quando a resposta muda',
		},
		onConfirmAnswer: {
			action: 'answer confirmed',
			description: 'Callback quando a resposta é confirmada',
		},
	},
	args: {
		question: {
			id: 1,
			question: 'Conte em poucas palavras como você divulga hoje o seu trabalho ou serviço para outras pessoas.',
			type: 'subjective',
			instruction: 'Não precisa escrever muito, pode ser só 2 ou 3 frases contando como você faz hoje para que mais pessoas conheçam seu trabalho.',
		},
		currentQuestion: 1,
		totalQuestions: 5,
		answer: '',
		audioBlobs: [],
		onAnswerChange: fn(),
		onAudioChange: fn(),
		onConfirmAnswer: fn(),
	},
} satisfies Meta<typeof QuizSubjectiveQuestionStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAnswer: Story = {
	args: {
		answer: 'Eu mando mensagem no WhatsApp pros meus clientes quando tenho bolo novo e posto foto no meu Facebook pra mostrar os bolos que faço.',
	},
};

export const WithAudio: Story = {
	args: {
		answer: 'Minha resposta em texto',
		audioBlobs: [
			new Blob(['audio content'], { type: 'audio/webm' }),
		],
	},
};

