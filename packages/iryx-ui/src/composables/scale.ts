/**
 * The arithmetic every chart shares: find a domain, map it onto a range, and
 * choose the numbers an axis is allowed to show.
 *
 * Deliberately not a charting engine — no band scales or stacking yet. Those
 * arrive with the components that need them rather than being guessed at now.
 */

/** A gap in a series. `null` reads as "no reading", not as zero. */
export type SparseValue = number | null | undefined

/** Finite values only, so gaps and stray `NaN` cannot poison a domain. */
export function finiteValues(values: readonly SparseValue[]): number[] {
  return values.filter((value): value is number => typeof value === 'number' && Number.isFinite(value))
}

/** Smallest and largest finite value, or `undefined` when there are none. */
export function extent(values: readonly SparseValue[]): [number, number] | undefined {
  const finite = finiteValues(values)
  if (!finite.length)
    return undefined
  return [Math.min(...finite), Math.max(...finite)]
}

/**
 * Map `domain` onto `range`.
 *
 * A zero-width domain — every value identical, or a single point — maps to the
 * middle of the range instead of dividing by zero. A flat series should draw a
 * flat line through the centre, not vanish or spike to an edge.
 */
export function linearScale(
  domain: readonly [number, number],
  range: readonly [number, number],
): (value: number) => number {
  const [d0, d1] = domain
  const [r0, r1] = range
  const span = d1 - d0

  if (span === 0)
    return () => (r0 + r1) / 2

  const ratio = (r1 - r0) / span
  return (value: number) => r0 + (value - d0) * ratio
}

/** Round `value` to the nearest 1, 2, 5 or 10 times a power of ten. */
function niceNumber(value: number, round: boolean): number {
  const exponent = Math.floor(Math.log10(value))
  const power = 10 ** exponent
  const fraction = value / power

  let nice: number
  if (round)
    nice = fraction < 1.5 ? 1 : fraction < 3 ? 2 : fraction < 7 ? 5 : 10
  else
    nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10

  return nice * power
}

/**
 * Axis values a person would actually write down.
 *
 * The difference between an axis reading `0 / 1,000 / 2,000` and one reading
 * `0 / 863.4 / 1,726.8` is the single clearest tell of a hand-rolled chart, so
 * the step is snapped to a 1/2/5 multiple of a power of ten and the domain is
 * widened outwards to land on it. The returned bounds are therefore usually
 * wider than the data — that is the point, and the caller should scale to the
 * first and last tick rather than to its own min and max.
 */
export function niceTicks(
  min: number,
  max: number,
  count = 5,
): { ticks: number[], min: number, max: number } {
  if (!Number.isFinite(min) || !Number.isFinite(max))
    return { ticks: [0, 1], min: 0, max: 1 }

  // A flat series has no range to divide; give it one so an axis still reads.
  if (min === max) {
    if (min === 0)
      return { ticks: [0, 1], min: 0, max: 1 }
    const magnitude = Math.abs(min)
    min = min - magnitude / 2
    max = max + magnitude / 2
  }

  const step = niceNumber(niceNumber(max - min, false) / Math.max(count - 1, 1), true)
  const niceMin = Math.floor(min / step) * step
  const niceMax = Math.ceil(max / step) * step

  /**
   * Steps below 1 accumulate float error fast — 0.1 + 0.2 is famously not 0.3,
   * and an axis labelled `0.30000000000000004` is worse than no axis.
   */
  const decimals = Math.max(0, -Math.floor(Math.log10(step)))
  const ticks: number[] = []
  const total = Math.round((niceMax - niceMin) / step)

  for (let index = 0; index <= total; index++)
    ticks.push(Number((niceMin + index * step).toFixed(decimals)))

  return { ticks, min: ticks[0]!, max: ticks[ticks.length - 1]! }
}
