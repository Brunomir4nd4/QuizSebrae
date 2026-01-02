import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import { FileTemplateInput, FileTemplateInputProps } from './index';

const meta = {
	title: 'components/Atoms/Input/FileTemplateInput',
	component: FileTemplateInput,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		hasFile: { control: 'boolean' },
		fileName: { control: 'text' },
		fileUrl: { control: 'text' },
		onUpload: { action: 'file uploaded' },
		onRemove: { action: 'file removed' },
	},
	args: {
		hasFile: false,
		fileName: 'template.pdf',
		fileUrl: 'https://example.com/template.pdf',
		onUpload: fn(),
		onRemove: fn(),
	},
} satisfies Meta<typeof FileTemplateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
	args: { hasFile: false },
};

export const WithFile: Story = {
	args: { hasFile: true },
};
