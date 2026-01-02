'use client';
import { ActivitiesSlider } from '@/components/ActivitiesSlider';
import { AppointmentScheduling } from '@/components/AppointmentScheduling';
import { Questions } from '@/components/Consultorias';
import { Loader } from '@/components/Loader';
import useStudents from '@/components/Participacao/hooks/useStudents';
import { ClassResponse } from '@/types/IClass';
import { ThemeSettings } from '@/types/IThemeSettings';
import { FunctionComponent } from 'react';
import React from 'react';

interface DrawerContentProps {
	/**
	 * ID da turma para buscar dados e exibir informações.
	 */
	classId: string;
	/**
	 * Token de autenticação do usuário.
	 */
	token: string;
	/**
	 * Indica se o usuário é administrador (facilitador).
	 */
	isAdmin: boolean;
	/**
	 * Configurações de tema para customização do drawer.
	 */
	themeSettings: ThemeSettings | null;
	/**
	 * Dados das turmas disponíveis.
	 */
	classesData: {
		[key: string]: ClassResponse['data'][0];
	} | null;
	/**
	 * Indica se o modal de agendamento está aberto.
	 */
	openModal: boolean;
	/**
	 * Função para alterar o estado do modal de agendamento.
	 */
	setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
	/**
	 * Etapa atual do drawer (0: seleção, 1: confirmação).
	 */
	drawerStep: 0 | 1;
	/**
	 * Função para alterar a etapa do drawer.
	 */
	setDrawerStep: React.Dispatch<React.SetStateAction<0 | 1>>;
	/**
	 * Horário de início selecionado para agendamento.
	 */
	startTime: string;
	/**
	 * Função para alterar o horário de início.
	 */
	setStartTime: React.Dispatch<React.SetStateAction<string>>;
	/**
	 * Data da consultoria selecionada.
	 */
	consultancyDate: string | null | undefined;
	/**
	 * Função para alterar a data da consultoria.
	 */
	setConsultancyDate: React.Dispatch<React.SetStateAction<string | null | undefined>>;
	/**
	 * Função para alterar as perguntas da consultoria.
	 */
	setQuestions: React.Dispatch<React.SetStateAction<Questions>>;
	/**
	 * Perguntas/respostas do formulário de consultoria.
	 */
	questions: Questions;
	/**
	 * Função para fechar o drawer.
	 */
	handleDrawerClose: () => void;
	/**
	 * Tipo de usuário (ex: facilitator, subscriber).
	 */
	type: string;
}

/**
 * **DrawerContent**
 *
 * ### 🧩 Funcionalidade
 * - Exibe conteúdo lateral da sala de reunião.
 * - Alterna entre atividades estratégicas (admin) e agendamento de consultorias (aluno).
 * - Gerencia etapas, dados de turma, perguntas e integração com hooks.
 * - Usa ActivitiesSlider para admins, AppointmentScheduling para alunos.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <DrawerContent
 *   classId="123"
 *   token="authToken"
 *   isAdmin={true}
 *   themeSettings={settings}
 *   classesData={data}
 *   openModal={false}
 *   setOpenModal={setModal}
 *   drawerStep={0}
 *   setDrawerStep={setStep}
 *   consultancyDate="2023-01-01"
 *   setConsultancyDate={setDate}
 *   startTime="10:00"
 *   setStartTime={setTime}
 *   setQuestions={setQ}
 *   questions={questions}
 *   handleDrawerClose={close}
 *   type="facilitator"
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - Layout condicional baseado em isAdmin.
 * - Título da turma para admins.
 * - Integra estilos de ActivitiesSlider e AppointmentScheduling.
 *
 * @component
 */
export const DrawerContent: FunctionComponent<DrawerContentProps> = ({
	classId,
	token,
	isAdmin,
	classesData,
	themeSettings,
	openModal,
	setOpenModal,
	drawerStep,
	setDrawerStep,
	consultancyDate,
	setConsultancyDate,
	startTime,
	setStartTime,
	setQuestions,
	questions,
	handleDrawerClose,
	type,
}) => {
	//TO-DO: Repensar fetch condicional dos dados com base na alteração interna dos componentes
	const { students, loading } = useStudents(classId, token, isAdmin);
	const whatsAppMessage = themeSettings?.whatsapp_message_to_facilitator;

	return (
		<>
			{isAdmin ? (
				classesData && students && !loading ? (
					<>
						<h4 className='text-2xl text-center md:text-3xl text-black-light font-bold mb-[25px]'>
							{classesData[classId].title}
						</h4>
						<ActivitiesSlider
							meetingRoomClassId={classId}
							classData={classesData[classId]}
							whatsAppMessage={whatsAppMessage}
							students={students}
							type={type}
						/>
					</>
				) : (
					<Loader />
				)
			) : (
				<AppointmentScheduling
					classId={classId}
					openModal={openModal}
					setOpenModal={setOpenModal}
					drawerStep={drawerStep}
					setDrawerStep={setDrawerStep}
					consultancyDate={consultancyDate}
					setConsultancyDate={setConsultancyDate}
					startTime={startTime}
					setStartTime={setStartTime}
					setQuestions={setQuestions}
					questions={questions}
					handleDrawerClose={handleDrawerClose}
				/>
			)}
		</>
	);
};
