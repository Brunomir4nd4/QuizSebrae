import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { ButtonDownload } from './ButtonDownload.component';
import { ProvidersDecorator } from '../../../.storybook/decorators/ProvidersDecorator';

export default {
  title: 'components/Atoms/Button/ButtonDownload',
  component: ButtonDownload,
  tags: ['autodocs'],
  decorators: [ProvidersDecorator],
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof ButtonDownload>;

const Template: StoryFn<React.ComponentProps<typeof ButtonDownload>> = (args) => (
  <div style={{ padding: 20 }}>
    <ButtonDownload {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  icon: '/icon-download-preto.svg',
  text: 'Baixar',
  onClick: () => console.log('ButtonDownload clicked'),
};

export const LongText = Template.bind({});
LongText.args = {
  icon: '/icon-download-preto.svg',
  text: 'Baixar material completo do curso',
  onClick: () => console.log('ButtonDownload clicked'),
};
