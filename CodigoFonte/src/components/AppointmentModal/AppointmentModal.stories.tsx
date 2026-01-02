import type { Meta, StoryObj } from '@storybook/nextjs';
import { AppointmentModal } from './AppointmentModal.component';

const meta: Meta<typeof AppointmentModal> = {
	title: 'components/Molecules/Modal/AppointmentModal',
	component: AppointmentModal,
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
		facilitator: {
			description: 'Nome do facilitador da mentoria.',
		},
	},
};

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		open: true,
		onClose: () => {},
		facilitator: 'Maria Santos',
		appointment: {
			type_id: 1,
			class_id: '123',
			course_name: 'Marketing Digital',
			employee_id: 456,
			start_time: '2024-01-15 10:00:00',
			finish_time: '2024-01-15 11:00:00',
			additional_fields: {
				main_topic: 'Estratégias de marketing',
				social_network: 'Instagram',
				specific_questions: 'Como aumentar o engajamento?',
			},
		},
		setAppointments: () => {},
	},
};

export default meta;
