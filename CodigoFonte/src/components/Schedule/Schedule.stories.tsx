import type { Meta, StoryObj } from '@storybook/nextjs';
import React, { useState } from 'react';
import { DateTime } from 'luxon';

import { Schedule } from './Schedule.component';
import { ScheduleCalendarView } from './utils/ScheduleCalendarView';
import { ScheduleHolder } from './Schedule.styles';
import { ScheduleHeader } from './components/ScheduleHeader';
import { ScheduleSlots } from './components/ScheduleSlots';
import { ScheduleEvent, ScheduleEventType } from './models/ScheduleEvent';

const meta: Meta<typeof Schedule> = {
	title: 'Pages/Schedule',
	component: Schedule,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			story: {
				inline: false,
				iframeHeight: 800,
			},
		},
	},
};

type Story = StoryObj<typeof meta>;

const today = new Date();
const event1 = new Date(today.setHours(16, 0, 0, 0));
const event2 = new Date(today.setHours(19, 0, 0, 0)); 

const schedule = [
	new ScheduleEvent(
		'1',
		ScheduleEventType.Appointment,
		event1,
		new Date(event1.getTime() + 1000 * 60 * 60),
		'Cliente Exemplo',
		'Reunião com equipe',
		{ main_topic: 'Alinhamento', social_network: 'Grupo', specific_questions: 'Sprint' },
		{ cpf: '00000000000', email: 'cliente@example.com', phone_number: null, name: 'Cliente Exemplo', id: 123 },
		{ cpf: '', email: null, phone_number: null, name: 'Facilitador', id: 1 },
		'1',
	),
	new ScheduleEvent(
		'2',
		ScheduleEventType.Meeting,
		event2,
		new Date(event2.getTime() + 1000 * 60 * 30),
		'Cliente Premium',
		'Call com cliente',
		{ main_topic: 'Resultados', social_network: 'Grupo', specific_questions: 'Q4' },
		{ cpf: '11111111111', email: 'premium@example.com', phone_number: null, name: 'Cliente Premium', id: 456 },
		{ cpf: '', email: null, phone_number: null, name: 'Facilitador', id: 1 },
		'1',
	),
];

const onEventClick = (event: ScheduleEvent) => {
	console.log('Evento clicado:', event);
};

const RenderSchedule = () => {
	const luxonToday = DateTime.local().setLocale('pt-BR');
	const [date, setDate] = useState<DateTime>(luxonToday);
	const weekStart = luxonToday.startOf('week');
	const weekEnd = luxonToday.endOf('week');

	return (
		<div style={{
			padding: '24px',
			width: '100%',
			maxWidth: '100%',
			boxSizing: 'border-box',
			minHeight: '100vh',
			overflow: 'visible',
			position: 'relative',
		} as React.CSSProperties}>
			<ScheduleHolder className='w-full'>
				<ScheduleHeader
					type={ScheduleCalendarView.Week}
					date={date}
					weekStart={weekStart}
					weekEnd={weekEnd}
					setDate={setDate}
				/>
				<ScheduleSlots
					type={ScheduleCalendarView.Week}
					weekStart={weekStart}
					weekEnd={weekEnd}
					workHourStart={6}
					workHourEnd={21}
					events={schedule}
					selectedDay={date.day}
					onEventClick={onEventClick}
				/>
			</ScheduleHolder>
		</div>
	);
};

export const Default: Story = {
	render: () => <RenderSchedule />,
};

export default meta;
