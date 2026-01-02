import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { FunctionComponent } from 'react'
import { Schedule } from '@/components/Schedule'
import { DateTime } from 'luxon';
import { ScheduleEvent, ScheduleEventType } from '@/components/Schedule/models/ScheduleEvent';
import { ScheduleCalendarView } from '@/components/Schedule/utils/ScheduleCalendarView';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/utils/authOptions';
import ScheduleProvider from '@/app/providers/ScheduleProvider';
import { redirect } from "next/navigation";

const today = DateTime.now();

// Sample schedule events:
const events: ScheduleEvent[] = [
  {
    id: "1",
    type: ScheduleEventType.Appointment,
    start: today.minus({ days: 3 }).set({ hour: 8, minute: 0 }).toJSDate(),
    end: today.minus({ days: 3 }).set({ hour: 9, minute: 0 }).toJSDate(),
    title: "Fernando Oliveira",
    client_name: "Fernando Oliveira",
    additional_fields: {
      main_topic: "",
      social_network: "",
      specific_questions: "",
    },
    client: {
      cpf: "",
      email: null,
      phone_number: null,
      name: "",
      id: 0,
    },
    employee: {
      cpf: "",
      email: null,
      phone_number: null,
      name: "",
      id: 0,
    },
    class_id: "",
  },
  {
    id: "2",
    type: ScheduleEventType.Meeting,
    start: today.set({ hour: 13, minute: 0 }).toJSDate(),
    end: today.set({ hour: 15, minute: 0 }).toJSDate(),
    title: "Encontro Coletivo",
    client_name: "Fernando Oliveira",
    additional_fields: {
      main_topic: "",
      social_network: "",
      specific_questions: "",
    },
    client: {
      cpf: "",
      email: null,
      phone_number: null,
      name: "",
      id: 0,
    },
    employee: {
      cpf: "",
      email: null,
      phone_number: null,
      name: "",
      id: 0,
    },
    class_id: "",
  },
  {
    id: "3",
    type: ScheduleEventType.Appointment,
    start: today.plus({ day: 1 }).set({ hour: 14, minute: 0 }).toJSDate(),
    end: today.plus({ day: 1 }).set({ hour: 15, minute: 0 }).toJSDate(),
    title: "Marcela Ferraz",
    client_name: "Fernando Oliveira",
    additional_fields: {
      main_topic: "",
      social_network: "",
      specific_questions: "",
    },
    client: {
      cpf: "",
      email: null,
      phone_number: null,
      name: "",
      id: 0,
    },
    employee: {
      cpf: "",
      email: null,
      phone_number: null,
      name: "",
      id: 0,
    },
    class_id: "",
  },
  {
    id: "4",
    type: ScheduleEventType.Block,
    start: today.plus({ day: 3 }).set({ hour: 16, minute: 0 }).toJSDate(),
    end: today.plus({ day: 3 }).set({ hour: 17, minute: 0 }).toJSDate(),
    client_name: "Fernando Oliveira",
    title: "",
    additional_fields: {
      main_topic: "",
      social_network: "",
      specific_questions: "",
    },
    client: {
      cpf: "",
      email: null,
      phone_number: null,
      name: "",
      id: 0,
    },
    employee: {
      cpf: "",
      email: null,
      phone_number: null,
      name: "",
      id: 0,
    },
    class_id: "",
  },
];

const PageAgenda: FunctionComponent = async () => {

  const session = await getServerSession(nextAuthOptions)

  if (!session) {
     return <></> 
  }

    return (
        <>
          <section className="flex justify-center w-full py-[40px] px-[20px] md:px-[70px] md:pl-[150px] 3xl:pl-[190px] min-h-screen bg-gray-100">
              <div className='max-w-[1640px] w-full'>
                <ScheduleProvider>
                  <Schedule
                    type={ScheduleCalendarView.Week}
                    focus={new Date()}
                    events={events}
                    session={session}
                    />
                </ScheduleProvider>
              </div>
          </section>
        </>
    )
}

export default PageAgenda;
