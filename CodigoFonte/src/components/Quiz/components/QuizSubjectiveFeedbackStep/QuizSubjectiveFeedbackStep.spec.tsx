import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QuizSubjectiveFeedbackStep } from './QuizSubjectiveFeedbackStep.component';
import { QuizQuestion } from '../../Quiz.interface';

describe('QuizSubjectiveFeedbackStep Component', () => {
	const mockQuestion: QuizQuestion = {
		id: 1,
		question: 'Conte em poucas palavras como você divulga hoje o seu trabalho ou serviço para outras pessoas.',
		type: 'subjective',
	};

	const mockProps = {
		question: mockQuestion,
		currentQuestion: 1,
		totalQuestions: 5,
		userAnswer: 'Eu mando mensagem no WhatsApp pros meus clientes.',
		audioBlobs: [],
		feedbackExplanation: 'Divulgar seu trabalho é importante para mais pessoas conhecerem o que você faz.',
		video: undefined,
		onNext: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the question text correctly', () => {
		render(<QuizSubjectiveFeedbackStep {...mockProps} />);
		expect(screen.getByText(mockQuestion.question)).toBeInTheDocument();
	});

	it('displays the user answer', () => {
		render(<QuizSubjectiveFeedbackStep {...mockProps} />);
		expect(screen.getByText(mockProps.userAnswer)).toBeInTheDocument();
	});

	it('displays feedback explanation', () => {
		render(<QuizSubjectiveFeedbackStep {...mockProps} />);
		expect(screen.getByText(mockProps.feedbackExplanation)).toBeInTheDocument();
	});

	it('calls onNext when next button is clicked', () => {
		render(<QuizSubjectiveFeedbackStep {...mockProps} />);
		const nextButton = screen.getByText('Próxima pergunta');
		fireEvent.click(nextButton);
		expect(mockProps.onNext).toHaveBeenCalledTimes(1);
	});

	it('renders progress indicator correctly', () => {
		render(<QuizSubjectiveFeedbackStep {...mockProps} />);
		expect(screen.getByText('Perguntas')).toBeInTheDocument();
		expect(screen.getByText('1')).toBeInTheDocument();
	});

	it('shows video section when video is provided', () => {
		const video = {
			thumbnail: 'https://example.com/thumb.jpg',
			url: 'https://example.com/video.mp4',
			title: 'Vídeo explicativo',
		};
		render(<QuizSubjectiveFeedbackStep {...mockProps} video={video} />);
		expect(screen.getByText(/Quer ver um vídeo sobre isso?/i)).toBeInTheDocument();
	});

	it('displays audio players when audioBlobs are provided', () => {
		const audioBlob = new Blob(['audio content'], { type: 'audio/webm' });
		render(<QuizSubjectiveFeedbackStep {...mockProps} audioBlobs={[audioBlob]} />);
		const audioElements = screen.getAllByRole('application');
		expect(audioElements.length).toBeGreaterThan(0);
	});
});

