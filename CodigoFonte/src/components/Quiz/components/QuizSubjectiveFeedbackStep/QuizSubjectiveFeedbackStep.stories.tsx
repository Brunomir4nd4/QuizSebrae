import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from '@storybook/test';
import { QuizSubjectiveFeedbackStep } from './QuizSubjectiveFeedbackStep.component';
import { QuizQuestion } from '../../Quiz.interface';

const meta = {
	title: 'components/Quiz/QuizSubjectiveFeedbackStep',
	component: QuizSubjectiveFeedbackStep,
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
		userAnswer: {
			control: 'text',
			description: 'Resposta do usuário',
		},
		onNext: {
			action: 'next clicked',
			description: 'Callback para próxima pergunta',
		},
	},
	args: {
		question: {
			id: 1,
			question: 'Conte em poucas palavras como você divulga hoje o seu trabalho ou serviço para outras pessoas.',
			type: 'subjective',
		},
		currentQuestion: 1,
		totalQuestions: 5,
		userAnswer: 'Eu mando mensagem no WhatsApp pros meus clientes quando tenho bolo novo e posto foto no meu Facebook pra mostrar os bolos que faço.',
		audioBlobs: [],
		feedbackExplanation: 'Divulgar seu trabalho é importante para mais pessoas conhecerem o que você faz. Continue divulgando seu trabalho e/ou serviço para outras pessoas nas suas redes sociais.',
		onNext: fn(),
	},
} satisfies Meta<typeof QuizSubjectiveFeedbackStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithVideo: Story = {
	args: {
		video: {
			thumbnail: 'https://via.placeholder.com/400x225/6B46C1/FFFFFF?text=Video+Thumbnail',
			url: 'https://example.com/video.mp4',
			title: 'Vídeo sobre divulgação',
			transcript: 'Este é um vídeo explicativo sobre como divulgar seu trabalho nas redes sociais.',
		},
	},
};

export const WithAudio: Story = {
	args: {
		audioBlobs: [
			new Blob(['audio content'], { type: 'audio/webm' }),
		],
	},
};

export const WithTextAndAudio: Story = {
	args: {
		userAnswer: 'Minha resposta em texto',
		audioBlobs: [
			new Blob(['audio content'], { type: 'audio/webm' }),
		],
	},
};

