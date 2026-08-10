<script setup lang="ts">
import { computed } from 'vue'
import { useFormField } from '../composables/form'
import { useIryxUiConfig } from '../config'
import { textareaTheme } from '../theme/input'

export interface TextareaProps {
  size?: 'sm' | 'md' | 'lg'
  rows?: number
  placeholder?: string
  disabled?: boolean
  required?: boolean
  /** Mark the field as invalid — styles the border and ring red. */
  invalid?: boolean
  id?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
}

const props = withDefaults(defineProps<TextareaProps>(), {
  invalid: undefined,
  unstyled: undefined,
})

const model = defineModel<string | null>()

// Inherit id / invalid / aria-describedby when inside a FormField.
const field = useFormField()
const inputId = computed(() => props.id ?? field?.id.value)
const isInvalid = computed(() => props.invalid ?? field?.invalid.value ?? false)

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const classes = computed(() => {
  if (isUnstyled.value)
    return props.class
  return textareaTheme({ size: props.size, invalid: isInvalid.value, class: props.class })
})
</script>

<template>
  <textarea
    :id="inputId"
    v-model="model"
    :rows="props.rows"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :required="props.required"
    :aria-invalid="isInvalid || undefined"
    :aria-describedby="field?.describedBy.value"
    :class="classes"
  />
</template>
