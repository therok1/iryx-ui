<script setup lang="ts">
import type { SparseValue } from '../composables/scale'
import { computed, ref } from 'vue'
import { AXIS_GAP, cartesianLayout, clampTooltip } from '../composables/cartesian'
import { useElementSize } from '../composables/element-size'
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

const formatter = computed(() => new Intl.NumberFormat(props.locale, props.format))
function formatValue(value: number): string {
  return formatter.value.format(value)
}

const layout = computed(() => cartesianLayout({
  values: props.data.map(datum => datum.value),
  categories: props.data.length,
  longestLabel: Math.max(...props.data.map(datum => datum.label.length), 1),
  width: width.value,
  height: props.height,
  tickCount: props.ticks,
  showAxis: props.axis,
  formatTick: formatValue,
  // Bars are read by length, so a truncated baseline makes the comparison lie.
  includeZero: true,
}))

const plot = computed(() => layout.value.plot)
const yScale = computed(() => layout.value.y)
const bandWidth = computed(() => layout.value.bandWidth)

/**
 * A proportion of the band, then capped — never the band minus a fixed gap.
 *
 * Subtracting a constant is fine at wide bands and collapses at narrow ones:
 * at a 10px band an 8px gap leaves a 2px sliver, so adding categories quietly
 * turns the bars into hairlines. Taking a share of the band shrinks the bar
 * and its gap together, which is what every charting library does. The 24px
 * cap then stops a handful of categories rendering as slabs.
 */
const BAR_SHARE = 0.7
const barWidth = computed(() => Math.max(2, Math.min(24, bandWidth.value * BAR_SHARE)))

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
    const centre = layout.value.bandCentre(index)

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

/** Every nth label; the rest would collide. Dropping beats rotating. */
const labelStep = computed(() => layout.value.labelStep)

const hovered = ref<number>()

const tooltip = computed(() => {
  if (hovered.value == null)
    return undefined
  const datum = props.data[hovered.value]
  if (!datum || typeof datum.value !== 'number')
    return undefined

  const label = datum.label
  const value = formatValue(datum.value)

  return {
    label,
    value,
    // Anchored to the band, not the pointer: a tooltip that follows the cursor
    // inside a bar wobbles for no informational gain.
    x: clampTooltip(layout.value.bandCentre(hovered.value), label + value, width.value),
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
        <g v-for="tick in layout.ticks" :key="`tick-${tick}`">
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
