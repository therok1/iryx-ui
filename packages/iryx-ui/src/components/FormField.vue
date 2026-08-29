<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { useId } from 'reka-ui'
import { computed, provide, ref, watch } from 'vue'
import { formFieldContextKey, getByPath, useForm } from '../composables/form'
import { useIryxUiConfig } from '../config'
import { formFieldTheme } from '../theme/form'
import Label from './Label.vue'

export interface FormFieldProps {
  /** Dot-path into the form state. Links this field to its validation errors. */
  name?: string
  label?: string
  /** Muted text under the label, explaining the field. */
  description?: string
  /** Muted text on the right of the label, e.g. "Optional". */
  hint?: string
  /** Muted text under the control, shown while there's no error. */
  help?: string
  required?: boolean
  /** Force an error message, bypassing the form's validation. */
  error?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  ui?: {
    root?: string
    header?: string
    label?: string
    hint?: string
    description?: string
    error?: string
    help?: string
  }
}

const props = withDefaults(defineProps<FormFieldProps>(), {
  unstyled: undefined,
})

const form = useForm()
const fieldId = useId()
const labelFor = ref<string | undefined>(fieldId)

const error = computed(() => props.error ?? form?.errorFor(props.name))
const describedBy = computed(() => {
  const ids: string[] = []
  if (props.description)
    ids.push(`${fieldId}-description`)
  if (error.value)
    ids.push(`${fieldId}-error`)
  else if (props.help)
    ids.push(`${fieldId}-help`)
  return ids.length ? ids.join(' ') : undefined
})

// Re-validate when the field's own value changes.
watch(
  () => (props.name && form ? getByPath(form.state.value, props.name) : undefined),
  () => {
    if (!props.name || !form)
      return
    const on = form.validateOn.value
    if (on.includes('change') || on.includes('input'))
      void form.validateField(props.name)
  },
)

function onFocusOut(): void {
  if (!props.name || !form)
    return
  if (form.validateOn.value.includes('blur'))
    void form.validateField(props.name)
}

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)
const slots = formFieldTheme()

function cls(slot: keyof typeof slots, override?: string) {
  return isUnstyled.value ? override : slots[slot]({ class: override })
}

provide(formFieldContextKey, {
  id: labelFor,
  labelId: computed(() => (props.label ? `${fieldId}-label` : undefined)),
  name: computed(() => props.name),
  invalid: computed(() => Boolean(error.value)),
  describedBy,
})
</script>

<template>
  <div
    :data-iryx-field="props.name"
    :class="isUnstyled ? props.class : slots.root({ class: [props.ui?.root, props.class] })"
    @focusout="onFocusOut"
  >
    <div v-if="props.label || props.hint || $slots.hint" :class="cls('header', props.ui?.header)">
      <Label v-if="props.label" :id="`${fieldId}-label`" :for="labelFor" :required="props.required" :class="props.ui?.label">
        {{ props.label }}
      </Label>
      <span v-if="props.hint || $slots.hint" :class="cls('hint', props.ui?.hint)">
        <slot name="hint">{{ props.hint }}</slot>
      </span>
    </div>

    <p v-if="props.description" :id="`${fieldId}-description`" :class="cls('description', props.ui?.description)">
      {{ props.description }}
    </p>

    <slot :id="fieldId" :error="error" />

    <p v-if="error" :id="`${fieldId}-error`" role="alert" aria-live="polite" :class="cls('error', props.ui?.error)">
      {{ error }}
    </p>
    <p v-else-if="props.help" :id="`${fieldId}-help`" :class="cls('help', props.ui?.help)">
      {{ props.help }}
    </p>
  </div>
</template>
