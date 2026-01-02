import type { Meta, StoryObj } from '@storybook/nextjs';
import { ConfirmModal } from './ConfirmModal.component';

const meta: Meta<typeof ConfirmModal> = {
	title: 'components/Molecules/Modal/ConfirmModal',
	component: ConfirmModal,
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
	},
};

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		open: true,
		onClose: () => {},
		week: 'SEG',
		start: '10:00',
		number: '15',
	},
};

export default meta;
