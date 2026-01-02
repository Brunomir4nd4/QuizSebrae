import { FunctionComponent, useState } from 'react';
import { DateTime } from 'luxon';

import { ScheduleCalendarView } from '../../utils/ScheduleCalendarView';
import { ScheduleSlot } from '../ScheduleSlot';
import { ScheduleSlotsProps } from './ScheduleSlots.interface';
import { DaySlots } from './components';
import { WeekSlots } from './components/WeekSlots.component';
import { useScheduleContext } from '@/app/providers/ScheduleProvider';


export const ScheduleSlots: FunctionComponent<ScheduleSlotsProps> = (
    { type, weekStart, weekEnd, workHourStart, workHourEnd, events, onSlotClick, onEventClick, selectedDay }: ScheduleSlotsProps
) => {

    const { dayViewDate } = useScheduleContext()

    const dayEvents = events.filter(event => {
        const date = DateTime.fromJSDate(event.start)

        if(date.day === dayViewDate.day){
            return true
        }
        return false

    })
    return (
        <div>
            {type === ScheduleCalendarView.Day
                ?   <DaySlots start={workHourStart} end={workHourEnd} weekStart={weekStart} currentDay={dayViewDate}>
                        {dayEvents.map((event, index) => {
                            const eventStart = DateTime.fromJSDate(event.start);
                            const spanCol = 1;
                            const spanRow = ((eventStart.hour - workHourStart) * 2) + 1;

                            return (
                                <ScheduleSlot
                                    key={`booking_${event.id}`}
                                    event={event}
                                    bookingId={event.id}
                                    spanCol={spanCol}
                                    spanRow={spanRow}
                                    onClick={onEventClick} />
                            );
                        })}
                    </DaySlots>
                : <WeekSlots weekStart={weekStart} start={workHourStart} end={workHourEnd}>
                    {events.map((event, index) => {
                        const eventStart = DateTime.fromJSDate(event.start);
                        const spanCol = Math.floor(eventStart.diff(weekStart, 'days').days) + 1;
                        const spanRow = ((eventStart.hour - workHourStart) * 2) + 1;

                        return (
                            <ScheduleSlot
                                key={`booking_${event.id}`}
                                event={event}
                                bookingId={event.id}
                                spanCol={spanCol}
                                spanRow={spanRow}
                                onClick={onEventClick} />
                        );
                    })}
                </WeekSlots>}
        </div>
    );
};