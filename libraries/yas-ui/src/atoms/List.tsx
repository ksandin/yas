import { styled } from "@yas/style";
import type { ComponentProps, ReactNode } from "react";
import { Stack } from "../layout/Stack";
import { Text } from "./Text";
import { list, item, icon, secondaryContent } from "./List.css";

export const List = styled("ul", list);

export const ListItem = styled("li", item);

export const ListItemIcon = styled("div").attrs({ className: icon });

export const ListItemText = styled(
  ({
    primary,
    secondary,
    ...props
  }: ComponentProps<typeof Stack> & {
    primary?: ReactNode;
    secondary?: ReactNode;
  }) => (
    <Stack {...props}>
      {primary ? <ListItemPrimaryText>{primary}</ListItemPrimaryText> : null}
      {secondary ? (
        <ListItemSecondaryText>{secondary}</ListItemSecondaryText>
      ) : null}
    </Stack>
  ),
);

export const ListItemPrimaryText = styled(Text).attrs({ variant: "h5" });

export const ListItemSecondaryText = styled(Text).attrs({ variant: "caption" });

export const ListItemSecondaryContent = styled("div").attrs({
  className: secondaryContent,
});
