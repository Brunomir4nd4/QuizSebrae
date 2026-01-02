'use client';
import { FunctionComponent, useMemo, useRef, useState } from 'react';
import React from 'react';
import Slider from 'react-slick';
import {
	SliderArrow,
	SliderArrows,
	SliderHeader,
} from './ActivitiesSlider.styles';
import { ClassResponse } from '@/types/IClass';
import { WhatsAppButton } from '@/components/ParticipacaoTable/components';
import { Box, Menu, MenuItem } from '@mui/material';
import { Participant } from '@/types/IParticipants';
import { useRouter } from 'next/navigation';
import { updateActivityToExternalUtil } from '@/utils/updateActivityToExternalUtil';
import { useUserContext } from '@/app/providers/UserProvider';
import { Loader } from '@/components/Loader';
import { useSession } from 'next-auth/react';
import useSubmissions from '@/hooks/useSubmissions';
import { createSubmission } from '@/app/services/bff/SubmissionService';
import { useActivityTemplates } from '@/hooks/useActivityTemplates';
import { BaseModal } from '@/components/BaseModal';
import { FileTemplateInput } from '@/components/FileTemplateInput';

/**
 * Propriedades para o componente ActivitiesSlider
 */
interface Props {
	/** Dados da turma, incluindo ciclos e atividades */
	classData: ClassResponse['data'][0];
	/** Mensagem personalizada para WhatsApp */
	whatsAppMessage?: string;
	/** Lista de participantes da turma */
	students?: Participant[];
}

/**
 * **ActivitiesSlider**
 *
 * Exibe um carrossel de atividades da turma, permitindo ações por participante e status de cada atividade.
 * Versão mobile/desktop para gestão de atividades, com navegação por slides e menus contextuais.
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Slider/carrossel para navegar entre atividades.
 * - Lista participantes com status de cada atividade.
 * - Ações como WhatsApp, redirecionamento para avaliação, menu para alterar status.
 * - Suporte a alterar status para "recebida em outro canal".
 * - Tratamento de loading e dados da turma.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <ActivitiesSlider
 *   classData={turmaData}
 *   whatsAppMessage="Mensagem personalizada"
 *   students={listaParticipantes}
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: ActivitiesSlider.styles.tsx.
 *
 * ---
 *
 * @component
 */
export const ActivitiesSlider: FunctionComponent<Props> = ({
	classData,
	whatsAppMessage,
	students: studentsProp,
}) => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [selectedStudentId, setSelectedStudentId] = React.useState<
		string | null
	>(null);
	const [selectedStudentName, setSelectedStudentName] = React.useState<
		string | null
	>(null);
	const [openModalTemplate, setOpenModalTemplate] = React.useState(false);
	const { classId, classesData } = useUserContext();
	const { data: session } = useSession();
	const sliderRef = useRef<Slider>(null);
	const router = useRouter();
	const { turma, updateStudentActivity, loading } = useSubmissions(classId);

	const classIdNumber = Number(classId);
	const {
		templates,
		uploadTemplate,
		deleteTemplate,
		fetchTemplates,
		loading: loadingTemplate,
	} = useActivityTemplates({
		classId: Number(classId),
		courseId: classesData?.[classIdNumber]?.courses?.id || null,
		cycleId: classesData?.[classIdNumber]?.ciclos?.id || null,
	});

	const students = useMemo(() => {
		return turma?.students || studentsProp || [];
	}, [studentsProp, turma]);

	const isLoading = !studentsProp && loading;

	const goToPrevSlide = () => {
		sliderRef.current?.slickPrev();
	};
	const goToNextSlide = () => {
		sliderRef.current?.slickNext();
	};
	const settings = {
		dots: false,
		arrows: false,
		infinite: false,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: false,
		beforeChange: (oldIndex: number, newIndex: number) =>
			setCurrentSlide(newIndex),
	};

	const activities = Array.from(
		{ length: classData.strategic_activities_number },
		(_, index) => index + 1,
	);

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (
		event: React.MouseEvent<HTMLButtonElement>,
		studentId: string,
		studentName: string,
	) => {
		setAnchorEl(event.currentTarget);
		setSelectedStudentId(studentId);
		setSelectedStudentName(studentName);
	};

	const handleClose = () => {
		setAnchorEl(null);
		setSelectedStudentId(null);
		setSelectedStudentName(null);
	};

	if (!classesData || !classId || isLoading) {
		return <Loader />;
	}

	const handleClickModalTemplate = async () => {
		await fetchTemplates();
		setOpenModalTemplate((prev) => !prev);
	};

	const handleUploadTemplateFile = async (
		file: File,
		activityIndex: number,
	) => {
		try {
			const formData = new FormData();

			formData.append('course_id', String(classesData[classId].courses.id));
			formData.append('activity_id', String(activityIndex));
			formData.append('cycle_id', String(classesData[classId].ciclos.id));
			formData.append('class_id', classId);
			formData.append(
				'description',
				`Template de atividade ${activityIndex} - Turma: ${classId} : ${classesData[classId].ciclos.id}`,
			);
			formData.append('file', file);

			await uploadTemplate(formData);
		} catch (error) {
			console.error(error);
		}
	};

	const handleUpdateActivityToExternal = async () => {
		if (selectedStudentId && selectedStudentName && session) {
			await updateActivityToExternalUtil({
				courseId: `${classesData[classId].courses.id}`,
				cycloId: `${classesData[classId].ciclos.id}`,
				classId,
				facilitador_id: `${session.user.id}`,
				selectedActivityIndex: currentSlide,
				selectedStudentId,
				selectedStudentName,
				createSubmission,
				updateStudentActivity,
				handleClose,
			});
		}
	};

	const handleRedirect = (
		studentId: string,
		activity: number,
		name: string,
		cpf: string,
		phone: string,
		email: string,
	) => {
		const participant = {
			id: studentId,
			name,
			cpf,
			phone,
			email,
		};
		sessionStorage.setItem('selectedParticipant', JSON.stringify(participant));
		sessionStorage.setItem('selectedActivity', activity.toString());

		router.push(`/gestao-de-atividades/${studentId}`);
	};

	return (
		<>
			<div className='w-full py-6 flex justify-center'>
				<button className='group' onClick={handleClickModalTemplate}>
					<div className='flex items-center gap-2 p-[6px] pr-4 bg-[#222325] text-[#1EFF9D] hover:text-[#222325] hover:bg-[#1EFF9D] rounded-[40px] transition-all'>
						<div className='w-[32px] min-w-[32px] h-[32px] rounded-full bg-[#1EFF9D] flex items-center justify-center pl-[1px] pb-[1px]'>
							<img
								src='/icone-template-atividades.svg'
								alt='Template das atividades'
								width={20}
							/>
						</div>
						<span className='font-bold whitespace-nowrap'>
							Template das atividades
						</span>
					</div>
				</button>
			</div>

			<SliderHeader>
				<SliderArrows>
					<SliderArrow onClick={goToPrevSlide}>
						<img src='/icon-arrow-prev.svg' alt='Anterior' />
					</SliderArrow>
					<p className='text-xl text-white font-bold'>
						{currentSlide + 1}ª atividade
					</p>
					<SliderArrow onClick={goToNextSlide}>
						<img src='/icon-arrow-next.svg' alt='Próximo' />
					</SliderArrow>
				</SliderArrows>
			</SliderHeader>
			<div className='slider-container'>
				<Slider ref={sliderRef} {...settings}>
					{activities &&
						activities.map((activity) => {
							return (
								<div key={'activity_' + activity}>
									<table className='table-fixed w-[100%] max-w-[100%] overflow-auto mt-[50px]'>
										<tbody>
											{students &&
												students.map((student, index) => {
													if (student.id) {
														return (
															<tr
																key={`student-${student.id}-${index}`}
																className='border-b py-5 text-center border-black/[.2] flex flex-row items-center justify-between flex-nowrap gap-x-4'>
																<td className='pr-[10px] w-full' align='right'>
																	<div className='flex w-full justify-between items-center gap-3'>
																		<span className='text-left py-2'>
																			{`${student.name} (${student.cpf ? student.cpf.slice(0, 3) : 'S/N'})`}
																		</span>
																		{student.activities[currentSlide].status ===
																		'não recebida' ? (
																			<div>
																				<button
																					className='block'
																					onClick={(e) =>
																						handleClick(
																							e,
																							student.id,
																							student.name,
																						)
																					}>
																					<div className='flex w-fit items-center gap-2 ml-[-6px] p-[6px] pr-3 bg-transparent rounded-[40px] hover:bg-[#222325] hover:text-[#1EFF9D] transition-all border-2 border-[#222325]'>
																						<div className='w-[20px] h-[20px] rounded-full bg-[#6E707A] flex items-center justify-center'>
																							<img
																								src='/icon-relogio-branco.svg'
																								alt=''
																								width={16}
																							/>
																						</div>
																						<span className='text-xs font-bold text-nowrap'>
																							Não Recebida
																						</span>
																					</div>
																				</button>
																			</div>
																		) : student.activities[currentSlide]
																				.status === 'recebida' ||
																		  student.activities[currentSlide]
																				.status ===
																				'recebida em outro canal' ? (
																			<button
																				onClick={() =>
																					handleRedirect(
																						student.id,
																						currentSlide + 1,
																						student.name,
																						student.cpf,
																						student.phone,
																						student.email,
																					)
																				}
																				className='flex w-fit items-center gap-2 ml-[-6px] p-[6px] pr-3 bg-transparent rounded-[40px] hover:bg-[#222325] hover:text-[#1EFF9D] transition-all border-2 border-[#222325]'>
																				<div className='w-[20px] h-[20px] rounded-full bg-[#EBD406] flex items-center justify-center pl-[1px] pb-[1px]'>
																					<img
																						src='/icon-relogio-preto.svg'
																						alt=''
																						width={16}
																					/>
																				</div>
																				<span className='text-xs font-bold text-nowrap'>
																					Fazer avaliação
																				</span>
																			</button>
																		) : student.activities[currentSlide]
																				.status === 'avaliada' ? (
																			<button
																				onClick={() =>
																					handleRedirect(
																						student.id,
																						currentSlide + 1,
																						student.name,
																						student.cpf,
																						student.phone,
																						student.email,
																					)
																				}
																				className='flex w-fit items-center gap-2 ml-[-6px] p-[6px] pr-3 bg-transparent rounded-[40px] hover:bg-[#222325] hover:text-[#1EFF9D] transition-all border-2 border-[#222325]'>
																				<div className='w-[20px] h-[20px] rounded-full bg-[#1EFF9D] flex items-center justify-center'>
																					<img
																						src='/icon-check-preto.svg'
																						alt=''
																						width={16}
																					/>
																				</div>
																				<span className='text-xs font-bold text-nowrap'>
																					Visualizar
																				</span>
																			</button>
																		) : null}
																	</div>
																	<div className='w-full'>
																		<div className='text-left text-lg md:text-2xl pl-0 flex items-center content-center gap-4'>
																			<WhatsAppButton
																				whatsAppMessage={`Oi ${student.name}! ${whatsAppMessage ?? ''}`}
																				phone={student.phone}
																			/>
																		</div>
																	</div>
																</td>
															</tr>
														);
													}
												})}
										</tbody>
									</table>
								</div>
							);
						})}
				</Slider>
				<Menu
					id='basic-menu'
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					sx={{
						'.MuiPaper-root': {
							boxShadow: 'none',
							paddingTop: '16px',
							paddingBottom: '12px',
							borderRadius: '15px',
							background: '#FFF',
							border: '1px solid #222325',
							marginTop: 1,
						},
					}}>
					<Box>
						<p className='text-xs font-bold px-4 mb-3'>
							Alterar o status da atividade:
						</p>
						<MenuItem onClick={handleClose}>
							<div className='flex items-center gap-2'>
								<div className='w-[33px] min-w-[33px] h-[33px] rounded-full bg-[#6E707A] flex items-center justify-center pl-[1px] pb-[1px]'>
									<img src='/icon-relogio-branco.svg' alt='' width={20} />
								</div>
								<span className='text-xs'>Não Recebida</span>
							</div>
						</MenuItem>
						<MenuItem onClick={handleUpdateActivityToExternal}>
							<div className='flex items-center gap-2'>
								<div className='w-[33px] min-w-[33px] h-[33px] rounded-full bg-[#EBD406] flex items-center justify-center pl-[1px] pb-[1px]'>
									<img src='/icon-relogio-preto.svg' alt='' width={20} />
								</div>
								<span className='text-xs'>Recebida em outro canal</span>
							</div>
						</MenuItem>
					</Box>
				</Menu>
			</div>

			<BaseModal
				open={openModalTemplate}
				onClose={handleClickModalTemplate}
				header={
					<h3 className='text-black-light text-left py-3 text-2xl sm:text-32 lg:text-40 font-light mb-3'>
						<strong className='font-bold'>Template</strong> das atividades!
					</h3>
				}>
				<div className='w-full py-2'>
					<table className='w-full text-left'>
						<thead className='border-b border-opacity-20 border-black'>
							<th className='font-normal text-xl py-4'>Atividade</th>
							<th className='font-normal text-xl py-4'>Template</th>
						</thead>
						<tbody>
							{Array.from(
								{ length: classData.strategic_activities_number },
								(_, index) => {
									const activityId = index + 1;
									const template = templates[activityId];

									return (
										<tr
											key={index}
											className='border-b border-opacity-20 border-black'>
											<td className='py-4 pr-5 text-sm'>
												{activityId}ª Atividade
											</td>
											<td className='py-4 pr-5 text-sm'>
												{loadingTemplate && <Loader />}
												<FileTemplateInput
													hasFile={!!template}
													fileName={template?.original_name}
													fileUrl={`${process.env.NEXT_PUBLIC_SUBMISSIONS_STORAGE_URL}/${template?.file_path}`}
													onUpload={(file) =>
														handleUploadTemplateFile(file, activityId)
													}
													onRemove={() => deleteTemplate(activityId)}
												/>
											</td>
										</tr>
									);
								},
							)}
						</tbody>
					</table>
				</div>
			</BaseModal>
		</>
	);
};
