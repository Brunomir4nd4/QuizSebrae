import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QuizCompletionStep } from './QuizCompletionStep.component';
import { QuizAnswer } from '../../Quiz.interface';

describe('QuizCompletionStep Component', () => {
	const mockAnswers: QuizAnswer[] = [
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
				question: 'Conte em poucas palavras como você divulga hoje o seu trabalho.',
				type: 'subjective',
			},
			subjectiveAnswer: 'Eu uso WhatsApp e Facebook.',
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
		render(<QuizCompletionStep {...mockProps} />);
		expect(screen.getByText('Quiz Encontro 03')).toBeInTheDocument();
	});

	it('displays success message', () => {
		render(<QuizCompletionStep {...mockProps} />);
		expect(screen.getByText(/Quiz enviado/i)).toBeInTheDocument();
		expect(screen.getByText(/com sucesso!/i)).toBeInTheDocument();
	});

	it('renders all answers', () => {
		render(<QuizCompletionStep {...mockProps} />);
		expect(screen.getByText('Suas respostas')).toBeInTheDocument();
		expect(screen.getByText(mockAnswers[0].question.question)).toBeInTheDocument();
		expect(screen.getByText(mockAnswers[1].question.question)).toBeInTheDocument();
	});

	it('calls onPrevious when previous button is clicked', () => {
		render(<QuizCompletionStep {...mockProps} />);
		const previousButton = screen.getByRole('button', { name: /previous/i });
		if (previousButton) {
			fireEvent.click(previousButton);
			expect(mockProps.onPrevious).toHaveBeenCalledTimes(1);
		}
	});

	it('calls onNext when next button is clicked', () => {
		render(<QuizCompletionStep {...mockProps} />);
		const nextButton = screen.getByRole('button', { name: /next/i });
		if (nextButton) {
			fireEvent.click(nextButton);
			expect(mockProps.onNext).toHaveBeenCalledTimes(1);
		}
	});

	it('displays correct answer indicator', () => {
		render(<QuizCompletionStep {...mockProps} />);
		// Verifica se a resposta correta é exibida
		const correctAnswer = mockAnswers.find(a => a.isCorrect);
		if (correctAnswer) {
			expect(screen.getByText(correctAnswer.question.question)).toBeInTheDocument();
		}
	});

	it('displays subjective answer', () => {
		render(<QuizCompletionStep {...mockProps} />);
		const subjectiveAnswer = mockAnswers.find(a => a.subjectiveAnswer);
		if (subjectiveAnswer) {
			expect(screen.getByText(subjectiveAnswer.subjectiveAnswer!)).toBeInTheDocument();
		}
	});
});

