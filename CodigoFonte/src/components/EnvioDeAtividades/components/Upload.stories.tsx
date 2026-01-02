import type { Meta, StoryObj } from '@storybook/nextjs';
import FileUpload from './Upload.component';

const meta: Meta<typeof FileUpload> = {
  title: 'components/Atoms/Envio/Upload',
  component: FileUpload,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  args: {
    submissionId: 1,
    islastSubmition: false,
  },
};
