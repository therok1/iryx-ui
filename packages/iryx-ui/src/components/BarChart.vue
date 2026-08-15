<script setup lang="ts">
import type { ChartSeries } from '../composables/cartesian'
import type { SparseValue } from '../composables/scale'
import { computed, ref } from 'vue'
import { AXIS_GAP, cartesianLayout, clampTooltip, seriesColor, slotOf, warnOnSlotOverflow } from '../composables/cartesian'
import { useElementSize } from '../composables/element-size'
import { useIryxUiConfig } from '../config'
import { barChartTheme } from '../theme/bar-chart'
import ChartLegend from './ChartLegend.vue'

/**
 * A row. `value` is the single-series shortcut; with `series` set, each entry
 * reads its own key off the row instead — plain objects and a descriptor, the
 * same shape `ITable` uses.
 */
export interface BarChartDatum {
  label: string
  /** `null` is a missing reading — no bar is drawn, which is not the same as 0. */
  value?: SparseValue
  [key: string]: unknown
}

export interface BarChartProps {
  data?: readonly BarChartDatum[]
  /** Two or more measures per category. Omit for the single-series case. */
  series?: readonly ChartSeries[]
  /** Rendered height in px. Width always fills the container. */
  height?: number
  /** Target tick count. The axis lands on round numbers, so this is a hint. */
  ticks?: number
  /** Drop the value axis and its gridlines. */
  axis?: boolean
  /** Drop the legend. Only honoured for a single series — see below. */
  legend?: boolean
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
  legend: true,
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

/** Single series is just the one-entry case, so there is one code path. */
const series = computed<ChartSeries[]>(() => {
  const declared = props.series?.length ? [...props.series] : [{ key: 'value' }]
  warnOnSlotOverflow(declared.length)
  return declared
})

const isMulti = computed(() => series.value.length > 1)

/**
 * Colour alone is not a dependable identity channel, so from two series up the
 * legend is not optional — `legend: false` only silences the single-series
 * case, where the chart's own title already names what is plotted.
 */
const showLegend = computed(() => isMulti.value || (props.legend && series.value[0]!.name != null))

function readValue(datum: BarChartDatum, key: string): SparseValue {
  const raw = datum[key]
  return typeof raw === 'number' && Number.isFinite(raw) ? raw : null
}

const layout = computed(() => cartesianLayout({
  values: props.data.flatMap(datum => series.value.map(entry => readValue(datum, entry.key))),
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
 * Each series takes a share of the band, so grouped bars stay inside their own
 * category. Sized as a proportion rather than the band minus a fixed gap: a
 * constant collapses at narrow bands and leaves hairlines.
 */
const BAR_SHARE = 0.7
const groupWidth = computed(() => bandWidth.value * BAR_SHARE)
const barWidth = computed(() =>
  Math.max(2, Math.min(24, groupWidth.value / series.value.length)),
)

interface Bar {
  x: number
  y: number
  width: number
  height: number
  up: boolean
  seriesIndex: number
  categoryIndex: number
}

const bars = computed<Bar[]>(() => {
  if (!width.value || !props.data.length)
    return []

  const baseline = yScale.value(0)
  const total = series.value.length

  return props.data.flatMap((datum, categoryIndex) =>
    series.value.flatMap((entry, seriesIndex) => {
      const value = readValue(datum, entry.key)
      if (value == null)
        return []

      const y = yScale.value(value)
      // Group centred on the band, then each bar offset within the group.
      const groupLeft = layout.value.bandCentre(categoryIndex) - (barWidth.value * total) / 2

      return [{
        x: groupLeft + barWidth.value * seriesIndex,
        y: Math.min(y, baseline),
        width: barWidth.value,
        height: Math.abs(baseline - y),
        up: value >= 0,
        seriesIndex,
        categoryIndex,
      }]
    }),
  )
})

/**
 * Rounded at the data end, square at the baseline — the rounding reads as the
 * tip of the value, so rounding both ends would detach the bar from its axis.
 * Grouped bars leave a 2px gap so neighbours read as separate marks.
 */
function barPath(bar: Bar): string {
  const gap = series.value.length > 1 ? 1 : 0
  const x = bar.x + gap
  const w = Math.max(bar.width - gap * 2, 1)
  const radius = Math.min(4, w / 2, bar.height)
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

/** Every series' reading for the hovered category, so one hover answers it all. */
const tooltip = computed(() => {
  if (hovered.value == null)
    return undefined
  const datum = props.data[hovered.value]
  if (!datum)
    return undefined

  const rows = series.value
    .map((entry, index) => ({
      name: entry.name ?? entry.key,
      color: seriesColor(slotOf(entry, index)),
      value: readValue(datum, entry.key),
    }))
    .filter(row => row.value != null)
    .map(row => ({ ...row, value: formatValue(row.value!) }))

  if (!rows.length)
    return undefined

  const widest = Math.max(...rows.map(row => row.name.length + row.value.length))
  const top = Math.min(
    ...series.value.map((entry) => {
      const value = readValue(datum, entry.key)
      return value == null ? Number.POSITIVE_INFINITY : Math.min(yScale.value(value), yScale.value(0))
    }),
  )

  return {
    label: datum.label,
    rows,
    multi: isMulti.value,
    x: clampTooltip(layout.value.bandCentre(hovered.value), 'x'.repeat(widest), width.value),
    y: top,
  }
})

const theme = computed(() => barChartTheme())

function slotClass(slot: keyof NonNullable<BarChartProps['ui']>, extra?: string) {
  const override = props.ui?.[slot]
  return isUnstyled.value ? [override, extra] : theme.value[slot]({ class: [override, extra] })
}

function barClass(bar: Bar) {
  const faded = hovered.value != null && hovered.value !== bar.categoryIndex
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
    <ChartLegend v-if="showLegend" :series="series" :unstyled="props.unstyled" />

    <div :class="isUnstyled ? undefined : theme.plot()">
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

        <!-- Colour is set inline, not by class: Tailwind cannot generate a class
           name assembled at runtime, so `fill-chart-3` would never exist. -->
        <path
          v-for="(bar, index) in bars"
          :key="`bar-${bar.categoryIndex}-${bar.seriesIndex}-${index}`"
          :d="barPath(bar)"
          :style="{ fill: seriesColor(slotOf(series[bar.seriesIndex]!, bar.seriesIndex)) }"
          :class="barClass(bar)"
        />

        <template v-for="(datum, index) in props.data" :key="`label-${datum.label}-${index}`">
          <text
            v-if="index % labelStep === 0"
            :x="layout.bandCentre(index)"
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
        :class="slotClass('tooltip', tooltip.multi ? 'flex-col items-start gap-1' : undefined)"
        :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px`, transform: 'translate(-50%, -100%) translateY(-8px)' }"
      >
        <span :class="slotClass('tooltipLabel')">{{ tooltip.label }}</span>
        <template v-if="tooltip.multi">
          <span v-for="row in tooltip.rows" :key="row.name" class="flex items-center gap-1.5">
            <span class="size-2 shrink-0 rounded-full" :style="{ background: row.color }" />
            <span :class="slotClass('tooltipLabel')">{{ row.name }}</span>
            <span :class="slotClass('tooltipValue')">{{ row.value }}</span>
          </span>
        </template>
        <span v-else :class="slotClass('tooltipValue')">{{ tooltip.rows[0]!.value }}</span>
      </div>
    </div>

    <!-- The marks are decorative to assistive tech; this carries the data. -->
    <table :class="slotClass('table')">
      <caption>{{ props.label }}</caption>
      <thead>
        <tr>
          <th scope="col">
            Category
          </th>
          <th v-for="entry in series" :key="entry.key" scope="col">
            {{ entry.name ?? 'Value' }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(datum, index) in props.data" :key="`row-${datum.label}-${index}`">
          <th scope="row">
            {{ datum.label }}
          </th>
          <td v-for="entry in series" :key="entry.key">
            {{ readValue(datum, entry.key) == null ? '—' : formatValue(readValue(datum, entry.key)!) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
