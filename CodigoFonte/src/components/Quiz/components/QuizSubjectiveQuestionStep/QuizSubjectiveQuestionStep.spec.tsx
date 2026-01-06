import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QuizSubjectiveQuestionStep } from './QuizSubjectiveQuestionStep.component';
import { QuizQuestion } from '../../Quiz.interface';

// Mock do MediaRecorder
global.MediaRecorder = jest.fn().mockImplementation(() => ({
	start: jest.fn(),
	stop: jest.fn(),
	ondataavailable: null,
	onstop: null,
	stream: {
		getTracks: jest.fn().mockReturnValue([
			{ stop: jest.fn() },
		]),
	},
	mimeType: 'audio/webm',
}));

// Mock do getUserMedia
global.navigator.mediaDevices = {
	getUserMedia: jest.fn().mockResolvedValue({
		getTracks: jest.fn().mockReturnValue([
			{ stop: jest.fn() },
		]),
	}),
} as any;

describe('QuizSubjectiveQuestionStep Component', () => {
	const mockQuestion: QuizQuestion = {
		id: 1,
		question: 'Conte em poucas palavras como você divulga hoje o seu trabalho ou serviço para outras pessoas.',
		type: 'subjective',
		instruction: 'Não precisa escrever muito, pode ser só 2 ou 3 frases.',
	};

	const mockProps = {
		question: mockQuestion,
		currentQuestion: 1,
		totalQuestions: 5,
		answer: '',
		audioBlobs: [],
		onAnswerChange: jest.fn(),
		onAudioChange: jest.fn(),
		onConfirmAnswer: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the question text correctly', () => {
		render(<QuizSubjectiveQuestionStep {...mockProps} />);
		expect(screen.getByText(mockQuestion.question)).toBeInTheDocument();
	});

	it('renders the instruction when provided', () => {
		render(<QuizSubjectiveQuestionStep {...mockProps} />);
		expect(screen.getByText(mockQuestion.instruction!)).toBeInTheDocument();
	});

	it('calls onAnswerChange when text is entered', () => {
		render(<QuizSubjectiveQuestionStep {...mockProps} />);
		const textarea = screen.getByPlaceholderText('Escreva sua resposta aqui ou grave um áudio');
		fireEvent.change(textarea, { target: { value: 'Minha resposta' } });
		expect(mockProps.onAnswerChange).toHaveBeenCalledWith('Minha resposta');
	});

	it('shows confirm button when answer is provided', () => {
		render(<QuizSubjectiveQuestionStep {...mockProps} answer="Minha resposta" />);
		expect(screen.getByText('Enviar resposta')).toBeInTheDocument();
	});

	it('calls onConfirmAnswer when confirm button is clicked', () => {
		render(<QuizSubjectiveQuestionStep {...mockProps} answer="Minha resposta" />);
		const confirmButton = screen.getByText('Enviar resposta');
		fireEvent.click(confirmButton);
		expect(mockProps.onConfirmAnswer).toHaveBeenCalledTimes(1);
	});

	it('renders progress indicator correctly', () => {
		render(<QuizSubjectiveQuestionStep {...mockProps} />);
		expect(screen.getByText('Perguntas')).toBeInTheDocument();
		expect(screen.getByText('1')).toBeInTheDocument();
	});

	it('does not show confirm button when answer is empty', () => {
		render(<QuizSubjectiveQuestionStep {...mockProps} answer="" />);
		expect(screen.queryByText('Enviar resposta')).not.toBeInTheDocument();
	});

	it('displays recording indicator when recording', async () => {
		render(<QuizSubjectiveQuestionStep {...mockProps} />);
		const micButton = screen.getByRole('button', { name: /microphone/i });
		fireEvent.click(micButton);
		
		await waitFor(() => {
			expect(screen.getByText(/Gravando.../i)).toBeInTheDocument();
		});
	});
});

