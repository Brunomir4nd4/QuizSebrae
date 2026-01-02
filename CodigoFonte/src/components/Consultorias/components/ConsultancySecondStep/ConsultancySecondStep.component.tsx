"use client";
import { Grid } from "@mui/material";
import { FunctionComponent } from "react";
import React from "react";
import { Booking } from "@/types/ITurma";
import { CardTime } from "@/components/CardTime";
import { isDateTimeOneHourBefore } from "@/hooks";

interface ConsultoriasProps {
  /** Slots disponíveis para a data selecionada */
  dateWithSlots: Booking | null;
  /** Data de consultoria atualmente selecionada */
  consultancyDate: string | null | undefined;
  /** Função para definir o horário selecionado */
  setStartTime: (startTime: string) => void;
  /** Horário atualmente selecionado */
  startTime: string;
  /** Indica se o agendamento é em grupo */
  is_group_meetings_enabled: boolean;
  /** Exibe o componente em modo drawer (layout responsivo) */
  isDrawerView?: boolean;
  /** Limite máximo de participantes no grupo */
  groupLimit?: number | null;
}

const times = [
  { id: "06:00:00", time: "06:00" },
  { id: "07:00:00", time: "07:00" },
  { id: "08:00:00", time: "08:00" },
  { id: "09:00:00", time: "09:00" },
  { id: "10:00:00", time: "10:00" },
  { id: "11:00:00", time: "11:00" },
  { id: "12:00:00", time: "12:00" },
  { id: "13:00:00", time: "13:00" },
  { id: "14:00:00", time: "14:00" },
  { id: "15:00:00", time: "15:00" },
  { id: "16:00:00", time: "16:00" },
  { id: "17:00:00", time: "17:00" },
  { id: "18:00:00", time: "18:00" },
  { id: "19:00:00", time: "19:00" },
  { id: "20:00:00", time: "20:00" },
  { id: "21:00:00", time: "21:00" },
];

/**
 * **ConsultancySecondStep**
 *
 * Exibe o segundo passo do fluxo de agendamento de consultorias, permitindo ao usuário escolher um horário disponível para a data selecionada.
 * Mostra todos os horários do dia, destacando disponibilidade, vagas em grupo e adapta o layout para modo drawer ou tela cheia.
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Grid de horários com CardTime.
 * - Validação de antecedência (1 hora).
 * - Suporte a reuniões em grupo (contador de vagas).
 * - Responsivo e modo drawer.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <ConsultancySecondStep
 *   dateWithSlots={slots}
 *   consultancyDate="2023-10-01"
 *   setStartTime={setTime}
 *   startTime="10:00"
 *   is_group_meetings_enabled={true}
 *   isDrawerView={false}
 *   groupLimit={5}
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: (usa Material-UI Grid).
 *
 * ---
 *
 * @component
 */
export const ConsultancySecondStep: FunctionComponent<ConsultoriasProps> = ({
  dateWithSlots,
  consultancyDate,
  setStartTime,
  startTime,
  is_group_meetings_enabled,
  isDrawerView,
  groupLimit
}) => {
  if (!consultancyDate || !dateWithSlots) {
    return <></>;
  }

  return (
    <>
      <Grid container spacing={3} sx={{ marginTop: "20px" }}>
        {times.map((item, index) => {
          const slot = dateWithSlots?.slots.find((obj) => obj.time === item.id)

          return (
            <Grid 
              key={`times_${item.id}`} 
              sx={{
                paddingTop: {
                  xs: '16px', 
                },
                paddingLeft: '24px',
              }}
              xs={12} 
              sm={6} 
              md={isDrawerView ? 6 : 4} 
              lg={isDrawerView ? 6 : 3} 
              xl={isDrawerView ? 6 : 2}>
              <CardTime
                time={item.time}
                id={item.id}
                available={
                  isDateTimeOneHourBefore(`${consultancyDate} ${item.id}`)
                    ? false
                    : !!slot
                }
                active={startTime === item.time}
                setStartTime={setStartTime}
                is_group_meetings_enabled={is_group_meetings_enabled}
                group={slot?.appointment_count}
                variant={isDrawerView ? 'black' : 'default'}
                groupLimit={groupLimit ?? 5}
              />
            </Grid>
          )
        })}
      </Grid>
    </>
  );
};
