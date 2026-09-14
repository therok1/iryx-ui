import type { DateValue } from '@internationalized/date'
import { CalendarDate, DateFormatter, endOfMonth, getLocalTimeZone, parseDate, startOfMonth, Time, today } from '@internationalized/date'

/**
 * The model is always an ISO `YYYY-MM-DD` **string**, never a `Date`.
 *
 * A `Date` is a timestamp, so it carries a time zone the caller never asked
 * for: serialising one to JSON can shift the day across a boundary, which in a
 * finance app moves an invoice into the wrong period. `CalendarDate` exists
 * only inside the component, as the calendar primitives' currency.
 */

/** `YYYY-MM-DD`, rejecting the impossible dates `parseDate` would accept. */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/**
 * Parse an ISO date, or `undefined` if it is absent or malformed.
 *
 * Malformed input resolves to "no selection" rather than throwing: the value
 * often comes from a URL or a stale draft, and a blank calendar is a better
 * outcome for the user than a crashed render.
 */
export function toCalendarDate(iso: string | null | undefined): CalendarDate | undefined {
  if (!iso || !ISO_DATE.test(iso))
    return undefined
  try {
    return parseDate(iso)
  }
  catch {
    return undefined
  }
}

/** Back to the canonical `YYYY-MM-DD`. */
export function toIsoDate(date: DateValue | null | undefined): string | null {
  return date ? `${date.year.toString().padStart(4, '0')}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}` : null
}

/** Today in the viewer's own zone, as an ISO date string. */
export function isoToday(): string {
  return toIsoDate(today(getLocalTimeZone()))!
}

/** One shortcut in `IDateRangePicker`'s preset list. */
export interface DateRangePreset {
  label: string
  /** A function is re-run each time the picker opens, so "Today" stays today. */
  range: { start: string | null, end: string | null } | (() => { start: string | null, end: string | null })
}

export interface CommonDateRangePresetLabels {
  today: string
  yesterday: string
  last7Days: string
  last30Days: string
  thisMonth: string
  lastMonth: string
}

/**
 * The usual dashboard shortcuts, relative to today in the viewer's zone.
 * Pass `labels` to translate them.
 */
export function commonDateRangePresets(labels: Partial<CommonDateRangePresetLabels> = {}): DateRangePreset[] {
  const text: CommonDateRangePresetLabels = {
    today: 'Today',
    yesterday: 'Yesterday',
    last7Days: 'Last 7 days',
    last30Days: 'Last 30 days',
    thisMonth: 'This month',
    lastMonth: 'Last month',
    ...labels,
  }
  const now = () => today(getLocalTimeZone())
  const span = (start: CalendarDate, end: CalendarDate) => ({ start: toIsoDate(start), end: toIsoDate(end) })

  return [
    { label: text.today, range: () => span(now(), now()) },
    { label: text.yesterday, range: () => span(now().subtract({ days: 1 }), now().subtract({ days: 1 })) },
    { label: text.last7Days, range: () => span(now().subtract({ days: 6 }), now()) },
    { label: text.last30Days, range: () => span(now().subtract({ days: 29 }), now()) },
    { label: text.thisMonth, range: () => span(startOfMonth(now()), endOfMonth(now())) },
    { label: text.lastMonth, range: () => {
      const first = startOfMonth(now()).subtract({ months: 1 })
      return span(first, endOfMonth(first))
    } },
  ]
}

/**
 * Render an ISO date for display. Returns `''` for absent or malformed input
 * so a caller can fall back to a placeholder.
 */
export function formatIsoDate(
  iso: string | null | undefined,
  locale?: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
): string {
  const date = toCalendarDate(iso)
  if (!date)
    return ''
  return new DateFormatter(locale ?? 'en-US', options).format(date.toDate(getLocalTimeZone()))
}

/** `HH:mm` or `HH:mm:ss`, on a 24-hour clock. */
const ISO_TIME = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/

/**
 * Parse a `HH:mm` (or `HH:mm:ss`) string, or `undefined` if it is absent or
 * malformed. Same bargain as {@link toCalendarDate}: bad input means "no
 * selection" rather than a thrown render.
 */
export function toTime(value: string | null | undefined): Time | undefined {
  if (!value || !ISO_TIME.test(value))
    return undefined
  const [hour, minute, second] = value.split(':').map(Number)
  return new Time(hour, minute, second ?? 0)
}

/**
 * Back to `HH:mm`, or `HH:mm:ss` when there are seconds to keep. Padded, so
 * the result sorts and compares as a string — which is most of the reason to
 * hold a time as one.
 */
export function toIsoTime(time: { hour: number, minute: number, second?: number } | null | undefined): string | null {
  if (!time)
    return null
  const pad = (n: number) => String(n).padStart(2, '0')
  const base = `${pad(time.hour)}:${pad(time.minute)}`
  return time.second ? `${base}:${pad(time.second)}` : base
}

export { CalendarDate, Time }
export type { DateValue }
