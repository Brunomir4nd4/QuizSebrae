import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { CancelRegistrationModal } from './CancelRegistration.component';

export default {
  title: 'components/Molecules/Modal/CancelRegistration',
  component: CancelRegistrationModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
			story: {
				inline: false,
				iframeHeight: '600px',
			},
		},
  },
} as Meta<typeof CancelRegistrationModal>;

const Template: StoryFn<React.ComponentProps<typeof CancelRegistrationModal>> = (args) => (
    <CancelRegistrationModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  modalOpen: true,
  enrollId: 'enroll-123',
  token: 'token-abc',
};
