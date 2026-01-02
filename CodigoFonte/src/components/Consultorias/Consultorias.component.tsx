"use client";

import { FunctionComponent, useRef, useState } from "react";
import { Alert, Grid, Snackbar } from "@mui/material";
import React from "react";
import { useUserContext } from "@/app/providers/UserProvider";
import { Loader } from "../Loader";
import { Booking } from "@/types/ITurma";
import {
  getAvailableSlots,
  getAvaliableGroupMeetingsSlots,
  useGetUserAppointment,
} from "./hooks";
import { Appointment, AppointmentResponse } from "@/types/IAppointment";
import { useRouter } from "next/navigation";
import { ConsultancySecondStep, ConsultancyFirstStep } from "./components";
import { ConsultancyThirdStep } from "./components/ConsultancyThirdStep/ConsultancyThirdStep.component";
import { AppointmentModal } from "../AppointmentModal";
import { ButtonIcon } from "../ButtonIcon";
import { addOneHour } from "@/hooks";
import { GroupTypeResponse } from "@/types/ICourses";
import { NotifyModal } from "../NotifyModal";

export interface Questions {
  social_network: string;
  main_topic: string;
  specific_questions: string;
}

interface ConsultoriasProps {
  /** Lista de agendamentos do usuário para a turma */
  userAppointmentsByClass: AppointmentResponse["data"];
  /** Dados do tipo de reunião (individual ou grupo) */
  meetingType: GroupTypeResponse["data"];
}

/**
 * **Consultorias**
 *
 * Gerencia o fluxo completo de agendamento de consultorias (mentorias), incluindo seleção de datas, horários, preenchimento de perguntas e confirmação.
 * Utiliza múltiplos passos e navegação suave entre seções, além de tratar indisponibilidade de datas e horários.
 * Permite agendamento tanto para reuniões individuais quanto em grupo, exibindo mensagens e botões contextuais conforme o progresso do usuário.
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Fluxo em passos: datas, horários, perguntas.
 * - Scroll suave entre seções.
 * - Validação de limite de agendamentos.
 * - Suporte a reuniões individuais e em grupo.
 * - Tratamento de loading e erros.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <Consultorias
 *   userAppointmentsByClass={appointments}
 *   meetingType={meetingData}
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: (estilos inline e componentes filhos).
 *
 * ---
 *
 * @component
 */
export const Consultorias: FunctionComponent<ConsultoriasProps> = ({
  userAppointmentsByClass,
  meetingType,
}) => {
  const { classesData, classId } = useUserContext();

  const router = useRouter();

  const { is_group_meetings_enabled, facilitator } = meetingType;

  const [appointments, setAppointments] = useState<Appointment[] | null>(
    userAppointmentsByClass
  );
  const userAppointmentsFormatted = useGetUserAppointment(
    appointments,
    classId,
    classesData
  );
  const [consultancyDate, setConsultancyDate] = useState<
    string | null | undefined
  >(null);
  const [dateWithSlots, setDateWithSlots] = useState<Booking | null>(null);
  const [startTime, setStartTime] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [questions, setQuestions] = useState<Questions>({
    social_network: "",
    main_topic: "",
    specific_questions: "",
  });

  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);

  const scrollToSection = (sectionRef: any) => {
    sectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleSectionChange = (section: React.SetStateAction<number>) => {
    if (section === 1) scrollToSection(section1Ref);
    if (section === 2) scrollToSection(section2Ref);
    if (section === 3) scrollToSection(section3Ref);
  };

  const closeModal = () => {
    setOpenModal(false);
    setConsultancyDate(null);
    setStartTime("");
  };

  if (!classesData || !classId) {
    return <Loader />;
  }

  if (classesData[classId]?.enable_calendar === false) {
    router.push("/home");
    return <></>;
  }

  const consultancyDatesRefact = classesData[classId].individual_meetings;

  const labelConfiguration = classesData[classId].label_configuration;

  const chooseConsultancyDate = async (date: string) => {
    setConsultancyDate(date);
    setStartTime("");
    const available = is_group_meetings_enabled
      ? await getAvaliableGroupMeetingsSlots(classId, date)
      : await getAvailableSlots(date, classId);
    setDateWithSlots(available);
    handleSectionChange(1);
  };

  const handleStartTime = (startTime: string) => {
    setStartTime(startTime);
    handleSectionChange(2);
  };

  if (!classesData[classId]?.enable_calendar || classesData[classId]?.individual_meetings.length === 0) {
    return (
      <section className='flex justify-center w-full py-[60px] px-[20px] md:px-[70px] md:pl-[150px] 3xl:pl-[190px] min-h-screen bg-gray-100'>
        <div className='max-w-[1640px] w-full'>
          <NotifyModal
            title={'Atenção'}
            message={'Não há agendamentos disponíveis.'}
            logout={false}
            backOnClose={true}
          />
        </div>
      </section>
    );
  }

  return (
    <>
      <div className="max-w-[1640px] w-full">
        <Grid container spacing={3}>
          <ConsultancyFirstStep
            labelConfiguration={labelConfiguration}
            consultancyDates={consultancyDatesRefact}
            currentDateSelected={consultancyDate}
            userAppointments={userAppointmentsFormatted}
            classId={classId}
            chooseConsultancyDate={chooseConsultancyDate}
            is_group_meetings_enabled={is_group_meetings_enabled}
          />
        </Grid>
        <div
          ref={section1Ref}
          className={`transition-opacity duration-[1000ms] delay-500 ease-in-out ${consultancyDate ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
        >
          <ConsultancySecondStep
            dateWithSlots={dateWithSlots}
            consultancyDate={consultancyDate}
            setStartTime={handleStartTime}
            startTime={startTime}
            is_group_meetings_enabled={is_group_meetings_enabled}
            groupLimit={classesData[classId].courses?.group_limit}
          />
        </div>
        <div
          ref={section2Ref}
          className={`transition-opacity duration-[500ms] delay-500 ease-in-out ${startTime ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
        >
          <Grid
            container
            spacing={3}
            sx={{ marginTop: { xs: "30px", md: "70px" } }}
          >
            <ConsultancyThirdStep
              questions={questions}
              setQuestions={setQuestions}
              courseSlug={classesData[classId].courses.slug}
              formSubjects={classesData[classId]?.courses?.form_subjects}
            />
          </Grid>
        </div>
        <Snackbar
          open={false}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            severity="warning"
            variant="filled"
            style={{
              background: "var(--light-black)",
              color: "var(--primary-color)",
              fontSize: "16px",
            }}
          >
            Nenhum horário disponível para esse dia!
          </Alert>
        </Snackbar>
        <Grid item xs={12}>
          <div className="flex justify-center md:justify-end mt-[26px]">
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
        <div
          ref={section3Ref}
          className={`inset-0 transition-opacity duration-[500ms] delay-500 ease-in-out ${startTime ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
        >
          <Grid justifyContent="flex-end" display={"flex"}>
            <ButtonIcon
              disabled={false}
              onClick={() => setOpenModal(true)}
              text="Concluir agendamento"
              icon="/icon-arrow-right.svg"
            />
          </Grid>
        </div>
      </div>
    </>
  );
};
