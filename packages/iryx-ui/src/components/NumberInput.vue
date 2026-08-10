<script setup lang="ts">
import { ArrowDown01Icon, ArrowUp01Icon } from '@hugeicons/core-free-icons'
import { computed, ref, watch } from 'vue'
import {
  addDecimals,
  clampDecimal,
  compareDecimals,
  formatForLocale,
  isDecimal,
  parseFromLocale,
  roundDecimal,
} from '../composables/decimal'
import { useFormField } from '../composables/form'
import { useIryxUiConfig } from '../config'
import { numberInputTheme } from '../theme/number-input'
import Icon from './Icon.vue'

export interface NumberInputProps {
  /** Smallest allowed value, as a decimal string. */
  min?: string
  /** Largest allowed value, as a decimal string. */
  max?: string
  /** Amount the stepper adds or subtracts, as a decimal string. */
  step?: string
  /** Fixed decimal places. Values are rounded half-up to this scale. */
  precision?: number
  /**
   * Locale used for the *display* only — `sl` shows `1.234,56`. The model
   * stays canonical (`"1234.56"`) whatever the locale.
   */
  locale?: string
  /** Show the stacked increment/decrement controls. */
  stepper?: boolean
  size?: 'sm' | 'md' | 'lg'
  placeholder?: string
  disabled?: boolean
  required?: boolean
  /** Mark the field as invalid — styles the border and ring red. */
  invalid?: boolean
  id?: string
  /** Accessible names for the stepper controls — override for non-English apps. */
  incrementLabel?: string
  decrementLabel?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  /** Override classes per slot, e.g. `{ step: 'px-2' }`. */
  ui?: {
    root?: string
    input?: string
    stepper?: string
    step?: string
  }
}

const props = withDefaults(defineProps<NumberInputProps>(), {
  step: '1',
  stepper: true,
  incrementLabel: 'Increment',
  decrementLabel: 'Decrement',
  invalid: undefined,
  unstyled: undefined,
})

/**
 * The model is a decimal **string**, never a number.
 *
 * Money in a finance app is computed with decimal arithmetic; coercing to a
 * float here would silently lose precision before the value ever reached the
 * caller. An empty string means "no value".
 */
const model = defineModel<string>({ default: '' })

const field = useFormField()
const inputId = computed(() => props.id ?? field?.id.value)
const isInvalid = computed(() => props.invalid ?? field?.invalid.value ?? false)

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

/** What the user sees: locale-formatted while idle, raw while editing. */
const display = ref('')
const editing = ref(false)

function toDisplay(value: string): string {
  if (!value)
    return ''
  if (props.locale)
    return formatForLocale(value, props.locale, props.precision)
  return props.precision != null ? roundDecimal(value, props.precision) ?? value : value
}

watch(
  () => model.value,
  (value) => {
    if (!editing.value)
      display.value = toDisplay(value)
  },
  { immediate: true },
)

/** Canonicalise, clamp and round — the only place a value enters the model. */
function commit(raw: string): void {
  const trimmed = raw.trim()
  if (!trimmed) {
    model.value = ''
    display.value = ''
    return
  }

  const canonical = props.locale ? parseFromLocale(trimmed, props.locale) : (isDecimal(trimmed) ? trimmed : undefined)
  if (canonical == null) {
    // Unparseable: fall back to the last good value rather than emitting junk.
    display.value = toDisplay(model.value)
    return
  }

  const clamped = clampDecimal(canonical, props.min, props.max)
  const rounded = props.precision != null ? roundDecimal(clamped, props.precision) ?? clamped : clamped

  model.value = rounded
  display.value = toDisplay(rounded)
}

function onFocus(): void {
  editing.value = true
  // Editing happens on the canonical value, so separators can't fight typing.
  display.value = model.value
}

function onBlur(): void {
  editing.value = false
  commit(display.value)
}

function nudge(direction: 1 | -1): void {
  const base = model.value || '0'
  const delta = direction === 1 ? props.step : `-${props.step}`
  const next = addDecimals(base, delta)
  if (next == null)
    return

  const clamped = clampDecimal(next, props.min, props.max)
  const rounded = props.precision != null ? roundDecimal(clamped, props.precision) ?? clamped : clamped
  model.value = rounded
  display.value = editing.value ? rounded : toDisplay(rounded)
}

const atMin = computed(() => props.min != null && model.value !== '' && compareDecimals(model.value, props.min) <= 0)
const atMax = computed(() => props.max != null && model.value !== '' && compareDecimals(model.value, props.max) >= 0)

const theme = computed(() =>
  numberInputTheme({
    size: props.size,
    invalid: isInvalid.value,
    withStepper: props.stepper,
  }),
)

function slotClass(slot: 'root' | 'input' | 'stepper' | 'step', extra?: string) {
  const override = props.ui?.[slot]
  return isUnstyled.value ? [override, extra] : theme.value[slot]({ class: [override, extra] })
}
</script>

<template>
  <div :class="slotClass('root')">
    <input
      :id="inputId"
      v-model="display"
      type="text"
      inputmode="decimal"
      autocomplete="off"
      role="spinbutton"
      :aria-valuenow="model || undefined"
      :aria-valuemin="props.min"
      :aria-valuemax="props.max"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :required="props.required"
      :aria-invalid="isInvalid || undefined"
      :aria-describedby="field?.describedBy.value"
      :class="isUnstyled ? [props.ui?.input, props.class] : theme.input({ class: [props.ui?.input, props.class] })"
      @focus="onFocus"
      @blur="onBlur"
      @keydown.up.prevent="nudge(1)"
      @keydown.down.prevent="nudge(-1)"
    >

    <div v-if="props.stepper" :class="slotClass('stepper')">
      <button
        type="button"
        tabindex="-1"
        :aria-label="props.incrementLabel"
        :disabled="props.disabled || atMax"
        :class="slotClass('step')"
        @click="nudge(1)"
      >
        <Icon :icon="ArrowUp01Icon" />
      </button>
      <button
        type="button"
        tabindex="-1"
        :aria-label="props.decrementLabel"
        :disabled="props.disabled || atMin"
        :class="slotClass('step')"
        @click="nudge(-1)"
      >
        <Icon :icon="ArrowDown01Icon" />
      </button>
    </div>
  </div>
</template>
