import type { ComputedRef, InjectionKey, Ref } from 'vue'
import { inject } from 'vue'

/** A validation failure. `name` is a dot-path into the form state. */
export interface FormError {
  name?: string
  message: string
}

export interface FormSubmitEvent<T> {
  data: T
}

/** When a field re-validates. `submit` always runs regardless. */
export type FormValidateOn = 'blur' | 'input' | 'change'

/**
 * Minimal structural type for the Standard Schema spec, so any compliant
 * validator (Zod 3.24+, Valibot, ArkType…) works without Iryx depending on it.
 *
 * @see https://standardschema.dev
 */
export interface StandardSchemaLike<Output = unknown> {
  '~standard': {
    version: number
    vendor: string
    validate: (value: unknown) => StandardSchemaResult<Output> | Promise<StandardSchemaResult<Output>>
  }
}

export interface StandardSchemaIssue {
  message: string
  path?: ReadonlyArray<PropertyKey | { key: PropertyKey }>
}

export type StandardSchemaResult<Output>
  = | { value: Output, issues?: undefined }
    | { issues: ReadonlyArray<StandardSchemaIssue>, value?: undefined }

export function isStandardSchema(value: unknown): value is StandardSchemaLike {
  return typeof value === 'object' && value !== null && '~standard' in value
}

/** Join a Standard Schema issue path into a dot-path (`address.city`). */
export function issuePath(issue: StandardSchemaIssue): string | undefined {
  if (!issue.path?.length)
    return undefined
  return issue.path
    .map(segment => (typeof segment === 'object' && segment !== null ? segment.key : segment))
    .join('.')
}

/** Read a dot-path out of an object, tolerating missing intermediates. */
export function getByPath(object: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>((acc, key) => (acc == null ? undefined : (acc as Record<string, unknown>)[key]), object)
}

export interface FormContext {
  errors: Ref<FormError[]>
  validateOn: ComputedRef<FormValidateOn[]>
  disabled: ComputedRef<boolean>
  /** Full state object, so fields can watch their own slice. */
  state: ComputedRef<Record<string, unknown>>
  errorFor: (name: string | undefined) => string | undefined
  validateField: (name: string) => Promise<void>
}

export const formContextKey: InjectionKey<FormContext> = Symbol.for('iryx-ui:form')

/** Context a `FormField` exposes to the control it wraps. */
export interface FormFieldContext {
  /**
   * The id the field's `<label for>` points at. Writable: a control with its
   * own `id` writes that back, and one a label cannot target — a radio group,
   * a slider — clears it so the field renders no dangling `for`.
   */
  id: Ref<string | undefined>
  /** Id of the field's own `<label>`, for controls a `for` cannot target. */
  labelId: ComputedRef<string | undefined>
  name: ComputedRef<string | undefined>
  invalid: ComputedRef<boolean>
  describedBy: ComputedRef<string | undefined>
}

export const formFieldContextKey: InjectionKey<FormFieldContext> = Symbol.for('iryx-ui:form-field')

/** Access the enclosing form, if any. */
export function useForm(): FormContext | undefined {
  return inject(formContextKey, undefined)
}

/**
 * Access the enclosing `FormField`, if any. Controls use this to pick up the
 * generated `id`, the invalid state and `aria-describedby` automatically.
 */
export function useFormField(): FormFieldContext | undefined {
  return inject(formFieldContextKey, undefined)
}
