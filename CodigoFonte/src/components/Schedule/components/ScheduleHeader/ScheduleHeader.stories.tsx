import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { ScheduleHeader } from './ScheduleHeader.component';
import { DateTime } from 'luxon';
import { ScheduleCalendarView } from '../../utils/ScheduleCalendarView';
import { ProvidersDecorator } from '../../../../../.storybook/decorators/ProvidersDecorator';

export default {
  title: 'components/Organisms/Schedule/ScheduleHeader',
  component: ScheduleHeader,
  decorators: [ProvidersDecorator],
  parameters: { 
    layout: 'fullscreen',
    docs: {
      story: {
        inline: false,
        iframeHeight: 600,
      },
    },
  },
  tags: ['autodocs'],
} as Meta<typeof ScheduleHeader>;

const Template: StoryFn<React.ComponentProps<typeof ScheduleHeader>> = (args) => {
  const [date, setDate] = useState<DateTime<true> | DateTime<false>>(DateTime.now().setLocale('pt-BR'));
  const weekStart = date.startOf('week');
  const weekEnd = date.endOf('week');

  return (
    <div style={{ 
      padding: '24px',
      width: '100vw',
      boxSizing: 'border-box',
      minHeight: '100vh',
      overflow: 'visible',
      position: 'relative',
      '--schedule-slot-height': '100px',
      '--schedule-first-slot-width': '90px',
      '--schedule-slots-horizontal-border-color': 'rgba(0, 0, 0, 0.2)',
      '--schedule-slots-vertical-border-color': 'rgba(34, 35, 37, 0.1)',
      '--background-rgb': '255, 255, 255',
      '--primary-color': '#1EFF9D',
    } as React.CSSProperties}>
      <ScheduleHeader {...args} date={date} weekStart={weekStart} weekEnd={weekEnd} setDate={setDate} />
    </div>
  );
};

export const DayView = Template.bind({});
DayView.args = { type: ScheduleCalendarView.Day } as Partial<React.ComponentProps<typeof ScheduleHeader>>;

export const WeekView = Template.bind({});
WeekView.args = { type: ScheduleCalendarView.Week } as Partial<React.ComponentProps<typeof ScheduleHeader>>;
