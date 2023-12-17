import { Container, DialogOutlet, Stack } from "@yas/ui";
import { Outlet as RouterOutlet } from "react-router-dom";
import { dark } from "@yas/style/themes/dark.css";
import { light } from "@yas/style/themes/light.css";
import { clsx } from "@yas/style";
import { useTheme } from "../hooks/useTheme";
import { Menu } from "./Menu";
import { layout } from "./Layout.css";

const themeClassNames = {
  dark,
  light,
};

export function Layout() {
  const [theme] = useTheme();
  return (
    <div className={clsx(themeClassNames[theme], layout)}>
      <Container as={Stack} asProps={{ gap: "#3", sx: { flex: 1, p: "#5" } }}>
        <Menu />
        <Stack sx={{ flex: 1 }}>
          <RouterOutlet />
        </Stack>
      </Container>
      <DialogOutlet />
    </div>
  );
}
