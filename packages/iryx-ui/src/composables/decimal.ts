/**
 * Decimal-string arithmetic, exact by construction.
 *
 * Money is stored and computed as decimal strings — `0.1 + 0.2` in binary
 * floating point is `0.30000000000000004`, which silently corrupts a total.
 * Everything here scales to integers and uses `BigInt`, so a value only ever
 * round-trips through `Number` if the caller asks for it.
 */

interface Decimal {
  /** Unscaled value: `1234.56` at scale 2 is `123456n`. */
  units: bigint
  /** Number of decimal places. */
  scale: number
}

const DECIMAL_PATTERN = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/

/** Parse a canonical decimal string (`-1234.56`). Returns undefined if invalid. */
export function parseDecimal(value: string): Decimal | undefined {
  const trimmed = value.trim()
  if (!trimmed || !DECIMAL_PATTERN.test(trimmed))
    return undefined

  const negative = trimmed.startsWith('-')
  const unsigned = trimmed.replace(/^[+-]/, '')
  const [whole = '', fraction = ''] = unsigned.split('.')
  const digits = `${whole || '0'}${fraction}`
  const units = BigInt(digits || '0')

  return { units: negative ? -units : units, scale: fraction.length }
}

/** Render a Decimal back to a canonical string. */
export function formatDecimal({ units, scale }: Decimal): string {
  const negative = units < 0n
  const digits = (negative ? -units : units).toString().padStart(scale + 1, '0')
  const whole = digits.slice(0, digits.length - scale)
  const fraction = scale ? digits.slice(digits.length - scale) : ''
  return `${negative ? '-' : ''}${whole}${fraction ? `.${fraction}` : ''}`
}

/** Line two decimals up on the same scale so they can be compared or added. */
function align(a: Decimal, b: Decimal): [bigint, bigint, number] {
  const scale = Math.max(a.scale, b.scale)
  const lift = (d: Decimal) => d.units * 10n ** BigInt(scale - d.scale)
  return [lift(a), lift(b), scale]
}

/** `-1` if a < b, `0` if equal, `1` if a > b. */
export function compareDecimals(a: string, b: string): number {
  const left = parseDecimal(a)
  const right = parseDecimal(b)
  if (!left || !right)
    return Number.NaN
  const [x, y] = align(left, right)
  return x < y ? -1 : x > y ? 1 : 0
}

/** Exact addition. `addDecimals('0.1', '0.2')` is `'0.3'`, not `'0.30000000000000004'`. */
export function addDecimals(a: string, b: string): string | undefined {
  const left = parseDecimal(a)
  const right = parseDecimal(b)
  if (!left || !right)
    return undefined
  const [x, y, scale] = align(left, right)
  return formatDecimal({ units: x + y, scale })
}

/** Round half-up to a fixed number of decimal places. */
export function roundDecimal(value: string, precision: number): string | undefined {
  const parsed = parseDecimal(value)
  if (!parsed)
    return undefined
  if (parsed.scale <= precision)
    return formatDecimal({ units: parsed.units * 10n ** BigInt(precision - parsed.scale), scale: precision })

  const drop = BigInt(parsed.scale - precision)
  const divisor = 10n ** drop
  const negative = parsed.units < 0n
  const magnitude = negative ? -parsed.units : parsed.units
  const remainder = magnitude % divisor
  // Half-up: 2.5 rounds to 3, -2.5 to -3.
  const carry = remainder * 2n >= divisor ? 1n : 0n
  const rounded = magnitude / divisor + carry

  return formatDecimal({ units: negative ? -rounded : rounded, scale: precision })
}

/** Constrain a value to a range, comparing exactly. */
export function clampDecimal(value: string, min?: string, max?: string): string {
  if (min != null && compareDecimals(value, min) < 0)
    return min
  if (max != null && compareDecimals(value, max) > 0)
    return max
  return value
}

/** Whether a string is a well-formed decimal. */
export function isDecimal(value: string): boolean {
  return parseDecimal(value) !== undefined
}

/** The separators a locale uses, e.g. `.`/`,` for `en`, `,`/`.` for `sl`. */
export function localeSeparators(locale: string): { decimal: string, group: string } {
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6)
  return {
    decimal: parts.find(p => p.type === 'decimal')?.value ?? '.',
    group: parts.find(p => p.type === 'group')?.value ?? ',',
  }
}

/**
 * Render a canonical decimal for display, e.g. `"1234.56"` as `1.234,56` in
 * `sl`. Formatting goes through the digits, never `Number`, so a value too
 * large for a float still displays exactly.
 */
export function formatForLocale(value: string, locale: string, precision?: number): string {
  const parsed = parseDecimal(value)
  if (!parsed)
    return value

  const scale = precision ?? parsed.scale
  const fixed = roundDecimal(value, scale) ?? value
  const [whole = '0', fraction = ''] = fixed.replace('-', '').split('.')
  const { decimal, group } = localeSeparators(locale)
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, group)

  return `${fixed.startsWith('-') ? '-' : ''}${grouped}${fraction ? `${decimal}${fraction}` : ''}`
}

/**
 * Turn typed input into a canonical decimal, accepting the locale's
 * separators. `1.234,56` in `sl` becomes `1234.56`.
 */
export function parseFromLocale(input: string, locale: string): string | undefined {
  const { decimal, group } = localeSeparators(locale)
  const canonical = input
    .trim()
    .replaceAll(group, '')
    // Some locales group with a non-breaking or narrow space, both of which
    // the whitespace class already covers.
    .replace(/\s/g, '')
    .replace(decimal, '.')

  return isDecimal(canonical) ? canonical : undefined
}
