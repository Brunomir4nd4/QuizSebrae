import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConsultancyThirdStep } from '../index';

describe('ConsultancyThirdStep component', () => {
	const mockSetQuestions = jest.fn();
	interface Questions {
		social_network: string;
		main_topic: string;
		specific_questions: string;
	}

	const initialQuestions: Questions = {
		social_network: '',
		main_topic: '',
		specific_questions: '',
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders inputs and select correctly', () => {
		render(
			<ConsultancyThirdStep
				courseSlug='upmarketing'
				questions={initialQuestions}
				setQuestions={mockSetQuestions}
			/>,
		);

		// Input de social network
		expect(screen.getByPlaceholderText('Seu @')).toBeInTheDocument();

		// Select de main_topic
		const select = screen.getByRole('combobox');
		expect(select).toBeInTheDocument();
		expect(select).toHaveTextContent('Escolha o principal assunto');

		// Input de specific_questions
		expect(
			screen.getByPlaceholderText('Escreva a sua dúvida'),
		).toBeInTheDocument();
	});

	it('calls setQuestions when typing in social_network field', () => {
		render(
			<ConsultancyThirdStep
				courseSlug='upmarketing'
				questions={initialQuestions}
				setQuestions={mockSetQuestions}
			/>,
		);

		const input = screen.getByPlaceholderText('Seu @');
		fireEvent.change(input, { target: { value: '@meuUsuario' } });

		expect(mockSetQuestions).toHaveBeenCalledWith(expect.any(Function));
	});

	it('calls setQuestions when typing in specific_questions field', () => {
		render(
			<ConsultancyThirdStep
				courseSlug='upmarketing'
				questions={initialQuestions}
				setQuestions={mockSetQuestions}
			/>,
		);

		const input = screen.getByPlaceholderText('Escreva a sua dúvida');
		fireEvent.change(input, { target: { value: 'Minha dúvida' } });

		expect(mockSetQuestions).toHaveBeenCalledWith(expect.any(Function));
	});
});
