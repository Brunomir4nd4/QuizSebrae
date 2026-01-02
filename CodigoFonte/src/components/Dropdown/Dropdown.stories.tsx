import React, { useState } from "react";
import { Dropdown } from "./Dropdown.component";
import type { Props } from "./Dropdown.interface";

const meta = {
  title: "components/Atoms/Dropdown/Dropdown",
  tags: ['autodocs'],
  component: Dropdown,
  argTypes: {
    startItem: { control: "text" },
    years: { control: "object" },
  },
};
export default meta;

import type { StoryFn } from "@storybook/nextjs";

const Template: StoryFn<Omit<Props, 'onClick'>> = (args) => {
  const [selected, setSelected] = useState<string>("");
  return (
    <div>
      <Dropdown {...args} onClick={setSelected} />
      <div style={{ marginTop: 16 }}>Selecionado: {selected}</div>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  startItem: "Selecione o ano",
  years: ["2023", "2024", "2025"],
};
