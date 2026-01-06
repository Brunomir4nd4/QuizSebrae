import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QuizFeedbackStep } from './QuizFeedbackStep.component';
import { QuizQuestion } from '../../Quiz.interface';

describe('QuizFeedbackStep Component', () => {
	const mockQuestion: QuizQuestion = {
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
	};

	const mockProps = {
		question: mockQuestion,
		currentQuestion: 1,
		totalQuestions: 5,
		selectedAnswerId: 'option1',
		points: 2,
		feedbackExplanation: 'Usar as redes sociais ajuda seu negócio a alcançar mais pessoas.',
		isCorrect: true,
		correctAnswerId: undefined,
		video: undefined,
		onNext: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the question text correctly', () => {
		render(<QuizFeedbackStep {...mockProps} />);
		expect(screen.getByText(mockQuestion.question)).toBeInTheDocument();
	});

	it('displays correct answer feedback when isCorrect is true', () => {
		render(<QuizFeedbackStep {...mockProps} isCorrect={true} />);
		expect(screen.getByText(/Muito bem, você acertou!/i)).toBeInTheDocument();
		expect(screen.getByText(/\+2 pontos/i)).toBeInTheDocument();
	});

	it('displays incorrect answer feedback when isCorrect is false', () => {
		render(
			<QuizFeedbackStep
				{...mockProps}
				isCorrect={false}
				correctAnswerId="option1"
			/>
		);
		expect(screen.getByText(/Ops, essa não é a resposta certa/i)).toBeInTheDocument();
		expect(screen.getByText(/Resposta correta:/i)).toBeInTheDocument();
	});

	it('displays feedback explanation', () => {
		render(<QuizFeedbackStep {...mockProps} />);
		expect(screen.getByText(mockProps.feedbackExplanation)).toBeInTheDocument();
	});

	it('calls onNext when next button is clicked', () => {
		render(<QuizFeedbackStep {...mockProps} />);
		const nextButton = screen.getByText('Próxima pergunta');
		fireEvent.click(nextButton);
		expect(mockProps.onNext).toHaveBeenCalledTimes(1);
	});

	it('renders progress indicator correctly', () => {
		render(<QuizFeedbackStep {...mockProps} />);
		expect(screen.getByText('Perguntas')).toBeInTheDocument();
		expect(screen.getByText('1')).toBeInTheDocument();
	});

	it('displays error message when question has no options', () => {
		const questionWithoutOptions: QuizQuestion = {
			...mockQuestion,
			options: [],
		};
		render(<QuizFeedbackStep {...mockProps} question={questionWithoutOptions} />);
		expect(screen.getByText(/Erro: Esta pergunta não possui opções de resposta/i)).toBeInTheDocument();
	});

	it('shows video section when video is provided', () => {
		const video = {
			thumbnail: 'https://example.com/thumb.jpg',
			url: 'https://example.com/video.mp4',
			title: 'Vídeo explicativo',
		};
		render(<QuizFeedbackStep {...mockProps} video={video} />);
		expect(screen.getByText(/Quer ver um vídeo sobre isso?/i)).toBeInTheDocument();
	});
});

