<script setup lang="ts">
import type { SparseValue } from '../composables/scale'
import { computed, ref } from 'vue'
import { useElementSize } from '../composables/element-size'
import { extent, linearScale, niceTicks } from '../composables/scale'
import { useIryxUiConfig } from '../config'
import { barChartTheme } from '../theme/bar-chart'

export interface BarChartDatum {
  label: string
  /** `null` is a missing reading — no bar is drawn, which is not the same as 0. */
  value: SparseValue
}

export interface BarChartProps {
  data?: readonly BarChartDatum[]
  /** Rendered height in px. Width always fills the container. */
  height?: number
  /** Target tick count. The axis lands on round numbers, so this is a hint. */
  ticks?: number
  /** Drop the value axis and its gridlines. */
  axis?: boolean
  /** Locale and options for every number shown — ticks and tooltip alike. */
  locale?: string
  format?: Intl.NumberFormatOptions
  /**
   * Accessible name for the figure. The bars are hidden from assistive tech
   * and the data is exposed as a table instead, so this names what that is.
   */
  label?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  ui?: Partial<Record<
    'root' | 'svg' | 'grid' | 'tick' | 'category' | 'bar' | 'tooltip'
    | 'tooltipLabel' | 'tooltipValue' | 'table',
    string
  >>
}

const props = withDefaults(defineProps<BarChartProps>(), {
  data: () => [],
  height: 240,
  ticks: 5,
  axis: true,
  unstyled: undefined,
})

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const root = ref<HTMLElement>()
const { width } = useElementSize(root)

/** Rough text metrics. Measuring for real would cost a layout pass per label. */
const CHAR_WIDTH = 6.5
const AXIS_GAP = 8
const CATEGORY_HEIGHT = 20
const TOP_PAD = 8

const formatter = computed(() => new Intl.NumberFormat(props.locale, props.format))
function formatValue(value: number): string {
  return formatter.value.format(value)
}

/** The axis decides the domain, not the data — see `niceTicks`. */
const axis = computed(() => {
  const span = extent(props.data.map(datum => datum.value))
  if (!span)
    return niceTicks(0, 1, props.ticks)

  // Bars grow from a baseline, so zero always has to be inside the domain or
  // the lengths stop being comparable.
  return niceTicks(Math.min(0, span[0]), Math.max(0, span[1]), props.ticks)
})

const gutter = computed(() => {
  if (!props.axis)
    return 0
  const widest = Math.max(...axis.value.ticks.map(tick => formatValue(tick).length), 1)
  return Math.ceil(widest * CHAR_WIDTH) + AXIS_GAP
})

const plot = computed(() => ({
  left: gutter.value,
  top: TOP_PAD,
  width: Math.max(width.value - gutter.value, 0),
  height: Math.max(props.height - TOP_PAD - CATEGORY_HEIGHT, 0),
}))

const yScale = computed(() =>
  linearScale([axis.value.min, axis.value.max], [plot.value.top + plot.value.height, plot.value.top]),
)

const bandWidth = computed(() =>
  props.data.length ? plot.value.width / props.data.length : 0,
)

/**
 * Capped rather than filling the slot: a bar that eats its whole band leaves
 * no air between neighbours, and the gap is what separates them.
 */
const barWidth = computed(() => Math.min(24, Math.max(bandWidth.value - 8, 1)))

interface Bar { x: number, y: number, width: number, height: number, up: boolean, datum: BarChartDatum }

const bars = computed<Bar[]>(() => {
  if (!width.value || !props.data.length)
    return []

  const baseline = yScale.value(0)

  return props.data.flatMap((datum, index) => {
    const value = datum.value
    if (typeof value !== 'number' || !Number.isFinite(value))
      return []

    const y = yScale.value(value)
    const centre = plot.value.left + bandWidth.value * (index + 0.5)

    return [{
      x: centre - barWidth.value / 2,
      y: Math.min(y, baseline),
      width: barWidth.value,
      height: Math.abs(baseline - y),
      up: value >= 0,
      datum,
    }]
  })
})

/**
 * Rounded at the data end, square at the baseline — the rounding reads as the
 * tip of the value, so rounding both ends would detach the bar from its axis.
 */
function barPath(bar: Bar): string {
  const radius = Math.min(4, bar.width / 2, bar.height)
  const { x, width: w } = bar
  const right = x + w

  if (bar.up) {
    const top = bar.y
    const base = bar.y + bar.height
    return `M${x} ${base} L${x} ${top + radius} Q${x} ${top} ${x + radius} ${top} L${right - radius} ${top} Q${right} ${top} ${right} ${top + radius} L${right} ${base} Z`
  }

  const base = bar.y
  const bottom = bar.y + bar.height
  return `M${x} ${base} L${x} ${bottom - radius} Q${x} ${bottom} ${x + radius} ${bottom} L${right - radius} ${bottom} Q${right} ${bottom} ${right} ${bottom - radius} L${right} ${base} Z`
}

/**
 * Show every nth category label so they never overlap. Dropping labels beats
 * rotating them, which costs more height and is harder to read.
 */
const labelStep = computed(() => {
  if (!bandWidth.value || !props.data.length)
    return 1
  const widest = Math.max(...props.data.map(datum => datum.label.length), 1)
  return Math.max(1, Math.ceil((widest * CHAR_WIDTH + 8) / bandWidth.value))
})

const hovered = ref<number>()

const tooltip = computed(() => {
  if (hovered.value == null)
    return undefined
  const datum = props.data[hovered.value]
  if (!datum || typeof datum.value !== 'number')
    return undefined

  const label = datum.label
  const value = formatValue(datum.value)

  /**
   * Kept inside the chart's own box. Estimated from the text rather than
   * measured: measuring needs an extra tick, during which the tooltip is
   * visible at the unclamped position and visibly jumps.
   */
  const estimatedWidth = (label.length + value.length) * CHAR_WIDTH + 28
  const half = estimatedWidth / 2
  const centre = plot.value.left + bandWidth.value * (hovered.value + 0.5)

  return {
    label,
    value,
    // Anchored to the band, not the pointer: a tooltip that follows the cursor
    // inside a bar wobbles for no informational gain.
    x: Math.min(Math.max(centre, half), Math.max(width.value - half, half)),
    y: Math.min(yScale.value(datum.value), yScale.value(0)),
  }
})

const theme = computed(() => barChartTheme())

function slotClass(slot: keyof NonNullable<BarChartProps['ui']>, extra?: string) {
  const override = props.ui?.[slot]
  return isUnstyled.value ? [override, extra] : theme.value[slot]({ class: [override, extra] })
}

function barClass(index: number) {
  const faded = hovered.value != null && hovered.value !== index
  return isUnstyled.value
    ? [props.ui?.bar]
    : theme.value.bar({ class: [props.ui?.bar, faded ? theme.value.faded() : undefined] })
}
</script>

<template>
  <div
    ref="root"
    :role="props.label ? 'figure' : undefined"
    :aria-label="props.label"
    :class="slotClass('root', props.class)"
  >
    <svg
      :width="width"
      :height="props.height"
      :viewBox="`0 0 ${width} ${props.height}`"
      aria-hidden="true"
      :class="slotClass('svg')"
    >
      <template v-if="props.axis">
        <g v-for="tick in axis.ticks" :key="`tick-${tick}`">
          <line
            :x1="plot.left"
            :y1="yScale(tick)"
            :x2="plot.left + plot.width"
            :y2="yScale(tick)"
            stroke-width="1"
            :class="slotClass('grid')"
          />
          <text
            :x="plot.left - AXIS_GAP"
            :y="yScale(tick)"
            text-anchor="end"
            dominant-baseline="middle"
            :class="slotClass('tick')"
          >
            {{ formatValue(tick) }}
          </text>
        </g>
      </template>

      <path
        v-for="(bar, index) in bars"
        :key="`bar-${bar.datum.label}-${index}`"
        :d="barPath(bar)"
        :class="barClass(index)"
      />

      <template v-for="(datum, index) in props.data" :key="`label-${datum.label}-${index}`">
        <text
          v-if="index % labelStep === 0"
          :x="plot.left + bandWidth * (index + 0.5)"
          :y="plot.top + plot.height + 14"
          text-anchor="middle"
          :class="slotClass('category')"
        >
          {{ datum.label }}
        </text>
      </template>

      <!-- Hit targets span the whole band and the full plot height, so a short
           bar is no harder to hover than a tall one. -->
      <rect
        v-for="(datum, index) in props.data"
        :key="`hit-${datum.label}-${index}`"
        :x="plot.left + bandWidth * index"
        :y="plot.top"
        :width="bandWidth"
        :height="plot.height"
        :class="isUnstyled ? undefined : theme.hit()"
        @pointerenter="hovered = index"
        @pointerleave="hovered = undefined"
      />
    </svg>

    <div
      v-if="tooltip"
      :class="slotClass('tooltip')"
      :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px`, transform: 'translate(-50%, -100%) translateY(-8px)' }"
    >
      <span :class="slotClass('tooltipLabel')">{{ tooltip.label }}</span>
      <span :class="slotClass('tooltipValue')">{{ tooltip.value }}</span>
    </div>

    <!-- The marks are decorative to assistive tech; this carries the data. -->
    <table :class="slotClass('table')">
      <caption>{{ props.label }}</caption>
      <thead>
        <tr>
          <th scope="col">
            Category
          </th><th scope="col">
            Value
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(datum, index) in props.data" :key="`row-${datum.label}-${index}`">
          <th scope="row">
            {{ datum.label }}
          </th>
          <td>{{ typeof datum.value === 'number' ? formatValue(datum.value) : '—' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
