---
'iryx-ui': minor
---

Add `IDatePicker` and `IDateRangePicker`, built on Reka's calendar primitives.

The model is an ISO `YYYY-MM-DD` string (`{ start, end }` for the range), never a `Date`: a `Date` is a timestamp carrying a time zone, so it can render as the previous day west of Greenwich and move a record into the wrong period. Malformed input resolves to "no selection" rather than throwing, since the value often arrives from a URL or a stale draft.

Both take `min` / `max` / `locale` / `format` / `weekStartsOn` / `clearable`, and every navigation and footer label is a prop. The conversion helpers (`toCalendarDate`, `toIsoDate`, `formatIsoDate`, `isoToday`) are exported too.

Adds `@internationalized/date` as a direct dependency — it already came in transitively with `reka-ui`, whose calendars require its `DateValue` type.
