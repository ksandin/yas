import { useContext } from "react";
import { createContext } from "react";
import { dark } from "@yas/style/themes/dark.css";
import { light } from "@yas/style/themes/light.css";
import { useMediaQuery } from "@yas/ui";

export type ThemeName = keyof typeof themeClassNames;

const themeClassNames = { dark, light };
const themeNames = Object.keys(
  themeClassNames,
) as (keyof typeof themeClassNames)[];

export const usePreferredTheme = (): ThemeName =>
  useMediaQuery("(prefers-color-scheme: dark)") ? "dark" : "light";

export const ThemeContext = createContext<[ThemeName, () => void]>([
  "light",
  () => {},
]);

export function useThemeNames() {
  return themeNames;
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function useThemeClassName() {
  const [themeName] = useTheme();
  return themeClassNames[themeName];
}
