<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { PinInputInput, PinInputRoot } from 'reka-ui'
import { computed } from 'vue'
import { useFormField } from '../composables/form'
import { useIryxUiConfig } from '../config'
import { pinInputTheme } from '../theme/pin-input'

export interface PinInputProps {
  /**
   * The code, as a plain string. Reka works in arrays of single characters;
   * a PIN is a string everywhere else in an app — in the request body, in the
   * validator, in the email it arrived in — so the array stays an internal
   * detail and never reaches your model.
   */
  modelValue?: string
  /** How many cells to render. */
  length?: number
  /** `number` gets the numeric keypad on mobile and rejects non-digits. */
  type?: 'text' | 'number'
  /** Render the entered characters as dots, like a password field. */
  mask?: boolean
  /**
   * Let phones offer the code from an SMS. Sets the one-time-code autofill
   * hint, which is the whole reason a reader does not have to retype it.
   */
  otp?: boolean
  /** Character shown in an empty cell. */
  placeholder?: string
  /**
   * Insert a separator after every N cells — `3` gives 123–456. Long codes
   * are read in chunks, and an unbroken row of eight is hard to check.
   */
  groupSize?: number
  /** What that separator shows. */
  separator?: string
  disabled?: boolean
  invalid?: boolean
  size?: 'sm' | 'md' | 'lg'
  id?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per element, e.g. `{ input: 'size-14' }`. */
  ui?: {
    root?: string
    input?: string
    separator?: string
  }
}

const props = withDefaults(defineProps<PinInputProps>(), {
  length: 6,
  separator: '–',
  invalid: undefined,
  unstyled: undefined,
})

const emits = defineEmits<{
  'update:modelValue': [value: string]
  /** Fired the moment every cell is filled — the point to submit. */
  'complete': [value: string]
}>()

/** Reka's shape: one entry per filled cell, shorter than `length` until full. */
const cells = computed(() => (props.modelValue ?? '').split(''))

const toString = (value: string[]) => value.join('')

const positions = computed(() => Array.from({ length: props.length }, (_, i) => i))

/**
 * Which cells are followed by a separator. The last cell is excluded — a
 * trailing dash after the final digit is punctuation for a group that is not
 * there.
 */
const separatorAfter = computed(() => {
  const size = props.groupSize
  if (!size || size <= 0)
    return new Set<number>()
  return new Set(positions.value.filter(i => (i + 1) % size === 0 && i !== props.length - 1))
})

const field = useFormField()
const firstCellId = computed(() => props.id ?? field?.id.value)
if (field && props.id)
  field.id.value = props.id
const isInvalid = computed(() => props.invalid ?? field?.invalid.value ?? false)

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const slots = computed(() => pinInputTheme({ size: props.size, invalid: isInvalid.value }))

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : slots.value.root({ class: [props.ui?.root, props.class] }),
)
const inputClass = computed(() =>
  isUnstyled.value ? props.ui?.input : slots.value.input({ class: props.ui?.input }),
)
const separatorClass = computed(() =>
  isUnstyled.value ? props.ui?.separator : slots.value.separator({ class: props.ui?.separator }),
)
</script>

<template>
  <PinInputRoot
    :aria-describedby="field?.describedBy.value"
    :model-value="cells"
    :type="props.type"
    :mask="props.mask"
    :otp="props.otp"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :class="rootClass"
    @update:model-value="value => emits('update:modelValue', toString(value))"
    @complete="value => emits('complete', toString(value))"
  >
    <template v-for="index in positions" :key="index">
      <PinInputInput
        :id="index === 0 ? firstCellId : undefined"
        :index="index"
        spellcheck="false"
        :aria-invalid="isInvalid || undefined"
        :class="inputClass"
      />
      <span v-if="separatorAfter.has(index)" :class="separatorClass" aria-hidden="true">
        <slot name="separator">{{ props.separator }}</slot>
      </span>
    </template>
  </PinInputRoot>
</template>
