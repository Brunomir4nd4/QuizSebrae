"use client";
import { FunctionComponent, useState } from "react";
import type { ConfirmMentorshipProps, MentorshipConfirmedProps, Props } from "./AppointmentModal.interface";
import { Box, Divider } from "@mui/material";
import React from "react";
import {
  ModalButton,
  ModalInfo,
} from "./AppointmentModal.styles";
import { getDateObject } from "@/hooks";
import { createAppointment } from "@/app/services/bff/ScheduleService";
import { BaseModal } from "../BaseModal";
import { sendParticipantModeLogBff } from "@/app/services/bff/ParticipantModeLogs";

/**
 * **AppointmentModal**
 *
 * Modal para agendamento de mentorias, permitindo confirmação dos detalhes e exibição de tela de sucesso após agendar.
 * Inclui validação de campos, criação de agendamento e logging para modo participante.
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Exibe tela de confirmação com detalhes da mentoria.
 * - Permite agendar mentoria individual após validação.
 * - Mostra tela de sucesso após agendamento.
 * - Suporte a logging para modo participante.
 * - Controle de estado para alternar entre telas de confirmação e sucesso.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <AppointmentModal
 *   open={isOpen}
 *   onClose={handleClose}
 *   closeDrawer={handleCloseDrawer}
 *   appointment={appointmentDetails}
 *   setAppointments={setAppointmentsList}
 *   facilitator="Nome do Facilitador"
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: AppointmentModal.styles.tsx.
 *
 * ---
 *
 * @component
 */
export const AppointmentModal: FunctionComponent<Props> = ({
  open,
  onClose,
  closeDrawer,
  appointment: appointmentData,
  setAppointments,
  facilitator,
}) => {
  const {
    type_id,
    additional_fields,
    class_id,
    course_name,
    employee_id,
    finish_time,
    start_time,
  } = appointmentData;

  const [contentControl, setContentControl] = useState(true);

  /**
   * Agenda uma mentoria individual após validação dos campos obrigatórios.
   * Cria o agendamento via API e atualiza a lista de agendamentos.
   */
  const setConsultoriaIndividual = async () => {
    if (
      !additional_fields.main_topic ||
      !additional_fields.social_network ||
      !additional_fields.specific_questions
    ) {
      alert("Prencha todos os campos");
      return;
    }
    if (!class_id) {
      alert("ID da turma indefinido");
      return;
    }
    if (!course_name) {
      alert("Nome do curso indefinido");
      return;
    }
    if (!start_time) {
      alert("Escolha uma data e horário");
      return;
    }

    const updatedAppointment = {
      ...appointmentData,
      additional_fields: {
        ...appointmentData.additional_fields,
        course_name,
      },
    };

    const appointment = await createAppointment(updatedAppointment);

    if (appointment && appointment.status === 201) {
      const appointmentCreated = appointment.data;

      setAppointments((prevAppointments) => {
        if (prevAppointments) {
          return [...prevAppointments, appointmentCreated];
        }
        return [appointmentCreated];
      });
      setContentControl(!contentControl);

      const isParticipantMode = localStorage.getItem('isParticipantMode') === 'true';
      if (!isParticipantMode) return;
      try {
        const getParticipantModeStorage = JSON.parse(localStorage.getItem("participantModeStorage") || "{}");

        await sendParticipantModeLogBff(
          getParticipantModeStorage.id,
          getParticipantModeStorage.cpf,
          getParticipantModeStorage.participantId,
          getParticipantModeStorage.participantCpf,
          `Agendou uma mentoria individual com ${facilitator}`
        );
      } catch (error) {
        console.error("Erro ao enviar log:", error);
      }
    }
  };

  const closeModal = () => {
    setContentControl(true);
    onClose();
  };

  return (
    <>
      <BaseModal
        open={open}
        onClose={closeModal}
        header={
          contentControl ? (
            <h3 className="text-black-light text-3xl sm:text-32 lg:text-40 font-bold" >
              Confirme <span className="font-thin">sua mentoria</span>
            </h3>
          ) : (
            <h3 className="text-black-light text-3xl sm:text-32 lg:text-40 font-bold">
              Mentoria <span className="font-thin">confirmada</span>
            </h3>
          )
        }
        footer={
          contentControl ? (
            <Box className="text-center">
              <ModalButton onClick={setConsultoriaIndividual}>
                <div>
                  <img src="/icon-like.svg" alt="" />
                </div>
                <p className="text-base sm:text-lg text-green-light font-bold">
                  Confirmar mentoria
                </p>
              </ModalButton>
            </Box>
          ) : null
        }
      >
        {contentControl ? (
          <div
            className={`transition duration-300 ease-in ${contentControl ? "opacity-100 h-100" : "opacity-0 h-0"
              }`}
          >
            <ConfirmMentorship
              facilitator={facilitator}
              startTime={getDateObject(start_time).hour}
              AppointmentType={type_id}
              setIndividualMentorship={setConsultoriaIndividual}
            />
          </div>
        ) : (
          <div
            className={`transition-opacity duration-300 ease-in ${contentControl ? "opacity-0 h-0" : "opacity-100 h-100"
              }`}
          >
            <MentorshipConfirmed
              week={getDateObject(start_time).dayName}
              day={getDateObject(start_time).dayNumber}
              startTime={getDateObject(start_time).hour}
            />
          </div>
        )}
      </BaseModal>
    </>
  );
};

/**
 * Componente que exibe a tela de confirmação após a mentoria ser agendada com sucesso.
 * Mostra a data, dia da semana e horário confirmados.
 * 
 * @param week - Dia da semana ou número da semana.
 * @param day - Dia do mês.
 * @param startTime - Horário de início da mentoria.
 */
const MentorshipConfirmed: FunctionComponent<MentorshipConfirmedProps> = ({
  week,
  day,
  startTime,
}) => {
  return (
    <>
      <ModalInfo className="gap-3">
        <div className="flex flex-col items-center justify-center min-w-[100px] h-[100px] bg-[#000] rounded-[10px] shadow-sm">
          <div className="items-center uppercase justify-center text-sm text-[#909192]">
            {week}
          </div>
          <div className="items-center justify-center text-32 text-green-light">
            {day}
          </div>
        </div>

        <div className="w-[100%] rounded-[10px] bg-[#000] p-[20px] flex gap-3 items-center">
          <div className="min-w-[45px] h-[45px] border border-green-light rounded-[7px] flex items-center justify-center">
            <img src="/icon-like-green.svg" alt="" />
          </div>
          <div>
            <p className="text-xl md:text-2xl text-green-light font-bold">
              {startTime}h
            </p>
            <p className="text-sm md:text-base text-green-light">Seu horário</p>
          </div>
        </div>
      </ModalInfo>
      <div className="text-center mt-6 mb-6">
        <p className="text-sm md:text-base text-black-light">
          <strong>Atenção</strong> para comparecer no horário agendado.
          <br />
          Não será possível remarcar.
          <br />
          <br />
          <strong>Contamos com a sua consideração.</strong>
        </p>
      </div>
    </>
  );
};

/**
 * Componente que exibe a tela de confirmação de detalhes da mentoria antes de agendar.
 * Mostra informações do facilitador, horário e tipo de mentoria.
 * 
 * @param facilitator - Nome do facilitador da mentoria.
 * @param startTime - Horário de início da mentoria.
 * @param AppointmentType - Tipo de agendamento (ID).
 */
const ConfirmMentorship: FunctionComponent<ConfirmMentorshipProps> = ({
  facilitator,
  startTime,
  AppointmentType,
}) => {
  return (
    <>
      <ModalInfo>
        <div>
          <p id="facilitator_name" className="flex text-base sm:text-lg md:text-2xl mb-3 text-black-light font-bold">
            <img src="/icon-user.svg" alt="" />
            {facilitator}
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-2 sm:gap-3 md:gap-8">
          <p className="flex text-base sm:text-2xl text-black-light">
            <img src="/icon-clock.svg" alt="" />
            {startTime}
          </p>
          <p className="flex text-base sm:text-2xl text-black-light">
            <img src="/icon-timer.svg" alt="" />
            {AppointmentType === 3 ? 45 : 60}min
          </p>
        </div>
      </ModalInfo>
      <div className="text-center mt-4 mb-4 sm:mt-6 sm:mb-6">
        <h4 className="text-base text-2xl font-bold text-black-light mb-2 sm:mb-6">
          Atenção
        </h4>
        <p className="text-sm md:text-base text-black-light text-left">
          Planeje bem o horário de acordo com a sua disponibilidade. O
          agendamento é exclusivo e o facilitador estará à sua disposição.
          <br /> <strong>Não será possível remarcar</strong>. Contamos com a sua
          consideração.
        </p>
      </div>
      <Divider />
    </>
  );
};
