<script setup lang="ts" generic="T extends Record<string, any>">
import type { FormError, FormSubmitEvent, FormValidateOn, StandardSchemaLike } from '../composables/form'
import { computed, provide, ref } from 'vue'
import { formContextKey, isStandardSchema, issuePath } from '../composables/form'

export interface FormProps<S extends Record<string, any>> {
  /** Reactive object holding the field values. */
  state: S
  /** Any Standard Schema validator (Zod 3.24+, Valibot, ArkType…). */
  schema?: StandardSchemaLike
  /** Custom validation, run after the schema. Return the errors you found. */
  validate?: (state: S) => FormError[] | Promise<FormError[]>
  /** Which interactions re-validate a field. Submit always validates everything. */
  validateOn?: FormValidateOn[]
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<FormProps<T>>(), {
  validateOn: () => ['blur', 'change'],
})

const emit = defineEmits<{
  submit: [event: FormSubmitEvent<T>]
  error: [errors: FormError[]]
}>()

const errors = ref<FormError[]>([])

/** Run schema + custom validation over the whole state. */
async function collectErrors(): Promise<FormError[]> {
  const found: FormError[] = []

  if (props.schema && isStandardSchema(props.schema)) {
    const result = await props.schema['~standard'].validate(props.state)
    if (result.issues) {
      for (const issue of result.issues)
        found.push({ name: issuePath(issue), message: issue.message })
    }
  }

  if (props.validate)
    found.push(...(await props.validate(props.state)))

  return found
}

/**
 * Validate the whole form. Returns the state when valid, `false` otherwise.
 * Pass `silent` to check validity without surfacing errors in the UI.
 */
async function validate(options: { silent?: boolean } = {}): Promise<T | false> {
  const found = await collectErrors()
  if (!options.silent)
    errors.value = found
  return found.length ? false : props.state
}

/** Re-validate a single field, leaving other fields' errors untouched. */
async function validateField(name: string): Promise<void> {
  const found = await collectErrors()
  errors.value = [...errors.value.filter(error => error.name !== name), ...found.filter(error => error.name === name)]
}

/** Clear every error, or just one field's. */
function clear(name?: string): void {
  errors.value = name ? errors.value.filter(error => error.name !== name) : []
}

/** Set errors manually — handy for surfacing server-side validation. */
function setErrors(next: FormError[]): void {
  errors.value = next
}

function errorFor(name: string | undefined): string | undefined {
  if (!name)
    return undefined
  return errors.value.find(error => error.name === name)?.message
}

async function onSubmit(event: Event): Promise<void> {
  event.preventDefault()
  // Capture the form now: `currentTarget` is nulled once dispatch finishes,
  // and validation below is async.
  const formEl = event.currentTarget as HTMLElement | null

  const found = await collectErrors()
  errors.value = found

  if (found.length) {
    emit('error', found)
    // Move focus to the first invalid control so keyboard users land on it.
    const first = found.find(error => error.name)?.name
    if (first && formEl) {
      const selector = `[data-iryx-field="${CSS.escape(first)}"] :is(input,textarea,select,button,[tabindex])`
      formEl.querySelector<HTMLElement>(selector)?.focus()
    }
    return
  }

  emit('submit', { data: props.state })
}

provide(formContextKey, {
  errors,
  validateOn: computed(() => props.validateOn),
  disabled: computed(() => props.disabled ?? false),
  state: computed(() => props.state),
  errorFor,
  validateField,
})

defineExpose({ validate, clear, setErrors, errors })
</script>

<template>
  <form novalidate :class="props.class" @submit="onSubmit">
    <slot :errors="errors" />
  </form>
</template>
