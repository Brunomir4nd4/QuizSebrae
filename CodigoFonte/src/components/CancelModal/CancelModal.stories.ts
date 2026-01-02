import type { Meta, StoryObj } from '@storybook/nextjs';
import { CancelModal } from './CancelModal.component';
import { fn } from 'storybook/test';

const meta: Meta<typeof CancelModal> = {
	title: 'components/Molecules/Modal/CancelModal',
	component: CancelModal,
	parameters: {
		layout: 'centered',
		docs: {
			story: {
				inline: false,
				iframeHeight: '600px',
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		open: {
			control: 'boolean',
		},
		onClose: {
			action: 'fechar modal',
		},
		mainModalClose: {
			action: 'fechar modal principal',
		},
		booking_id: {
			control: 'text',
		},
	},
	args: {
		open: false,
		onClose: fn(),
		mainModalClose: fn(),
		booking_id: '123',
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Aberta: Story = {
	args: {
		open: true,
	},
};

