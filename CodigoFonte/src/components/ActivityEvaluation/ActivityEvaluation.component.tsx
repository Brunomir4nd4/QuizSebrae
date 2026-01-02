
'use client';

import { FunctionComponent, useState } from 'react';
import {
	NextButton,
	PrevButton,
} from '../EnvioDeAtividades/components/ArrowsButton.styles';
import { Visibility } from '@mui/icons-material';
import {
	Divider,
	Grid,
	IconButton,
	Rating,
	TextField,
	Tooltip,
} from '@mui/material';
import { CarouselModal } from '../CarouselModal';
import Slider from 'react-slick';
import React from 'react';
import { ButtonIcon } from '../ButtonIcon';
import { ButtonDownload } from '../ButtonDownload';
import { DownloadButton } from './components/DownloadButton.styles';
import {
	createSubmission,
	deleteSubmission,
	getSubmissionFiles,
	updateSubmission,
} from '@/app/services/bff/SubmissionService';
import { useUserContext } from '@/app/providers/UserProvider';
import { useSession } from 'next-auth/react';
import { renderFile, renderFileThumbnail } from '@/utils/renderFile';
import { downloadFile } from '@/utils/downloadFile';
import { isDateWithinLimit } from '@/utils/dateUtils';
import ConfirmDeleteSubmissionModal from '../ConfirmDeleteSubmissionModal';
import { NotifyModal } from '../NotifyModal';

/**
 * Propriedades para o componente ActivityEvaluation
 */
export interface ActivityEvaluationProps {
       /** Identificador da submissão/atividade */
       id: number;
       /** Status da atividade: 'recebida' | 'recebida em outro canal' | 'não recebida' | 'avaliada' */
       status: string | 'recebida' | 'recebida em outro canal' | 'não recebida';
       /** Feedback já existente (nota + comentário) */
       feedback?: {
	       /** Nota dada (0-5) */
	       note: number;
	       /** Comentário do facilitador */
	       comment: string;
       };
       /** Arquivos enviados pelo participante */
       items?: FileItem[];
       /** Id do participante selecionado (para downloads API) */
       selectedParticipant?: number;
       /** Nome do participante selecionado */
       selectedStudentName?: string;
       /** Email do participante selecionado */
       selectedStudentEmail?: string;
       /** Número da atividade (ex: 1, 2, ...) */
       selectedActivity?: number;
       /** Callback chamado quando algo muda (recarregar lista, etc.) */
       onChange?: () => void;
}

export type FileItem = {
	id: string;
	name: string;
	type: string;
	url: string;
};


/**
 * **ActivityEvaluation**
 *
 * Componente que exibe arquivos submetidos para uma atividade, permite avaliação do facilitador,
 * download dos arquivos e alteração de status (recebida / não recebida / recebida em outro canal).
 * Inclui funcionalidades para avaliar com nota e comentário, permitir reenvio, marcar como recebida em outro canal, e visualizar arquivos em carrossel.
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Exibe lista de arquivos submetidos com thumbnails e opções de visualização.
 * - Permite avaliação com rating (nota 0-5) e comentário do facilitador.
 * - Oferece ações para marcar como "não recebida" (deletar submissão), permitir reenvio, ou marcar como recebida em outro canal.
 * - Suporte a download de todos os arquivos da atividade.
 * - Modal de carrossel para visualizar arquivos em fullscreen.
 * - Verificações de data para habilitar downloads.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <ActivityEvaluation
 *   id={submissionId}
 *   status="recebida"
 *   items={fileItems}
 *   feedback={{ note: 4, comment: "Bom trabalho" }}
 *   selectedParticipant={participantId}
 *   selectedStudentName="João Silva"
 *   selectedStudentEmail="joao@email.com"
 *   selectedActivity={1}
 *   onChange={handleChange}
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: (integrado no componente, sem arquivo separado específico).
 *
 * ---
 *
 * @component
 */

const ActivityEvaluation: FunctionComponent<ActivityEvaluationProps> = ({
	id,
	status,
	items,
	feedback,
	selectedParticipant = 0,
	selectedStudentName = '',
	selectedStudentEmail = '',
	selectedActivity = 1,
	onChange,
}) => {
	const { classId, classesData } = useUserContext();
	const { data: session } = useSession();
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [openModalResendSubmission, setOpenModalResendSubmission] =
		useState<boolean>(false);

	const carouselSettings = {
		dots: false,
		arrows: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		nextArrow: (
			<NextButton>
				<div>
					<img src='/icon-arrow-next.svg' alt='Próximo' />
				</div>
			</NextButton>
		),
		prevArrow: (
			<PrevButton>
				<div>
					<img src='/icon-arrow-prev.svg' alt='Anterior' />
				</div>
			</PrevButton>
		),
	};

	const handleModalOpen = (index: number) => {
		setActiveIndex(index);
		setModalOpen(true);
	};
	const handleCloseCarousel = () => {
		setModalOpen(false);
	};

	const [value, setValue] = useState<number | null>(feedback?.note ?? 0);
	const [comment, setComment] = useState<string>(feedback?.comment ?? '');
	const [saving, setSaving] = useState(false);
	const [resubmissionError, setResubmissionError] = useState(false);
	const canDownloadFiles =
		classesData && classId && isDateWithinLimit(classesData[classId].end_date);

	const handleSave = async () => {
		if (value === null) return;
		setSaving(true);
		try {
			if(classesData && classId) {
				await updateSubmission(id, {
					status: 'evaluated',
					score: value,
					facilitator_comment: comment,
					participant_email: selectedStudentEmail,
					participant_name: selectedStudentName,
					course_name: classesData[classId].courses.name
				});
			}
			
		} catch (e) {
			console.error('Erro ao salvar avaliação:', e);
		} finally {
			setSaving(false);
			onChange?.();
		}
	};

	const handleNotReceived = async () => {
		setSaving(true);
		try {
			await deleteSubmission(id);
		} catch (e) {
			console.error('Erro ao remover submissão:', e);
		} finally {
			setSaving(false);
			onChange?.();
		}
	};

	const handleAllowResubmission = async () => {
		setSaving(true);
		try {
			setResubmissionError(false);
			
			if(classesData && classId) {
				const participantData = {
					participant_name: selectedStudentName,
					participant_email: selectedStudentEmail,
					action: "resend",
					course_name: classesData[classId].courses.name
				}
	
				await deleteSubmission(id, participantData);
			}
		} catch (e) {
			console.error('Erro ao permitir o reenvio da submissão:', e);
			setResubmissionError(true);
		} finally {
			setSaving(false);
			setOpenModalResendSubmission(false);
			onChange?.();
		}
	};

	const handleDownloadFile = async () => {
		try {
			if (classId) {
				setLoading(true);
				const blob = await getSubmissionFiles({
					participant_id: selectedParticipant,
					activity_id: selectedActivity,
					class_id: classId,
				});

				const url = URL.createObjectURL(blob);
				downloadFile(
					url,
					`${selectedStudentName}_ATIVIDADE ESTRATEGICA ${selectedActivity}`,
				);
				URL.revokeObjectURL(url);
			}
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleReceivedOtherChannel = async () => {
		if (!classesData || !classId || !session) return;
		setSaving(true);
		const submissionData = new FormData();
		submissionData.append('class_id', String(classesData[classId].id));
		submissionData.append('participant_id', String(selectedParticipant));
		submissionData.append('activity_id', String(selectedActivity));
		submissionData.append(
			'title',
			`ATIVIDADE ESTRATEGICA ${selectedActivity} - ${selectedStudentName}`,
		);
		submissionData.append('course_id', String(classesData[classId].courses.id));
		submissionData.append('cycle_id', String(classesData[classId].ciclos.id));
		submissionData.append('facilitator_id', String(session.user.id));
		submissionData.append('status', 'submitted_external');

		try {
			await createSubmission(submissionData);
		} catch (e) {
			console.error(e);
		} finally {
			setSaving(false);
			onChange?.();
		}
	};

	return (
		<>
			<Grid container spacing={7} sx={{ marginBottom: 5 }}>
				<Grid item xs={12} lg={8}>
					{status === 'recebida' || status === 'avaliada' ? (
						items && items.length ? (
							<>
								<div className='bg-white rounded-2xl border border-color-[rgba(0, 0, 0, 0.15)]'>
									<div className='grid grid-cols-3 md:grid-cols-5 gap-4 p-6'>
										{items?.map((item, index) => {
											return (
												<div key={index} className='h-[130px] relative group'>
													<div className='w-full flex items-center justify-center  h-[130px] bg-[rgba(7,13,38,0.6)]'>
														{renderFileThumbnail(item)}
													</div>
													<div className='w-full h-[130px] bg-[rgba(7,13,38,0.6)] flex items-center justify-center opacity-0 absolute top-0 left-0 transition-all group-hover:opacity-100'>
														{canDownloadFiles && (
															<>
																<div className='text-xl text-white font-regular'>
																	<Tooltip title='Baixar'>
																		<IconButton
																			size='medium'
																			color='inherit'
																			onClick={() => {
																				const apiUrl = `/api/download?url=${encodeURIComponent(item.url)}&name=${encodeURIComponent(item.name)}`;
																				downloadFile(apiUrl, item.name);
																			}}>
																			<img
																				src='/icon-download-branco.svg'
																				alt=''
																				width='24px'
																			/>
																		</IconButton>
																	</Tooltip>
																</div>
																<div className='text-xl text-white font-regular'>
																	<Tooltip title='Expandir'>
																		<IconButton
																			size='medium'
																			color='inherit'
																			onClick={() => handleModalOpen(index)}>
																			<Visibility fontSize='medium' />
																		</IconButton>
																	</Tooltip>
																</div>
															</>
														)}
													</div>
												</div>
											);
										})}
									</div>
								</div>

								<div className='flex gap-4'>
									{canDownloadFiles && (
										<div className='my-8'>
											<ButtonDownload
												icon={'/icon-download-preto.svg'}
												text={loading ? 'Baixando...' : 'Baixar atividade'}
												onClick={handleDownloadFile}
											/>
										</div>
									)}

									{session?.user.role?.includes('facilitator') && (
										<button
											className='group'
											onClick={() => setOpenModalResendSubmission(true)}>
											<div className='flex items-center gap-2 p-[6px] pr-4 bg-transparent rounded-[40px] hover:bg-[#222325] hover:text-[#FF755B] transition-all'>
												<div className='w-[32px] min-w-[32px] h-[32px] rounded-full bg-[#FF755B] flex items-center justify-center'>
													<img
														src='/icon-lixeira-preto.svg'
														alt='Liberar reenvio da atividade'
														width={20}
													/>
												</div>
												<span className='text-xs font-bold'>
													Liberar reenvio da atividade
												</span>
											</div>
										</button>
									)}
								</div>

								<Divider />

								<CarouselModal
									width='80%'
									open={modalOpen}
									onClose={handleCloseCarousel}>
									<Slider
										{...carouselSettings}
										initialSlide={activeIndex}
										beforeChange={(_, next) => setActiveIndex(next)}>
										{items?.map((file) => (
											<div
												key={file.id}
												className='w-full flex flex-col justify-center text-center'>
												{renderFile(file)}
											</div>
										))}
									</Slider>

									{canDownloadFiles && (
										<DownloadButton
											sx={{ margin: 0 }}
											onClick={() => {
												if (items && items[activeIndex]) {
													const apiUrl = `/api/download?url=${encodeURIComponent(items[activeIndex].url)}&name=${encodeURIComponent(items[activeIndex].name)}`;
													downloadFile(apiUrl, items[activeIndex].name);
												}
											}}>
											<div>
												<img
													src='/icon-download-preto.svg'
													alt=''
													className='w-[20px]'
												/>
											</div>
										</DownloadButton>
									)}
								</CarouselModal>
							</>
						) : (
							<div className='py-5 px-14 bg-[#222325] rounded-2xl text-white text-xl font-bold'>
								Atividade recebida em outro canal.
							</div>
						)
					) : status === 'não recebida' ? (
						<>
							<div className='py-5 px-14 bg-[#6E707A] rounded-2xl text-white text-xl font-bold'>
								Atividade não recebida.
							</div>
							<div className='bg-white rounded-2xl p-5 mt-9 inline-block w-full'>
								<p className='text-sm text-[#070D26] font-bold mb-5'>
									Deseja alterar o status?
								</p>
								<button className='group' onClick={handleReceivedOtherChannel}>
									<div className='flex items-center gap-2 p-[6px] pr-4 bg-transparent rounded-[40px] hover:bg-[#222325] hover:text-[#1EFF9D] transition-all'>
										<div className='w-[32px] min-w-[32px] h-[32px] rounded-full bg-[#EBD406] flex items-center justify-center pl-[1px] pb-[1px]'>
											<img
												src='/icon-relogio-preto.svg'
												alt='Recebi em outro canal'
												width={20}
											/>
										</div>
										<span className='text-xs font-bold'>
											<strong>Sim!</strong> Recebi em outro canal
										</span>
									</div>
								</button>
							</div>
						</>
					) : status === 'recebida em outro canal' ? (
						<>
							<div className='py-5 px-14 bg-[#222325] rounded-2xl text-white text-xl font-bold'>
								Atividade recebida em outro canal.
							</div>
							<div className='bg-white rounded-2xl p-5 mt-9 inline-block w-full'>
								<p className='text-sm text-[#070D26] font-bold mb-5'>
									Deseja alterar o status?
								</p>
								<button className='group' onClick={handleNotReceived}>
									<div className='flex items-center gap-2 p-[6px] pr-4 bg-transparent rounded-[40px] hover:bg-[#222325] hover:text-[#1EFF9D] transition-all'>
										<div className='w-[32px] min-w-[32px] h-[32px] rounded-full bg-[#6E707A] flex items-center justify-center pl-[1px] pb-[1px]'>
											<img
												src='/icon-relogio-branco.svg'
												alt='Recebi em outro canal'
												width={20}
											/>
										</div>
										<span className='text-xs font-bold'>
											Alterar para <strong>não recebida</strong>
										</span>
									</div>
								</button>
							</div>
						</>
					) : (
						<div className='py-5 px-14 bg-[#6E707A] rounded-2xl text-white text-xl font-bold'>
							Nenhuma atividade encontrada
						</div>
					)}
				</Grid>
				<Grid item xs={12} lg={4}>
					{status === 'não recebida' ? null : (
						<>
							{feedback ? (
								<div className='bg-white rounded-2xl p-10'>
									<h2 className='text-2xl lg:text-3xl mb-4 text-[#070D26] font-bold'>
										Avaliação Realizada
									</h2>
									<div className='border border-color-[#F5F6F9] rounded-2xl p-5 mb-4 flex flex-col items-center'>
										<Rating
											size='large'
											name='simple-controlled'
											value={feedback.note}
											readOnly
											className='!text-5xl !text-[#1EFF9D]'
										/>
										<div className='w-full flex justify-between items-center mt-2'>
											<span className='text-sm text-[#070D26] font-regular'>
												Precisa melhorar
											</span>
											<span className='text-sm text-[#070D26] font-regular'>
												Está perfeito
											</span>
										</div>
									</div>
									<div className='border border-color-[#F5F6F9] rounded-2xl p-6'>
										<p className='text-lg lg:text-xl text-[#070D26] font-bold mb-4'>
											Comentário:
										</p>
										<p className='text-lg lg:text-xl text-[#070D26] font-regular'>
											{feedback.comment}
										</p>
									</div>
								</div>
							) : (
								session?.user.role?.includes('facilitator') && (
									<div className='bg-white rounded-2xl p-10'>
										<h2 className='text-2xl lg:text-3xl mb-4 text-[#070D26] font-bold'>
											Faça a avaliação
										</h2>
										<div className='border border-color-[#F5F6F9] rounded-2xl p-5 mb-4 flex flex-col items-center'>
											<Rating
												size='large'
												name='simple-controlled'
												defaultValue={0}
												value={value}
												onChange={(_, v) => setValue(v)}
												className='!text-5xl !text-[#1EFF9D]'
											/>
											<div className='w-full flex justify-between items-center mt-2'>
												<span className='text-sm text-[#070D26] font-regular'>
													Precisa melhorar
												</span>
												<span className='text-sm text-[#070D26] font-regular'>
													Está perfeito
												</span>
											</div>
										</div>
										<div className='border border-color-[#F5F6F9] rounded-2xl p-6 mb-4'>
											<p className='text-lg lg:text-xl text-[#070D26] font-bold mb-4'>
												Escreva seu feedback:
											</p>
											<TextField
												id='comment'
												placeholder='Comentário...'
												multiline
												fullWidth
												minRows={3}
												sx={{
													border: 'none',
													fontSize: '20px',
													'.MuiInputBase-root, .MuiInputBase-input, .MuiOutlinedInput-notchedOutline':
														{
															border: 'none',
															padding: 0,
															margin: 0,
															fontSize: '20px',
															'&:focus, &:active': {
																outline: 'none',
															},
														},
												}}
												value={comment}
												onChange={(e) => setComment(e.target.value)}
											/>
										</div>
										<ButtonIcon
											icon='/icon-arrow-right.svg'
											text='Enviar avaliação'
											onClick={handleSave}
											disabled={value === null || comment === '' || saving}
											size='large'
										/>
									</div>
								)
							)}
						</>
					)}
				</Grid>
			</Grid>

			{resubmissionError && (
				<NotifyModal
					title={'Erro ao Permitir Reenvio'}
					message={
						'Não foi possível ativar o reenvio da submissão. Por favor, tente novamente mais tarde ou contate o suporte caso o problema persista.'
					}
					logout={false}
				/>
			)}

			<ConfirmDeleteSubmissionModal
				open={openModalResendSubmission}
				handleClose={() => setOpenModalResendSubmission(false)}
				deleteSubmission={handleAllowResubmission}
			/>
		</>
	);
};

export default ActivityEvaluation;
