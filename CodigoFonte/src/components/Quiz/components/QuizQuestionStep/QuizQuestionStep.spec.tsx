import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QuizQuestionStep } from './QuizQuestionStep.component';
import { QuizQuestion } from '../../Quiz.interface';

describe('QuizQuestionStep Component', () => {
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
			{
				id: 'option3',
				text: 'Não ajuda em nada no seu negócio.',
			},
		],
	};

	const mockProps = {
		question: mockQuestion,
		currentQuestion: 1,
		totalQuestions: 5,
		selectedAnswer: undefined,
		onAnswerSelect: jest.fn(),
		onConfirmAnswer: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the question text correctly', () => {
		render(<QuizQuestionStep {...mockProps} />);
		expect(screen.getByText(mockQuestion.question)).toBeInTheDocument();
	});

	it('renders all options correctly', () => {
		render(<QuizQuestionStep {...mockProps} />);
		mockQuestion.options?.forEach((option) => {
			expect(screen.getByText(option.text)).toBeInTheDocument();
		});
	});

	it('calls onAnswerSelect when an option is clicked', () => {
		render(<QuizQuestionStep {...mockProps} />);
		const firstOption = screen.getByText(mockQuestion.options![0].text);
		fireEvent.click(firstOption);
		expect(mockProps.onAnswerSelect).toHaveBeenCalledWith('option1');
	});

	it('shows confirm button when an answer is selected', () => {
		render(<QuizQuestionStep {...mockProps} selectedAnswer="option1" />);
		expect(screen.getByText('Confirmar Resposta')).toBeInTheDocument();
	});

	it('calls onConfirmAnswer when confirm button is clicked', () => {
		render(<QuizQuestionStep {...mockProps} selectedAnswer="option1" />);
		const confirmButton = screen.getByText('Confirmar Resposta');
		fireEvent.click(confirmButton);
		expect(mockProps.onConfirmAnswer).toHaveBeenCalledTimes(1);
	});

	it('renders progress indicator correctly', () => {
		render(<QuizQuestionStep {...mockProps} />);
		expect(screen.getByText('Perguntas')).toBeInTheDocument();
		expect(screen.getByText('1')).toBeInTheDocument();
	});

	it('displays message when no options are available', () => {
		const questionWithoutOptions: QuizQuestion = {
			...mockQuestion,
			options: [],
		};
		render(<QuizQuestionStep {...mockProps} question={questionWithoutOptions} />);
		expect(screen.getByText('Nenhuma opção de resposta disponível.')).toBeInTheDocument();
	});

	it('does not show confirm button when no answer is selected', () => {
		render(<QuizQuestionStep {...mockProps} selectedAnswer={undefined} />);
		expect(screen.queryByText('Confirmar Resposta')).not.toBeInTheDocument();
	});
});

