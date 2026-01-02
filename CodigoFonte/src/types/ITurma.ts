import { Facilitator } from "./IFacilitador";
import { Student } from "./IStudent";

export interface Course {
  id: number;
  title: string;
  students: Student[];
  start_date: string;
  end_date: string;
  facilitator: Facilitator;
  evaluate_course?: string;
  first_consultancy: Booking[];
  second_consultancy: Booking[];
  turno: {
    label: 'Manhã' | 'Noite' | 'Tarde' | 'Turma Única'
    value: 'diurno' | 'noturno' | 'vespertino' | 'unica'
  };
  links_and_materials?: {
    icon: string,
    title: string,
    link: string,
  }[];
  enable_calendar?: boolean;
  enable_room?: boolean;
}

interface Slot {
  id: string;
  date: string;
  time: string;
  appointment_count?: number | null
  type?: 'group' | null 
}

export interface Booking {
  date: string;
  slots: Slot[];
}