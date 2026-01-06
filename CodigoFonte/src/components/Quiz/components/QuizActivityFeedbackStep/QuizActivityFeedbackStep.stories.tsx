import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from '@storybook/test';
import { QuizActivityFeedbackStep } from './QuizActivityFeedbackStep.component';

const meta = {
	title: 'components/Quiz/QuizActivityFeedbackStep',
	component: QuizActivityFeedbackStep,
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
		onNext: {
			action: 'next clicked',
			description: 'Callback para próxima pergunta',
		},
	},
	args: {
		currentQuestion: 1,
		totalQuestions: 5,
		activityTitle: 'Orçamento pessoal: equilibrando receitas e despesas',
		activityDescription: 'Organize suas receitas e despesas mensais.',
		feedbackText: 'Organizar o que você ganha e o que gasta ajuda a entender melhor seu dinheiro. Assim, você consegue se planejar, evitar dívidas e dar passos mais seguros no seu negócio e na sua vida.',
		submittedFiles: [
			new File(['content'], 'documento.pdf', { type: 'application/pdf' }),
			new File(['content'], 'imagem.jpg', { type: 'image/jpeg' }),
		],
		onNext: fn(),
	},
} satisfies Meta<typeof QuizActivityFeedbackStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithVideo: Story = {
	args: {
		video: {
			thumbnail: 'https://via.placeholder.com/400x225/8156FF/FFFFFF?text=Video+Thumbnail',
			url: 'https://example.com/video.mp4',
			title: 'Vídeo sobre orçamento pessoal',
		},
	},
};

export const LastQuestion: Story = {
	args: {
		currentQuestion: 5,
		totalQuestions: 5,
	},
};

export const MultipleFiles: Story = {
	args: {
		submittedFiles: [
			new File(['content'], 'arquivo1.pdf', { type: 'application/pdf' }),
			new File(['content'], 'arquivo2.jpg', { type: 'image/jpeg' }),
			new File(['content'], 'arquivo3.png', { type: 'image/png' }),
			new File(['content'], 'arquivo4.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
		],
	},
};

