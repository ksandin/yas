import type { Draft } from "immer";
import { produce } from "immer";
import type {
  FieldNames,
  FormSchema,
  FormState,
  FormValidationMode,
  inferValue,
} from "./types/commonTypes";
import type { FieldErrors } from "./types/commonTypes";
import type { AnyError } from "./types/commonTypes";
import type { FormErrors } from "./types/commonTypes";
import type { GetShapeFromSchema } from "./utils/getShapeFromSchema";
import { getShapeFromSchema } from "./utils/getShapeFromSchema";
import type { AnyRCFGenerics } from "./types/optionTypes";

export type FormStoreFor<G extends AnyRCFGenerics> = FormStore<G["schema"]>;

export class FormStore<Schema extends FormSchema> {
  private _listeners = new Set<StoreListener<Schema>>();
  private _currentMutation?: { draft: Draft<FormState<Schema>> };
  private _state: FormState<Schema>;
  private readonly _schemaShape: GetShapeFromSchema<Schema>;

  get data(): inferValue<Schema> {
    return this._state.data;
  }

  get generalErrors(): AnyError[] {
    return this._state.combinedErrors.general;
  }

  get fieldErrors(): FieldErrors<Schema> {
    return this._state.combinedErrors.field;
  }

  get isLocallyValid() {
    const { field, general } = this._state.localErrors;
    const hasLocalFieldErrors = Object.values(field).some((e) => e?.length);
    const hasLocalGeneralErrors = general.length > 0;
    return !hasLocalFieldErrors && !hasLocalGeneralErrors;
  }

  constructor(
    public readonly schema: Schema,
    initialData: inferValue<Schema>,
    private _modes: readonly FormValidationMode[],
  ) {
    this._schemaShape = getShapeFromSchema(schema);
    this._state = {
      localErrors: emptyFormErrorState(),
      externalErrors: emptyFormErrorState(),
      combinedErrors: emptyFormErrorState(),
      data: initialData,
    };
  }

  resetData(data: inferValue<Schema>) {
    this.mutate((state) => {
      state.data = data;
    });
  }

  handleSubmit() {
    if (this.hasMode("submit")) {
      this.validate();
    }
  }

  changeField<FieldName extends FieldNames<Schema>>(
    name: FieldName,
    value: inferValue<Schema>[FieldName],
  ) {
    this.mutate((draft) => {
      draft.data[name] = value;
      if (this.hasMode("change")) {
        this.validate(name);
      }
    });
  }

  focusField<FieldName extends FieldNames<Schema>>(name: FieldName) {
    if (this.hasMode("focus")) {
      this.validate(name);
    }
  }

  blurField<FieldName extends FieldNames<Schema>>(name: FieldName) {
    if (this.hasMode("blur")) {
      this.validate(name);
    }
  }

  setExternalErrors(errors?: FormErrors<Schema>) {
    this.mutate((draft) => {
      draft.externalErrors.field = errors?.field ?? {};
      draft.externalErrors.general = errors?.general ?? [];
      this.updateCombinedErrors();
    });
  }

  private updateCombinedErrors() {
    this.mutate(
      ({
        externalErrors: external,
        localErrors: local,
        combinedErrors: combined,
      }) => {
        combined.general = external.general.concat(local.general);

        combined.field = { ...local.field };
        for (const key in external.field) {
          const fieldName = key as FieldNames<Schema>;
          if (fieldName in this._schemaShape) {
            combined.field[fieldName] = [
              ...(external.field[fieldName] ?? []),
              ...(local.field?.[fieldName] ?? []),
            ];
          } else {
            throw new Error(
              `Invalid external field error: Field "${fieldName}" doesn't exist in schema`,
            );
          }
        }
      },
    );
  }

  setModes(modes: readonly FormValidationMode[]) {
    this._modes = modes;
  }

  private hasMode(mode: FormValidationMode) {
    return this._modes.includes(mode);
  }

  private validate<FieldName extends FieldNames<Schema>>(
    ...fieldNames: FieldName[]
  ) {
    this.mutate((draft) => {
      const localErrors = getFormErrorState(this.schema, draft.data);

      draft.localErrors.general = localErrors.general;

      if (fieldNames.length) {
        for (const name of fieldNames) {
          draft.localErrors.field[name] = localErrors.field[name];
        }
      } else {
        draft.localErrors.field = localErrors.field;
      }

      this.updateCombinedErrors();
    });
  }

  private mutate(mutator: (state: FormState<Schema>) => void): void {
    if (this._currentMutation) {
      mutator(this._currentMutation.draft as FormState<Schema>);
      return;
    }

    const newState = produce(this._state, (draft) => {
      this._currentMutation = { draft };
      mutator(draft as FormState<Schema>);
      this._currentMutation = undefined;
    });

    this._state = newState;
    for (const listener of this._listeners) {
      listener(newState);
    }
  }

  subscribe = (listener: StoreListener<Schema>): StoreUnsubscriber => {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  };
}

function getFormErrorState<Schema extends FormSchema>(
  schema: Schema,
  value: inferValue<Schema>,
): FormErrors<Schema> {
  const res = schema.safeParse(value);
  if (res.success) {
    return emptyFormErrorState();
  }
  const { formErrors: general, fieldErrors: field } = res.error.flatten();
  return { general, field } as FormErrors<Schema>;
}

export type StoreUnsubscriber = () => void;

export type StoreListener<Schema extends FormSchema> = (
  state: FormState<Schema>,
) => void;

function emptyFormErrorState<Schema extends FormSchema>(): FormErrors<Schema> {
  return {
    general: [],
    field: {},
  };
}
