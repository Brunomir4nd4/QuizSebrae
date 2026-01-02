import type { Meta, StoryObj } from '@storybook/nextjs';
import { CancelMatriculaModal } from './CancelMatriculaModal.component';

const meta: Meta<typeof CancelMatriculaModal> = {
	title: 'components/Molecules/Modal/CancelMatriculaModal',
	component: CancelMatriculaModal,
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

type Story = StoryObj<typeof CancelMatriculaModal>;

export const Default: Story = {
	args: {
		title: 'cancelamento de matrícula',
		subtitle: 'Confirme a ação',
		message: 'Deseja realmente cancelar a matrícula deste participante?',
		studentName: 'João Silva',
		studentPhone: '5511999999999',
		modalOpen: true,
	},
};
