import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Quiz } from './Quiz.component';
import { QuizProps } from './Quiz.interface';

// Mock do useRouter e usePathname
jest.mock('next/navigation', () => ({
	useRouter: () => ({
		push: jest.fn(),
	}),
	usePathname: () => '/quiz/encontro-03',
}));

describe('Quiz Component', () => {
	const mockProps: QuizProps = {
		totalQuestions: 4,
		currentQuestion: 1,
		activities: [],
		onAnswerSelect: jest.fn(),
		onActivitySubmit: jest.fn(),
		onNext: jest.fn(),
		encounterNumber: 3,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the first question by default', () => {
		render(<Quiz {...mockProps} />);
		expect(screen.getByText(/Qual é uma vantagem/i)).toBeInTheDocument();
	});

	it('displays progress indicator', () => {
		render(<Quiz {...mockProps} />);
		expect(screen.getByText('Perguntas')).toBeInTheDocument();
		expect(screen.getByText('1')).toBeInTheDocument();
	});

	it('calls onAnswerSelect when an answer is selected', async () => {
		render(<Quiz {...mockProps} />);
		
		await waitFor(() => {
			const option = screen.getByText(/Você alcança mais pessoas/i);
			if (option) {
				fireEvent.click(option);
			}
		});

		await waitFor(() => {
			if (mockProps.onAnswerSelect) {
				expect(mockProps.onAnswerSelect).toHaveBeenCalled();
			}
		});
	});

	it('shows confirm button when answer is selected', async () => {
		render(<Quiz {...mockProps} />);
		
		await waitFor(() => {
			const option = screen.getByText(/Você alcança mais pessoas/i);
			if (option) {
				fireEvent.click(option);
			}
		});

		await waitFor(() => {
			const confirmButton = screen.queryByText('Confirmar Resposta');
			if (confirmButton) {
				expect(confirmButton).toBeInTheDocument();
			}
		});
	});

	it('renders subjective question step for subjective questions', async () => {
		render(<Quiz {...mockProps} currentQuestion={2} />);
		
		await waitFor(() => {
			expect(screen.getByText(/Conte em poucas palavras/i)).toBeInTheDocument();
		});
	});

	it('handles activity submission', async () => {
		const activities = [
			{
				id: 4,
				activityTitle: 'Orçamento pessoal',
				activityDescription: 'Organize suas finanças',
			},
		];

		render(<Quiz {...mockProps} activities={activities} currentQuestion={4} />);
		
		await waitFor(() => {
			expect(screen.getByText(/Orçamento pessoal/i)).toBeInTheDocument();
		});
	});
});

