// This is an encapsulation of vanilla-extract modules.
// You should never use vanilla-extract directly (enforced via linting).

import { style, globalStyle, keyframes } from "@vanilla-extract/css";
import { recipe as unsafeRecipe } from "@vanilla-extract/recipes";
import { createStyledFactory } from "vanilla-extract-styled";
import { createRecipeFactory } from "vanilla-extract-recipe-factory";
import * as tokens from "./tokens";
import { atoms } from "./atoms.css";
import { themeClassNames } from "./theme.css";

// Our convention is to prioritize relying on our atomic CSS framework.
export const styled = createStyledFactory(atoms);
export const recipe = createRecipeFactory(atoms);
export { tokens, atoms, themeClassNames };
export { destructureVariantProps, variantProps } from "vanilla-extract-styled";
export type { Atoms } from "./atoms.css";
export type { ThemeName } from "./theme.css";

// But we provide non-atomic escape hatches via a clear naming convention.
export const unsafe = { style, keyframes, globalStyle, recipe: unsafeRecipe };
