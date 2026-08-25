<script setup lang="ts">
import type { ChartSeries } from '../composables/cartesian'
import type { SparseValue } from '../composables/scale'
import { computed, ref } from 'vue'
import { clampTooltip, seriesColor, slotOf, warnOnSlotOverflow } from '../composables/cartesian'
import { useElementSize } from '../composables/element-size'
import { useIryxUiConfig } from '../config'
import { donutChartTheme } from '../theme/donut-chart'
import ChartLegend from './ChartLegend.vue'

/**
 * One slice. Unlike the cartesian charts there is no second axis to hold a
 * series, so the row *is* the identity: its `label` names it and its `slot`
 * pins its colour.
 */
export interface DonutChartDatum {
  label: string
  /** `null` is a missing reading — the slice is dropped, which is not a zero. */
  value?: SparseValue
  /**
   * Pin this slice to a palette slot (0-based) instead of taking its position
   * in the array. Pin every slice that can be filtered out, so the survivors
   * keep the colours the reader already learned.
   */
  slot?: number
}

export interface DonutChartProps {
  data?: readonly DonutChartDatum[]
  /**
   * Rendered height in px. The ring is a circle centred in whatever width the
   * container gives, so this is also its diameter once the box is wide enough.
   */
  size?: number
  /**
   * Ring thickness in px. Defaults to two fifths of the radius, which keeps
   * the hole large enough to hold a total at every size. Ignored when `pie`.
   */
  thickness?: number
  /**
   * Fill the middle in and draw a pie instead.
   *
   * The ring is the better default: a pie asks the reader to compare angles
   * and areas, a donut only arc lengths, and the hole is somewhere to put the
   * total the slices add up to.
   */
  pie?: boolean
  /**
   * The gap between neighbouring slices, in px. `0` closes it and lets them
   * touch.
   *
   * A width rather than an angle, and held the same all the way across: each
   * edge is pushed half a gap off its own radius, so the divider reads as a
   * line instead of a wedge that widens towards the rim. In a pie that is
   * also why a slice stops a hair short of the centre — two parallel edges
   * meet before they reach it.
   */
  gap?: number
  /** Drop the legend. */
  legend?: boolean
  /** Locale and options for every number shown — the total and the tooltip. */
  locale?: string
  format?: Intl.NumberFormatOptions
  /**
   * Accessible name for the figure. The slices are hidden from assistive tech
   * and the data is exposed as a table instead, so this names what that is.
   */
  label?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  ui?: Partial<Record<
    'root' | 'svg' | 'slice' | 'center' | 'tooltip' | 'tooltipLabel'
    | 'tooltipValue' | 'tooltipShare' | 'table',
    string
  >>
}

const props = withDefaults(defineProps<DonutChartProps>(), {
  data: () => [],
  size: 240,
  gap: 2,
  legend: true,
  unstyled: undefined,
})

defineSlots<{
  /**
   * The hole. Given the total and its formatted form, so the usual figure
   * plus caption is one line of markup.
   */
  center?: (props: { total: number, formatted: string }) => unknown
}>()

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const root = ref<HTMLElement>()
const { width } = useElementSize(root)

const formatter = computed(() => new Intl.NumberFormat(props.locale, props.format))
function formatValue(value: number): string {
  return formatter.value.format(value)
}

/**
 * A share is a proportion of the whole, so it is formatted as a percent
 * regardless of what `format` does to the values — a currency option applied
 * to `0.42` would render the share as money.
 */
const shareFormatter = computed(() =>
  new Intl.NumberFormat(props.locale, { style: 'percent', maximumFractionDigits: 1 }),
)

let warnedNegative = false

/**
 * Dev-only warning. A part-of-whole chart has no way to draw a negative — it
 * would have to eat into its own total — so those rows are dropped, and being
 * told beats a slice quietly going missing.
 *
 * `process.env.NODE_ENV` is read as a bare global on purpose; see the note on
 * `warnOnSlotOverflow`.
 */
function warnOnNegative(): void {
  if (warnedNegative || process.env.NODE_ENV === 'production')
    return
  warnedNegative = true
  console.warn(
    '[iryx-ui] IDonutChart dropped a negative value. A share of a whole cannot '
    + 'be negative — plot the magnitudes, or use IBarChart, which has a baseline.',
  )
}

interface Slice {
  label: string
  value: number
  share: number
  color: string
  /** Index into `data`, so a slice still knows the row it came from. */
  index: number
}

const slices = computed<Slice[]>(() => {
  const rows = props.data
    .map((datum, index) => ({ datum, index }))
    .filter(({ datum }) => {
      const value = datum.value
      if (typeof value !== 'number' || !Number.isFinite(value) || value === 0)
        return false
      if (value < 0) {
        warnOnNegative()
        return false
      }
      return true
    })

  warnOnSlotOverflow(rows.length)

  const total = rows.reduce((sum, { datum }) => sum + (datum.value as number), 0)

  return rows.map(({ datum, index }) => ({
    label: datum.label,
    value: datum.value as number,
    share: total ? (datum.value as number) / total : 0,
    color: seriesColor(slotOf(datum, index)),
    index,
  }))
})

const total = computed(() => slices.value.reduce((sum, slice) => sum + slice.value, 0))

/** The shape `IChartLegend` reads. A slice's label is both its name and its key. */
const legendSeries = computed<ChartSeries[]>(() =>
  // Two slices can share a label, so the key carries the index to stay unique.
  slices.value.map(slice => ({
    key: `${slice.index}-${slice.label}`,
    name: slice.label,
    slot: props.data[slice.index]?.slot ?? slice.index,
  })),
)

const showLegend = computed(() => props.legend && slices.value.length > 0)

const centre = computed(() => ({ x: width.value / 2, y: props.size / 2 }))
const outer = computed(() => Math.max(Math.min(width.value, props.size) / 2, 0))

/**
 * Clamped rather than trusted: a thickness past the radius would give a
 * negative inner radius, and SVG draws that as a second ring turned inside
 * out rather than as the solid disc the caller meant.
 */
const inner = computed(() => {
  if (props.pie)
    return 0
  const thickness = Math.min(props.thickness ?? outer.value * 0.4, outer.value)
  return Math.max(outer.value - thickness, 0)
})

/**
 * Slices start at twelve o'clock and run clockwise, which is where a reader
 * expects a share to begin. SVG's angles start at three o'clock, hence the
 * quarter turn.
 */
const START = -Math.PI / 2

/** Half a gap is the distance each of the two edges is held off its radius. */
const halfGap = computed(() => Math.max(props.gap, 0) / 2)

/**
 * Two decimals is under a tenth of a device pixel, and it keeps the path free
 * of the exponent notation a trigonometric near-zero renders as — `2.4e-14` is
 * legal in a path, but nothing downstream expects to parse it.
 */
function round(value: number): number {
  return Math.round(value * 100) / 100
}

function point(radius: number, angle: number): [number, number] {
  return [
    round(centre.value.x + radius * Math.cos(angle)),
    round(centre.value.y + radius * Math.sin(angle)),
  ]
}

interface Arc extends Slice {
  /** Mid-angle, for placing the tooltip on the slice it describes. */
  mid: number
  path: string
}

const arcs = computed<Arc[]>(() => {
  if (!width.value || !outer.value || !slices.value.length)
    return []

  let angle = START
  return slices.value.map((slice) => {
    const sweep = slice.share * Math.PI * 2
    const from = angle
    angle += sweep

    return {
      ...slice,
      mid: from + sweep / 2,
      path: arcPath(from, from + sweep),
    }
  })
})

/**
 * Half the gap, as the angle that steps that far *sideways* off a radius at
 * the given distance from the centre — the angle a fixed offset subtends
 * grows as the radius shrinks, which is what keeps the two edges parallel.
 *
 * Never more than a third of the slice, so a thin one is thinned rather than
 * swallowed whole.
 */
function gapTrim(radius: number, sweep: number): number {
  const half = halfGap.value
  if (!half || radius <= half)
    return 0
  return Math.min(Math.asin(half / radius), sweep / 3)
}

/**
 * An annular sector: out along one edge, round the outside, in along the
 * other, back round the inside.
 *
 * A pie has no inner edge, so it runs to a point instead — but not to the
 * centre once there are gaps to keep even. Two edges held a fixed distance
 * off their radii meet short of the middle, and that meeting point is the
 * slice's tip: blunt, a couple of pixels out, and the price of the gap being
 * a line rather than a wedge. Same for a ring thick enough to have closed
 * its hole.
 */
function arcPath(from: number, to: number): string {
  const sweep = to - from
  const solid = !inner.value
  // A lone slice has no neighbour to be separated from.
  const outerTrim = slices.value.length < 2 ? 0 : gapTrim(outer.value, sweep)

  const start = from + outerTrim
  const end = to - outerTrim
  const large = end - start > Math.PI ? 1 : 0
  const [x0, y0] = point(outer.value, start)
  const [x1, y1] = point(outer.value, end)

  if (solid) {
    /*
     * Where the two offset edges cross. A hair of a slice would push that
     * meeting point out past the rim and leave nothing to draw, so it is
     * capped at half the radius — the edges give up being exactly parallel
     * before the slice gives up existing.
     */
    const tip = outerTrim
      ? Math.min(halfGap.value / Math.sin(sweep / 2), outer.value / 2)
      : 0
    const [tx, ty] = point(tip, from + sweep / 2)
    return `M${x0} ${y0} A${round(outer.value)} ${round(outer.value)} 0 ${large} 1 ${x1} ${y1} L${tx} ${ty} Z`
  }

  const innerTrim = outerTrim ? gapTrim(inner.value, sweep) : 0
  // The inner edge is trimmed harder than the outer one, so the two spans
  // straddle the half-turn at different slices and need their own flag.
  const innerLarge = sweep - innerTrim * 2 > Math.PI ? 1 : 0
  const [x2, y2] = point(inner.value, to - innerTrim)
  const [x3, y3] = point(inner.value, from + innerTrim)
  return `M${x0} ${y0} A${round(outer.value)} ${round(outer.value)} 0 ${large} 1 ${x1} ${y1} `
    + `L${x2} ${y2} A${round(inner.value)} ${round(inner.value)} 0 ${innerLarge} 0 ${x3} ${y3} Z`
}

/**
 * A lone slice is the whole circle, and an arc whose ends meet is a path of
 * zero length — the chart would render empty. A circle element draws it
 * instead: filled for a pie, and stroked down the middle of the band for a
 * ring, which is what a full-circle annulus amounts to.
 */
const whole = computed(() => {
  if (arcs.value.length !== 1 || !outer.value)
    return undefined
  const slice = arcs.value[0]!
  return {
    ...slice,
    radius: inner.value ? (outer.value + inner.value) / 2 : outer.value,
    strokeWidth: outer.value - inner.value,
  }
})

/** Empty when the circle is drawn whole, so the two never render at once. */
const sectors = computed(() => (whole.value ? [] : arcs.value))

const hovered = ref<number>()

const tooltip = computed(() => {
  if (hovered.value == null)
    return undefined
  const slice = arcs.value.find(arc => arc.index === hovered.value)
  if (!slice)
    return undefined

  const value = formatValue(slice.value)
  const share = shareFormatter.value.format(slice.share)

  /*
   * Centred on the slice's own band rather than beyond its outer edge. A
   * cartesian tooltip must clear the mark because the mark's tip *is* the
   * reading; here the reading is the arc's length, which stays legible around
   * a label sitting on it — and anything placed outside the ring would leave
   * the chart's box at the top and bottom.
   */
  const radius = inner.value ? (outer.value + inner.value) / 2 : outer.value / 2
  const [x, y] = point(radius, slice.mid)

  return {
    label: slice.label,
    value,
    share,
    x: clampTooltip(x, `${slice.label}${value}${share}`, width.value),
    y,
  }
})

const theme = computed(() => donutChartTheme())

function slotClass(slot: keyof NonNullable<DonutChartProps['ui']>, extra?: string) {
  const override = props.ui?.[slot]
  return isUnstyled.value ? [override, extra] : theme.value[slot]({ class: [override, extra] })
}

function sliceClass(index: number) {
  const faded = hovered.value != null && hovered.value !== index
  return isUnstyled.value
    ? [props.ui?.slice]
    : theme.value.slice({ class: [props.ui?.slice, faded ? theme.value.faded() : undefined] })
}
</script>

<template>
  <div
    ref="root"
    :role="props.label ? 'figure' : undefined"
    :aria-label="props.label"
    :class="slotClass('root', props.class)"
  >
    <ChartLegend
      v-if="showLegend"
      :series="legendSeries"
      :active="hovered == null ? undefined : slices.findIndex(slice => slice.index === hovered)"
      :unstyled="props.unstyled"
    />

    <div :class="isUnstyled ? undefined : theme.plot()">
      <svg
        :width="width"
        :height="props.size"
        :viewBox="`0 0 ${width} ${props.size}`"
        aria-hidden="true"
        :class="slotClass('svg')"
      >
        <!-- Colour is set inline, not by class: Tailwind cannot generate a
           class name assembled at runtime, so `fill-chart-3` would never exist. -->
        <circle
          v-if="whole"
          :cx="centre.x"
          :cy="centre.y"
          :r="whole.radius"
          :fill="inner ? 'none' : whole.color"
          :stroke="inner ? whole.color : 'none'"
          :stroke-width="inner ? whole.strokeWidth : 0"
          :class="sliceClass(whole.index)"
          @pointerenter="hovered = whole.index"
          @pointerleave="hovered = undefined"
        />
        <path
          v-for="arc in sectors"
          :key="`slice-${arc.index}`"
          :d="arc.path"
          :style="{ fill: arc.color }"
          :class="sliceClass(arc.index)"
          @pointerenter="hovered = arc.index"
          @pointerleave="hovered = undefined"
        />
      </svg>

      <!-- Sized to the hole so long content wraps inside the ring instead of
         running out over the slices. -->
      <div
        v-if="$slots.center && inner"
        :class="slotClass('center')"
        :style="{
          left: `${centre.x}px`,
          top: `${centre.y}px`,
          width: `${inner * 2 * 0.82}px`,
          transform: 'translate(-50%, -50%)',
        }"
      >
        <slot name="center" :total="total" :formatted="formatValue(total)" />
      </div>

      <div
        v-if="tooltip"
        :class="slotClass('tooltip')"
        :style="{
          left: `${tooltip.x}px`,
          top: `${tooltip.y}px`,
          transform: 'translate(-50%, -50%)',
        }"
      >
        <span :class="slotClass('tooltipLabel')">{{ tooltip.label }}</span>
        <span :class="slotClass('tooltipValue')">{{ tooltip.value }}</span>
        <span :class="slotClass('tooltipShare')">{{ tooltip.share }}</span>
      </div>
    </div>

    <!--
      The marks are decorative to assistive tech; this carries the data.

      `sr-only` goes on a wrapper rather than on the table itself. A table
      treats a specified width as a *minimum* and refuses to shrink below its
      content, so `sr-only` left it at full content size — absolutely
      positioned, still measured, and adding its height to the document's
      scroll area.
    -->
    <div :class="slotClass('table')">
      <table>
        <caption>{{ props.label }}</caption>
        <thead>
          <tr>
            <th scope="col">
              Category
            </th>
            <th scope="col">
              Value
            </th>
            <th scope="col">
              Share
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="slice in slices" :key="`row-${slice.index}`">
            <th scope="row">
              {{ slice.label }}
            </th>
            <td>{{ formatValue(slice.value) }}</td>
            <td>{{ shareFormatter.format(slice.share) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
