import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QuizActivityStep } from './QuizActivityStep.component';

describe('QuizActivityStep Component', () => {
	const mockProps = {
		currentQuestion: 1,
		totalQuestions: 5,
		activityTitle: 'Orçamento pessoal: equilibrando receitas e despesas',
		activityDescription: 'Organize suas receitas e despesas mensais.',
		suggestionLabel: 'Confira nossa sugestão:',
		downloadButtonText: 'Baixar template',
		downloadUrl: 'https://example.com/template.pdf',
		onSubmit: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the activity title correctly', () => {
		render(<QuizActivityStep {...mockProps} />);
		expect(screen.getByText(mockProps.activityTitle)).toBeInTheDocument();
	});

	it('renders the activity description correctly', () => {
		render(<QuizActivityStep {...mockProps} />);
		expect(screen.getByText(mockProps.activityDescription)).toBeInTheDocument();
	});

	it('renders download button when downloadUrl is provided', () => {
		render(<QuizActivityStep {...mockProps} />);
		expect(screen.getByText(mockProps.downloadButtonText!)).toBeInTheDocument();
	});

	it('does not render download button when downloadUrl is not provided', () => {
		const propsWithoutDownload = {
			...mockProps,
			downloadUrl: undefined,
			downloadButtonText: undefined,
		};
		render(<QuizActivityStep {...propsWithoutDownload} />);
		expect(screen.queryByText('Baixar template')).not.toBeInTheDocument();
	});

	it('renders progress indicator correctly', () => {
		render(<QuizActivityStep {...mockProps} />);
		expect(screen.getByText('Perguntas')).toBeInTheDocument();
		expect(screen.getByText('1')).toBeInTheDocument();
	});

	it('renders file upload section', () => {
		render(<QuizActivityStep {...mockProps} />);
		expect(screen.getByText(/Envie sua atividade:/i)).toBeInTheDocument();
	});

	it('disables submit button when no files are selected', () => {
		render(<QuizActivityStep {...mockProps} />);
		const submitButton = screen.getByText('Enviar atividade');
		expect(submitButton).toBeDisabled();
	});

	it('calls onSubmit when files are selected and submit is clicked', async () => {
		render(<QuizActivityStep {...mockProps} />);
		
		// Simular seleção de arquivo
		const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
		const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
		
		Object.defineProperty(fileInput, 'files', {
			value: [file],
			writable: false,
		});

		fireEvent.change(fileInput);

		await waitFor(() => {
			const submitButton = screen.getByText('Enviar atividade');
			expect(submitButton).not.toBeDisabled();
		});

		const submitButton = screen.getByText('Enviar atividade');
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(mockProps.onSubmit).toHaveBeenCalled();
		});
	});
});

