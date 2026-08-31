<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { ProgressIndicator, ProgressRoot, useId } from 'reka-ui'
import { computed, useSlots } from 'vue'
import { useIryxUiConfig } from '../config'
import { progressTheme } from '../theme/progress'

export type ProgressVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'

export interface ProgressSegment {
  /** Amount this run covers, on the same scale as `max`. */
  value: number
  /** Named in the legend. Without one, no legend row is rendered for it. */
  label?: string
  variant?: ProgressVariant
}

export interface ProgressProps {
  /** Current value. `null` (or `indeterminate`) means unknown duration. */
  modelValue?: number | null
  max?: number
  variant?: ProgressVariant
  /**
   * Break the bar into runs that share one track — storage by file type, a
   * budget by category. Given `segments`, `modelValue` is ignored and the
   * accessible value becomes their sum.
   */
  segments?: ProgressSegment[]
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
  class?: ClassValue
  /** Override classes per element, e.g. `{ track: 'h-4' }`. */
  ui?: {
    root?: string
    header?: string
    label?: string
    value?: string
    track?: string
    indicator?: string
    segment?: string
    legend?: string
    legendItem?: string
    legendSwatch?: string
    legendValue?: string
  }
}

/**
 * The root is a plain wrapper; the element carrying `role="progressbar"` is
 * the track inside it. An attribute left to fall through landed on the
 * wrapper, so a consumer's `aria-label` never reached the thing being
 * described.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ProgressProps>(), {
  max: 100,
  unstyled: undefined,
})

const slots = useSlots()

/**
 * `label` renders visible text above the track, but nothing ever tied it to
 * the progressbar — so a labelled bar still announced as an unnamed one, which
 * the axe sweep caught. Point `aria-labelledby` at that text when it exists,
 * and otherwise let a caller's own `aria-label` through `$attrs`.
 */
const labelId = useId()
const hasLabel = computed(() => Boolean(props.label || slots.label))

const isStacked = computed(() => (props.segments?.length ?? 0) > 0)

/*
 * A stacked bar always has a value — the sum of its runs — so it is never
 * indeterminate, whatever `modelValue` says or fails to say.
 */
const isIndeterminate = computed(() =>
  !isStacked.value && (props.indeterminate || props.modelValue == null),
)

/**
 * Runs with their widths, clamped cumulatively.
 *
 * Segments are data from somewhere else and can perfectly well sum past `max`
 * — a disk that grew, a budget overspent. Clamping each run against what is
 * left keeps the last one from painting outside the track, and keeps the
 * rounded corner on whichever run actually reaches the end.
 */
const runs = computed(() => {
  let used = 0
  return (props.segments ?? []).map((segment) => {
    const value = Math.max(segment.value, 0)
    const room = Math.max(props.max - used, 0)
    const painted = Math.min(value, room)
    used += painted
    return {
      ...segment,
      value,
      percent: props.max > 0 ? (painted / props.max) * 100 : 0,
    }
  })
})

const segmentTotal = computed(() => runs.value.reduce((sum, run) => sum + run.value, 0))

/** Legend rows exist only for named runs; an unnamed set stays a bare bar. */
const legend = computed(() => runs.value.filter(run => run.label))

/** Clamped so a stray value can't overflow the track. */
const value = computed(() => {
  if (isIndeterminate.value)
    return null
  if (isStacked.value)
    return Math.min(segmentTotal.value, props.max)
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

const legendClass = computed(() =>
  isUnstyled.value ? props.ui?.legend : theme.value.legend({ class: props.ui?.legend }),
)
const legendItemClass = computed(() =>
  isUnstyled.value ? props.ui?.legendItem : theme.value.legendItem({ class: props.ui?.legendItem }),
)
const legendValueClass = computed(() =>
  isUnstyled.value ? props.ui?.legendValue : theme.value.legendValue({ class: props.ui?.legendValue }),
)

/**
 * Resolved per run rather than once for the component: each carries its own
 * variant, so the theme has to be called with that variant to get its colour.
 */
function segmentClass(variant: ProgressVariant | undefined) {
  if (isUnstyled.value)
    return props.ui?.segment
  return progressTheme({ variant: variant ?? 'neutral' }).segment({ class: props.ui?.segment })
}

function swatchClass(variant: ProgressVariant | undefined) {
  if (isUnstyled.value)
    return props.ui?.legendSwatch
  return progressTheme({ variant: variant ?? 'neutral' }).legendSwatch({ class: props.ui?.legendSwatch })
}

/** Determinate bars are revealed by sliding the indicator in from the left. */
const indicatorStyle = computed(() =>
  isIndeterminate.value ? undefined : { transform: `translateX(-${100 - percent.value}%)` },
)
</script>

<template>
  <div :class="rootClass">
    <div v-if="hasHeader" :class="headerClass">
      <span v-if="hasLabel" :id="labelId" :class="labelClass">
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
      :aria-labelledby="hasLabel ? labelId : undefined"
      v-bind="$attrs"
      :class="trackClass"
    >
      <div v-if="isStacked" class="flex h-full w-full">
        <div
          v-for="(run, index) in runs"
          :key="run.label ?? index"
          :class="segmentClass(run.variant)"
          :style="{ width: `${run.percent}%` }"
        />
      </div>
      <ProgressIndicator v-else :class="indicatorClass" :style="indicatorStyle" />
    </ProgressRoot>

    <!--
      The runs are `aria-hidden` through the track, so the legend is the only
      place a screen reader meets the breakdown. It is text, not a tooltip,
      for exactly that reason.
    -->
    <ul v-if="legend.length" :class="legendClass">
      <li v-for="(run, index) in legend" :key="run.label ?? index" :class="legendItemClass">
        <span :class="swatchClass(run.variant)" />
        <span>{{ run.label }}</span>
        <span :class="legendValueClass">
          {{ props.formatValue ? props.formatValue(run.value, props.max) : `${Math.round((run.value / props.max) * 100)}%` }}
        </span>
      </li>
    </ul>
  </div>
</template>
