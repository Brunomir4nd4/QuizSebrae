import { DateTime } from 'luxon';

import { ScheduleEvent } from '../../models/ScheduleEvent';
import { ScheduleCalendarView } from '../../utils/ScheduleCalendarView';

export interface ScheduleSlotsProps {
    type: ScheduleCalendarView;
    weekStart: DateTime;
    weekEnd: DateTime;
    selectedDay: number
    workHourStart: number;
    workHourEnd: number;
    events: ScheduleEvent[];
    onSlotClick?: (date: Date) => void;
    onEventClick?: (event: ScheduleEvent) => void;
}