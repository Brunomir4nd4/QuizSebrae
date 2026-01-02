import React from "react";
import type { Meta, StoryObj } from '@storybook/nextjs';
import { AtendimentoButton } from "./AttendanceButton.component";

const meta: Meta<typeof AtendimentoButton> = {
  title: "components/Atoms/Button/AttendanceButton",
  component: AtendimentoButton,
  tags: ['autodocs'],
  argTypes: {
    text: { control: "text" },
    align: {
      control: { type: "select" },
      options: ["justify-start", "justify-center", "justify-end"],
    },
    disabled: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof AtendimentoButton>;

export const Default: Story = {
  args: {
    text: "Atendimento",
    align: "justify-start",
    disabled: false,
  },
};
