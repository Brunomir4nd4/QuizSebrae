'use client';
import { FunctionComponent, useState } from 'react';
import { StyledSwitch } from '../StyledSwitch';
import { ClassResponse } from '@/types/IClass';
import {
	BootstrapTooltip,
	NavigateAsParticipantIcon,
	WhatsAppButton,
} from './components';
import { Typography } from '@mui/material';
import { Student } from '@/types/IStudent';
import { isDateWithinEditPeriod, useIsTodayWithinDateRange } from '@/hooks';
import {
	CanceledMatriculaButton,
	ActiveMatriculaButton,
	RequestedMatriculaButton,
} from './Participacao.styles';
import { CancelMatriculaModal } from '../CancelMatriculaModal';
import CloseIcon from '@mui/icons-material/Close';
import { requestEnrollmentCancellation } from '@/app/services/bff/ClassService';

interface Props {
	/**
	 * Dados completos da turma, incluindo ciclos, datas e configurações
	 */
	classData: ClassResponse['data'][0];
	/**
	 * Mensagem padrão para envio via WhatsApp aos estudantes
	 */
	whatsAppMessage: string;
	/**
	 * Lista de estudantes com suas atividades e status de matrícula
	 */
	students: Student[];
	/**
	 * Tipo de usuário visualizando ('supervisor' ou 'estudante')
	 */
	type: string;
	/**
	 * Callback opcional chamado após atualização de estudante (ex: cancelamento de matrícula)
	 */
	onStudentUpdate?: () => void;
}

interface ActivityTitleProps {
	classData: {
		ciclos: {
			activity_titles: string[];
		};
	};
	collective_meetings: string[];
	courses: {
		slug: string;
	};
	i: number;
	activities: number;
	mentorship: string;
}

/**
 * Renders a title or a specific message based on the provided activity data.
 *
 * This component checks various conditions such as if the activity title exists,
 * whether it's part of a collective meeting, or if it's the final activity in a course.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.classData - Data containing activity titles.
 * @param {Object} props.classData.ciclos - Contains an array of activity titles.
 * @param {string[]} props.classData.ciclos.activity_titles - An array of activity titles.
 * @param {string[]} props.collective_meetings - An array of collective meeting titles.
 * @param {Object} props.courses - Course information.
 * @param {string} props.courses.slug - The slug identifier for the course.
 * @param {number} props.i - The index representing the current activity or cycle.
 * @param {number} props.activities - The total number of activities.
 * @param {string} props.mentorship - The fallback text to display when other conditions are not met.
 *
 * @returns {JSX.Element} A React element that displays the appropriate title or message.
 */
const ActivityTitle = ({
	classData,
	collective_meetings,
	courses,
	i,
	activities,
	mentorship,
}: ActivityTitleProps) => {
	const { ciclos } = classData;
	const activityTitle = ciclos?.activity_titles?.[i - 1];
	const collectiveMeeting = collective_meetings?.[i - 1];

	const isFocoDelas = courses?.slug === 'focodelas';
	const isLastActivity = i === activities;

	return (
		<>
			{activityTitle ? (
				<Typography textAlign='center' color='inherit'>
					{activityTitle}
				</Typography>
			) : collectiveMeeting ? (
				<>
					<Typography textAlign='center' color='inherit'>
						Encontro coletivo
					</Typography>
					<Typography textAlign='center' color='inherit'>
						{collectiveMeeting}
					</Typography>
				</>
			) : (
				<Typography textAlign='center' color='inherit'>
					{isFocoDelas && isLastActivity ? 'Cartão de Visitas' : mentorship}
				</Typography>
			)}
		</>
	);
};

/**
 * **ParticipacaoTable**
 *
 * ### 🧩 Funcionalidade
 * - Tabela desktop de participação dos estudantes.
 * - Exibe atividades e status de matrícula.
 * - Adapta ao período de edição, desabilita ações fora do prazo.
 * - Supervisores acessam navegação como participante.
 * - Gerencia cancelamento de matrícula.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <ParticipacaoTable
 *   classData={turmaData}
 *   whatsAppMessage="Mensagem"
 *   students={listaAlunos}
 *   type="supervisor"
 *   onStudentUpdate={refetch}
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - Tabela com table-fixed, bordas e tooltips.
 * - Botões customizados para matrícula.
 * - StyledSwitch para atividades.
 * - Modal para confirmação de cancelamento.
 *
 * @component
 */
export const ParticipacaoTable: FunctionComponent<Props> = ({
	classData,
	whatsAppMessage,
	students,
	type,
	onStudentUpdate,
}) => {
	const { collective_meetings, courses, start_date, end_date } = classData;
	const mentorship =
		courses.slug === 'focodelas' ? 'Mentoria em Grupo' : `Mentoria Individual`;

	const isWithinEditPeriod = isDateWithinEditPeriod(start_date, end_date);

	const isProgressive = classData.enable_certificacao_progressiva || false;

	const isTodayWithinEditPeriod = useIsTodayWithinDateRange(
		start_date,
		end_date,
	);

	const [cancelModalOpen, setCancelModalOpen] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

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

	const setActivities = (activities?: number) => {
		if (!activities) {
			return <></>;
		}
		const rows = [];

		for (let i = 1; i <= activities; i++) {
			rows.push(
				<BootstrapTooltip
					key={'activity_header' + i}
					title={ActivityTitle({
						classData,
						collective_meetings,
						courses,
						i,
						activities,
						mentorship,
					})}
					arrow
					placement='top'>
					<th className='text-4xl w-[100px] min-w-[100px]'>{`${i}ª`}</th>
				</BootstrapTooltip>,
			);
		}

		return rows;
	};

	return (
		<>
			<table
				className='table-fixed w-full max-w-full border-collapse'
				style={{ borderSpacing: 0 }}>
				<thead>
					<tr>
						<th className='w-[530px] text-left'>
							<p className='text-4xl font-bold pb-6'>Participantes</p>
						</th>
						<th className='w-[272px] text-left px-0'></th>
						<th
							style={{
								width: `${classData?.ciclos.activities * 100}px`,
								minWidth: `${classData?.ciclos.activities * 100}px`,
							}}
							className='text-left'
							colSpan={classData?.ciclos.activities}>
							<p className='text-4xl font-bold pb-6'>Atividades</p>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className='text-left text-4xl py-5 w-[530px] pr-0'></td>
						<td className='text-left text-4xl py-5 w-[272px] pl-0'></td>
						{setActivities(classData?.ciclos.activities)}
					</tr>
					{students &&
						students.map((student) => {
							if (student.id && student.activities) {
								return (
									<tr
										key={`student${student.id}`}
										className='border-b text-center border-gray-300'>
										<td className='text-left text-2xl py-5 w-[530px] pr-0'>
											<div className='flex items-center content-center gap-4'>
												{isTodayWithinEditPeriod && type === 'supervisor' && (
													<NavigateAsParticipantIcon studentId={student.id} />
												)}
												<WhatsAppButton
													whatsAppMessage={`Oi ${student.name}! ${whatsAppMessage ?? ''}`}
													phone={student.phone}
												/>
												<span>{`${student.name} (${student.cpf ? student.cpf.slice(0, 3) : 'S/N'})`}</span>
											</div>
										</td>
										<td className='text-left text-2xl py-5 w-[272px] pl-0'>
											<div className='flex justify-start'>
												{student.is_enroll_canceled === null ||
												student.is_enroll_canceled !== false ? (
													<CanceledMatriculaButton
														type='button'
														className='bt-dhedalos'
														disabled={
															!isTodayWithinEditPeriod || !isProgressive
														}>
														<h3>Matrícula Cancelada</h3>
													</CanceledMatriculaButton>
												) : student.is_cancel_requested ? (
													<RequestedMatriculaButton
														type='button'
														className='bt-dhedalos'
														disabled={
															!isTodayWithinEditPeriod || !isProgressive
														}>
														<h3>Cancelamento Solicitado</h3>
													</RequestedMatriculaButton>
												) : (
													<ActiveMatriculaButton
														type='button'
														onClick={() => handleCancelMatricula(student)}
														disabled={
															!isTodayWithinEditPeriod || !isProgressive
														}
														className='bt-dhedalos'>
														<span>
															<CloseIcon sx={{ fontSize: 22 }} />
														</span>
														<h3>Matrícula Ativa</h3>
														<h3>Cancelar Matrícula</h3>
													</ActiveMatriculaButton>
												)}
											</div>
										</td>
										{Object.keys(student.activities || {}).map((key, index) => (
											<td
												key={`activity${index}`}
												className='w-[100px] min-w-[100px]'>
												<StyledSwitch
													active={student.activities[key]}
													classId={classData.id}
													studentId={student.id}
													activityId={key}
													isEditingAllowed={
														isWithinEditPeriod &&
														(student.is_enroll_canceled ?? false) === false &&
														(student.is_cancel_requested ?? false) === false
													}
													isEnrollCanceled={student.is_enroll_canceled}
												/>
											</td>
										))}
									</tr>
								);
							}
						})}
				</tbody>
			</table>
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
