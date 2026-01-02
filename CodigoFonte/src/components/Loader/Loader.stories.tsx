import React from "react";
import { Loader } from "./Loader.component";

const meta = {
  tags: ['autodocs'],
  title: "components/Atoms/Loader/Loader",
  component: Loader,
};
export default meta;
import type { StoryFn } from "@storybook/nextjs";

const Template: StoryFn = () => (
  <div style={{ height: "100px" }}>
    <Loader />
  </div>
);

export const Default = Template.bind({});
