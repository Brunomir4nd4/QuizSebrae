import type { Meta, StoryObj } from '@storybook/nextjs';
import { ModalBlockTime } from './ModalBlockTime.component';
import { Appointment } from '@/types/IAppointment';

const meta: Meta<typeof ModalBlockTime> = {
	title: 'components/Molecules/Modal/ModalBlockTime',
	component: ModalBlockTime,
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
	argTypes: {
		open: {
			control: 'boolean',
		},
		type: {
			control: 'radio',
			options: ['block', 'unblock'],
		},
	},
};

type Story = StoryObj<typeof meta>;

// Story para bloquear horário
export const BlockTime: Story = {
	args: {
		open: true,
		onClose: () => {},
		blockCallback: async () => ({
            status: 201,
            message: 'Horário bloqueado com sucesso',
            data: {
                id: 1,
                start_time: '2024-01-15 10:00:00',
                finish_time: '2024-01-15 11:00:00',
                comments: 'Horário bloqueado',
                employee_id: 123,
            } as unknown as Appointment,
        }),
		type: 'block',
		blockTime: {
			start_date_time: '2024-01-15 10:00:00',
			end_date_time: '2024-01-15 11:00:00',
			time_blocked: 'true',
		},
	},
};

// Story para desbloquear horário
export const UnblockTime: Story = {
	args: {
		open: true,
		onClose: () => {},
		blockCallback: async () => ({
            status: 201,
            message: 'Horário bloqueado com sucesso',
            data: {
                id: 1,
                start_time: '2024-01-15 10:00:00',
                finish_time: '2024-01-15 11:00:00',
                comments: 'Horário bloqueado',
                employee_id: 123,
            } as unknown as Appointment,
        }),
		type: 'unblock',
	},
};


export default meta;
