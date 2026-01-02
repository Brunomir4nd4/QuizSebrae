import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import HomeFacilitador from './HomeFacilitador.component';
import { ProvidersDecorator } from '../../../.storybook/decorators/ProvidersDecorator';
import { ThemeSettings } from '@/types/IThemeSettings';

export default {
  title: 'Pages/Home/HomeFacilitador',
  component: HomeFacilitador,
  tags: ['autodocs'],
  decorators: [ProvidersDecorator],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof HomeFacilitador>;

const Template: StoryFn<React.ComponentProps<typeof HomeFacilitador>> = (args) => (
  <div style={{ padding: '40px', background: '#f3f4f6', width: '100vw', minHeight: '100vh' }}>
    <HomeFacilitador {...args} />
  </div>
);

const settings: ThemeSettings = {
  facilitator: {
    enable_room: true,
    enable_calendar: true,
  },
  participant: {
    enable_room: true,
    enable_calendar: true,
  },
  supervisor: {
    enable_room: true,
    enable_calendar: true,
  },
  maintenance_mode: false,
  site_url: 'https://example.com',
  whatsapp_message_to_facilitator: 'Olá, preciso de ajuda!',
  whatsapp_message_to_participant: 'Olá participante!',
  whatsapp_support_link: 'https://wa.me/1234567890',
  maintenance_mode_general_hub_active: false,
  maintenance_mode_general_hub_title: 'Manutenção Programada',
  maintenance_mode_general_hub_message: 'O sistema está em manutenção.',
  maintenance_mode_general_hub_description: 'Estamos trabalhando para melhorar nossos serviços. Por favor, tente novamente mais tarde.',
};

export const Default = Template.bind({});
Default.args = {
  settings,
};
