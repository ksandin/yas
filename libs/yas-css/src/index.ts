// This is an encapsulation of vanilla-extract modules.
// You should never use vanilla-extract directly (enforced via linting).

// Re-export our chosen styling libraries as-is
export * from "@vanilla-extract/css";
export * from "clsx";

// Export our custom utilities
import { recipe } from "@vanilla-extract/recipes";
import { createStyledFactory } from "vanilla-extract-styled";
import { createAtomicRecipeFactory } from "vanilla-extract-atomic-recipe";
import * as tokens from "./tokens";
import { atoms } from "./atoms.css";

const styled = createStyledFactory(atoms);
const atomicRecipe = createAtomicRecipeFactory(atoms);

export { tokens, styled, recipe, atomicRecipe };
export { destructureVariantProps, variantProps } from "vanilla-extract-styled";
export * from "./atoms.css";
