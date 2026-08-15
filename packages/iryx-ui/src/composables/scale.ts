/**
 * The arithmetic every chart shares: find a domain, map it onto a range.
 *
 * Deliberately not a charting engine — no ticks, no bands, no axes yet. Those
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
