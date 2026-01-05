'use client';

import React, { FunctionComponent } from 'react';
import { QuizQuestion, QuizAnswer, QuizOption } from '../../Quiz.interface';
import { Check, X, UsersThree, CurrencyDollar, ThumbsDown, CaretLeft, CaretRight } from 'phosphor-react';

interface QuizCompletionStepProps {
	answers: QuizAnswer[];
	quizTitle?: string;
	onPrevious?: () => void;
	onNext?: () => void;
}

export const QuizCompletionStep: FunctionComponent<QuizCompletionStepProps> = ({
	answers,
	quizTitle = 'Quiz Encontro 03',
	onPrevious,
	onNext,
}) => {
	// Reorganiza as respostas:
	// 1. "Qual é uma vantagem..." com ícone de pessoas (correta) - posição 1
	// 2. "Qual é uma vantagem..." com ícone de dinheiro (incorreta) - posição 2
	// 3. "Conte em poucas palavras..." - posição 3
	const reorganizedAnswers = [...answers];
	
	// Encontra as respostas por tipo
	const correctAnswer = reorganizedAnswers.find(
		(a) => a.question.type === 'multiple-choice' && a.isCorrect && a.question.question.includes('Qual é uma vantagem')
	);
	const incorrectAnswer = reorganizedAnswers.find(
		(a) => a.question.type === 'multiple-choice' && !a.isCorrect && a.question.question.includes('Qual é uma vantagem')
	);
	const subjectiveAnswer = reorganizedAnswers.find(
		(a) => a.question.type === 'subjective' && a.question.question.includes('Conte em poucas palavras')
	);
	
	// Reorganiza: [correta, incorreta, subjetiva]
	if (correctAnswer && incorrectAnswer && subjectiveAnswer) {
		reorganizedAnswers[0] = correctAnswer;
		reorganizedAnswers[1] = incorrectAnswer;
		reorganizedAnswers[2] = subjectiveAnswer;
	}
	
	// Função auxiliar para obter o componente de ícone padrão
	const getDefaultIconComponent = (optionId: string, color: string, size: number = 24) => {
		switch (optionId) {
			case 'option1':
				return <UsersThree size={size} weight='fill' color={color} />;
			case 'option2':
				return <CurrencyDollar size={size} weight='fill' color={color} />;
			case 'option3':
				return <ThumbsDown size={size} weight='fill' color={color} />;
			default:
				return null;
		}
	};

	// Encontra a resposta selecionada
	const getSelectedOption = (answer: QuizAnswer): QuizOption | null => {
		if (!answer.selectedOptionId || !answer.question.options) return null;
		return answer.question.options.find((opt) => opt.id === answer.selectedOptionId) || null;
	};

	// Encontra a resposta correta
	const getCorrectOption = (answer: QuizAnswer): QuizOption | null => {
		if (!answer.correctAnswerId || !answer.question.options) return null;
		return answer.question.options.find((opt) => opt.id === answer.correctAnswerId) || null;
	};

	return (
		<div className='w-full max-w-full overflow-x-hidden box-border'>
			{/* Barra de navegação do Quiz (Estilo Pill com bolinhas dentro) */}
			<div className='flex items-center justify-start mb-6 md:mb-8'>
				{/* Barra central: fundo cinza escuro arredondado com bolinhas dentro */}
				<div className='bg-[#222325] rounded-full px-2 py-1 md:px-2.5 md:py-1.5 flex items-center justify-between gap-3 md:gap-4 shadow-sm'>
					{/* Botão esquerdo: bolinha verde dentro da barra (decorativo) */}
					<div className='w-10 h-10 rounded-full bg-[#4ade80] flex items-center justify-center flex-shrink-0 shadow-md -ml-1 md:-ml-1.5'>
						<CaretLeft size={20} weight='bold' color='#2d3748' />
					</div>

					{/* Texto central */}
					<span className='text-base md:text-lg font-medium text-white whitespace-nowrap px-2 md:px-3'>
						{quizTitle}
					</span>

					{/* Botão direito: bolinha verde dentro da barra (decorativo) */}
					<div className='w-10 h-10 rounded-full bg-[#4ade80] flex items-center justify-center flex-shrink-0 shadow-md -mr-1 md:-mr-1.5'>
						<CaretRight size={20} weight='bold' color='#2d3748' />
					</div>
				</div>
			</div>

			{/* Mensagem de sucesso */}
			<div className='mb-6 md:mb-8'>
				<h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#070D26] mb-4'>
					<span className='font-bold'>Quiz enviado</span> com sucesso!
				</h2>
			</div>

			<div className='flex flex-col lg:flex-row gap-6 lg:gap-8'>
				{/* Seção principal - Suas respostas */}
				<div className='flex-1 lg:flex-[2]'>
					<h3 className='text-xl md:text-2xl lg:text-3xl text-[#070D26] font-bold mb-6'>
						Suas respostas
					</h3>

					<div className='relative pl-14'>
						{/* Barra vertical contínua */}
						<div className='absolute left-5 top-0 bottom-0 w-[2px] bg-[#E5E7EB]'></div>
						
						<div className='space-y-6'>
							{reorganizedAnswers.map((answer, index) => {
								const isSubjective = answer.question.type === 'subjective';
								const isMultipleChoice = !isSubjective && answer.question.options;
								// Todas as bolinhas centralizadas na barra
								const circleLeft = '-55px';

								if (isMultipleChoice && answer.selectedOptionId) {
									const selectedOption = getSelectedOption(answer);
									const correctOption = !answer.isCorrect ? getCorrectOption(answer) : null;

									return (
										<div key={answer.questionId} className='flex items-start gap-4 relative'>
											{/* Bolinha com número - centralizada na barra */}
											<div 
												className='absolute z-10' 
												style={{ 
													left: `${circleLeft}`,
													top: '32px'
												}}
											>
												<div className='w-10 h-10 rounded-full bg-white border-2 border-[#E5E7EB] flex items-center justify-center font-bold text-[#070D26]'>
													{index + 1}
												</div>
											</div>
											
										{/* Card de resposta */}
										<div className='flex-1 max-w-4xl bg-white rounded-2xl p-5 md:p-6 lg:p-8 border border-[#E5E7EB] relative'>
											{/* Bolinha verde com checkmark no canto superior esquerdo (apenas para resposta correta) */}
											{answer.isCorrect && (
												<div className='absolute -top-2 -left-2 w-8 h-8 bg-[#4ade80] rounded-full flex items-center justify-center z-20 shadow-md'>
													<Check size={16} weight='bold' color='#070D26' />
												</div>
											)}
											{/* Bolinha coral com X no canto superior esquerdo (apenas para resposta incorreta) */}
											{!answer.isCorrect && isMultipleChoice && (
												<div className='absolute -top-2 -left-2 w-8 h-8 bg-[#FF6F61] rounded-full flex items-center justify-center z-20 shadow-md'>
													<X size={16} weight='bold' color='#070D26' />
												</div>
											)}
												
												{/* Conteúdo com pergunta à esquerda e resposta à direita */}
												<div className='flex items-center'>
													{/* Título da pergunta à esquerda */}
													<div className='flex-1 max-w-[40%]'>
														<p className='text-base md:text-lg lg:text-xl text-[#070D26] font-bold mb-4'>
															{answer.question.question.includes('Qual é uma vantagem de divulgar') ? (
																<>
																	Qual é uma vantagem de divulgar<br />
																	seu negócio nas redes sociais?
																</>
															) : (
																answer.question.question
															)}
														</p>
													</div>

													{/* Resposta do usuário */}
													<div className='flex items-center gap-3 flex-shrink-0 ml-1'>
														{answer.isCorrect ? (
															// Resposta correta com quadradinho verde retangular
															<div className='flex items-center gap-3 bg-[#4ade80] rounded-xl p-4 min-w-[280px]'>
																<UsersThree size={24} weight='fill' color='#070D26' />
																<p className='text-sm md:text-base text-[#070D26] font-medium'>
																	{selectedOption?.text || 'Resposta selecionada'}
																</p>
															</div>
														) : (
															<div className='flex flex-col gap-3'>
																<div className='flex items-center gap-3 p-4 rounded-xl bg-[#FF6F61] min-w-[280px]'>
																	<img 
																		src='/IMG_1552.PNG' 
																		alt='Ícone de dinheiro' 
																		className='w-6 h-6 flex-shrink-0'
																		style={{ filter: 'brightness(0) saturate(100%)' }}
																	/>
																	<p className='text-sm md:text-base font-medium text-[#070D26]'>
																		{selectedOption?.text || 'Resposta selecionada'}
																	</p>
																</div>
																{/* Resposta correta (apenas se errou) - azul escuro com ícone de pessoas */}
																{correctOption && (
																	<div className='bg-[#070D26] rounded-xl p-4 min-w-[280px]'>
																		<p className='text-xs md:text-sm text-[#1EFF9D] font-bold mb-2'>
																			Resposta correta:
																		</p>
																		<div className='flex items-center gap-3'>
																			<UsersThree size={24} weight='fill' color='#1EFF9D' />
																			<p className='text-sm md:text-base text-[#1EFF9D] font-medium'>
																				{correctOption.text}
																			</p>
																		</div>
																	</div>
																)}
															</div>
														)}
													</div>
													
													{/* Bolinha de interrogação no canto superior direito */}
													<div className='absolute top-4 right-4 w-5 h-5 rounded-full bg-[#6E707A] bg-opacity-20 flex items-center justify-center z-10'>
														<span className='text-[#6E707A] font-bold text-sm'>?</span>
													</div>
												</div>
											</div>
										</div>
									);
								}

								// Verifica se é "Orçamento pessoal" - deve mostrar box de arquivos
								const isOrcamentoPessoal = answer.question.question.includes('Orçamento pessoal');
								
								if (isOrcamentoPessoal) {
									// Usa os arquivos reais enviados ou array vazio
									const submittedFiles = answer.submittedFiles || [];
									const filesCount = submittedFiles.length;
									
									// Função para gerar preview dos arquivos (similar ao QuizActivityFeedbackStep)
									const getFilePreview = (file: File): string => {
										if (file.type.startsWith('image/')) {
											return URL.createObjectURL(file);
										}
										// Para outros tipos de arquivo, retorna um placeholder
										return '/document-icon.svg';
									};
									
									return (
										<div key={answer.questionId} className='flex items-start gap-4 relative'>
											{/* Bolinha com número - centralizada na barra */}
											<div 
												className='absolute z-10' 
												style={{ 
													left: `${circleLeft}`,
													top: '32px'
												}}
											>
												<div className='w-10 h-10 rounded-full bg-white border-2 border-[#E5E7EB] flex items-center justify-center font-bold text-[#070D26]'>
													{index + 1}
												</div>
											</div>
											
											{/* Card de resposta */}
											<div className='flex-1 max-w-4xl bg-white rounded-2xl p-5 md:p-6 lg:p-8 border border-[#E5E7EB] relative'>
												{/* Bolinha de interrogação no canto superior direito */}
												<div className='absolute top-4 right-4 w-5 h-5 rounded-full bg-[#6E707A] bg-opacity-20 flex items-center justify-center z-10'>
													<span className='text-[#6E707A] font-bold text-sm'>?</span>
												</div>
												
												{/* Conteúdo com pergunta à esquerda e box de arquivos à direita */}
												<div className='flex items-center'>
													{/* Título da pergunta à esquerda */}
													<div className='flex-1 max-w-[40%]'>
														<p className='text-base md:text-lg text-[#070D26] mb-3 font-medium'>
															{answer.question.question}
														</p>
													</div>

													{/* Box de arquivos à direita */}
													<div className='flex items-center gap-3 flex-shrink-0 ml-1'>
														<div className='max-w-[20rem]'>
															<div className='border-2 border-[#1EFF9D] rounded-2xl p-3 md:p-4 pt-5 md:pt-6 pb-14 md:pb-16 flex flex-col bg-transparent'>
																<div className='flex items-center justify-between mb-5'>
																	<span className='text-sm md:text-base font-medium text-[#1EFF9D]'>Seus arquivos enviados</span>
																	<span className='text-sm md:text-base font-bold text-[#1EFF9D]'>{filesCount}</span>
																</div>
																{/* Linha divisória verde - vai até o final em ambos os lados */}
																<div className='h-0.5 bg-[#1EFF9D] mb-5 -mx-3 md:-mx-4'></div>
																{/* Grid de thumbnails */}
																<div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4'>
																	{submittedFiles.length > 0 ? (
																		submittedFiles.map((file, i) => (
																			<div
																				key={i}
																				className='aspect-[3/4] rounded-lg overflow-hidden bg-[#F5F5F0] border-2 border-dashed border-[#D0D0D0] flex items-center justify-center shadow-sm'
																			>
																				{file.type.startsWith('image/') ? (
																					<img
																						src={getFilePreview(file)}
																						alt={file.name}
																						className='w-full h-full object-cover'
																					/>
																				) : (
																					<div className='flex flex-col items-center justify-center p-3 w-full h-full'>
																						<svg
																							className='w-full h-full max-w-[60%] max-h-[70%] text-[#8B8B7A]'
																							viewBox='0 0 100 140'
																							fill='none'
																							xmlns='http://www.w3.org/2000/svg'
																						>
																							{/* Contorno do documento */}
																							<path 
																								d='M 10 10 L 80 10 L 80 20 L 90 20 L 90 130 L 10 130 Z' 
																								stroke='currentColor' 
																								strokeWidth='2' 
																								fill='none'
																								strokeLinejoin='round'
																							/>
																							{/* Linha do canto dobrado */}
																							<line x1='80' y1='10' x2='90' y2='20' stroke='currentColor' strokeWidth='2' />
																							{/* Linhas de texto simuladas */}
																							<line x1='20' y1='35' x2='75' y2='35' stroke='currentColor' strokeWidth='1.5' />
																							<line x1='20' y1='50' x2='80' y2='50' stroke='currentColor' strokeWidth='1.5' />
																							<line x1='20' y1='65' x2='70' y2='65' stroke='currentColor' strokeWidth='1.5' />
																						</svg>
																					</div>
																				)}
																			</div>
																		))
																	) : (
																		// Se não houver arquivos, mostra placeholder
																		<div className='aspect-[3/4] rounded-lg overflow-hidden bg-[#F5F5F0] border-2 border-dashed border-[#D0D0D0] flex items-center justify-center shadow-sm'>
																			<div className='flex flex-col items-center justify-center p-3 w-full h-full'>
																				<svg
																					className='w-full h-full max-w-[60%] max-h-[70%] text-[#8B8B7A]'
																					viewBox='0 0 100 140'
																					fill='none'
																					xmlns='http://www.w3.org/2000/svg'
																				>
																					<path 
																						d='M 10 10 L 80 10 L 80 20 L 90 20 L 90 130 L 10 130 Z' 
																						stroke='currentColor' 
																						strokeWidth='2' 
																						fill='none'
																						strokeLinejoin='round'
																					/>
																					<line x1='80' y1='10' x2='90' y2='20' stroke='currentColor' strokeWidth='2' />
																					<line x1='20' y1='35' x2='75' y2='35' stroke='currentColor' strokeWidth='1.5' />
																					<line x1='20' y1='50' x2='80' y2='50' stroke='currentColor' strokeWidth='1.5' />
																					<line x1='20' y1='65' x2='70' y2='65' stroke='currentColor' strokeWidth='1.5' />
																				</svg>
																			</div>
																		</div>
																	)}
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									);
								}
								
								if (isSubjective && (answer.subjectiveAnswer || (answer.audioBlobs && answer.audioBlobs.length > 0))) {
									return (
										<div key={answer.questionId} className='flex items-start gap-4 relative'>
											{/* Bolinha com número - centralizada na barra */}
											<div 
												className='absolute z-10' 
												style={{ 
													left: `${circleLeft}`,
													top: '32px'
												}}
											>
												<div className='w-10 h-10 rounded-full bg-white border-2 border-[#E5E7EB] flex items-center justify-center font-bold text-[#070D26]'>
													{index + 1}
												</div>
											</div>
											
											{/* Card de resposta */}
											<div className='flex-1 max-w-4xl bg-white rounded-2xl p-5 md:p-6 lg:p-8 border border-[#E5E7EB] relative'>
												{/* Bolinha de interrogação no canto superior direito */}
												<div className='absolute top-4 right-4 w-5 h-5 rounded-full bg-[#6E707A] bg-opacity-20 flex items-center justify-center z-10'>
													<span className='text-[#6E707A] font-bold text-sm'>?</span>
												</div>
												
												{/* Conteúdo com pergunta à esquerda e resposta à direita */}
												<div className='flex items-center'>
													{/* Título da pergunta à esquerda */}
													<div className='flex-1 max-w-[40%]'>
														<p className='text-base md:text-lg text-[#070D26] mb-3 font-medium'>
															{answer.question.question}
														</p>
													</div>

														{/* Resposta de texto à direita */}
													<div className='flex items-center gap-3 flex-shrink-0 ml-1'>
														<div className='bg-white rounded-lg border border-[#E5E7EB] p-4 md:p-6 min-w-[280px]'>
															{/* Texto da resposta (transcrição se houver áudio) */}
															{answer.subjectiveAnswer && (
																<p className='text-sm md:text-base text-[#070D26] mb-4'>
																	{answer.subjectiveAnswer}
																</p>
															)}
															{/* Áudios */}
															{answer.audioBlobs && answer.audioBlobs.length > 0 && (
																<div className='space-y-3'>
																	{answer.audioBlobs.map((audioBlob, audioIndex) => {
																		// Criar URL do blob para duração mockada
																		const audioUrl = URL.createObjectURL(audioBlob);
																		return (
																			<div
																				key={audioIndex}
																				className='bg-[#F9FAFB] rounded-lg p-3 md:p-4 flex items-center gap-3'
																			>
																				<button
																					type='button'
																					className='w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center hover:bg-[#059669] transition-colors flex-shrink-0'
																				>
																					<svg
																						width='20'
																						height='20'
																						viewBox='0 0 24 24'
																						fill='none'
																						xmlns='http://www.w3.org/2000/svg'
																					>
																						<path
																							d='M8 5v14l11-7z'
																							fill='white'
																						/>
																					</svg>
																				</button>
																				<span className='text-xs md:text-sm text-[#6B7280] font-medium flex-shrink-0'>
																					0:30
																				</span>
																				{/* Waveform visual */}
																				<div className='flex-1 flex items-center gap-1 h-8'>
																					{[...Array(20)].map((_, i) => {
																						const heights = [45, 30, 60, 25, 50, 35, 55, 40, 30, 50, 45, 35, 60, 25, 50, 40, 55, 30, 45, 50];
																						return (
																							<div
																								key={i}
																								className='flex-1 bg-[#10B981] rounded-sm'
																								style={{
																									height: `${heights[i % heights.length]}%`,
																								}}
																							/>
																						);
																					})}
																				</div>
																			</div>
																		);
																	})}
																</div>
															)}
														</div>
													</div>
												</div>
											</div>
										</div>
									);
								}

								return null;
							})}
						</div>
					</div>
				</div>

				{/* Barra lateral - Informações de retorno */}
				<div className='lg:w-80 lg:flex-shrink-0'>
					<div 
						className='rounded-2xl p-5 md:p-6 lg:p-8 sticky top-6 shadow-sm border border-[#E5E7EB]'
						style={{
							backgroundColor: '#FFFFFF',
							background: '#FFFFFF',
						}}
					>
						<h4 className='text-xl md:text-2xl text-[#070D26] font-bold mb-4'>
							Retorno em breve!
						</h4>
						<div className='space-y-4'>
							<p className='text-sm md:text-base text-[#070D26] leading-relaxed'>
								Suas respostas foram enviadas para o facilitador, que vai ler e te dar um retorno em breve.
							</p>
							<p className='text-sm md:text-base text-[#070D26] leading-relaxed'>
								Com essa atividade, o facilitador vai confirmar sua presença nesta aula.
							</p>
							<p className='text-sm md:text-base text-[#070D26] font-bold leading-relaxed'>
								Parabéns por participar ativamente!
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

