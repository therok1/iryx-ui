<script setup lang="ts">
import type { ChartSeries } from '../composables/cartesian'
import type { SparseValue } from '../composables/scale'
import { computed, ref } from 'vue'
import { AXIS_GAP, cartesianLayout, clampTooltip, seriesColor, slotOf, warnOnSlotOverflow } from '../composables/cartesian'
import { useElementSize } from '../composables/element-size'
import { useIryxUiConfig } from '../config'
import { lineChartTheme } from '../theme/line-chart'
import ChartLegend from './ChartLegend.vue'

/**
 * A row. `value` is the single-series shortcut; with `series` set, each entry
 * reads its own key off the row instead.
 */
export interface LineChartDatum {
  label: string
  /** `null` is a missing reading — the line breaks rather than bridging it. */
  value?: SparseValue
  [key: string]: unknown
}

export interface LineChartProps {
  data?: readonly LineChartDatum[]
  /** Two or more measures per category. Omit for the single-series case. */
  series?: readonly ChartSeries[]
  /**
   * `area` adds a wash beneath the line. Ignored for multiple series, where
   * overlapping washes muddy into a colour that belongs to neither.
   */
  variant?: 'line' | 'area'
  /** Rendered height in px. Width always fills the container. */
  height?: number
  /** Target tick count. The axis lands on round numbers, so this is a hint. */
  ticks?: number
  /** Drop the value axis and its gridlines. */
  axis?: boolean
  /** Drop the legend. Only honoured for a single series. */
  legend?: boolean
  /**
   * Force zero onto the axis. Off by default: a line is read by its shape, and
   * a series hovering around 8,000 flattens into a straight edge once the axis
   * starts at nothing. Bars are the opposite case and always include zero.
   */
  zero?: boolean
  /** Locale and options for every number shown — ticks and tooltip alike. */
  locale?: string
  format?: Intl.NumberFormatOptions
  /**
   * Accessible name for the figure. The line is hidden from assistive tech and
   * the data is exposed as a table instead, so this names what that is.
   */
  label?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  ui?: Partial<Record<
    'root' | 'svg' | 'grid' | 'tick' | 'category' | 'line' | 'area' | 'crosshair'
    | 'marker' | 'markerRing' | 'tooltip' | 'tooltipLabel' | 'tooltipValue' | 'table',
    string
  >>
}

const props = withDefaults(defineProps<LineChartProps>(), {
  data: () => [],
  variant: 'line',
  height: 240,
  ticks: 5,
  axis: true,
  legend: true,
  zero: false,
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

/** Mandatory from two series up: colour alone is not a dependable identity. */
const showLegend = computed(() => isMulti.value || (props.legend && series.value[0]!.name != null))

function readValue(datum: LineChartDatum, key: string): SparseValue {
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
  includeZero: props.zero,
}))

interface Point { x: number, y: number, index: number }

function round(value: number): number {
  return Math.round(value * 100) / 100
}

/** Runs of consecutive readings per series. A gap ends one run, starts the next. */
const lines = computed(() => {
  if (!width.value)
    return []

  return series.value.map((entry, seriesIndex) => {
    const runs: Point[][] = []
    let current: Point[] = []

    props.data.forEach((datum, index) => {
      const value = readValue(datum, entry.key)
      if (value == null) {
        if (current.length)
          runs.push(current)
        current = []
        return
      }
      current.push({
        x: round(layout.value.bandCentre(index)),
        y: round(layout.value.y(value)),
        index,
      })
    })

    if (current.length)
      runs.push(current)

    return { runs, color: seriesColor(slotOf(entry, seriesIndex)), seriesIndex }
  })
})

/**
 * A wash under several lines muddies into a colour belonging to neither, so
 * only the single-series case gets one. Also gated on there being a measured
 * line at all — before the first measurement there is nothing to fill under.
 */
const showArea = computed(() => props.variant === 'area' && !isMulti.value && lines.value.length > 0)

function toLine(points: Point[]): string {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`).join(' ')
}

/** Closed to the bottom of the plot, not to zero — the axis may not show it. */
function toArea(points: Point[]): string {
  const base = layout.value.plot.top + layout.value.plot.height
  const first = points[0]!
  const last = points[points.length - 1]!
  return `${toLine(points)} L${last.x} ${base} L${first.x} ${base} Z`
}

const hovered = ref<number>()

/** One marker per series that actually has a reading at the hovered category. */
const markers = computed(() => {
  if (hovered.value == null)
    return []
  return lines.value.flatMap((line) => {
    for (const run of line.runs) {
      const found = run.find(point => point.index === hovered.value)
      if (found)
        return [{ ...found, color: line.color }]
    }
    return []
  })
})

const crosshairX = computed(() =>
  hovered.value == null ? undefined : round(layout.value.bandCentre(hovered.value)),
)

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

  // Matches what is rendered: one line for a single series, a row per measure
  // under the category label otherwise.
  const widest = isMulti.value
    ? Math.max(datum.label.length, ...rows.map(row => row.name.length + row.value.length + 3))
    : datum.label.length + rows[0]!.value.length + 2

  return {
    label: datum.label,
    rows,
    multi: isMulti.value,
    x: clampTooltip(layout.value.bandCentre(hovered.value), 'x'.repeat(widest), width.value),
    y: Math.min(...markers.value.map(marker => marker.y), layout.value.plot.top + layout.value.plot.height),
  }
})

const theme = computed(() => lineChartTheme())

function slotClass(slot: keyof NonNullable<LineChartProps['ui']>, extra?: string) {
  const override = props.ui?.[slot]
  return isUnstyled.value ? [override, extra] : theme.value[slot]({ class: [override, extra] })
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
              :x1="layout.plot.left"
              :y1="layout.y(tick)"
              :x2="layout.plot.left + layout.plot.width"
              :y2="layout.y(tick)"
              stroke-width="1"
              :class="slotClass('grid')"
            />
            <text
              :x="layout.plot.left - AXIS_GAP"
              :y="layout.y(tick)"
              text-anchor="end"
              dominant-baseline="middle"
              :class="slotClass('tick')"
            >
              {{ formatValue(tick) }}
            </text>
          </g>
        </template>

        <!--
          Extension points, in place of a plugin system. SVG does not need one:
          the layout is handed to the caller, who writes ordinary markup into
          it — declarative, reactive and type-checked, which an imperative draw
          hook can never be. `underlay` sits behind the marks for bands and
          shaded regions, `overlay` in front for reference lines and
          annotations. Both go under the hit targets, so hovering still works
          through whatever is drawn.
        -->
        <slot name="underlay" v-bind="layout" />

        <!-- Behind the line, so the wash never dulls the reading itself. -->
        <template v-if="showArea">
          <path
            v-for="(points, index) in lines[0]!.runs"
            :key="`area-${index}`"
            :d="toArea(points)"
            :style="{ fill: lines[0]!.color }"
            :class="slotClass('area')"
          />
        </template>

        <!-- Under the lines: a crosshair drawn on top would cut through them. -->
        <line
          v-if="crosshairX != null"
          :x1="crosshairX"
          :y1="layout.plot.top"
          :x2="crosshairX"
          :y2="layout.plot.top + layout.plot.height"
          stroke-width="1"
          :class="slotClass('crosshair')"
        />

        <!-- Colour is set inline, not by class: Tailwind cannot generate a class
           name assembled at runtime, so `stroke-chart-3` would never exist. -->
        <template v-for="line in lines" :key="`series-${line.seriesIndex}`">
          <path
            v-for="(points, index) in line.runs"
            :key="`line-${line.seriesIndex}-${index}`"
            :d="toLine(points)"
            :style="{ stroke: line.color }"
            :class="slotClass('line')"
          />
        </template>

        <!--
        One marker per series at the hovered category. A dot on every point is
        noise, and the axis plus the tooltip already carry the rest.
      -->
        <template v-for="(marker, index) in markers" :key="`marker-${index}`">
          <circle :cx="marker.x" :cy="marker.y" r="6" :class="slotClass('markerRing')" />
          <circle :cx="marker.x" :cy="marker.y" r="4" :style="{ fill: marker.color }" :class="slotClass('marker')" />
        </template>

        <template v-for="(datum, index) in props.data" :key="`label-${datum.label}-${index}`">
          <text
            v-if="index % layout.labelStep === 0"
            :x="layout.bandCentre(index)"
            :y="layout.plot.top + layout.plot.height + 14"
            text-anchor="middle"
            :class="slotClass('category')"
          >
            {{ datum.label }}
          </text>
        </template>

        <slot name="overlay" v-bind="layout" />

        <rect
          v-for="(datum, index) in props.data"
          :key="`hit-${datum.label}-${index}`"
          :x="layout.plot.left + layout.bandWidth * index"
          :y="layout.plot.top"
          :width="layout.bandWidth"
          :height="layout.plot.height"
          :class="isUnstyled ? undefined : theme.hit()"
          @pointerenter="hovered = index"
          @pointerleave="hovered = undefined"
        />
      </svg>

      <div
        v-if="tooltip"
        :class="slotClass('tooltip', tooltip.multi ? 'flex-col items-start gap-1' : undefined)"
        :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px`, transform: 'translate(-50%, -100%) translateY(-12px)' }"
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
