import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QuizActivityFeedbackStep } from './QuizActivityFeedbackStep.component';

describe('QuizActivityFeedbackStep Component', () => {
	const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
	const mockImageFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

	const mockProps = {
		currentQuestion: 1,
		totalQuestions: 5,
		activityTitle: 'Orçamento pessoal: equilibrando receitas e despesas',
		activityDescription: 'Organize suas receitas e despesas.',
		feedbackText: 'Organizar o que você ganha e o que gasta ajuda a entender melhor seu dinheiro.',
		submittedFiles: [mockFile, mockImageFile],
		video: undefined,
		onNext: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the activity title correctly', () => {
		render(<QuizActivityFeedbackStep {...mockProps} />);
		expect(screen.getByText(mockProps.activityTitle)).toBeInTheDocument();
	});

	it('displays the number of submitted files', () => {
		render(<QuizActivityFeedbackStep {...mockProps} />);
		expect(screen.getByText('2')).toBeInTheDocument();
		expect(screen.getByText(/Seus arquivos enviados/i)).toBeInTheDocument();
	});

	it('displays feedback text', () => {
		render(<QuizActivityFeedbackStep {...mockProps} />);
		expect(screen.getByText(mockProps.feedbackText)).toBeInTheDocument();
	});

	it('calls onNext when next button is clicked', () => {
		render(<QuizActivityFeedbackStep {...mockProps} />);
		const nextButton = screen.getByText('Próxima pergunta');
		fireEvent.click(nextButton);
		expect(mockProps.onNext).toHaveBeenCalledTimes(1);
	});

	it('shows "Finalizar quiz" when on last question', () => {
		render(<QuizActivityFeedbackStep {...mockProps} currentQuestion={5} totalQuestions={5} />);
		expect(screen.getByText('Finalizar quiz')).toBeInTheDocument();
	});

	it('renders progress indicator correctly', () => {
		render(<QuizActivityFeedbackStep {...mockProps} />);
		expect(screen.getByText('Perguntas')).toBeInTheDocument();
	});

	it('displays default feedback text when not provided', () => {
		const propsWithoutFeedback = {
			...mockProps,
			feedbackText: undefined,
		};
		render(<QuizActivityFeedbackStep {...propsWithoutFeedback} />);
		expect(screen.getByText(/Organizar o que você ganha/i)).toBeInTheDocument();
	});

	it('shows video section when video is provided', () => {
		const video = {
			thumbnail: 'https://example.com/thumb.jpg',
			url: 'https://example.com/video.mp4',
			title: 'Vídeo explicativo',
		};
		render(<QuizActivityFeedbackStep {...mockProps} video={video} />);
		expect(screen.getByText(/Quer ver um vídeo sobre isso?/i)).toBeInTheDocument();
	});
});

