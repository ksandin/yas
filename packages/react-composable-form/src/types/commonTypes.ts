import type { AnyZodObject, output, ZodEffects, ZodType } from "zod";
import type { ZodRawShape } from "zod/lib/types";

export type FormSchema = ValueType;

export type ValueType<T = any> = ZodType<T>;

export type AnyError = unknown;

export type FormValidationMode = "change" | "blur" | "submit";

export type inferValue<Type extends ValueType> = output<Type>;

export interface FormState<Schema extends FormSchema> {
  localErrors: FormErrorState<Schema>;
  externalErrors: FormErrorState<Schema>;
  combinedErrors: FormErrorState<Schema>;
  data: inferValue<Schema>;
}

export type GetShapeFromSchema<T extends ValueType> = T extends AnyZodObject
  ? T["shape"]
  : T extends ZodEffects<infer U>
  ? GetShapeFromSchema<U>
  : ZodRawShape;

export type FieldNames<Schema extends FormSchema> = `${string &
  keyof GetShapeFromSchema<Schema>}`;

export type FieldErrors<Schema extends FormSchema> = Partial<
  Record<FieldNames<Schema>, AnyError[]>
>;

export type ExternalFormErrors<Schema extends FormSchema> = Partial<
  FormErrorState<Schema>
>;

export interface FormErrorState<Schema extends FormSchema> {
  general: AnyError[];
  field: FieldErrors<Schema>;
}
