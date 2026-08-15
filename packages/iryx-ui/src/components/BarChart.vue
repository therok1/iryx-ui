<script setup lang="ts">
import type { ChartSeries } from '../composables/cartesian'
import type { SparseValue } from '../composables/scale'
import { computed, ref } from 'vue'
import { AXIS_GAP, cartesianLayout, clampTooltip, seriesColor, slotOf, tooltipHalfWidth, warnOnSlotOverflow } from '../composables/cartesian'
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
  /**
   * `horizontal` runs the categories down the side, where a long name has room
   * to be read. Vertical charts thin their labels to avoid collisions, so long
   * or numerous category names are the case to turn the chart for.
   */
  orientation?: 'vertical' | 'horizontal'
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
  orientation: 'vertical',
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

const horizontal = computed(() => props.orientation === 'horizontal')

const layout = computed(() => cartesianLayout({
  orientation: props.orientation,
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
  /** Which side of the baseline the bar grows toward. */
  direction: 'up' | 'down' | 'right' | 'left'
  seriesIndex: number
  categoryIndex: number
}

const bars = computed<Bar[]>(() => {
  if (!width.value || !props.data.length)
    return []

  const baseline = layout.value.value(0)
  const total = series.value.length
  // Neighbouring bars in a group need a sliver of surface between them.
  const gap = total > 1 ? 1 : 0

  return props.data.flatMap((datum, categoryIndex) =>
    series.value.flatMap((entry, seriesIndex) => {
      const value = readValue(datum, entry.key)
      if (value == null)
        return []

      const tip = layout.value.value(value)
      // Group centred on the band, then each bar offset within the group.
      const groupStart = layout.value.bandCentre(categoryIndex) - (barWidth.value * total) / 2
      const bandOffset = groupStart + barWidth.value * seriesIndex + gap
      const thickness = Math.max(barWidth.value - gap * 2, 1)
      const length = Math.abs(tip - baseline)

      // The band axis and the value axis swap; everything else is the same.
      return [horizontal.value
        ? {
            x: Math.min(tip, baseline),
            y: bandOffset,
            width: length,
            height: thickness,
            direction: value >= 0 ? 'right' as const : 'left' as const,
            seriesIndex,
            categoryIndex,
          }
        : {
            x: bandOffset,
            y: Math.min(tip, baseline),
            width: thickness,
            height: length,
            direction: value >= 0 ? 'up' as const : 'down' as const,
            seriesIndex,
            categoryIndex,
          }]
    }),
  )
})

/**
 * Rounded at the data end, square at the baseline — the rounding reads as the
 * tip of the value, so rounding both ends would detach the bar from its axis.
 */
function barPath(bar: Bar): string {
  const { x, y, width: w, height: h } = bar
  const right = x + w
  const bottom = y + h
  const r = Math.min(4, w / 2, h / 2, bar.direction === 'up' || bar.direction === 'down' ? h : w)

  switch (bar.direction) {
    case 'up':
      return `M${x} ${bottom} L${x} ${y + r} Q${x} ${y} ${x + r} ${y} L${right - r} ${y} Q${right} ${y} ${right} ${y + r} L${right} ${bottom} Z`
    case 'down':
      return `M${x} ${y} L${x} ${bottom - r} Q${x} ${bottom} ${x + r} ${bottom} L${right - r} ${bottom} Q${right} ${bottom} ${right} ${bottom - r} L${right} ${y} Z`
    case 'right':
      return `M${x} ${y} L${right - r} ${y} Q${right} ${y} ${right} ${y + r} L${right} ${bottom - r} Q${right} ${bottom} ${right - r} ${bottom} L${x} ${bottom} Z`
    default:
      return `M${right} ${y} L${x + r} ${y} Q${x} ${y} ${x} ${y + r} L${x} ${bottom - r} Q${x} ${bottom} ${x + r} ${bottom} L${right} ${bottom} Z`
  }
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

  /**
   * Estimated from what is actually rendered: a single-series tooltip shows
   * the category and the value on one line, while a multi-series one stacks a
   * row per measure under the category. Measuring the series name in the
   * single case underestimated the box by half and let it cover the mark.
   */
  const widest = isMulti.value
    ? Math.max(datum.label.length, ...rows.map(row => row.name.length + row.value.length + 3))
    : datum.label.length + rows[0]!.value.length + 2
  const centre = layout.value.bandCentre(hovered.value)

  // Horizontal: anchor past the longest bar in the group, at the band's centre.
  if (horizontal.value) {
    const reach = Math.max(
      ...series.value.map((entry) => {
        const value = readValue(datum, entry.key)
        return value == null ? Number.NEGATIVE_INFINITY : layout.value.value(value)
      }),
    )
    /**
     * Past the tip rather than over it — the end of the bar is the reading, so
     * covering it defeats the tooltip. Where a long bar leaves no room on the
     * right, it flips to the inside rather than being squashed against the
     * edge and overlapping the tip anyway.
     */
    const text = 'x'.repeat(widest)
    const half = tooltipHalfWidth(text)
    const outside = reach + half + 8
    const fits = outside + half <= width.value

    return {
      label: datum.label,
      rows,
      multi: isMulti.value,
      x: clampTooltip(fits ? outside : reach - half - 8, text, width.value),
      y: centre,
    }
  }

  const top = Math.min(
    ...series.value.map((entry) => {
      const value = readValue(datum, entry.key)
      return value == null ? Number.POSITIVE_INFINITY : Math.min(layout.value.value(value), layout.value.value(0))
    }),
  )

  return {
    label: datum.label,
    rows,
    multi: isMulti.value,
    x: clampTooltip(centre, 'x'.repeat(widest), width.value),
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
            <!-- Gridlines cross the value axis, so they turn with the chart. -->
            <line
              :x1="horizontal ? layout.value(tick) : plot.left"
              :y1="horizontal ? plot.top : yScale(tick)"
              :x2="horizontal ? layout.value(tick) : plot.left + plot.width"
              :y2="horizontal ? plot.top + plot.height : yScale(tick)"
              stroke-width="1"
              :class="slotClass('grid')"
            />
            <text
              :x="horizontal ? layout.value(tick) : plot.left - AXIS_GAP"
              :y="horizontal ? plot.top + plot.height + 14 : yScale(tick)"
              :text-anchor="horizontal ? 'middle' : 'end'"
              :dominant-baseline="horizontal ? undefined : 'middle'"
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

        <!-- Colour is set inline, not by class: Tailwind cannot generate a class
           name assembled at runtime, so `fill-chart-3` would never exist. -->
        <path
          v-for="(bar, index) in bars"
          :key="`bar-${bar.categoryIndex}-${bar.seriesIndex}-${index}`"
          :d="barPath(bar)"
          :style="{ fill: seriesColor(slotOf(series[bar.seriesIndex]!, bar.seriesIndex)) }"
          :class="barClass(bar)"
        />

        <!-- Beside the plot when horizontal, where a long name has room. -->
        <template v-for="(datum, index) in props.data" :key="`label-${datum.label}-${index}`">
          <text
            v-if="index % labelStep === 0"
            :x="horizontal ? plot.left - AXIS_GAP : layout.bandCentre(index)"
            :y="horizontal ? layout.bandCentre(index) : plot.top + plot.height + 14"
            :text-anchor="horizontal ? 'end' : 'middle'"
            :dominant-baseline="horizontal ? 'middle' : undefined"
            :class="slotClass('category')"
          >
            {{ datum.label }}
          </text>
        </template>

        <!-- Hit targets span the whole band and the full plot height, so a short
           bar is no harder to hover than a tall one. -->
        <slot name="overlay" v-bind="layout" />

        <rect
          v-for="(datum, index) in props.data"
          :key="`hit-${datum.label}-${index}`"
          :x="horizontal ? plot.left : plot.left + bandWidth * index"
          :y="horizontal ? plot.top + bandWidth * index : plot.top"
          :width="horizontal ? plot.width : bandWidth"
          :height="horizontal ? bandWidth : plot.height"
          :class="isUnstyled ? undefined : theme.hit()"
          @pointerenter="hovered = index"
          @pointerleave="hovered = undefined"
        />
      </svg>

      <div
        v-if="tooltip"
        :class="slotClass('tooltip', tooltip.multi ? 'flex-col items-start gap-1' : undefined)"
        :style="{
          left: `${tooltip.x}px`,
          top: `${tooltip.y}px`,
          // Horizontal bars grow sideways, so the free space is beside the
          // tip rather than above it.
          transform: horizontal
            ? 'translate(-50%, -50%)'
            : 'translate(-50%, -100%) translateY(-8px)',
        }"
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
