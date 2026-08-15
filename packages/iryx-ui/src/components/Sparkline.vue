<script setup lang="ts">
import type { SparseValue } from '../composables/scale'
import { computed } from 'vue'
import { extent, linearScale } from '../composables/scale'
import { useIryxUiConfig } from '../config'
import { sparklineTheme } from '../theme/sparkline'

export interface SparklineProps {
  /** Values, oldest first. `null` is a gap in the series, not a zero. */
  data?: readonly SparseValue[]
  /** `area` adds a wash beneath the same line. */
  variant?: 'line' | 'area'
  /** Mark the most recent point with a dot. */
  endDot?: boolean
  /** Lower edge of the `area` wash. */
  baseline?: 'min' | 'zero'
  /** Pin the domain — set both to put several sparklines on one scale. */
  min?: number
  max?: number
  /** Draw in muted ink, for the de-emphasised trend inside a stat tile. */
  muted?: boolean
  /**
   * Accessible description of the trend. Without one the sparkline is treated
   * as decorative and hidden from assistive tech — which is correct when it
   * sits beside a value that already states the number.
   */
  label?: string
  /** Rendered height in px. Width always fills the container. */
  height?: number
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  /** Override classes per slot, e.g. `{ line: 'stroke-[3]' }`. */
  ui?: Partial<Record<'root' | 'plot' | 'line' | 'area' | 'dot' | 'ring', string>>
}

const props = withDefaults(defineProps<SparklineProps>(), {
  data: () => [],
  variant: 'line',
  baseline: 'min',
  height: 32,
  unstyled: undefined,
})

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

/**
 * A resolution-independent box. Combined with `preserveAspectRatio="none"` the
 * drawing stretches to whatever width the container gives it, and every stroke
 * carries `vector-effect="non-scaling-stroke"` so the distortion never reaches
 * the ink — a 2px line stays 2px and a round cap stays circular.
 */
const BOX = 100

/** Half the widest mark, in px — the ringed end dot at 12px, or the 2px line. */
const inset = computed(() => (props.endDot ? 6 : 1))

/**
 * Marks are centred on their data point, so the first and last ones straddle
 * the edge of the drawing and half of each would paint outside the component.
 * The plot is inset by the mark's radius and the drawing shrinks to match, so
 * the box a caller reserves is the box the sparkline actually occupies.
 */
const plotHeight = computed(() => Math.max(props.height - inset.value * 2, 1))

interface Point { x: number, y: number }

/** Runs of consecutive readings. A gap ends one run and starts the next. */
const runs = computed<Point[][]>(() => {
  const values = props.data
  const domain = extent(values)
  if (!domain)
    return []

  const [dataMin, dataMax] = domain
  const low = props.min ?? dataMin
  const high = props.max ?? dataMax

  const x = linearScale([0, Math.max(values.length - 1, 0)], [0, BOX])
  // Inverted: SVG y grows downward, so the largest value sits at the top.
  const y = linearScale([low, high], [BOX, 0])

  const result: Point[][] = []
  let current: Point[] = []

  values.forEach((value, index) => {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      if (current.length)
        result.push(current)
      current = []
      return
    }
    current.push({ x: round(x(index)), y: round(y(value)) })
  })

  if (current.length)
    result.push(current)

  return result
})

/** Two decimals is well past sub-pixel at any real size, and keeps the DOM readable. */
function round(value: number): number {
  return Math.round(value * 100) / 100
}

function toLine(points: Point[]): string {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`).join(' ')
}

/** Where an `area` wash closes down to. */
const baseY = computed(() => {
  const domain = extent(props.data)
  if (!domain)
    return BOX

  const low = props.min ?? domain[0]
  const high = props.max ?? domain[1]
  if (props.baseline === 'zero' && low <= 0 && high >= 0)
    return round(linearScale([low, high], [BOX, 0])(0))

  return BOX
})

function toArea(points: Point[]): string {
  const first = points[0]!
  const last = points[points.length - 1]!
  return `${toLine(points)} L${last.x} ${baseY.value} L${first.x} ${baseY.value} Z`
}

/** The most recent reading, wherever the series happens to end. */
const endPoint = computed<Point | undefined>(() => {
  const last = runs.value[runs.value.length - 1]
  return last?.[last.length - 1]
})

const theme = computed(() => sparklineTheme({ muted: props.muted }))

function slotClass(slot: 'root' | 'plot' | 'line' | 'area' | 'dot' | 'ring', extra?: string) {
  const override = props.ui?.[slot]
  return isUnstyled.value ? [override, extra] : theme.value[slot]({ class: [override, extra] })
}
</script>

<template>
  <span
    :class="slotClass('root', props.class)"
    :style="{ padding: `${inset}px` }"
  >
    <svg
      :viewBox="`0 0 ${BOX} ${BOX}`"
      preserveAspectRatio="none"
      :height="plotHeight"
      :style="{ height: `${plotHeight}px` }"
      :role="props.label ? 'img' : undefined"
      :aria-label="props.label"
      :aria-hidden="props.label ? undefined : true"
      :class="slotClass('plot')"
    >
      <template v-if="props.variant === 'area'">
        <path
          v-for="(points, index) in runs"
          :key="`area-${index}`"
          :d="toArea(points)"
          :class="slotClass('area')"
        />
      </template>

      <path
        v-for="(points, index) in runs"
        :key="`line-${index}`"
        :d="toLine(points)"
        vector-effect="non-scaling-stroke"
        :class="slotClass('line')"
      />

      <!--
        A zero-length path with a round cap renders as a circle of the stroke's
        width, and `non-scaling-stroke` keeps it perfectly round however far
        the box is stretched. A real <circle> would be squashed into an
        ellipse. The ring goes first so the dot sits on top of it.
      -->
      <template v-if="props.endDot && endPoint">
        <path
          :d="`M${endPoint.x} ${endPoint.y} L${endPoint.x} ${endPoint.y}`"
          stroke-width="12"
          vector-effect="non-scaling-stroke"
          :class="slotClass('ring')"
        />
        <path
          :d="`M${endPoint.x} ${endPoint.y} L${endPoint.x} ${endPoint.y}`"
          stroke-width="8"
          vector-effect="non-scaling-stroke"
          :class="slotClass('dot')"
        />
      </template>
    </svg>
  </span>
</template>
