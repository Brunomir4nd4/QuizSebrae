"use client";

import { CardWeekDay } from "@/components/CardWeekDay";
import { Grid, useMediaQuery } from "@mui/material";
import { FunctionComponent } from "react";
import React from "react";
import { checkIfAnyDateIsAfterToday, dateIsBeforeToday } from "@/hooks";
import { ConsultancyConfirmed } from "@/components/ConsultancyConfirmed";
import { Appointment } from "@/types/IAppointment";

interface ConsultoriasProps {
  /** Configuração dos rótulos exibidos nos títulos das mentorias */
  labelConfiguration: {
    label_configuration_regular: string;
    label_configuration_strong: string;
    label_configuration_suffix: string;
  };
  /** Datas disponíveis para cada mentoria (arrays de datas por etapa) */
  consultancyDates: string[][];
  /** Data atualmente selecionada pelo usuário */
  currentDateSelected: string | null | undefined;
  /** Id da turma */
  classId: string | number;
  /** Agendamentos já realizados pelo usuário */
  userAppointments:
    | {
        [x: number]: Appointment;
      }
    | null
    | undefined;
  /** Função para selecionar uma data de mentoria */
  chooseConsultancyDate: (date: string) => Promise<void>;
  /** Indica se o agendamento é em grupo */
  is_group_meetings_enabled: boolean;
  /** Exibe o componente em modo drawer (layout responsivo) */
  isDrawerView?: boolean;
}

const setGrid = (dates: string[]) => {
  if (dates.length === 1) {
    return 2;
  }
  if (dates.length === 3) {
    return 5;
  }
  if (dates.length === 4 || dates.length === 5) {
    return 7;
  }
  if (dates.length === 6) {
    return 9;
  }
  if (dates.length < 3) {
    return 3;
  }
  return 12;
};

/**
 * **ConsultancyFirstStep**
 *
 * Exibe o primeiro passo do fluxo de agendamento de consultorias, permitindo ao usuário escolher entre datas disponíveis para cada mentoria.
 * Mostra cards de dias disponíveis, destaca agendamentos já realizados e adapta o layout para modo drawer ou tela cheia.
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Renderiza datas por mentoria.
 * - Destaque de agendamentos realizados.
 * - Suporte a modo drawer (lógica condicional).
 * - Responsivo com media queries.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <ConsultancyFirstStep
 *   labelConfiguration={labels}
 *   consultancyDates={dates}
 *   currentDateSelected="2023-10-01"
 *   classId="123"
 *   userAppointments={appointments}
 *   chooseConsultancyDate={handleChoose}
 *   is_group_meetings_enabled={false}
 *   isDrawerView={false}
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: (usa Material-UI e estilos inline).
 *
 * ---
 *
 * @component
 */
export const ConsultancyFirstStep: FunctionComponent<ConsultoriasProps> = ({
  labelConfiguration,
  consultancyDates,
  currentDateSelected,
  classId,
  userAppointments,
  chooseConsultancyDate,
  is_group_meetings_enabled,
  isDrawerView,
}) => {
  const bgColor = isDrawerView ? "custom-grey" : "[#E0E3E8]";
  const borderColor = isDrawerView ? "#222325" : "#D0D1D4";

  const isLargeScreen = useMediaQuery("(min-width: 1025px)");

  return (
    <>
      {consultancyDates.map((dates, firstIndex) => {
        const isAllDatesAfterToday = checkIfAnyDateIsAfterToday(dates);
        /**
         * Caso todas as datas sejam passadas e a visão seja do drawer, não exibe o bloco de datas
         */
        if (!isAllDatesAfterToday && isDrawerView) {
          return <></>;
        }
        /**
         * Se ja houver agendamento e a visão seja do drawer, não exibe nada.
         */
        if (
          isDrawerView &&
          userAppointments &&
          userAppointments[firstIndex + 1]
        ) {
          return <></>;
        }
        let groupId = null;
        if (userAppointments && userAppointments[firstIndex + 1]) {
          const currAppointment = userAppointments[firstIndex + 1];
          const key =
            `${currAppointment.start_time}${currAppointment.finish_time}${currAppointment.class_id}${currAppointment.employee_id}`.match(
              /\d+/g
            );
          groupId = key ? key.join("") : null;
        }
        /**
         * Verifica se a visão é drawer e se o primeiro agendamento já foi realizado.
         * Caso tenha sido agendado, exibe o segundo bloco de datas de mentoria.
         * Caso não tenha, só exibe o primeiro bloco
         */
        if (
          isDrawerView &&
          firstIndex === 1 &&
          !(userAppointments && userAppointments[1])
        ) {
          return <></>;
        }

        return (
          <Grid
            item
            xs={12}
            md={isLargeScreen ? setGrid(dates) : 12}
            key={`dates_${firstIndex}`}
          >
            <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-[#070D26] font-extralight">
              <strong className="font-bold">
                {`${firstIndex + 1}${
                  labelConfiguration?.label_configuration_suffix || "ª"
                } ${
                  labelConfiguration?.label_configuration_strong || "Mentoria"
                }`}
              </strong>
              {` ${
                labelConfiguration?.label_configuration_regular || "Individual"
              }`}
            </h2>

            <div className="bg-custom-grey border-[#222325] d-none" />
            <div
              className={`rounded-[20px] overflow-auto bg-${bgColor} border ${
                isDrawerView ? "border-opacity-10" : ""
              } border-[${borderColor}] sm:p-5 p-[15px] mt-[17px] flex gap-2 justify-around`}
            >
              {userAppointments && userAppointments[firstIndex + 1] ? (
                <ConsultancyConfirmed
                  key={`ConsultancyConfirmed_${firstIndex}`}
                  classId={classId}
                  start_datetime={userAppointments[firstIndex + 1].start_time}
                  is_group_meetings_enabled={is_group_meetings_enabled}
                  meeting_id={groupId}
                />
              ) : (
                dates.map((date, secondIndex) => {
                  return (
                    <div
                      key={`weekDaysFirst${secondIndex}`}
                      className="w-[130px]"
                    >
                      <CardWeekDay
                        availableDate={date}
                        active={date === currentDateSelected}
                        disabled={dateIsBeforeToday(date)}
                        consultancyDate={currentDateSelected}
                        isDrawerView={isDrawerView}
                        setConsultancyDate={() => chooseConsultancyDate(date)}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </Grid>
        );
      })}
    </>
  );
};
