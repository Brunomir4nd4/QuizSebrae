import type { Meta, StoryObj } from '@storybook/nextjs';
import { GroupDetailModal } from './GroupDetailModal.component';
import { ScheduleEventType } from '../Schedule/models/ScheduleEvent';
import { Appointment } from '@/types/IAppointment';

const meta: Meta<typeof GroupDetailModal> = {
	title: 'components/Molecules/Modal/GroupDetailModal',
	component: GroupDetailModal,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		docs: {
			story: {
				inline: false,
				iframeHeight: '600px',
			},
		},
	},
};

export default meta;

type Story = StoryObj<typeof GroupDetailModal>;

const appointmentMock = {
	id: 'g1',
	title: 'Roda de conversa',
	start: new Date(),
	end: new Date(Date.now() + 60 * 60 * 1000),
	type: 'group' as ScheduleEventType,
	client_name: 'João Silva',
	additional_fields: null,
	client: null,
	group: [
		{
			id: 'b1',
			start_time: new Date().toISOString(),
			finish_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
			comments: '',
			additional_fields: null,
			class_id: '1',
			type_id: 1,
			client_id: 1,
			employee_id: 10,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			deleted_at: null,
			client: { id: '1', name: 'João Silva', cpf: '123.456.789-00' },
			employee: {
				id: 10,
				name: 'Facilitador Exemplo',
				cpf: '111.222.333-44',
				email: 'facilitator@example.com',
				phone_number: '11999999999',
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				deleted_at: null,
			},
		},
		{
			id: 'b1',
			start_time: new Date().toISOString(),
			finish_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
			comments: '',
			additional_fields: null,
			class_id: '1',
			type_id: 1,
			client_id: 1,
			employee_id: 10,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			deleted_at: null,
			client: { id: '2', name: 'Maria Oliveira', cpf: '987.654.321-00' },
			employee: {
				id: 10,
				name: 'Facilitador Exemplo',
				cpf: '111.222.333-44',
				email: 'facilitator@example.com',
				phone_number: '11999999999',
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				deleted_at: null,
			},
		},
	] as Appointment[],
	class_id: '1',
	employee: {
		id: 10,
		name: 'Facilitador Exemplo',
		cpf: '111.222.333-44',
		email: 'facilitator@example.com',
		phone_number: '11999999999',
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		deleted_at: null,
	},
};

export const Default: Story = {
	args: {
		open: true,
		onClose: () => {},
		appointment: appointmentMock,
		role: 'facilitator',
	},
};
