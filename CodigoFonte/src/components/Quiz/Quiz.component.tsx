'use client';

import { FunctionComponent, useState } from 'react';
import { QuizProps, QuizQuestion } from './Quiz.interface';
import { QuizQuestionStep } from './components/QuizQuestionStep';

// Dados mockados do quiz - em produção viriam de uma API
const mockQuestions: QuizQuestion[] = [
	{
		id: 1,
		question: 'Qual é uma vantagem de divulgar seu negócio nas redes sociais?',
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
	},
	// Adicione mais perguntas aqui conforme necessário
];

/**
 * **Quiz**
 *
 * Componente principal do wizard de quiz.
 * Gerencia o estado das perguntas, respostas selecionadas e navegação entre etapas.
 *
 * @component
 */
export const Quiz: FunctionComponent<QuizProps> = ({
	totalQuestions = 5,
	currentQuestion: initialQuestion = 1,
	onAnswerSelect: externalOnAnswerSelect,
	onNext,
	onPrevious,
}) => {
	const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
	const [selectedAnswers, setSelectedAnswers] = useState<{
		[questionId: number]: string;
	}>({});

	const handleAnswerSelect = (optionId: string) => {
		const questionId = currentQuestion;
		setSelectedAnswers((prev) => ({
			...prev,
			[questionId]: optionId,
		}));

		if (externalOnAnswerSelect) {
			externalOnAnswerSelect(questionId, optionId);
		}
	};

	const handleNext = () => {
		if (currentQuestion < totalQuestions) {
			setCurrentQuestion((prev) => prev + 1);
			if (onNext) {
				onNext();
			}
		}
	};

	const handlePrevious = () => {
		if (currentQuestion > 1) {
			setCurrentQuestion((prev) => prev - 1);
			if (onPrevious) {
				onPrevious();
			}
		}
	};

	const handleConfirmAnswer = () => {
		// Aqui você pode adicionar lógica para processar a resposta
		// Por exemplo, validar, enviar para API, etc.
		console.log('Resposta confirmada:', selectedAnswers[currentQuestion]);
		
		// Por enquanto, apenas navega para a próxima pergunta
		handleNext();
	};

	// Busca a pergunta atual (por enquanto usa mock)
	const currentQuestionData =
		mockQuestions.find((q) => q.id === currentQuestion) || mockQuestions[0];

	return (
		<div className='w-full'>
			<QuizQuestionStep
				question={currentQuestionData}
				currentQuestion={currentQuestion}
				totalQuestions={totalQuestions}
				selectedAnswer={selectedAnswers[currentQuestion]}
				onAnswerSelect={handleAnswerSelect}
				onConfirmAnswer={handleConfirmAnswer}
			/>

			{/* Botões de Navegação - serão implementados nas próximas etapas */}
			{/* <div className='flex justify-between mt-8'>
				<button
					onClick={handlePrevious}
					disabled={currentQuestion === 1}
					className='px-6 py-3 bg-white border border-[#D0D1D4] rounded-lg disabled:opacity-50'>
					Anterior
				</button>
				<button
					onClick={handleNext}
					disabled={currentQuestion === totalQuestions}
					className='px-6 py-3 bg-[#1EFF9D] text-[#070D26] rounded-lg font-bold disabled:opacity-50'>
					Próxima
				</button>
			</div> */}
		</div>
	);
};

