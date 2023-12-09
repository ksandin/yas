import type { Meta } from "@storybook/react";
import type { ComponentProps } from "react";
import { useState } from "react";
import type { StrictStoryObj } from "../../.storybook/StrictStoryObj";
import { TextField } from "./TextField";

export default {
  title: "fields/TextField",
  component: TextFieldWithState,
  tags: ["autodocs"],
} satisfies Meta<typeof TextFieldWithState>;

export const Default: StrictStoryObj<typeof TextField> = {
  args: {
    label: "TextField",
    inputProps: {
      placeholder: "Placeholder",
    },
  },
};

export const WithDefaultValue: StrictStoryObj<typeof TextField> = {
  args: {
    value: "Default",
  },
};

export const WithError: StrictStoryObj<typeof TextField> = {
  args: {
    errors: ["Something went wrong"],
  },
};

function TextFieldWithState(props: ComponentProps<typeof TextField>) {
  const [value, setValue] = useState(props.value);
  return <TextField {...props} value={value} onChange={setValue} />;
}
