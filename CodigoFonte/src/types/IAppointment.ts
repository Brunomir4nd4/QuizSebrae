import { Questions } from "@/components/Consultorias";
import { ApiResponse } from "./IApiResponse";

export interface Appointment {
  id: number | string;
  start_time: string;
  finish_time: string;
  comments: string;
  additional_fields: string | null;
  class_id: string;
  type_id: 1 | 2 | 3 | 4;
  client_id: number | null;
  employee_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  client: any | null;
  employee: {
    id: number;
    name: string;
    cpf: string;
    email: string | null;
    phone_number: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
}

export interface GroupAppointment extends Appointment {
  group_id: string
  items: Appointment[]
}

export interface AppointmentResponse extends ApiResponse {
  data: Appointment[];
}

export interface AppointmentDeleteResponse extends ApiResponse {
  data: Appointment;
}

export interface CreateAppointment {
  start_time: string;
  finish_time: string;
  additional_fields: Questions;
  class_id: string;
  course_name: string;
  employee_id: number;
  type_id: 1 | 2 | 3 | 4;
}

export interface GetUserResponse extends ApiResponse {
  data: ScheduleUser;
}

interface ScheduleUser {
  id: number;
  name: string;
  cpf: string;
  email: string | null;
  phone_number: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
