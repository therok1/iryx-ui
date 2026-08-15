import type { SparseValue } from './scale'
import process from 'node:process'
import { extent, linearScale, niceTicks } from './scale'

/**
 * The frame every category-versus-value chart draws inside: an axis of round
 * numbers, a gutter wide enough for its labels, and the plot rectangle left
 * over. A pure function rather than a composable, so it can be called from a
 * single `computed` in each chart and tested without mounting anything.
 */

/** Rough text metrics. Measuring for real costs a layout pass per label. */
export const CHAR_WIDTH = 6.5
export const AXIS_GAP = 8
export const CATEGORY_HEIGHT = 20
export const TOP_PAD = 8

export interface CartesianInput {
  /** Every plotted value, gaps included — only the finite ones set the domain. */
  values: readonly SparseValue[]
  /** How many slots along the x axis. */
  categories: number
  /** Longest category label, in characters. */
  longestLabel: number
  /** Measured container width in px. Zero before the first measurement. */
  width: number
  /** Requested total height in px. */
  height: number
  tickCount: number
  showAxis: boolean
  /** Renders a tick for the gutter measurement, and the tooltip elsewhere. */
  formatTick: (value: number) => string
  /**
   * Force zero into the domain. True for bars, which are read by length and
   * lie under a truncated baseline; false for lines, where the shape is the
   * message and a forced zero can flatten it into nothing.
   */
  includeZero: boolean
}

export interface CartesianLayout {
  ticks: number[]
  plot: { left: number, top: number, width: number, height: number }
  /** Value to y-pixel, already inverted for SVG's downward axis. */
  y: (value: number) => number
  /** Width of one category slot. */
  bandWidth: number
  /** Draw every nth category label; the rest would collide. */
  labelStep: number
  /** Centre of a category slot, in px. */
  bandCentre: (index: number) => number
}

export function cartesianLayout(input: CartesianInput): CartesianLayout {
  const span = extent(input.values)

  const axis = span
    ? niceTicks(
        input.includeZero ? Math.min(0, span[0]) : span[0],
        input.includeZero ? Math.max(0, span[1]) : span[1],
        input.tickCount,
      )
    : niceTicks(0, 1, input.tickCount)

  const gutter = input.showAxis
    ? Math.ceil(Math.max(...axis.ticks.map(tick => input.formatTick(tick).length), 1) * CHAR_WIDTH) + AXIS_GAP
    : 0

  const plot = {
    left: gutter,
    top: TOP_PAD,
    width: Math.max(input.width - gutter, 0),
    height: Math.max(input.height - TOP_PAD - CATEGORY_HEIGHT, 0),
  }

  const y = linearScale([axis.min, axis.max], [plot.top + plot.height, plot.top])
  const bandWidth = input.categories ? plot.width / input.categories : 0

  const labelStep = bandWidth
    ? Math.max(1, Math.ceil((input.longestLabel * CHAR_WIDTH + 8) / bandWidth))
    : 1

  return {
    ticks: axis.ticks,
    plot,
    y,
    bandWidth,
    labelStep,
    bandCentre: (index: number) => plot.left + bandWidth * (index + 0.5),
  }
}

/** One plotted measure. `key` reads a field off each row; `name` labels it. */
export interface ChartSeries {
  key: string
  name?: string
  /**
   * Pin this series to a palette slot (0-based), instead of taking its
   * position in the array.
   *
   * Colour has to follow the entity, not its rank: filter a series out of a
   * chart and the survivors must keep the colours the reader already learned.
   * Without a pin, removing the first of three repaints the other two.
   */
  slot?: number
}

/** How many categorical slots the palette actually defines. */
export const SERIES_SLOTS = 8

/**
 * The colour for a series slot.
 *
 * Callers pass the series' pinned `slot` where it has one, and its array
 * position otherwise — see `ChartSeries.slot` for why that distinction exists.
 *
 * Slots are never cycled: a ninth hue has not been checked for separation
 * against its neighbours, so past eight the answer is folding into "Other" or
 * splitting into small multiples. Beyond the eighth the last slot repeats and
 * a warning is emitted, because silently colliding two identities is worse
 * than saying so.
 */
export function seriesColor(index: number): string {
  return `var(--iryx-chart-${Math.min(Math.max(index, 0), SERIES_SLOTS - 1) + 1})`
}

/** A series' palette slot: pinned if it has one, otherwise its position. */
export function slotOf(entry: ChartSeries, index: number): number {
  return entry.slot ?? index
}

let warnedSlots = false

export function warnOnSlotOverflow(count: number): void {
  if (count <= SERIES_SLOTS || warnedSlots || process.env.NODE_ENV === 'production')
    return
  warnedSlots = true
  console.warn(
    `[iryx-ui] ${count} chart series exceeds the ${SERIES_SLOTS} categorical slots. `
    + 'Colours past the eighth repeat and stop identifying anything — fold the tail '
    + 'into "Other", or use small multiples.',
  )
}

/**
 * Keep a tooltip inside the chart's own box. Estimated from the text rather
 * than measured: measuring needs an extra tick, during which the tooltip is
 * visible at the unclamped position and visibly jumps.
 */
export function clampTooltip(centre: number, text: string, width: number): number {
  const half = (text.length * CHAR_WIDTH + 28) / 2
  return Math.min(Math.max(centre, half), Math.max(width - half, half))
}
