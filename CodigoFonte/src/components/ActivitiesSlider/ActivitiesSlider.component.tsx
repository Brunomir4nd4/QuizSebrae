'use client';
import { FunctionComponent, useRef, useState } from 'react';
import React from 'react';
import Slider from 'react-slick';
import {
	SliderArrow,
	SliderArrows,
	SliderHeader,
} from './ActivitiesSlider.styles';
import { StyledSwitch } from '../StyledSwitch';
import { Student } from '@/types/IStudent';
import {
	NavigateAsParticipantIcon,
	WhatsAppButton,
} from '../ParticipacaoTable/components';
import { ClassResponse } from '@/types/IClass';
import { isDateWithinEditPeriod, useIsTodayWithinDateRange } from '@/hooks';
import { CancelMatriculaModal } from '../CancelMatriculaModal';
import { requestEnrollmentCancellation } from '@/app/services/bff/ClassService';

interface Props {
	/**
	 * Dados da turma, incluindo informações sobre ciclos, datas e configurações de certificação progressiva.
	 */
	classData: ClassResponse['data'][0];
	/**
	 * Mensagem personalizada que será enviada via WhatsApp para os alunos ao clicar no botão correspondente.
	 */
	whatsAppMessage?: string;
	/**
	 * Lista de estudantes da turma, contendo status de matrícula, atividades realizadas e informações pessoais.
	 */
	students: Student[];
	/**
	 * ID alternativo da turma, utilizado em contextos de sala de reunião.
	 */
	meetingRoomClassId?: string;
	/**
	 * Define o tipo de usuário visualizando o componente ex: 'supervisor'.
	 */
	type: string;
	/**
	 * Callback chamado após a solicitação de cancelamento de um estudante, para atualizar a lista.
	 */
	onStudentUpdate?: () => void;
}
/**
 * **ActivitiesSlider**
 *
 * Componente que exibe um carrossel de atividades de uma turma, permitindo que supervisores ou estudantes visualizem e interajam com o status das atividades de cada aluno.
 * Mostra uma lista de estudantes com seus respectivos status (atividade realizada, matrícula ativa/cancelada, solicitação de cancelamento) e ações disponíveis, como solicitar cancelamento de matrícula, enviar mensagem via WhatsApp ou navegar como participante (para supervisores).
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Exibe um slider/carrossel de atividades, com navegação entre elas.
 * - Para cada atividade, lista os estudantes com status de participação.
 * - Permite alternar o status de atividades (se dentro do período de edição).
 * - Oferece ações como WhatsApp, cancelamento de matrícula e navegação como participante.
 * - Adapta a interface e permissões de acordo com o tipo de usuário (supervisor ou estudante).
 * - Verifica se está dentro do período de edição baseado nas datas da turma.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <ActivitiesSlider
 *   classData={turmaData}
 *   whatsAppMessage="Mensagem personalizada"
 *   students={listaEstudantes}
 *   type="supervisor"
 *   onStudentUpdate={handleUpdate}
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
	students,
	meetingRoomClassId,
	type,
	onStudentUpdate,
}) => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const sliderRef = useRef<Slider>(null);
	const [cancelModalOpen, setCancelModalOpen] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const classId = meetingRoomClassId ?? classData.id;

	const isProgressive = classData.enable_certificacao_progressiva || false;

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
		{ length: classData.ciclos.activities },
		(_, index) => index + 1,
	);
	const isWithinEditPeriod = isDateWithinEditPeriod(
		classData.start_date,
		classData.end_date,
	);
	const isTodayWithinEditPeriod = useIsTodayWithinDateRange(
		classData.start_date,
		classData.end_date,
	);

	const handleCancelMatricula = (student: Student) => {
		setSelectedStudent(student);
		setCancelModalOpen(true);
	};

	const handleConfirmCancelMatricula = async () => {
		if (selectedStudent) {
			setIsSubmitting(true);
			try {
				const response = await requestEnrollmentCancellation(
					selectedStudent.enrollment_id,
				);

				if (response && (response.status === 200 || response.status === 201)) {
					if (onStudentUpdate) {
						onStudentUpdate();
					}
				} else {
					const errorMessage =
						response?.message || 'Erro desconhecido ao solicitar cancelamento';
					console.error('Erro ao solicitar cancelamento:', errorMessage);
				}
			} catch (error) {
				console.error('Erro ao solicitar cancelamento de matrícula:', error);
			} finally {
				setIsSubmitting(false);
				setCancelModalOpen(false);
				setSelectedStudent(null);
			}
		} else {
			setCancelModalOpen(false);
			setSelectedStudent(null);
		}
	};

	const handleCancelModal = () => {
		setCancelModalOpen(false);
		setSelectedStudent(null);
	};

	return (
		<>
			<SliderHeader>
				<SliderArrows>
					<SliderArrow onClick={goToPrevSlide}>
						<img src='/icon-arrow-prev.svg' alt='Anterior' />
					</SliderArrow>
					<p className='text-xl text-white font-bold'>
						{classData.ciclos?.activity_titles
							? classData.ciclos?.activity_titles[currentSlide]
							: `${currentSlide + 1}ª atividade`}
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
															<tr key={`student-${student.id}-${index}`}>
																<td className='w-ful'>
																	<div
																		style={{ borderRadius: '16px' }}
																		className='flex flex-row justify-between bg-white rounded-sm gap-x-4 pl-3 pr-3 pt-4 pb-4 mb-3'>
																		<div className='flex flex-col gap-2 flex-1'>
																			<div className='flex items-center w-full justify-between'>
																				<span className='text-base md:text-lg leading-none'>
																					{`${student.name} (${student.cpf ? student.cpf.slice(0, 3) : 'S/N'})`}
																				</span>
																				<div className='flex-shrink-0'>
																					<StyledSwitch
																						active={
																							student.activities[activity]
																						}
																						classId={classId}
																						studentId={student.id.toString()}
																						activityId={activity.toString()}
																						isEditingAllowed={
																							isWithinEditPeriod
																						}
																					/>
																				</div>
																			</div>
																			<div className='flex items-stretch gap-1 justify-start flex-wrap'>
																				<div className='flex items-center justify-center'>
																					{student.is_enroll_canceled ===
																						null ||
																					student.is_enroll_canceled !==
																						false ? (
																						<button
																							disabled={
																								!isTodayWithinEditPeriod ||
																								!isProgressive
																							}
																							type='button'
																							className='flex items-center justify-center h-8 px-2 text-xs font-semibold text-sm text-red-600 bg-transparent border border-red-600 rounded-full cursor-default'>
																							Matrícula Cancelada
																						</button>
																					) : student.is_cancel_requested ? (
																						<button
																							type='button'
																							disabled={
																								!isTodayWithinEditPeriod ||
																								!isProgressive
																							}
																							className='flex items-center justify-center h-8 px-2 text-xs  text-sm text-white bg-gray-400 border border-gray-400 rounded-full cursor-default'>
																							Cancelamento Solicitado
																						</button>
																					) : (
																						<button
																							type='button'
																							disabled={
																								!isTodayWithinEditPeriod ||
																								!isProgressive
																							}
																							onClick={() =>
																								handleCancelMatricula(student)
																							}
																							className='flex items-center justify-center h-8 px-2 text-xs text-sm text-[rgb(28 29 35 / var(--tw-bg-opacity)] bg-transparent border border-green-500 rounded-full cursor-pointer'>
																							Matrícula Ativa
																						</button>
																					)}
																				</div>
																				<div
																					className='px-3 py-1'
																					style={{
																						background: '#F5F6F9',
																						borderRadius: '16px',
																						minHeight: 28,
																					}}>
																					<WhatsAppButton
																						whatsAppMessage={`Oi ${student.name}! ${whatsAppMessage ?? ''}`}
																						phone={student.phone}
																						showLabel
																					/>
																				</div>
																				{isTodayWithinEditPeriod &&
																					type === 'supervisor' && (
																						<div
																							className='px-3 py-1 flex items-center'
																							style={{
																								background: '#F5F6F9',
																								borderRadius: '16px',
																								minHeight: 28,
																							}}>
																							<NavigateAsParticipantIcon
																								studentId={student.id}
																								showLabel
																							/>
																						</div>
																					)}
																			</div>
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
			</div>
			{cancelModalOpen && selectedStudent && (
				<CancelMatriculaModal
					title='cancelamento de matrícula'
					// subtitle='Tem certeza que deseja cancelar esta matrícula?'
					message='Ao confirmar, a matrícula será cancelada  <strong>de forma irreversível</strong> por não atingir a participação mínima.'
					studentName={selectedStudent.name}
					studentPhone={selectedStudent.phone}
					modalOpen={cancelModalOpen}
					onConfirm={handleConfirmCancelMatricula}
					onCancel={handleCancelModal}
					isSubmitting={isSubmitting}
				/>
			)}
		</>
	);
};
