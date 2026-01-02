import type { Meta, StoryObj } from '@storybook/nextjs';
import { DetailModal } from './DetailModal.component';

const meta: Meta<typeof DetailModal> = {
	title: 'components/Molecules/Modal/DetailModal',
	component: DetailModal,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		docs: {
			story: {
				inline: false,
				iframeHeight: '700px',
			},
		},
	},
	argTypes: {
		open: {
			control: 'boolean',
		},
	},
};

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		open: true,
		onClose: () => {},
		title: 'Detalhes da Mentoria',
		name: 'João Silva',
		start: '10:00',
		end: '11:00',
		interval: '60',
		subject: 'Marketing Digital',
		social: 'Instagram, Facebook',
		description: 'Estratégias para aumentar o engajamento nas redes sociais',
		booking_id: '123',
		client_cpf: '123.456.789-00',
		token: 'sample-token',
		className: 'Turma A',
		role: 'participant',
	},
};

export const SupervisorView: Story = {
	args: {
		...Default.args,
		role: 'supervisor',
	},
};

export default meta;
