import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from '@storybook/test';
import { QuizFeedbackStep } from './QuizFeedbackStep.component';
import { QuizQuestion } from '../../Quiz.interface';

const meta = {
	title: 'components/Quiz/QuizFeedbackStep',
	component: QuizFeedbackStep,
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
		points: {
			control: 'number',
			description: 'Pontos ganhos',
		},
		isCorrect: {
			control: 'boolean',
			description: 'Se a resposta está correta',
		},
		onNext: {
			action: 'next clicked',
			description: 'Callback para próxima pergunta',
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
			],
		},
		currentQuestion: 1,
		totalQuestions: 5,
		selectedAnswerId: 'option1',
		points: 2,
		feedbackExplanation: 'Usar as redes sociais ajuda seu negócio a alcançar mais pessoas e pode aumentar suas vendas.',
		isCorrect: true,
		onNext: fn(),
	},
} satisfies Meta<typeof QuizFeedbackStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CorrectAnswer: Story = {
	args: {
		isCorrect: true,
		points: 2,
	},
};

export const IncorrectAnswer: Story = {
	args: {
		isCorrect: false,
		points: 0,
		correctAnswerId: 'option1',
		selectedAnswerId: 'option2',
	},
};

export const WithVideo: Story = {
	args: {
		video: {
			thumbnail: 'https://via.placeholder.com/400x225/6B46C1/FFFFFF?text=Video+Thumbnail',
			url: 'https://example.com/video.mp4',
			title: 'Vídeo sobre redes sociais',
			transcript: 'Este é um vídeo explicativo sobre como usar redes sociais para divulgar seu negócio.',
		},
	},
};

