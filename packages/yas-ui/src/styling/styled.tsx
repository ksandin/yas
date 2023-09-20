import type {
  ReactNode,
  ElementType,
  ReactElement,
  ComponentProps,
} from "react";
import type { ComplexStyleRule } from "@vanilla-extract/css";
import type { RuntimeFn, RecipeVariants } from "@vanilla-extract/recipes";
import { createElement } from "react";
import clsx from "clsx";
import type { Atoms } from "./atoms.css";
import { atoms } from "./atoms.css";

interface RecipeImplementationProps {
  className?: string;
  children?: ReactNode;
}

interface RecipeComponentProps<Recipe extends RuntimeFn<VariantGroups>>
  extends RecipeImplementationProps {
  variants?: RecipeVariants<Recipe>;
  sx?: Atoms;
}

/**
 * Syntax sugar for creating a @vanilla-extract based
 * component without having to do the type and props wiring.
 */
export function styled<
  Implementation extends ElementType<RecipeImplementationProps>,
  Recipe extends RuntimeFn<VariantGroups>,
>(implementation: Implementation, recipe?: Recipe) {
  type AdditionalProps = Omit<
    ComponentProps<Implementation>,
    keyof RecipeComponentProps<Recipe>
  >;
  function RecipeComponent({
    variants,
    className: inlineClassName,
    sx,
    ...additionalProps
  }: RecipeComponentProps<Recipe> & AdditionalProps): ReactElement {
    const className = clsx(
      recipe?.(variants),
      sx ? atoms(sx) : undefined,
      inlineClassName,
    );
    return createElement(implementation, {
      className,
      ...additionalProps,
    });
  }

  return RecipeComponent;
}

type RecipeStyleRule = ComplexStyleRule | string;
type VariantDefinitions = Record<string, RecipeStyleRule>;
type VariantGroups = Record<string, VariantDefinitions>;
type VariantName<Recipe extends RuntimeFn<VariantGroups>> = `${string &
  keyof Exclude<RecipeVariants<Recipe>, undefined>}`;

/**
 * Selects the props corresponding to the variant names of the given recipe
 */
export function variantProps<
  Props extends Record<string, unknown>,
  Recipe extends RuntimeFn<VariantGroups>,
>(props: Props, recipe: Recipe): Pick<Props, VariantName<Recipe>> {
  const selected = {} as Pick<Props, VariantName<Recipe>>;
  for (const variant of recipe.variants() as VariantName<Recipe>[]) {
    selected[variant] = props[variant];
  }
  return selected;
}
