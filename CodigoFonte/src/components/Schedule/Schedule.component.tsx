'use client';

import { useState, type FunctionComponent, useEffect } from 'react';

import { ScheduleProps } from './Schedule.interface';
import { ScheduleHolder } from './Schedule.styles';
import { ScheduleHeader } from './components/ScheduleHeader';
import { ScheduleSlots } from './components/ScheduleSlots';
import { ScheduleEventType } from './models/ScheduleEvent';
import { Loader } from '../Loader';
import { useScheduleContext } from '@/app/providers/ScheduleProvider';
import { ScheduleCalendarView } from './utils/ScheduleCalendarView';
import { useUserContext } from '@/app/providers/UserProvider';
import { useRouter } from 'next/navigation';
import { NotifyModal } from '../NotifyModal';
import { GlobalThis } from 'global-this';

interface BookingType {
	'1': ScheduleEventType.Block;
	'2': ScheduleEventType.Meeting;
	'3': ScheduleEventType.Appointment;
	'4': ScheduleEventType.Group;
}

export const BOOKING_TYPE: BookingType = {
	'1': ScheduleEventType.Block,
	'2': ScheduleEventType.Meeting,
	'3': ScheduleEventType.Appointment,
	'4': ScheduleEventType.Group,
};

/**
 * **Schedule**
 *
 * ### 🧩 Funcionalidade
 * - Agenda interativa para visualização e gerenciamento de horários.
 * - Alterna entre visualizações diária/semanal baseado na tela.
 * - Gerencia eventos via ScheduleContext, sincroniza com backend.
 * - Redireciona se calendário desabilitado na turma.
 * - Mostra loader ou erro se dados indisponíveis.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <Schedule
 *   type="facilitator"
 *   session={session}
 *   workHourStart={6}
 *   workHourEnd={21}
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - ScheduleHolder container.
 * - ScheduleHeader com navegação.
 * - ScheduleSlots em grid.
 * - Responsivo: dia <901px, semana >=901px.
 *
 * @component
 */
export const Schedule: FunctionComponent<ScheduleProps> = ({
	type,
	focus,
	events,
	session,
	workHourStart = 6,
	workHourEnd = 21,
	onEventClick = undefined,
	onEventHover = undefined,
	onSlotClick = undefined,
	onSlotHover = undefined,
}: ScheduleProps) => {
	const [supportName, setSupportName] = useState('o suporte da plataforma');

	useEffect(() => {
		const name = (globalThis as GlobalThis).projectName ?? '';

		if (name === 'sebrae') {
			setSupportName('o Sebrae');
		} else if (name === 'essencia') {
			setSupportName('o suporte da Essência');
		}
	}, []);

	const { schedule, date, loading, setDate } = useScheduleContext();
	const { classId, classesData } = useUserContext();
	const router = useRouter();

	const weekStart = date
		.minus({ days: date.weekday - 1 })
		.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
	const weekEnd = date
		.plus({ days: 7 - date.weekday })
		.set({ hour: 23, minute: 59, second: 59, millisecond: 999 });

	const [screenWidth, setScreenWidth] = useState(0);

	useEffect(() => {
		const localStorageClassId = localStorage.getItem('class_id');
		if (session.user.role[0] === 'supervisor' && !localStorageClassId) {
			localStorage.setItem('class_id', classId ?? '');
		}
		setScreenWidth(window.innerWidth);
	}, []);

	useEffect(() => {
		const handleResize = () => {
			setScreenWidth(window.innerWidth);
		};

		// Add event listener for window resize
		window.addEventListener('resize', handleResize);

		// Remove event listener when the component is unmounted
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	if (
		classesData &&
		classId &&
		classesData[classId]?.enable_calendar === false
	) {
		router.push('/home');
		return <></>;
	}

	return (
		<ScheduleHolder className='w-full'>
			<ScheduleHeader
				type={
					screenWidth < 901
						? ScheduleCalendarView.Day
						: ScheduleCalendarView.Week
				}
				date={date}
				weekStart={weekStart}
				weekEnd={weekEnd}
				setDate={setDate}
			/>
			{schedule && !loading && (
				<ScheduleSlots
					type={
						screenWidth < 901
							? ScheduleCalendarView.Day
							: ScheduleCalendarView.Week
					}
					weekStart={weekStart}
					weekEnd={weekEnd}
					workHourStart={workHourStart}
					workHourEnd={workHourEnd}
					events={schedule}
					selectedDay={date.day}
					onEventClick={onEventClick}
				/>
			)}

			{!schedule && !loading && (
				<NotifyModal
					title={'Atenção'}
					message={`Não foi possível obter os dados da agenda. <br> <strong> Tente novamente ou entre em contato com ${supportName}.</strong>`}
					logout={true}
					whats={false}
				/>
			)}
			{loading && <Loader />}
		</ScheduleHolder>
	);
};
