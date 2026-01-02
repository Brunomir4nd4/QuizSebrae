import React from "react";
import { CancelRegistrationButton } from "./CancelRegistrationButton.component";

const meta = {
  title: "components/Atoms/Button/CancelRegistrationButton",
  tags: ['autodocs'],
  component: CancelRegistrationButton,
  argTypes: {
    text: { control: "text" },
    align: {
      control: { type: "select" },
      options: ["justify-start", "justify-center", "justify-end"],
    },
    disabled: { control: "boolean" },
    enrollId: { control: "text" },
    token: { control: "text" },
  },
};
export default meta;

import type { StoryFn } from "@storybook/nextjs";
import type { Props } from "./CancelRegistrationButton.component";

const Template: StoryFn<Props> = (args: Props) => <CancelRegistrationButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  text: "Cancelar matrícula",
  align: "justify-start",
  disabled: false,
  enrollId: "123",
  token: "token_exemplo",
};
