import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';

import { StyledSwitch } from './StyledSwitch.component';

const meta = {
	title: 'components/Atoms/Switch/StyledSwitch',
	component: StyledSwitch,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		active: {
			control: 'boolean',
		},
		isEditingAllowed: {
			control: 'boolean',
		},
		isEnrollCanceled: {
			control: 'boolean',
		},
	},
	args: {
		active: false,
		classId: '1',
		studentId: '1',
		activityId: '1',
		isEditingAllowed: true,
		isEnrollCanceled: false,
	},
} satisfies Meta<typeof StyledSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inativo: Story = {};
	
export const Ativo: Story = {
	args: {
		active: true,
	},
};

export const DesabilitadoInativo: Story = {
	args: {
		isEditingAllowed: false,
		active: false,
	},
};

export const DesabilitadoAtivo: Story = {
	args: {
		isEditingAllowed: false,
		active: true,
	},
};
