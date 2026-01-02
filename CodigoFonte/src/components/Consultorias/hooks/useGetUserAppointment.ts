import { Appointment, AppointmentResponse } from "@/types/IAppointment";
import { ClassResponse } from "@/types/IClass";

/**
 * Retorna um objeto contendo os agendamentos do usuário indexados pelo índice da mentoria individual.
 *
 * @param {AppointmentResponse['data']} appointments - Array de agendamentos do usuário.
 * @param {string | number | null} [classId] - ID da turma (pode ser string, número ou null).
 * @param {{ [key: string]: ClassResponse['data'][0] } | null} [classesData] - Dados das turmas, onde a chave é o ID da turma.
 * @returns {{ [x: number]: Appointment } | undefined | null} - Objeto contendo os agendamentos indexados ou null se classesData ou classId não forem fornecidos.
 */
export const useGetUserAppointment = (
  appointments: AppointmentResponse['data'] | null,
  classId?: string | number | null,
  classesData?: { [key: string]: ClassResponse['data'][0] } | null,
): ({ [x: number]: Appointment } | undefined | null) => {

  if (!classesData || !classId || !appointments) {
    return null;
  }

  const keysArray = Object.keys(classesData);

  if (keysArray.includes(`${classId}`)) {
    const consultancyArray = classesData[classId].individual_meetings;

    const userAppointments = appointments.map((appointment) => {
      const index = findDateIndex(consultancyArray, appointment.start_time.split(" ")[0]);

      if (index !== null) {
        return { [index + 1]: appointment };
      }
    })
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});

    return userAppointments;
  }

  return null;
}

/**
 * Encontra o índice da data no array de arrays de mentorias.
 *
 * @param {string[][]} datesArray - Array de arrays de datas de mentorias.
 * @param {string} targetDate - Data a ser encontrada.
 * @returns {number | null} - Índice do array que contém a data ou null se não encontrada.
 */
function findDateIndex(datesArray: string[][], targetDate: string): number | null {
  for (let i = 0; i < datesArray.length; i++) {
    if (datesArray[i].includes(targetDate)) {
      return i;
    }
  }
  return null;
}
