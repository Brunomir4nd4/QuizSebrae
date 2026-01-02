import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import ConfirmDeleteSubmissionModal from './index';
import { ProvidersDecorator } from '../../../.storybook/decorators/ProvidersDecorator';

export default {
  title: 'components/Molecules/Modal/ConfirmDeleteSubmission',
  component: ConfirmDeleteSubmissionModal,
  tags: ['autodocs'],
  decorators: [ProvidersDecorator],
  parameters: {
    layout: 'fullscreen',
    docs: {
			story: {
				inline: false,
				iframeHeight: '600px',
			},
		},
  },
} as Meta<typeof ConfirmDeleteSubmissionModal>;

const Template: StoryFn<React.ComponentProps<typeof ConfirmDeleteSubmissionModal>> = (args) => (
    <ConfirmDeleteSubmissionModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  open: true,
  handleClose: () => console.log('handleClose called'),
  deleteSubmission: () => console.log('deleteSubmission called'),
};
