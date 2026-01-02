import type { Meta, StoryObj } from '@storybook/nextjs';
import { RemoveParticipantModal } from './RemoveParticipantModal.component';
import { fn } from 'storybook/test';


const meta: Meta<typeof RemoveParticipantModal> = {
  title: 'components/Molecules/Modal/RemoveParticipantModal',
  component: RemoveParticipantModal,
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
      action: 'fechar modal de remover participante',
    },
    mainModalClose: {
      action: 'fechar modal principal',
    },
    booking_id: {
      control: 'text',
    },
    class_id: {
      control: 'text',
    },
    group_id: {
      control: 'text',
    },
  },
  args: {
    open: true,
    onClose: fn(),
    mainModalClose: fn(),
    booking_id: 'participant-001',
    class_id: 'class-001',
    group_id: 'group-001',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
  },
};


