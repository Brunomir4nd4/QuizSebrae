import { Appointment } from "@/types/IAppointment";

export enum ScheduleEventType {
    Group = "group",
    Appointment = "appointment",
    Meeting = "meeting",
    Block = "block",
}

export class ScheduleEvent {
  constructor(
    public id: string,
    public type: ScheduleEventType,
    public start: Date,
    public end: Date,
    public client_name: string,
    public title: string,
    public additional_fields: {
      main_topic: string;
      social_network: string;
      specific_questions: string;
    } | null,
    public client: {
      cpf: string;
      email: string | null;
      phone_number: string | null;
      name: string;
      id: number;
    } | null,
    public employee: {
      cpf: string;
      email: string | null;
      phone_number: string | null;
      name: string;
      id: number;
    },
    public class_id: string,
    public group?: Appointment[]
  ) {}
}