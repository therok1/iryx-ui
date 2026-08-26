<script setup lang="ts">
import type { ClassValue } from '../class-value'
import type { ChartSeries } from '../composables/cartesian'
import type { ChartAnimate } from '../composables/chart-reveal'
import type { SparseValue } from '../composables/scale'
import { computed, ref, useId } from 'vue'
import { AXIS_GAP, cartesianLayout, clampTooltip, seriesColor, slotOf, warnOnSlotOverflow } from '../composables/cartesian'
import { useChartAnimation, useChartReveal } from '../composables/chart-reveal'
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
  /**
   * How much to curve the line, from `0` (straight segments between
   * readings) to `1` (fully rounded). Straight by default: a curve claims the
   * readings run continuously into each other, which is true of a temperature
   * trace and false of six monthly totals.
   */
  tension?: number
  /**
   * Carry the line and its fill flat out to the left and right edges of the
   * plot. The readings themselves do not move — markers, labels and the
   * tooltip stay where they are — so the chart fills its box without
   * pretending to know a value it was never given.
   */
  flush?: boolean
  /** Rendered height in px. Width always fills the container. */
  height?: number
  /** Target tick count. The axis lands on round numbers, so this is a hint. */
  ticks?: number
  /** Drop the value axis and its gridlines. */
  axis?: boolean
  /**
   * Draw the line on across the plot on the first paint. Skipped for a reader
   * who has asked for reduced motion, and played once — not again when the
   * data changes underneath it.
   */
  animate?: ChartAnimate
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
  class?: ClassValue
  ui?: Partial<Record<
    'root' | 'svg' | 'grid' | 'tick' | 'category' | 'line' | 'area' | 'crosshair'
    | 'marker' | 'markerRing' | 'tooltip' | 'tooltipLabel' | 'tooltipValue' | 'table',
    string
  >>
}

const props = withDefaults(defineProps<LineChartProps>(), {
  tension: 0,
  flush: undefined,
  data: () => [],
  variant: 'line',
  height: 240,
  ticks: 5,
  axis: true,
  animate: true,
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
        x: round(layout.value.pointAt(index)),
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

/** Where the data starts and ends, and the plot edges it can be carried to. */
const edgeX = computed(() => {
  const count = props.data?.length ?? 0
  return {
    first: count ? round(layout.value.pointAt(0)) : 0,
    last: count ? round(layout.value.pointAt(count - 1)) : 0,
    left: round(layout.value.plot.left),
    right: round(layout.value.plot.left + layout.value.plot.width),
  }
})

function tail(last: Point): string {
  return props.flush && last.x === edgeX.value.last
    ? `L${edgeX.value.right} ${last.y}`
    : ''
}

/** `tension` is a 0–1 dial; a Catmull-Rom spline wants a sixth of it. */
const curve = computed(() => Math.min(Math.max(props.tension, 0), 1) / 6)

/*
 * Catmull-Rom through the readings, converted to the cubic segments SVG
 * draws, with each control point clamped to the pair it sits between.
 *
 * The clamp is the whole point. An unclamped spline overshoots: between a low
 * reading and a high one it swings past both, so the curve dips under the
 * smallest number in the data and over the largest. On a decorative shape
 * that is a flourish; on a chart it draws values that were never measured.
 */
function toLine(points: Point[]): string {
  const first = points[0]!
  const last = points[points.length - 1]!

  /*
   * Only the run that actually reaches an end of the data gets extended. A
   * series broken by a gap renders as several runs, and carrying an inner
   * one out to the edge would draw straight through the gap it was split for.
   */
  const lead = props.flush && first.x === edgeX.value.first
    ? `M${edgeX.value.left} ${first.y} L${first.x} ${first.y}`
    : `M${first.x} ${first.y}`

  const start = lead
  if (curve.value === 0 || points.length < 2) {
    const line = points.slice(1).map(point => `L${point.x} ${point.y}`)
    return [start, ...line, tail(last)].filter(Boolean).join(' ')
  }

  const clamp = (value: number, a: number, b: number) =>
    Math.min(Math.max(value, Math.min(a, b)), Math.max(a, b))

  const segments = points.slice(1).map((point, index) => {
    const p1 = points[index]!
    // The ends have no neighbour beyond them, so they double back on themselves.
    const p0 = points[index - 1] ?? p1
    const p2 = point
    const p3 = points[index + 2] ?? p2

    const c1x = p1.x + (p2.x - p0.x) * curve.value
    const c1y = clamp(p1.y + (p2.y - p0.y) * curve.value, p1.y, p2.y)
    const c2x = p2.x - (p3.x - p1.x) * curve.value
    const c2y = clamp(p2.y - (p3.y - p1.y) * curve.value, p1.y, p2.y)

    return `C${round(c1x)} ${round(c1y)}, ${round(c2x)} ${round(c2y)}, ${p2.x} ${p2.y}`
  })

  return [start, ...segments, tail(last)].filter(Boolean).join(' ')
}

/** Closed to the bottom of the plot, not to zero — the axis may not show it. */
function toArea(points: Point[]): string {
  const base = layout.value.plot.top + layout.value.plot.height
  const first = points[0]!
  const last = points[points.length - 1]!
  // Closed under whatever the line actually spans, extensions included.
  const leftX = props.flush && first.x === edgeX.value.first ? edgeX.value.left : first.x
  const rightX = props.flush && last.x === edgeX.value.last ? edgeX.value.right : last.x
  return `${toLine(points)} L${rightX} ${base} L${leftX} ${base} Z`
}

/*
 * A gradient needs an id, and two charts on the same page must not share
 * one — the second would reference the first's stops and inherit its
 * colour. `useId` is unique per component instance and stable across SSR
 * and hydration, which a counter or a random string is not.
 */
const areaGradientId = `iryx-area-${useId()}`
/** Same reasoning for the reveal's clip path. */
const plotClipId = `iryx-plot-clip-${useId()}`

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
  hovered.value == null ? undefined : round(layout.value.pointAt(hovered.value)),
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
    x: clampTooltip(layout.value.pointAt(hovered.value), 'x'.repeat(widest), width.value),
    y: Math.min(...markers.value.map(marker => marker.y), layout.value.plot.top + layout.value.plot.height),
  }
})

const animation = useChartAnimation(computed(() => props.animate))
const ready = computed(() => Boolean(width.value && lines.value.length))
const { revealed } = useChartReveal(ready, animation)

/**
 * One clip rectangle widening across the plot, uncovering the line and its
 * wash together.
 *
 * Drawing the line on with a dash offset was tried and dropped: a dash
 * advances along the *path* and a fill can only be uncovered along *x*, so
 * the two drift apart wherever the line is steep.
 */
const plotReveal = computed(() => ({
  transform: `scaleX(${revealed.value ? 1 : 0})`,
  transformOrigin: `${layout.value.plot.left}px 0px`,
  transition: `transform ${animation.value.duration}ms ${animation.value.css}`,
}))

const theme = computed(() => lineChartTheme())

function slotClass(slot: keyof NonNullable<LineChartProps['ui']>, extra?: ClassValue) {
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

        <!--
          The wash fades out downwards rather than sitting as one flat tint,
          so the line stays the strongest thing in the plot and the area
          reads as depth under it rather than as a filled shape.
        -->
        <defs v-if="showArea">
          <linearGradient :id="areaGradientId" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="currentColor" stop-opacity="0.35" />
            <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
          </linearGradient>

          <!--
            The reveal's wipe. It widens with the line rather than fading,
            and lives here so the area keeps its own translucency — an
            opacity applied to the shape would override the wash's.
          -->
          <clipPath :id="plotClipId">
            <rect
              :x="layout.plot.left"
              :y="layout.plot.top"
              :width="layout.plot.width"
              :height="layout.plot.height"
              :style="plotReveal"
            />
          </clipPath>
        </defs>

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

        <!--
          The line and its wash share one clip, so the reveal uncovers them
          together. Colour is set inline, not by class: Tailwind cannot
          generate a class name assembled at runtime, so `stroke-chart-3`
          would never exist.
        -->
        <g :clip-path="`url(#${plotClipId})`">
          <!-- Behind the line, so the wash never dulls the reading itself. -->
          <path
            v-for="(points, index) in showArea ? lines[0]!.runs : []"
            :key="`area-${index}`"
            :d="toArea(points)"
            :fill="`url(#${areaGradientId})`"
            :style="{ color: lines[0]!.color }"
            :class="slotClass('area')"
          />

          <template v-for="line in lines" :key="`series-${line.seriesIndex}`">
            <path
              v-for="(points, index) in line.runs"
              :key="`line-${line.seriesIndex}-${index}`"
              :d="toLine(points)"
              :style="{ stroke: line.color }"
              :class="slotClass('line')"
            />
          </template>
        </g>

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
            :x="layout.pointAt(index)"
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

    <!--
      The marks are decorative to assistive tech; this carries the data.

      `sr-only` goes on a wrapper rather than on the table itself. A table
      treats a specified width as a *minimum* and refuses to shrink below
      its content, so `sr-only` left it at full content size — absolutely
      positioned, still measured, and adding its height to the document's
      scroll area. A page with two charts grew a second scrollbar behind
      the app. A div honours the 1px box and clips the table inside it.
    -->
    <div :class="slotClass('table')">
      <table>
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
  </div>
</template>
