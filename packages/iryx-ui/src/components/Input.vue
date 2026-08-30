<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { Cancel01Icon, Loading03Icon } from '@hugeicons/core-free-icons'
import { computed, onBeforeUnmount, ref, useSlots, watch } from 'vue'
import { useFormField } from '../composables/form'
import { useIryxUiConfig } from '../config'
import { inputTheme } from '../theme/input'
import Icon from './Icon.vue'

export interface InputProps {
  type?: string
  size?: 'sm' | 'md' | 'lg'
  placeholder?: string
  disabled?: boolean
  required?: boolean
  /** Mark the field as invalid — styles the border and ring red. */
  invalid?: boolean
  id?: string
  /** Show a clear button in the trailing area while the field has a value. */
  clearable?: boolean
  /** Show a spinner in the trailing area. Does not disable the field. */
  loading?: boolean
  /**
   * Milliseconds to wait after the last keystroke before the model updates.
   * `0` (the default) updates on every keystroke. Blur and Enter flush a
   * pending update immediately, so a submit never reads a stale value.
   */
  debounce?: number
  /** Accessible name for the clear button — override for non-English apps. */
  clearLabel?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  /** Applied to the outer field, which is the element carrying the chrome. */
  class?: ClassValue
  /** Override classes per slot, e.g. `{ input: 'text-right' }`. */
  ui?: {
    root?: string
    input?: string
    leading?: string
    trailing?: string
    clear?: string
  }
}

// The wrapper is presentational; `name`, `autocomplete`, `maxlength` and the
// like belong on the control itself.
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  debounce: 0,
  clearLabel: 'Clear',
  invalid: undefined,
  unstyled: undefined,
})

// Autocorrect mangles addresses and identifiers, so only free text is checked.
const spellcheck = computed(() => (['email', 'url', 'tel', 'password'].includes(props.type) ? false : undefined))

const model = defineModel<string | number | null>()

const slots = useSlots()

const field = useFormField()
const inputId = computed(() => props.id ?? field?.id.value)
if (field && props.id)
  field.id.value = props.id
const isInvalid = computed(() => props.invalid ?? field?.invalid.value ?? false)

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

/**
 * What the input displays. With `debounce` this runs ahead of the model — the
 * field has to stay responsive while the committed value lags behind.
 */
const draft = ref<string | number | null | undefined>(model.value)
let timer: ReturnType<typeof setTimeout> | undefined

function cancelPending(): void {
  if (timer !== undefined) {
    clearTimeout(timer)
    timer = undefined
  }
}

// An external write (reset, prefill) wins over whatever is queued locally.
watch(model, (value) => {
  cancelPending()
  draft.value = value
})

function onInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  draft.value = value

  cancelPending()
  if (!props.debounce) {
    model.value = value
    return
  }
  timer = setTimeout(() => {
    timer = undefined
    model.value = value
  }, props.debounce)
}

/** Commit a queued value now rather than waiting out the remaining delay. */
function flush(): void {
  if (timer === undefined)
    return
  cancelPending()
  model.value = draft.value
}

onBeforeUnmount(cancelPending)

const inputEl = ref<HTMLInputElement>()

function clear(): void {
  cancelPending()
  draft.value = ''
  model.value = ''
  inputEl.value?.focus()
}

defineExpose({
  /** The underlying element, for focus management by the caller. */
  input: inputEl,
})

const hasValue = computed(() => draft.value !== '' && draft.value != null)
const showClear = computed(() => props.clearable && hasValue.value && !props.disabled)
const hasTrailing = computed(() => props.loading || showClear.value || !!slots.trailing)

const theme = computed(() => inputTheme({ size: props.size, invalid: isInvalid.value }))

function slotClass(slot: 'root' | 'input' | 'leading' | 'trailing' | 'clear', extra?: ClassValue) {
  const override = props.ui?.[slot]
  return isUnstyled.value ? [override, extra] : theme.value[slot]({ class: [override, extra] })
}
</script>

<template>
  <div :class="slotClass('root', props.class)">
    <span v-if="slots.leading" :class="slotClass('leading')">
      <slot name="leading" />
    </span>

    <input
      :id="inputId"
      ref="inputEl"
      :value="draft"
      :type="props.type"
      :spellcheck="spellcheck"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :required="props.required"
      :aria-invalid="isInvalid || undefined"
      :aria-describedby="field?.describedBy.value"
      :class="slotClass('input')"
      v-bind="$attrs"
      @input="onInput"
      @blur="flush"
      @keydown.enter="flush"
    >

    <span v-if="hasTrailing" :class="slotClass('trailing')">
      <slot name="trailing" />
      <button
        v-if="showClear"
        type="button"
        tabindex="-1"
        :aria-label="props.clearLabel"
        :class="slotClass('clear')"
        @click="clear"
      >
        <Icon :icon="Cancel01Icon" />
      </button>
      <Icon v-if="props.loading" :icon="Loading03Icon" class="animate-spin" />
    </span>
  </div>
</template>
