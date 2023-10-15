import type { ComponentProps, ReactNode } from "react";
import { styled } from "@yas/css";
import { Alert } from "../atoms/Alert";
import type { ControlFactory } from "./FormControlLabel";
import { FormControlLabel } from "./FormControlLabel";
import { FormControl } from "./FormControl";
import type { FieldProps } from "./rcf";

export type BaseFieldProps = Pick<
  FieldProps<unknown>,
  "label" | "info" | "name" | "errors"
> &
  Pick<
    ComponentProps<typeof FormControl>,
    "onFocus" | "onBlur" | "className" | "style" | "sx"
  > & {
    actions?: ReactNode;
  } & ControlProps;

type ControlProps = { children: ReactNode } | { control: ControlFactory };

export function BaseField({
  name,
  label = name,
  info,
  errors,
  actions,
  onFocus,
  onBlur,
  className,
  style,
  sx,
  ...rest
}: BaseFieldProps) {
  const controlFactory = "control" in rest ? rest.control : undefined;
  const controlChildren = "children" in rest ? rest.children : undefined;
  return (
    <FormControl
      {...{
        onFocus,
        onBlur,
        className,
        style,
        sx,
      }}
    >
      <FormControlLabel control={controlFactory}>{label}</FormControlLabel>
      {info && <FieldInfo>{info}</FieldInfo>}
      {actions}
      {controlChildren}
      {errors && errors.length > 0 && (
        <Alert variant="error">{errors.join(", ")}</Alert>
      )}
    </FormControl>
  );
}

const FieldInfo = styled("div");
