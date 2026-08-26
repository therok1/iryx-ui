<script setup lang="ts">
import type { ClassValue } from '../class-value'
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
  toEditable,
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
  class?: ClassValue
  /** Override classes per slot, e.g. `{ step: 'px-2' }`. */
  ui?: {
    root?: string
    input?: string
    stepper?: string
    step?: string
  }
}

/**
 * The root is the wrapper carrying the field chrome, so an attribute left to
 * fall through landed there instead of on the `<input>` — including
 * `aria-label`, which meant a `INumberInput` with no visible label had no
 * accessible name at all. `IInput` already does this; the axe sweep found that
 * this one had been missed.
 */
defineOptions({ inheritAttrs: false })

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
  // Ungrouped, but in the locale's own decimal separator: showing the
  // canonical `1234.56` where `.` groups digits would parse back as `123456`.
  display.value = toEditable(model.value, props.locale)
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
  display.value = editing.value ? toEditable(rounded, props.locale) : toDisplay(rounded)
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

/**
 * `class` goes on the root, not on the `<input>`.
 *
 * The stepper is positioned against the root and the input is `w-full` inside
 * it, so a width written on the input left the root at its full width and the
 * arrows pinned to *that* edge — floating in space beside a narrow field.
 * Sizing the box that defines the field is the only placement where the two
 * cannot come apart. `ui.input` still reaches the input itself.
 *
 * Note the template keeps a single root element: a leading comment node would
 * make this a fragment, and Vue then has no root to fall attributes through to.
 */
function slotClass(slot: 'root' | 'input' | 'stepper' | 'step', extra?: ClassValue) {
  const override = props.ui?.[slot]
  return isUnstyled.value ? [override, extra] : theme.value[slot]({ class: [override, extra] })
}
</script>

<template>
  <div :class="isUnstyled ? [props.ui?.root, props.class] : theme.root({ class: [props.ui?.root, props.class] })">
    <input
      :id="inputId"
      v-model="display"
      v-bind="$attrs"
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
      :class="slotClass('input')"
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
