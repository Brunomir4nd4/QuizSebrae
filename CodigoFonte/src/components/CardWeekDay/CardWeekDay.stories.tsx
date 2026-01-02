import React, { useState } from "react";
import { CardWeekDay } from "./CardWeekDay.component";
import type { Props } from "./CardWeekDay.interface";

const meta = {
  title: "components/Atoms/Card/CardWeekDay",
  tags: ['autodocs'],
  component: CardWeekDay,
  argTypes: {
    availableDate: { control: "text" },
    active: { control: "boolean" },
    disabled: { control: "boolean" },
    isDrawerView: { control: "boolean" },
  },
};
export default meta;

import type { StoryFn } from "@storybook/nextjs";

const Template: StoryFn<Omit<Props, 'setConsultancyDate' | 'consultancyDate'>> = (args) => {
  const [consultancyDate, setConsultancyDate] = useState<string | null | undefined>(null);
  return (
    <div style={{ maxWidth: 130 }}>
      <CardWeekDay {...args} setConsultancyDate={setConsultancyDate} consultancyDate={consultancyDate} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  availableDate: new Date().toISOString().slice(0, 10),
  active: false,
  disabled: false,
  isDrawerView: false,
};
