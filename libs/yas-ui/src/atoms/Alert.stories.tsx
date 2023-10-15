import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./Alert";

export default {
  title: "atoms/Alert",
  component: Alert,
  tags: ["autodocs"],
} satisfies Meta<typeof Alert>;

export const Default: StoryObj<Meta<typeof Alert>> = {
  args: { children: "Alert!" },
};
