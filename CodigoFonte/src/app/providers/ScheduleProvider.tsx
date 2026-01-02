'use client'
import React, { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { ScheduleEvent, ScheduleEventType } from '@/components/Schedule/models/ScheduleEvent';
import { getSchedule } from "../services/bff/ScheduleService";
import { DateTime } from "luxon";
import { BOOKING_TYPE } from "@/components/Schedule";
import { useSession } from 'next-auth/react';
import { Appointment, GroupAppointment } from '@/types/IAppointment';

interface ScheduleContextProps {
  scheduleData: number;
  schedule: ScheduleEvent[] | null;
  loading: boolean;
  date: DateTime<true> | DateTime<false>;
  dayViewDate: DateTime<true> | DateTime<false>;
  setDayViewDate: React.Dispatch<
    React.SetStateAction<DateTime<true> | DateTime<false>>
  >;
  setDate: React.Dispatch<
    React.SetStateAction<DateTime<true> | DateTime<false>>
  >;
  setScheduleData: Dispatch<SetStateAction<number>>;
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleEvent[] | null>>;
}

const APPOINTMENT_TITLE = {
  "1": "Bloqueio",
  "2": "Encontro Coletivo",
  "3": "Mentoria Individual",
  "4": "Mentoria em Grupo",
};

export const ScheduleContext = createContext<ScheduleContextProps>({
  scheduleData: 0,
  loading: true,
  schedule: null,
  date: DateTime.fromJSDate(new Date()).setLocale("pt-BR"),
  dayViewDate: DateTime.fromJSDate(new Date()).setLocale("pt-BR"),
  setDate: () => {},
  setDayViewDate: () => {},
  setScheduleData: () => {},
  setSchedule: () => {},
});

export function useScheduleContext(): ScheduleContextProps {
  return useContext(ScheduleContext);
}

export default function ScheduleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = "pt-BR";
  const [scheduleData, setScheduleData] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState<ScheduleEvent[] | null>(null);
  const [date, setDate] = useState(
    DateTime.fromJSDate(new Date()).setLocale(locale),
  );
  const [dayViewDate, setDayViewDate] = useState(
    DateTime.fromJSDate(new Date()).setLocale(locale),
  );
  const session = useSession();
  const role    = session.data?.user?.role[0];
  
  useEffect(() => {
    const classId = localStorage.getItem('class_id')
    const fetchData = async () => {
      try {
        const scheduleResponse = await getScheduleFromPoc(date, classId, role);
        if(scheduleResponse) {
          setSchedule(scheduleResponse);
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
      }
    };

    if(role === 'supervisor' && !classId){
      return;
    }
    fetchData();
  }, [scheduleData, date]);

  const getScheduleFromPoc = async (date: DateTime<true> | DateTime<false>, class_id: string | null, role?: string) => {
    setLoading(true);
    
    const response = await getSchedule(date.weekNumber, class_id, session.data?.user?.role[0]);
    
    setLoading(false);
    if (!response) {
      return null
    }

    const scheduleMap: ScheduleEvent[] = [];

    const groupAppointments = response.data.filter((appointment) => appointment.type_id == 4)
    const groupedData = groupAppointments.reduce((acc: { [key: string]: GroupAppointment}, curr) => {
      const key = `${curr.start_time}${curr.finish_time}${curr.class_id}${curr.employee_id}`.match(/\d+/g);
      const groupId = key ? key.join('') : '1'
      
      if (!acc[groupId]) {
          acc[groupId] = {
              start_time: curr.start_time,
              finish_time: curr.finish_time,
              class_id: curr.class_id,
              employee_id: curr.employee_id,
              employee: curr.employee,
              group_id: groupId,
              client: null,
              client_id: null,
              id: groupId,
              additional_fields: null,
              comments: 'Mentoria em Grupo',
              type_id: 4,
              created_at: '',
              updated_at: '',
              deleted_at: null,
              items: []
          };
      }
      
      acc[groupId].items.push(curr);
      return acc;
    }, {});
    
    const result = Object.values(groupedData);

    result.forEach((appointment) => {
      const startTime = DateTime.fromFormat(
        appointment.start_time,
        "yyyy-MM-dd HH:mm:ss",
      );
      const startDateString = startTime.toISO({ suppressMilliseconds: false });

      const endTime = DateTime.fromFormat(
        appointment.finish_time,
        "yyyy-MM-dd HH:mm:ss",
      );
      const endDateString = endTime.toISO({ suppressMilliseconds: false });

      scheduleMap.push({
        end: endDateString
          ? DateTime.fromISO(endDateString).toJSDate()
          : new Date(),
        id: appointment.id.toString(),
        start: startDateString
          ? DateTime.fromISO(startDateString).toJSDate()
          : new Date(),
        title: APPOINTMENT_TITLE[appointment.type_id],
        type: BOOKING_TYPE[appointment.type_id],
        client_name:
          appointment.type_id == 3
            ? `${appointment.client.name}`
            : APPOINTMENT_TITLE[appointment.type_id],
        additional_fields: null,
        client: null,
        employee: appointment.employee,
        class_id: appointment.class_id,
        group: appointment.items
      });
    })

    response.data.forEach((appointment) => {

      if(appointment.type_id == 4){
        return;
      }

      const startTime = DateTime.fromFormat(
        appointment.start_time,
        "yyyy-MM-dd HH:mm:ss",
      );
      const startDateString = startTime.toISO({ suppressMilliseconds: false });
      const endTime = DateTime.fromFormat(
        appointment.finish_time,
        "yyyy-MM-dd HH:mm:ss",
      );
      const endDateString = endTime.toISO({ suppressMilliseconds: false });

      const questions = appointment.additional_fields && appointment.type_id == 3 ? JSON.parse(appointment.additional_fields) : {};

      scheduleMap.push({
        end: endDateString
          ? DateTime.fromISO(endDateString).toJSDate()
          : new Date(),
        id: appointment.id.toString(),
        start: startDateString
          ? DateTime.fromISO(startDateString).toJSDate()
          : new Date(),
        title: APPOINTMENT_TITLE[appointment.type_id],
        type: BOOKING_TYPE[appointment.type_id],
        client_name:
          appointment.type_id == 3
            ? `${appointment.client.name}`
            : APPOINTMENT_TITLE[appointment.type_id],
        additional_fields: {
          main_topic: questions?.main_topic,
          social_network: questions?.social_network,
          specific_questions: questions?.specific_questions,
        },
        client: appointment.client,
        employee: appointment.employee,
        class_id: appointment.class_id,
      });
    });

    return scheduleMap;
  };

  return (
    <ScheduleContext.Provider
      value={{
        scheduleData,
        setScheduleData,
        setDayViewDate,
        setSchedule,
        setDate,
        dayViewDate,
        schedule,
        loading,
        date,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}
