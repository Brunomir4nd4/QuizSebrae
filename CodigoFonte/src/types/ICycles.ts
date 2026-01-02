export interface Cycle {
  id: number;
  name: string;
  slug: string;
  course_id: number;
  course_name: string;
  start_date: string;
  end_date: string;
  activities: string;
  first_consultancy: Consultancy[]; 
  second_consultancy: Consultancy[]; 
}

interface Consultancy {
  consultancy_date: string;
}

export interface ClassByClycleResponse {
  id: number;
  name: string;
  slug: string;
  cycle_id: number;
  turno: {
    label: 'Manhã' | 'Noite' | 'Tarde' | 'Turma Única'
    value: 'diurno' | 'noturno' | 'vespertino' | 'unica'
  };
}