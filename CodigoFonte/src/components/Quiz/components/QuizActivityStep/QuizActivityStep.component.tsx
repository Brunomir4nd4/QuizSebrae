'use client';

import React, { FunctionComponent, useState, useRef } from 'react';
import { SpeakerHigh, ArrowRight, Folder, Camera, ImageSquare } from 'phosphor-react';


interface QuizActivityStepProps {
	currentQuestion: number;
	totalQuestions: number;
	activityTitle: string;
	activityDescription: string;
	suggestionLabel?: string;
	downloadButtonText?: string;
	downloadUrl?: string;
	onSubmit?: (files: File[]) => void;
	onNext?: () => void;
}

/**
 * **QuizActivityStep**
 *
 * Componente que exibe uma atividade com upload de arquivos (Etapa 2 do wizard).
 * Mostra indicador de progresso, descrição da atividade, botão de download e área de upload.
 * Adapta-se para desktop e mobile com diferentes interfaces de upload.
 *
 * @component
 */
export const QuizActivityStep: FunctionComponent<QuizActivityStepProps> = ({
	currentQuestion,
	totalQuestions,
	activityTitle,
	activityDescription,
	suggestionLabel = 'Confira nossa sugestão:',
	downloadButtonText,
	downloadUrl,
	onSubmit,
	onNext,
}) => {
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const cameraInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const files = Array.from(e.target.files);
			setSelectedFiles((prev) => [...prev, ...files]);
		}
	};

	const handleFileInputClick = () => {
		fileInputRef.current?.click();
	};

	const handleCameraClick = () => {
		cameraInputRef.current?.click();
	};

	const handleDownload = () => {
		if (downloadUrl) {
			const link = document.createElement('a');
			link.href = downloadUrl;
			link.download = downloadButtonText || 'arquivo';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	};

	const handleSubmit = () => {
		if (selectedFiles.length > 0 && onSubmit) {
			onSubmit(selectedFiles);
		}
		// Não chama onNext aqui - o feedback será mostrado primeiro
		// O onNext será chamado quando o usuário clicar em "Próxima pergunta" no feedback
	};

	const handleRemoveFile = (index: number) => {
		setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
	};

	return (
		<div className='w-full'>
			{/* Indicador de Progresso com linha conectando */}
			<div className='mb-6 md:mb-8'>
				<div className='flex flex-col md:flex-row md:items-center gap-3 md:gap-0 mb-3 md:mb-4'>
					<p className='text-base md:text-lg text-[#6E707A] font-regular md:mr-4 flex-shrink-0'>Perguntas</p>
					<div className='flex items-center w-full md:flex-1 md:w-auto overflow-hidden'>
						<div className='flex items-center w-full gap-1 sm:gap-1.5 md:gap-2'>
							{Array.from({ length: totalQuestions }, (_, index) => {
								const questionNumber = index + 1;
								const isActive = questionNumber === currentQuestion;
								const isCompleted = questionNumber < currentQuestion;
								const isLast = questionNumber === totalQuestions;

								return (
									<React.Fragment key={questionNumber}>
										{/* Círculo do número */}
										<div className='relative flex items-center justify-center flex-shrink-0 z-10'>
											<div
												className={`relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full border-2 transition-all ${
													isActive
														? 'bg-[#1EFF9D] border-white text-[#070D26] font-bold shadow-lg'
														: isCompleted
															? 'bg-[#1EFF9D] border-white text-[#070D26] font-bold'
															: 'bg-white border-[#D0D1D4] text-[#6E707A]'
												}`}>
												<span className='text-sm sm:text-sm md:text-base lg:text-lg font-semibold'>{questionNumber}</span>
											</div>
										</div>
										{/* Linha conectando (exceto no último) */}
										{!isLast && (
											<div
												className={`w-2 sm:w-3 md:flex-1 md:min-w-0 h-0.5 md:h-1 transition-all flex-shrink-0 ${
													isCompleted || isActive
														? 'bg-[#1EFF9D]'
														: 'bg-[#D0D1D4]'
												}`}
											/>
										)}
									</React.Fragment>
								);
							})}
						</div>
					</div>
				</div>
			</div>

			{/* Seção Completa da Atividade (Fundo Verde) - Tudo dentro do mesmo bloco */}
			<div className='bg-gradient-to-b from-[#1EFF9D] to-[#14E48A] rounded-2xl p-4 md:p-5 lg:p-6 xl:p-8'>
				{/* Cabeçalho com ícone de áudio e título - Centralizado */}
				<div className='flex items-center justify-center gap-2 md:gap-3 lg:gap-4 mb-4 md:mb-6'>
					{/* Ícone de áudio com fundo circular escuro */}
					<div className='flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#070D26] flex items-center justify-center shadow-lg'>
						<SpeakerHigh size={14} weight='fill' color='#FFFFFF' className='md:w-5 md:h-5' />
					</div>
					{/* Título - Centralizado */}
					<h2 className='text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-[#070D26] font-bold leading-tight text-center'>
						{activityTitle}
					</h2>
				</div>

				{/* Descrição da atividade - Centralizada */}
				<div className='mb-4 md:mb-6'>
					<p className='text-sm md:text-base lg:text-lg text-[#070D26] leading-relaxed text-center'>
						{activityDescription}
					</p>
				</div>

				{/* Sugestão e botão de download - Centralizado */}
				{downloadButtonText && (
					<div className='mb-6 md:mb-8 flex flex-col items-center'>
						<p className='text-sm md:text-base text-[#070D26] mb-3 md:mb-4 font-bold text-center'>{suggestionLabel}</p>
						<button
							onClick={handleDownload}
							className='bg-[#1a1f3a] hover:bg-[#1f2545] text-white font-bold rounded-full transition-all shadow-md hover:shadow-lg flex items-center overflow-hidden group'>
							<span className='text-sm md:text-base text-white px-6 md:px-8 lg:px-10 py-3 md:py-3.5'>{downloadButtonText}</span>
							<div className='bg-[#1F2937] px-4 md:px-5 lg:px-6 py-3 md:py-3.5 flex items-center justify-center flex-shrink-0'>
								<img
									src='/icon-download-branco.svg'
									alt='Download'
									width={18}
									height={18}
									className='md:w-5 md:h-5 flex-shrink-0'
								/>
							</div>
						</button>
					</div>
				)}

				{/* Linha divisória fina - Centralizada */}
				<div className='flex justify-center mb-6 md:mb-8'>
					<div className='w-full max-w-md h-px bg-gray-400'></div>
				</div>

				{/* Seção de Upload - Agora dentro do bloco verde */}
				<div className='mt-6 md:mt-8 flex flex-col items-center'>
					<h3 className='text-base md:text-lg text-[#070D26] font-bold mb-4 md:mb-6 text-left md:hidden'>
						Envio de atividade
					</h3>

					{/* Versão Desktop/Tablet */}
					<div className='hidden md:block w-full flex flex-col items-center'>
						<h3 className='text-base md:text-lg text-[#070D26] font-bold mb-4 md:mb-6 text-center w-full -ml-16 md:-ml-20'>
							Envie sua atividade:
						</h3>
						<div className='mb-4 flex justify-center'>
							<input
								ref={fileInputRef}
								type='file'
								multiple
								className='hidden'
								onChange={handleFileSelect}
								accept='image/*,application/pdf,.doc,.docx,.xls,.xlsx'
							/>
							<button
								onClick={handleFileInputClick}
								className='bg-[#14E48A] border border-[#070D26] hover:border-[#070D26] rounded-full flex items-center justify-between transition-all cursor-pointer overflow-hidden shadow-md w-auto min-w-[300px] md:min-w-[350px]'>
								<span className='text-xs md:text-sm text-[#070D26] font-regular px-4 md:px-5 py-2 md:py-2.5 text-center whitespace-nowrap'>
									Escolher arquivo(s)
								</span>
								<div className='bg-[#1F2937] px-3 md:px-4 py-2 md:py-2.5 flex items-center justify-center flex-shrink-0'>
									<Folder size={16} weight='regular' color='#1EFF9D' className='md:w-5 md:h-5 flex-shrink-0' />
								</div>
							</button>
						</div>

						{/* Lista de arquivos selecionados */}
						{selectedFiles.length > 0 && (
							<div className='mb-4 space-y-2'>
								{selectedFiles.map((file, index) => (
									<div
										key={index}
										className='flex items-center justify-between bg-white/50 rounded-lg p-3 border border-[#070D26]/20'>
										<span className='text-sm text-[#070D26] truncate flex-1'>{file.name}</span>
										<button
											onClick={() => handleRemoveFile(index)}
											className='ml-2 text-red-600 hover:text-red-800 text-sm font-medium'>
											Remover
										</button>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Versão Mobile */}
					<div className='block md:hidden'>
					<div className='grid grid-cols-3 gap-3 mb-4'>
						{/* Botão Galeria */}
						<button
							onClick={handleFileInputClick}
							className='flex flex-col items-center justify-center gap-2 bg-white border-2 border-[#D0D1D4] hover:border-[#070D26] rounded-xl p-4 transition-all aspect-square'>
							<ImageSquare size={24} weight='regular' color='#070D26' />
							<span className='text-xs text-[#070D26] font-regular text-center'>Galeria de imagens</span>
						</button>

						{/* Botão Câmera */}
						<button
							onClick={handleCameraClick}
							className='flex flex-col items-center justify-center gap-2 bg-white border-2 border-[#D0D1D4] hover:border-[#070D26] rounded-xl p-4 transition-all aspect-square'>
							<Camera size={24} weight='regular' color='#070D26' />
							<span className='text-xs text-[#070D26] font-regular text-center'>Abrir Câmera</span>
						</button>

						{/* Botão Pasta */}
						<button
							onClick={handleFileInputClick}
							className='flex flex-col items-center justify-center gap-2 bg-white border-2 border-[#D0D1D4] hover:border-[#070D26] rounded-xl p-4 transition-all aspect-square'>
							<Folder size={24} weight='regular' color='#070D26' />
							<span className='text-xs text-[#070D26] font-regular text-center'>Pasta de arquivos</span>
						</button>
					</div>

					{/* Input oculto para câmera (mobile) */}
					<input
						ref={cameraInputRef}
						type='file'
						multiple
						capture='environment'
						className='hidden'
						onChange={handleFileSelect}
						accept='image/*'
					/>

						{/* Lista de arquivos selecionados (mobile) */}
						{selectedFiles.length > 0 && (
							<div className='mb-4 space-y-2'>
								{selectedFiles.map((file, index) => (
									<div
										key={index}
										className='flex items-center justify-between bg-white/50 rounded-lg p-3 border border-[#070D26]/20'>
										<span className='text-xs text-[#070D26] truncate flex-1'>{file.name}</span>
										<button
											onClick={() => handleRemoveFile(index)}
											className='ml-2 text-red-600 hover:text-red-800 text-xs font-medium'>
											Remover
										</button>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Botão de Enviar Atividade - Centralizado */}
					<div className='flex justify-center mt-4 md:mt-6'>
						<button
							type='button'
							onClick={handleSubmit}
							disabled={selectedFiles.length === 0}
							className={`quiz-submit-button font-bold rounded-full transition-all shadow-lg flex items-center gap-2 md:gap-3 justify-center overflow-hidden w-auto px-4 md:px-5 py-2 md:py-2.5 ${selectedFiles.length === 0 ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}`}
							style={{
								cursor: selectedFiles.length === 0 ? 'not-allowed' : 'pointer',
								fontWeight: 'bold',
								borderRadius: '9999px',
								transition: 'all 0.3s',
								boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
								display: 'flex',
								alignItems: 'center',
								gap: '0.5rem',
								justifyContent: 'center',
								overflow: 'hidden',
								width: 'auto',
								padding: '0.5rem 1rem'
							}}
							onMouseEnter={(e) => {
								if (selectedFiles.length > 0) {
									e.currentTarget.style.backgroundColor = '#2a2a2a';
								}
							}}
							onMouseLeave={(e) => {
								if (selectedFiles.length > 0) {
									e.currentTarget.style.backgroundColor = '#1a1a1a';
								}
							}}>
							<span className='text-xs md:text-sm' style={{ color: selectedFiles.length === 0 ? '#6E707A' : '#1EFF9D', opacity: 1 }}>Enviar atividade</span>
							<div style={{ backgroundColor: '#1EFF9D', borderRadius: '9999px', padding: '0.25rem 0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
								<ArrowRight size={12} weight='bold' color='#070D26' className='md:w-4 md:h-4' />
							</div>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

