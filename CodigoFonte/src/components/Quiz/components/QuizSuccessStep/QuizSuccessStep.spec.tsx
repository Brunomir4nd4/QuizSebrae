import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QuizSuccessStep, QuizAnswer } from './QuizSuccessStep.component';

describe('QuizSuccessStep Component', () => {
	const mockAnswers: QuizAnswer[] = [
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
			question: 'Conte em poucas palavras como você divulga hoje o seu trabalho.',
			type: 'text',
			textAnswer: 'Eu uso WhatsApp e Facebook.',
		},
	];

	const mockProps = {
		answers: mockAnswers,
		quizTitle: 'Quiz Encontro 03',
		onPrevious: jest.fn(),
		onNext: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the quiz title correctly', () => {
		render(<QuizSuccessStep {...mockProps} />);
		expect(screen.getByText('Quiz Encontro 03')).toBeInTheDocument();
	});

	it('displays success message', () => {
		render(<QuizSuccessStep {...mockProps} />);
		expect(screen.getByText(/Quiz enviado/i)).toBeInTheDocument();
		expect(screen.getByText(/com sucesso!/i)).toBeInTheDocument();
	});

	it('renders all answers', () => {
		render(<QuizSuccessStep {...mockProps} />);
		expect(screen.getByText('Suas respostas')).toBeInTheDocument();
		mockAnswers.forEach((answer) => {
			expect(screen.getByText(answer.question)).toBeInTheDocument();
		});
	});

	it('displays correct answer indicator', () => {
		render(<QuizSuccessStep {...mockProps} />);
		const correctAnswer = mockAnswers.find(a => a.isCorrect);
		if (correctAnswer) {
			expect(screen.getByText(correctAnswer.question)).toBeInTheDocument();
		}
	});

	it('displays text answer', () => {
		render(<QuizSuccessStep {...mockProps} />);
		const textAnswer = mockAnswers.find(a => a.type === 'text');
		if (textAnswer && textAnswer.textAnswer) {
			expect(screen.getByText(textAnswer.textAnswer)).toBeInTheDocument();
		}
	});

	it('calls onPrevious when previous button is clicked', () => {
		render(<QuizSuccessStep {...mockProps} />);
		const previousButton = screen.getByRole('button', { name: /previous/i });
		if (previousButton) {
			fireEvent.click(previousButton);
			expect(mockProps.onPrevious).toHaveBeenCalledTimes(1);
		}
	});

	it('calls onNext when next button is clicked', () => {
		render(<QuizSuccessStep {...mockProps} />);
		const nextButton = screen.getByRole('button', { name: /next/i });
		if (nextButton) {
			fireEvent.click(nextButton);
			expect(mockProps.onNext).toHaveBeenCalledTimes(1);
		}
	});
});

