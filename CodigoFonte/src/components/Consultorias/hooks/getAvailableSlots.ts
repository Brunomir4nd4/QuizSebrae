import { getAvailableSlot, getMeetingGroupSlots } from "@/app/services/bff/ScheduleService";
import { Appointment, AppointmentResponse } from "@/types/IAppointment";
import { ClassResponse } from "@/types/IClass";
import { Booking } from "@/types/ITurma";

export const getAvailableSlots = async (id: string, classId: string | number) => {
  const availableSlots = await getAvailableSlot(id, classId);

  if(availableSlots && availableSlots.status === 200){
    const dateWithSlots: Booking = {
      date: id,
      slots: availableSlots.data,
    };
    return dateWithSlots
  }
  return null;
 
};

export const getAvaliableGroupMeetingsSlots = async (classId: string, date: string) => {
  const availableSlots = await getMeetingGroupSlots(classId, date);

  if(availableSlots && availableSlots.status === 200){
    const dateWithSlots: Booking = {
      date: date,
      slots: availableSlots.data,
    };
    return dateWithSlots
  }
  return null;
}