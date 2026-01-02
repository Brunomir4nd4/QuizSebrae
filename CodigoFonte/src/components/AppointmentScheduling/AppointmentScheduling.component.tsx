'use client';

import { FunctionComponent, useEffect, useState } from 'react';
import { Alert, Divider, Grid, Snackbar, Stack } from '@mui/material';
import React from 'react';
import { useUserContext } from '@/app/providers/UserProvider';
import { Loader } from '../Loader';
import { Booking } from '@/types/ITurma';
import {
	getAvailableSlots,
	getAvaliableGroupMeetingsSlots,
	useGetUserAppointment,
} from '@/components/Consultorias/hooks';
import { Appointment } from '@/types/IAppointment';
import { useRouter } from 'next/navigation';
import { AppointmentModal } from '@/components/AppointmentModal';
import { addOneHour } from '@/hooks';
import { GroupType } from '@/types/ICourses';
import { getAppointmentByClassAndCpf } from '@/app/services/bff/ScheduleService';
import { Questions } from '@/components/Consultorias';
import {
	ConsultancyFirstStep,
	ConsultancySecondStep,
	ConsultancyThirdStep,
} from '@/components/Consultorias/components';
import { getMeetingTypeByClassId } from '@/app/services/bff/ClassService';
import { NotifyModal } from '../NotifyModal';

interface Props {
       /** Id da turma */
       classId: string;
       /** Controla se o modal de agendamento está aberto */
       openModal: boolean;
       /** Função para abrir/fechar o modal de agendamento */
       setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
       /** Etapa atual do drawer (0: datas, 1: perguntas) */
       drawerStep: 0 | 1;
       /** Função para alterar a etapa do drawer */
       setDrawerStep: React.Dispatch<React.SetStateAction<0 | 1>>;
       /** Horário selecionado */
       startTime: string;
       /** Função para alterar o horário selecionado */
       setStartTime: React.Dispatch<React.SetStateAction<string>>;
       /** Data da consultoria selecionada */
       consultancyDate: string | null | undefined;
       /** Função para alterar a data da consultoria */
       setConsultancyDate: React.Dispatch<
	       React.SetStateAction<string | null | undefined>
       >;
       /** Função para alterar as perguntas */
       setQuestions: React.Dispatch<React.SetStateAction<Questions>>;
       /** Perguntas preenchidas pelo usuário */
       questions: Questions;
       /** Função para fechar o drawer */
       handleDrawerClose: () => void;
}

/**
 * **AppointmentScheduling**
 *
 * Responsável pelo fluxo de agendamento de mentorias, incluindo seleção de datas, horários e perguntas.
 * Gerencia o processo de agendamento em etapas, com validação de limites e tipos de reunião.
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Exibe etapas de seleção de data e horário, e preenchimento de perguntas.
 * - Busca slots disponíveis para reuniões individuais ou em grupo.
 * - Valida se o usuário já atingiu o limite de agendamentos.
 * - Abre modal de confirmação de agendamento.
 * - Tratamento de loading e erros.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <AppointmentScheduling
 *   classId="123"
 *   openModal={true}
 *   setOpenModal={setModal}
 *   drawerStep={0}
 *   setDrawerStep={setStep}
 *   startTime="10:00"
 *   setStartTime={setTime}
 *   consultancyDate="2023-10-01"
 *   setConsultancyDate={setDate}
 *   setQuestions={setQuestions}
 *   questions={questions}
 *   handleDrawerClose={closeDrawer}
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: (integrado nos componentes filhos).
 *
 * ---
 *
 * @component
 */
export const AppointmentScheduling: FunctionComponent<Props> = ({
	classId,
	openModal,
	setOpenModal,
	drawerStep,
	setDrawerStep,
	startTime,
	setStartTime,
	consultancyDate,
	setConsultancyDate,
	questions,
	setQuestions,
	handleDrawerClose,
}) => {
	const { classesData } = useUserContext();
	const [appointments, setAppointments] = useState<Appointment[] | null>(null);
	const [meetingType, setMeetingType] = useState<GroupType | null>(null);

	const userAppointmentsFormatted = useGetUserAppointment(
		appointments,
		classId,
		classesData,
	);

	useEffect(() => {
		const fetchData = async () => {
			const meetingType = await getMeetingTypeByClassId(classId);
			const userAppointments = await getAppointmentByClassAndCpf(classId);

			setAppointments(userAppointments.data);
			setMeetingType(meetingType.data);
		};

		fetchData();
	}, []);

	const router = useRouter();
	const [dateWithSlots, setDateWithSlots] = useState<Booking | null>(null);

	const closeModal = () => {
		setOpenModal(false);
		setConsultancyDate(null);
		setStartTime('');
		setDrawerStep(0);
	};

	if (!classesData || !classId || !meetingType) {
		return <Loader />;
	}

	if (classesData[classId]?.enable_calendar === false) {
		router.push('/home');
		return <></>;
	}

	const { is_group_meetings_enabled, facilitator } = meetingType;

	const consultancyDatesRefact = classesData[classId].individual_meetings;
	const labelConfiguration = classesData[classId].label_configuration;

	if (appointments && appointments?.length >= consultancyDatesRefact.length) {
		return (
			<NotifyModal
				title={'Atenção'}
				message={'Você já realizou todos os agendamentos desta turma.'}
				logout={false}
				callback={() => handleDrawerClose()}
			/>
		);
	}

	const chooseConsultancyDate = async (date: string) => {
		setConsultancyDate(date);
		setStartTime('');
		const available = is_group_meetings_enabled
			? await getAvaliableGroupMeetingsSlots(classId, date)
			: await getAvailableSlots(date, classId);
		setDateWithSlots(available);
	};

	const handleStartTime = (startTime: string) => {
		setStartTime(startTime);
	};

	return (
		<div className='max-w-[1640px] w-full'>
			{drawerStep === 0 && (
				<>
					<Stack gap={3}>
						<ConsultancyFirstStep
							labelConfiguration={labelConfiguration}
							consultancyDates={consultancyDatesRefact}
							currentDateSelected={consultancyDate}
							userAppointments={userAppointmentsFormatted}
							classId={classId}
							chooseConsultancyDate={chooseConsultancyDate}
							is_group_meetings_enabled={is_group_meetings_enabled}
							isDrawerView
						/>
					</Stack>
					<div
						className={`transition-opacity duration-[1000ms] delay-500 ease-in-out ${
							consultancyDate ? 'opacity-100' : 'opacity-0'
						}`}>
						<ConsultancySecondStep
							dateWithSlots={dateWithSlots}
							consultancyDate={consultancyDate}
							setStartTime={handleStartTime}
							startTime={startTime}
							is_group_meetings_enabled={is_group_meetings_enabled}
							isDrawerView
							groupLimit={classesData[classId].courses?.group_limit}
						/>
					</div>
				</>
			)}
			{drawerStep === 1 && (
				<div
					className={`transition-opacity duration-[500ms] delay-500 ease-in-out ${
						startTime ? 'opacity-100' : 'opacity-0'
					}`}>
					<h2 className='text-2xl sm:text-3xl md:text-4xl text-[#070D26] font-extralight'>
						<strong className='font-bold'>Quais são </strong> as principais
						dúvidas?
					</h2>
					<Divider
						sx={{
							marginTop: {
								xs: '1.5rem',
								sm: '1.75rem',
								md: '2.5rem',
							},
						}}
					/>
					<Grid container spacing={3} sx={{ marginTop: '1.25rem !important' }}>
						<ConsultancyThirdStep
							questions={questions}
							setQuestions={setQuestions}
							courseSlug={classesData[classId].courses.slug}
							formSubjects={classesData[classId]?.courses?.form_subjects}
							isDrawerView
						/>
					</Grid>
				</div>
			)}
			<Snackbar
				open={false}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
				<Alert
					severity='warning'
					variant='filled'
					style={{
						background: 'var(--light-black)',
						color: 'var(--primary-color)',
						fontSize: '16px',
					}}>
					Nenhum horário disponível para esse dia!
				</Alert>
			</Snackbar>
			<Grid item xs={12}>
				<div className='flex justify-center md:justify-end mt-[26px]'>
					<AppointmentModal
						open={openModal}
						onClose={() => closeModal()}
						setAppointments={setAppointments}
						facilitator={facilitator.display_name}
						appointment={{
							start_time: `${consultancyDate} ${startTime}:00`,
							finish_time: addOneHour(`${consultancyDate} ${startTime}:00`),
							class_id: classId,
							course_name: classesData[classId].courses.name,
							employee_id: classesData[classId].facilitator,
							additional_fields: questions,
							type_id: is_group_meetings_enabled ? 4 : 3,
						}}
					/>
				</div>
			</Grid>
		</div>
	);
};
