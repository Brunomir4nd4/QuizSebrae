import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from '@storybook/test';
import { Quiz } from './Quiz.component';
import { QuizProps } from './Quiz.interface';

// Mock do useRouter e usePathname para Storybook
const mockRouter = {
	push: fn(),
	replace: fn(),
	prefetch: fn(),
};

jest.mock('next/navigation', () => ({
	useRouter: () => mockRouter,
	usePathname: () => '/quiz/encontro-03',
}));

const meta = {
	title: 'components/Quiz/Quiz',
	component: Quiz,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
	argTypes: {
		totalQuestions: {
			control: 'number',
			description: 'Total de perguntas no quiz',
		},
		currentQuestion: {
			control: 'number',
			description: 'Pergunta atual',
		},
		encounterNumber: {
			control: 'number',
			description: 'Número do encontro',
		},
		onAnswerSelect: {
			action: 'answer selected',
			description: 'Callback quando uma resposta é selecionada',
		},
		onActivitySubmit: {
			action: 'activity submitted',
			description: 'Callback quando uma atividade é enviada',
		},
		onNext: {
			action: 'next clicked',
			description: 'Callback para próxima pergunta',
		},
	},
	args: {
		totalQuestions: 4,
		currentQuestion: 1,
		activities: [
			{
				id: 4,
				activityTitle: 'Orçamento pessoal: equilibrando receitas e despesas',
				activityDescription: 'Organize suas receitas e despesas mensais para ter um melhor controle financeiro.',
				suggestionLabel: 'Confira nossa sugestão:',
				downloadButtonText: 'Baixar template',
				downloadUrl: 'https://example.com/template.pdf',
			},
		],
		onAnswerSelect: fn(),
		onActivitySubmit: fn(),
		onNext: fn(),
		encounterNumber: 3,
	},
} satisfies Meta<typeof Quiz>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SecondQuestion: Story = {
	args: {
		currentQuestion: 2,
	},
};

export const ThirdQuestion: Story = {
	args: {
		currentQuestion: 3,
	},
};

export const ActivityStep: Story = {
	args: {
		currentQuestion: 4,
	},
};

