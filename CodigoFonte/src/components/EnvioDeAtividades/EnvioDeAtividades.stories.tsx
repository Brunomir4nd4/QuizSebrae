import React from "react";
import EnvioDeAtividades from "./EnvioDeAtividades.component";
import type { StoryFn } from "@storybook/nextjs";
import type { EnvioDeAtividadesProps } from "./EnvioDeAtividades.component";

const meta = {
  tags: ['autodocs'],
  title: 'components/Molecules/Envio/EnvioDeAtividades',
  component: EnvioDeAtividades,
  parameters: { layout: 'fullscreen' },
};
export default meta;

const Template: StoryFn<EnvioDeAtividadesProps> = (args: EnvioDeAtividadesProps) => (
  <div
    style={{
      padding: 32,
      boxSizing: 'border-box',
      background: '#f3f4f6',
      overflowX: 'auto',
      minWidth: 400,
      width: '100vw',
    }}
  >
    <EnvioDeAtividades {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  id: 1,
  islastSubmition: false,
  sent: false,
  items: [
    { id: '1', name: 'Arquivo.pdf', type: 'pdf', url: '#' },
    { id: '2', name: 'Imagem.png', type: 'image', url: '#' },
  ],
  feedback: {
    note: 4,
    comment: 'Muito bom!',
  },
};

export const ComFeedback = Template.bind({});
ComFeedback.args = {
  ...Default.args,
  sent: true,
  feedback: { note: 5, comment: 'Excelente trabalho!' },
};

export const SemFeedback = Template.bind({});
SemFeedback.args = {
  ...Default.args,
  sent: true,
  feedback: undefined,
};

export const EmOutroCanal = Template.bind({});
EmOutroCanal.args = {
  ...Default.args,
  sent: true,
  items: [],
};
