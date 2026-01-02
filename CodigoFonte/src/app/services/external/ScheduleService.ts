import {
  AppointmentResponse,
  CreateAppointment,
  GetUserResponse,
} from "@/types/IAppointment";
import { scheduleRequest } from "../api";
import { SlotResponse } from "@/types/ISlots";

/**
 * Obtém o calendário de facilitador para uma semana e CPF específicos.
 * @param week - O número da semana para o qual se deseja obter o calendário.
 * @param cpf - O CPF do usuário para o qual se deseja obter o calendário.
 * @returns Uma Promise que resolve em um objeto contendo o calendário para a semana e CPF especificados.
 */
export const getCalendar = (
  week: string,
  cpf: string,
): Promise<AppointmentResponse> => {
  const queryParams = new URLSearchParams({
    week: week,
    cpf: cpf,
  });
  return scheduleRequest(`/appointments/?${queryParams}`, "GET");
};

/**
 * Bloqueia um horário.
 * @param params - Um objeto contendo os detalhes do horário a ser bloqueado, incluindo o tempo de início e término.
 */
export const blockScheduleTimePoc = (params: {
  start_time: string;
  finish_time: string;
}) => {
  return scheduleRequest(`/appointments`, "POST", params);
};

/**
 * Desbloqueia um horário.
 * @param id - O ID do horário a ser desbloqueado.
 * @param cpf - O CPF do usuário associado ao horário a ser desbloqueado.
 */
export const unblockScheduleTime = (id: string | number, cpf: string) => {
  return scheduleRequest(`/appointments/${id}/cpf/${cpf}`, "DELETE");
};

/**
 * Obtém os slots disponíveis para agendamento em uma determinada data, classe e CPF.
 * @param date - A data para a qual se deseja obter os slots disponíveis.
 * @param class_id - O ID da classe para a qual se deseja obter os slots disponíveis.
 * @param cpf - O CPF do usuário para o qual se deseja obter os slots disponíveis.
 * @returns Uma Promise que resolve em um objeto contendo os slots disponíveis para a data, classe e CPF especificados.
 */
export const getAvailableSlotByDate = (
  date: string,
  facilitador: string,
  client: string,
): Promise<SlotResponse> => {
  return scheduleRequest(
    `/appointments/slots/${date}/employee/${facilitador}/client/${client}`,
    "GET",
  );
};

export const deleteBookingById = (booking_id: string | number, cpf: string) => {
  return scheduleRequest(`/appointments/${booking_id}/cpf/${cpf}`, "DELETE");
};

export const createAppointment = (appointment: CreateAppointment) => {
  return scheduleRequest(`/appointments`, "POST", appointment);
};

export const getAppointmentByClassAndCpf = (
  class_id: string | number,
  cpf: string | number,
): Promise<AppointmentResponse> => {
  return scheduleRequest(`/appointments/class/${class_id}/cpf/${cpf}`, "GET", null, { cache: 'no-store' });
};

export const createUser = (
  role: "facilitator" | "subscriber",
  email: string,
  cpf: string,
  name: string,
) => {
  const body = {
    email,
    cpf,
    name,
  };
  return scheduleRequest(
    `/${role === "subscriber" ? "clients" : "employees"}`,
    "POST",
    body,
  );
};

export const getUserByCpf = (
  role: "facilitator" | "subscriber",
  cpf: string,
): Promise<GetUserResponse> => {
  return scheduleRequest(
    `/${role === "subscriber" ? "clients" : "employees"}/cpf/${cpf}`,
    "GET",
  );
};

export const getMeetingGroupSlots = (
  date: string,
  employee_cpf: string,
  client_cpf: string,
): Promise<SlotResponse> => {
  return scheduleRequest(
    `/appointments/slots/group/${date}/employee/${employee_cpf}/client/${client_cpf}`,
    "GET",
  );
};
