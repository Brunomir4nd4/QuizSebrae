import type { Meta, StoryObj } from '@storybook/nextjs';
import { ConflictModal } from './ConflictModal.component';

const meta: Meta<typeof ConflictModal> = {
	title: 'components/Molecules/Modal/ConflictModal',
	component: ConflictModal,
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
	},
};

export default meta;
