<script setup lang="ts">
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { progressTheme } from '../theme/progress'

export interface ProgressProps {
  /** Current value. `null` (or `indeterminate`) means unknown duration. */
  modelValue?: number | null
  max?: number
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  /** Unknown duration — animates instead of tracking a value. */
  indeterminate?: boolean
  /** Text shown above the track. */
  label?: string
  /** Show the value beside the label. Defaults to a percentage. */
  showValue?: boolean
  /**
   * Format the displayed value and the accessible label. Override for
   * non-percentage units or non-English locales.
   */
  formatValue?: (value: number, max: number) => string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  /** Override classes per slot, e.g. `{ track: 'h-4' }`. */
  ui?: {
    root?: string
    header?: string
    label?: string
    value?: string
    track?: string
    indicator?: string
  }
}

const props = withDefaults(defineProps<ProgressProps>(), {
  max: 100,
  unstyled: undefined,
})

const isIndeterminate = computed(() => props.indeterminate || props.modelValue == null)

/** Clamped so a stray value can't overflow the track. */
const value = computed(() => {
  if (isIndeterminate.value)
    return null
  return Math.min(Math.max(props.modelValue ?? 0, 0), props.max)
})

const percent = computed(() => (value.value == null ? 0 : (value.value / props.max) * 100))

const formatted = computed(() => {
  if (value.value == null)
    return undefined
  return props.formatValue
    ? props.formatValue(value.value, props.max)
    : `${Math.round(percent.value)}%`
})

const hasHeader = computed(() => Boolean(props.label || (props.showValue && formatted.value)))

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() =>
  progressTheme({
    variant: props.variant,
    size: props.size,
    indeterminate: isIndeterminate.value,
  }),
)

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : theme.value.root({ class: [props.ui?.root, props.class] }),
)
const headerClass = computed(() =>
  isUnstyled.value ? props.ui?.header : theme.value.header({ class: props.ui?.header }),
)
const labelClass = computed(() =>
  isUnstyled.value ? props.ui?.label : theme.value.label({ class: props.ui?.label }),
)
const valueClass = computed(() =>
  isUnstyled.value ? props.ui?.value : theme.value.value({ class: props.ui?.value }),
)
const trackClass = computed(() =>
  isUnstyled.value ? props.ui?.track : theme.value.track({ class: props.ui?.track }),
)
const indicatorClass = computed(() =>
  isUnstyled.value ? props.ui?.indicator : theme.value.indicator({ class: props.ui?.indicator }),
)

/** Determinate bars are revealed by sliding the indicator in from the left. */
const indicatorStyle = computed(() =>
  isIndeterminate.value ? undefined : { transform: `translateX(-${100 - percent.value}%)` },
)
</script>

<template>
  <div :class="rootClass">
    <div v-if="hasHeader" :class="headerClass">
      <span v-if="props.label || $slots.label" :class="labelClass">
        <slot name="label">
          {{ props.label }}
        </slot>
      </span>
      <span v-if="props.showValue && formatted" :class="valueClass">
        <slot name="value" :value="value" :percent="percent" :formatted="formatted">
          {{ formatted }}
        </slot>
      </span>
    </div>

    <ProgressRoot
      :model-value="value"
      :max="props.max"
      :get-value-label="() => formatted ?? ''"
      :class="trackClass"
    >
      <ProgressIndicator :class="indicatorClass" :style="indicatorStyle" />
    </ProgressRoot>
  </div>
</template>
