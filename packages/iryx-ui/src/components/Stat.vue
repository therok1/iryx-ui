<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { ArrowDown01Icon, ArrowRight01Icon, ArrowUp01Icon } from '@hugeicons/core-free-icons'
import { Primitive } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { statTheme } from '../theme/stat'
import Icon from './Icon.vue'

export interface StatProps {
  /** Render as a different element or component. */
  as?: string
  label?: string
  value?: string | number
  /** Change since the previous period. Sign picks the colour and the arrow. */
  delta?: number
  /**
   * Override the colour of the delta. Useful when down is the good direction —
   * falling costs, for example — since the sign alone cannot tell.
   */
  trend?: 'up' | 'down' | 'neutral'
  /** Secondary text under the value. */
  hint?: string
  size?: 'sm' | 'md' | 'lg'
  /**
   * Format the delta. Defaults to a signed percentage; override for other
   * units or locales.
   */
  formatDelta?: (delta: number) => string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per element, e.g. `{ value: 'text-4xl' }`. */
  ui?: {
    root?: string
    label?: string
    value?: string
    delta?: string
    hint?: string
    row?: string
  }
}

const props = withDefaults(defineProps<StatProps>(), {
  as: 'div',
  unstyled: undefined,
})

/**
 * Which way the number actually moved. Zero counts as neutral, so a flat
 * result reads as neither good nor bad.
 */
const direction = computed(() => {
  if (props.delta == null || props.delta === 0)
    return 'neutral'
  return props.delta > 0 ? 'up' : 'down'
})

/**
 * The colour only. `trend` says whether the move was *good*, which the sign
 * cannot tell on its own — falling costs are a win. It deliberately does not
 * touch the arrow: an arrow that disagrees with the signed number printed
 * beside it ("↑ -14%") reads as a bug rather than as nuance.
 */
const trend = computed(() => props.trend ?? direction.value)

/** Decorative: the colour and the formatted value already carry the meaning. */
const trendArrow = computed(() =>
  ({ up: ArrowUp01Icon, down: ArrowDown01Icon, neutral: ArrowRight01Icon }[direction.value]),
)

const formattedDelta = computed(() => {
  if (props.delta == null)
    return undefined
  if (props.formatDelta)
    return props.formatDelta(props.delta)
  const sign = props.delta > 0 ? '+' : ''
  return `${sign}${props.delta}%`
})

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => statTheme({ size: props.size, trend: trend.value }))

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : theme.value.root({ class: [props.ui?.root, props.class] }),
)
const labelClass = computed(() =>
  isUnstyled.value ? props.ui?.label : theme.value.label({ class: props.ui?.label }),
)
const valueClass = computed(() =>
  isUnstyled.value ? props.ui?.value : theme.value.value({ class: props.ui?.value }),
)
const deltaClass = computed(() =>
  isUnstyled.value ? props.ui?.delta : theme.value.delta({ class: props.ui?.delta }),
)
const hintClass = computed(() =>
  isUnstyled.value ? props.ui?.hint : theme.value.hint({ class: props.ui?.hint }),
)
const rowClass = computed(() =>
  isUnstyled.value ? props.ui?.row : theme.value.row({ class: props.ui?.row }),
)
</script>

<template>
  <Primitive :as="props.as" :class="rootClass">
    <span v-if="props.label || $slots.label" :class="labelClass">
      <slot name="label">{{ props.label }}</slot>
    </span>

    <span :class="rowClass">
      <span :class="valueClass">
        <slot>{{ props.value }}</slot>
      </span>
      <span v-if="formattedDelta || $slots.delta" :class="deltaClass">
        <slot name="delta" :trend="trend">
          <Icon :icon="trendArrow" data-icon="inline-start" />
          {{ formattedDelta }}
        </slot>
      </span>
    </span>

    <span v-if="props.hint || $slots.hint" :class="hintClass">
      <slot name="hint">{{ props.hint }}</slot>
    </span>
  </Primitive>
</template>
