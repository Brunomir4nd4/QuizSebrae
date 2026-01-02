import {
  AppointmentDeleteResponse,
  AppointmentResponse,
  CreateAppointment,
} from "@/types/IAppointment";
import { proxyRequest } from "../api";
import { SlotResponse } from "@/types/ISlots";

/**
 * Obtém o cronograma de facilitador para uma semana específica.
 * @param week - O número da semana para o qual se deseja obter o cronograma.
 * @returns Uma Promise que resolve em um objeto contendo o cronograma para a semana especificada.
 */
export const getSchedule = (week: number, class_id?: string | null, role?: string): Promise<AppointmentResponse> => {
  const endpoint = role === 'supervisor' ? `/schedule/calendar/${week}/class/${class_id}` : `/schedule/calendar/${week}`;
  return proxyRequest(endpoint, "GET");
};

/**
 * Bloqueia um horário no sistema BFF (Backend for Frontend).
 * @param params - Um objeto contendo os detalhes do horário a ser bloqueado, incluindo o tempo de início e término.
 */
export const blockScheduleTimeBff = (params: {
  start_time: string;
  finish_time: string;
  class_id: string | number;
}): Promise<AppointmentDeleteResponse> => {
  return proxyRequest(`/schedule/block/${params.class_id}`, "POST", params);
};

/**
 * Desbloqueia um horário no sistema BFF (Backend for Frontend).
 * @param id - O ID do horário a ser desbloqueado.
 */
export const unblockScheduleTimeBff = (
  id: string | number,
): Promise<AppointmentDeleteResponse> => {
  return proxyRequest(`/schedule/unblock/${id}`, "POST");
};

/**
 * Obtém os slots disponíveis para uma determinada data e classe.
 * @param date - A data para a qual se deseja obter os slots disponíveis.
 * @param class_id - O ID da classe para a qual se deseja obter os slots disponíveis.
 * @returns Uma Promise que resolve em um objeto contendo os slots disponíveis para a data e classe especificadas.
 */
export const getAvailableSlot = (
  date: string,
  class_id: string | number,
): Promise<SlotResponse> => {
  return proxyRequest(`/schedule/slot/${date}/class/${class_id}`, "GET");
};

export const deleteBookingById = (
  booking_id: string | number,
): Promise<AppointmentDeleteResponse> => {
  return proxyRequest(`/schedule/appointment/delete/${booking_id}`, "POST");
};

export const createAppointment = (
  appointment: CreateAppointment,
): Promise<AppointmentDeleteResponse> => {
  return proxyRequest(`/schedule/appointment/create`, "POST", appointment);
};

export const getAppointmentByClassAndCpf = (
  class_id: string,
): Promise<AppointmentResponse> => {
  return proxyRequest(`/schedule/appointment/class/${class_id}`, "GET");
};

export const getMeetingGroupSlots = (
  class_id: string,
  date: string
): Promise<SlotResponse> => {
  return proxyRequest(`/schedule/slot`, "POST", {
    class_id,
    date
  });
};