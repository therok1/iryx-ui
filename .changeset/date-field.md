---
"iryx-ui": minor
---

Add `IDateField`, segmented date entry

Day, month and year as three arrow-key controls, ordered by the locale, with the same chrome and sizes as `ITimeField`. ISO `YYYY-MM-DD` model, `minValue` / `maxValue`, and an `isUnavailable` predicate taking ISO strings. The one to reach for when the reader already knows the date — a birthday, an invoice date — where hunting through a month grid is slower than typing.
