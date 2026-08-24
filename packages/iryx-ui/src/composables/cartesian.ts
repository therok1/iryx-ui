import type { SparseValue } from './scale'
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

/**
 * Which way the bands run. `vertical` puts categories along the bottom;
 * `horizontal` puts them down the side, where a long name has room to be read
 * instead of being thinned out or rotated.
 */
export type ChartOrientation = 'vertical' | 'horizontal'

export interface CartesianInput {
  orientation?: ChartOrientation
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
  orientation: ChartOrientation
  ticks: number[]
  plot: { left: number, top: number, width: number, height: number }
  /**
   * A value to its pixel along the value axis — y when vertical, x when
   * horizontal. Named for the job rather than the axis, so callers do not have
   * to care which way round the chart is.
   */
  value: (value: number) => number
  /** Backwards-compatible alias for the vertical case. */
  y: (value: number) => number
  /** Size of one category slot, along whichever axis carries the categories. */
  bandWidth: number
  /** Draw every nth category label; the rest would collide. */
  labelStep: number
  /** Centre of a category slot, in px along the category axis. */
  bandCentre: (index: number) => number
  /**
   * Where a *point* sits, as against the middle of a band. The first lands
   * on the left edge of the plot and the last on the right, so a line spans
   * the full width instead of floating half a band clear of both sides.
   * Bars want `bandCentre`; lines and areas want this.
   */
  pointAt: (index: number) => number
}

export function cartesianLayout(input: CartesianInput): CartesianLayout {
  const orientation = input.orientation ?? 'vertical'
  const horizontal = orientation === 'horizontal'
  const span = extent(input.values)

  const axis = span
    ? niceTicks(
        input.includeZero ? Math.min(0, span[0]) : span[0],
        input.includeZero ? Math.max(0, span[1]) : span[1],
        input.tickCount,
      )
    : niceTicks(0, 1, input.tickCount)

  const tickWidth = Math.ceil(
    Math.max(...axis.ticks.map(tick => input.formatTick(tick).length), 1) * CHAR_WIDTH,
  ) + AXIS_GAP

  /**
   * The left gutter holds whichever labels sit beside the plot: the value
   * ticks when vertical, the category names when horizontal. Horizontal is
   * the whole point of the orientation — a long name gets real width here
   * rather than being thinned out along the bottom.
   */
  const gutter = horizontal
    ? Math.ceil(input.longestLabel * CHAR_WIDTH) + AXIS_GAP
    : (input.showAxis ? tickWidth : 0)

  // Both orientations reserve the bottom strip: category names when vertical,
  // value ticks when horizontal.
  const bottom = horizontal && !input.showAxis ? 0 : CATEGORY_HEIGHT

  /**
   * Horizontal ticks are centred on their gridline, and the last gridline sits
   * on the plot's right edge — so half of `20,000` hangs off the chart unless
   * the plot stops short of it. Vertical needs none of this: its tick labels
   * live in the left gutter, and the last category label is already half a
   * band in from the edge.
   */
  const rightPad = horizontal && input.showAxis ? Math.ceil(tickWidth / 2) : 0

  const plot = {
    left: gutter,
    top: TOP_PAD,
    width: Math.max(input.width - gutter - rightPad, 0),
    height: Math.max(input.height - TOP_PAD - bottom, 0),
  }

  const value = horizontal
    // Left to right, so a bigger number reaches further right.
    ? linearScale([axis.min, axis.max], [plot.left, plot.left + plot.width])
    // Inverted: SVG y grows downward, so the largest value sits at the top.
    : linearScale([axis.min, axis.max], [plot.top + plot.height, plot.top])

  const bandSpan = horizontal ? plot.height : plot.width
  const bandWidth = input.categories ? bandSpan / input.categories : 0
  const bandStart = horizontal ? plot.top : plot.left

  /**
   * Vertical labels collide side to side, so the test is the text's width.
   * Horizontal labels stack, so the test is line height — which is why long
   * names stop being a problem the moment the chart turns.
   */
  const labelFootprint = horizontal ? 16 : input.longestLabel * CHAR_WIDTH + 8
  const labelStep = bandWidth ? Math.max(1, Math.ceil(labelFootprint / bandWidth)) : 1

  return {
    orientation,
    ticks: axis.ticks,
    plot,
    value,
    y: value,
    bandWidth,
    labelStep,
    bandCentre: (index: number) => bandStart + bandWidth * (index + 0.5),
    // A single reading has no span to stretch across, so it sits in the middle.
    pointAt: (index: number) => {
      if (input.categories <= 1)
        return bandStart + bandSpan / 2
      /*
       * Not quite the full width: a quarter of a band at each end, against the
       * half a band that centring in a band would have given. A line that ends
       * exactly on the plot edge reads as clipped rather than as finished, and
       * its end marker has nowhere to sit.
       */
      const inset = bandWidth * 0.25
      const usable = bandSpan - inset * 2
      return bandStart + inset + (usable * index) / (input.categories - 1)
    },
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

/**
 * Dev-only warning.
 *
 * `process.env.NODE_ENV` is read as a bare global rather than through an
 * `import process from 'node:process'`, which is what this used to do. That
 * import shipped a Node builtin in a browser library: bundlers externalise it,
 * `process` is undefined in a browser, and this line threw the moment a chart
 * had more than eight series. Every bundler statically replaces the bare form
 * instead, which also lets the whole branch be dropped from a production
 * build — the same thing Vue and Reka do.
 */
export function warnOnSlotOverflow(count: number): void {
  // eslint-disable-next-line node/prefer-global/process
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
  const half = tooltipHalfWidth(text)
  if (width <= half * 2)
    return width / 2
  return Math.min(Math.max(centre, half), Math.max(width - half, half))
}

/**
 * Half the tooltip's estimated width, for callers that need to offset it.
 *
 * Narrower per character than `CHAR_WIDTH`, which is sized for axis labels
 * where over-reserving costs nothing. A tooltip is placed against that width,
 * so overshooting makes it dodge out of the way of space it would have fitted
 * in.
 */
const TOOLTIP_CHAR_WIDTH = 5.6

export function tooltipHalfWidth(text: string): number {
  return (text.length * TOOLTIP_CHAR_WIDTH + 28) / 2
}
