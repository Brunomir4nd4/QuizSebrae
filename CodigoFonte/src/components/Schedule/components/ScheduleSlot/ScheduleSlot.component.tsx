import { FunctionComponent } from 'react';
import { DateTime } from 'luxon';

import {
	IconEventAppointment,
	IconEventBlock,
	IconEventMeeting,
} from '@/resources/icons';

import { ScheduleSlotProps } from './ScheduleSlot.interface';
import {
	ScheduleSlotContent,
	ScheduleSlotHolder,
	ScheduleSlotInterval,
} from './ScheduleSlot.styles';
import { ScheduleEvent, ScheduleEventType } from '../../models/ScheduleEvent';
import React from 'react';
import { DetailModal } from '@/components/DetailModal';
import { unblockScheduleTimeBff } from '@/app/services/bff/ScheduleService';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ModalBlockTime } from '@/components/ModalBlockTime';
import { GroupDetailModal } from '@/components/GroupDetailModal';

/**
 * **ScheduleSlot**
 *
 * ### 🧩 Funcionalidade
 * - Slot de agendamento na grade, mostra info do evento.
 * - Permite abrir modais de detalhes, cancelar bloqueios, navegar para salas.
 * - Calcula duração e ícones baseados no tipo de evento.
 * - Integra com contexto do usuário e modais.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <ScheduleSlot
 *   event={eventData}
 *   spanCol={1}
 *   spanRow={2}
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - ScheduleSlotHolder com grid positioning.
 * - Ícones por tipo (EventIcon).
 * - Cursor pointer, título tooltip.
 *
 * @component
 */
export const ScheduleSlot: FunctionComponent<ScheduleSlotProps> = ({
	event,
	spanCol,
	spanRow,
}: ScheduleSlotProps) => {
	const clientName = event.client_name;
	const startHour = DateTime.fromJSDate(event.start).toFormat('HH:mm');
	const endHour = DateTime.fromJSDate(event.end).toFormat('HH:mm');
	const eventDuration = DateTime.fromJSDate(event.end).diff(
		DateTime.fromJSDate(event.start),
		'hours',
	).hours;
	const session = useSession();
	const router = useRouter();
	const [openConfirm, setOpenConfirm] = React.useState(false);
	const [openCancelBlockTime, setOpenCancelBlockTime] = React.useState(false);
	const [booking, setBooking] = React.useState<ScheduleEvent | null>(null);

	if (!session.data) {
		return <></>;
	}

	const EventIcon = () => {
		switch (event.type) {
			case ScheduleEventType.Group:
				return <IconEventAppointment />;
			case ScheduleEventType.Appointment:
				return <IconEventAppointment />;
			case ScheduleEventType.Block:
				return <IconEventBlock />;
			case ScheduleEventType.Meeting:
				return <IconEventMeeting />;
			default:
				return null;
		}
	};

	const handleOpenConfirm = async () => {
		if (!session.data?.user.token) {
			return;
		}

		if (event.type === ScheduleEventType.Meeting) {
			router.push('/sala-de-reuniao');
		}

		setBooking(event);
		setOpenConfirm(true);
	};
	const handleCloseConfirm = () => setOpenConfirm(false);

	return (
		<>
			<ScheduleSlotHolder
				className={event.type}
				style={{
					gridColumnStart: spanCol,
					gridRowStart: spanRow,
					gridRowEnd: `span ${eventDuration * 2}`,
					cursor: 'pointer',
				}}
				title={event.start.toISOString()}
				onClick={
					event.type !== ScheduleEventType.Block
						? handleOpenConfirm
						: () => setOpenCancelBlockTime(true)
				}>
				<ScheduleSlotInterval>
					{startHour} - {endHour}
				</ScheduleSlotInterval>

				<ScheduleSlotContent>
					<EventIcon />
					<h1>
						{event.type !== ScheduleEventType.Block ? clientName : 'Bloqueado'}
					</h1>
				</ScheduleSlotContent>
			</ScheduleSlotHolder>

			{booking &&
				booking.type === ScheduleEventType.Appointment &&
				(event?.client?.cpf || event?.client?.email) && (
					<DetailModal
						open={openConfirm}
						onClose={handleCloseConfirm}
						title={
							event.type !== ScheduleEventType.Appointment
								? 'Encontro Coletivo'
								: 'Mentoria Individual'
						}
						name={booking.client_name}
						start={startHour}
						end={endHour}
						className={booking.class_id.toString()}
						booking_id={`${booking.id}`}
						client_email={event.client.email || ''}
						client_cpf={event.client.cpf}
						token={session.data?.user.token}
						interval={`15`}
						subject={`${booking?.additional_fields?.main_topic}`}
						social={`${booking?.additional_fields?.social_network}`}
						description={`${booking?.additional_fields?.specific_questions}`}
						role={session?.data?.user?.role[0]}
					/>
				)}

			{booking && booking.type === ScheduleEventType.Group && (
				<GroupDetailModal
					open={openConfirm}
					onClose={handleCloseConfirm}
					appointment={booking}
					role={session?.data?.user?.role[0]}
				/>
			)}

			<ModalBlockTime
				open={openCancelBlockTime}
				onClose={() => setOpenCancelBlockTime(false)}
				blockCallback={async () => await unblockScheduleTimeBff(event.id)}
				type={'unblock'}
			/>
		</>
	);
};
