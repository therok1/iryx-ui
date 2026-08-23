---
eyebrow: Composables
---

<script setup lang="ts">
import { formatIsoDate, isoToday } from 'iryx-ui'
import { ref } from 'vue'

const date = ref<string | null>('2026-08-15')
</script>

# Date helpers

Conversions between the ISO `YYYY-MM-DD` strings the date components model and the `CalendarDate` values Reka's calendars require, plus formatting for display.

<Demo stack>
<template #demo>
<div class="flex w-full max-w-md items-center text-center flex-col gap-3">
<IDatePicker v-model="date" class="w-full" />
<p class="font-mono text-sm text-muted-foreground">model → {{ date ?? 'null' }}</p>
<p class="text-sm">formatIsoDate → {{ formatIsoDate(date) }}</p>
<p class="text-sm">de-DE, full → {{ formatIsoDate(date, 'de-DE', { dateStyle: 'full' }) }}</p>
<p class="font-mono text-sm text-muted-foreground">isoToday() → {{ isoToday() }}</p>
</div>
</template>

```ts
import { formatIsoDate, isoToday } from 'iryx-ui'

formatIsoDate('2026-08-15') // '15 Aug 2026'
formatIsoDate('2026-08-15', 'de-DE', { dateStyle: 'full' })
isoToday() // '2026-08-22'
```
</Demo>

## Why a string and not a Date

A `Date` carries a time zone: `new Date('2026-08-15')` parses as UTC midnight, so a reader west of Greenwich formatting it locally sees the 14th. Stored as `'2026-08-15'` the date stays the day that was picked, wherever it is read.

## The helpers

| Function | Signature | |
| --- | --- | --- |
| `toCalendarDate` | `(iso) => CalendarDate \| undefined` | ISO string → the value Reka's calendars take |
| `toIsoDate` | `(date) => string \| null` | Back the other way |
| `isoToday` | `() => string` | Today in the local zone, as `YYYY-MM-DD` |
| `formatIsoDate` | `(iso, locale?, options?) => string` | For display; `''` for absent or malformed input |

`formatIsoDate` defaults to `{ dateStyle: 'medium' }` and takes any `Intl.DateTimeFormatOptions`. It returns an empty string rather than throwing on bad input, so a caller can fall back to a placeholder without a `try`.

`CalendarDate` and the `DateValue` type are re-exported, so you can work with `@internationalized/date` without adding it to your own dependencies.

## Formatting elsewhere

The model is a plain string, so format it with `Intl`, dayjs or anything else you already use.
