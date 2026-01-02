import React from "react";
import NotifyDot from "./index";

const meta = {
  title: "components/Atoms/Notify/NotifyDot",
  tags: ['autodocs'],
  component: NotifyDot,
  argTypes: {
    position: {
      control: { type: "select" },
      options: ["top-right-sm", "top-left-sm", "top-right-lg", "top-left-lg"],
    },
  },
};
export default meta;

import type { StoryFn } from "@storybook/nextjs";

const Template: StoryFn = (args) => (
  <div style={{ position: "relative", width: 60, height: 60, background: "#eee", borderRadius: 8 }}>
    <NotifyDot {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  position: "top-right-sm",
};
