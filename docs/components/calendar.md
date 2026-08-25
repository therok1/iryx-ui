---
eyebrow: Forms
---

<script setup lang="ts">
import { computed, ref } from 'vue'

const day = ref('2026-09-14')
const booking = ref(null)
const span = ref('2026-09-10')

const taken = ['2026-09-16', '2026-09-17', '2026-09-22', '2026-09-23', '2026-09-24']

function isTaken(date: string) {
  return taken.includes(date)
}

/** Weekends are closed. */
function isClosed(date: string) {
  const weekday = new Date(`${date}T00:00:00`).getDay()
  return weekday === 0 || weekday === 6
}
</script>

# ICalendar

A month grid that stays on the page. The same grid [`IDatePicker`](/components/date-picker) puts behind a field, for the times a popover is the wrong shape: a booking page, an availability view, a date shown beside the thing it applies to.

<Demo stack>
<template #demo>
<ICalendar v-model="day" label="Choose a day" />
</template>

```vue
<script setup lang="ts">
const day = ref('2026-09-14')
</script>

<template>
  <ICalendar v-model="day" label="Choose a day" />
</template>
```
</Demo>

The model is an **ISO `YYYY-MM-DD` string**, never a `Date` — see [the date helpers](/composables/dates) for why. Clicking the selected day again clears it, unless `preventDeselect` is set.

## Picker or calendar

Reach for [`IDatePicker`](/components/date-picker) inside a form: a field the reader scans past until they need it, in a column of other fields. Reach for `ICalendar` when choosing the date **is** the task on the page, or when what is available has to be visible without opening anything.

## Several months

`months` shows more than one at a time, which is what makes a span legible without paging back and forth. `pagedNavigation` then advances a whole view at a time rather than a single month.

<Demo stack>
<template #demo>
<ICalendar v-model="span" :months="2" paged-navigation label="Two months" />
</template>

```vue
<ICalendar v-model="span" :months="2" paged-navigation />
```
</Demo>

For picking a start and an end rather than one day, use [`IDateRangePicker`](/components/date-range-picker).

## Bounds and availability

`min` and `max` fence the selectable range. `isUnavailable` refuses individual days — a taken slot, a closed day — and is given an ISO string, not a `DateValue`.

<Demo stack>
<template #demo>
<ICalendar
  v-model="booking"
  min="2026-09-01"
  max="2026-10-31"
  :is-unavailable="date => isTaken(date) || isClosed(date)"
  label="Available appointments"
/>
</template>

```vue
<script setup lang="ts">
const taken = ['2026-09-16', '2026-09-17', '2026-09-22']

function isClosed(date: string) {
  const weekday = new Date(`${date}T00:00:00`).getDay()
  return weekday === 0 || weekday === 6
}
</script>

<template>
  <ICalendar
    v-model="booking"
    min="2026-09-01"
    max="2026-10-31"
    :is-unavailable="date => taken.includes(date) || isClosed(date)"
  />
</template>
```
</Demo>

The two states are drawn differently on purpose. A day outside `min`/`max` is faded — it is not part of this calendar's business. An unavailable day is **struck through**, because it is a real day that someone has already taken: hiding it would leave the reader wondering whether they had misread the month.

## Weeks

`weekStartsOn` overrides the locale's own convention — `0` is Sunday. `weekdayFormat` sets how the headings read.

<Demo stack>
<template #demo>
<div class="grid w-full gap-8 sm:grid-cols-2">
<ICalendar v-model="day" locale="en-GB" weekday-format="short" label="Short weekday names" />
<ICalendar v-model="day" :week-starts-on="0" label="Weeks starting Sunday" />
</div>
</template>

```vue
<ICalendar v-model="day" locale="en-GB" weekday-format="short" />
<ICalendar v-model="day" :week-starts-on="0" />
```
</Demo>

Every month is six rows tall by default. `fixedWeeks` turns that off, at the cost of the calendar changing height as the reader pages through it — which moves everything below it on the page.

## Accessibility

`label` names the calendar for a screen reader; without one it is an unnamed grid. Arrow keys move by day, `PageUp` and `PageDown` by month, and `Home` / `End` reach the ends of the week — all of that is Reka's, not ours. `initialFocus` moves focus to the selected day on mount, which is right inside a popover and usually wrong on a page that has other content above it.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| null` | `null` | The selected date, ISO `YYYY-MM-DD` |
| `min` | `string` | — | Earliest selectable date |
| `max` | `string` | — | Latest selectable date |
| `locale` | `string` | — | Month names and weekday initials |
| `weekStartsOn` | `0`–`6` | locale's own | `0` is Sunday |
| `weekdayFormat` | `'narrow' \| 'short' \| 'long'` | `'narrow'` | How the headings read |
| `months` | `number` | `1` | Months shown side by side |
| `pagedNavigation` | `boolean` | `false` | Advance a whole view rather than one month |
| `fixedWeeks` | `boolean` | `true` | Keep every month six rows tall |
| `disableDaysOutsideCurrentView` | `boolean` | `false` | Grey out the neighbouring months' days |
| `disabled` | `boolean` | `false` | Nothing is selectable |
| `readonly` | `boolean` | `false` | Shows a selection but will not change it |
| `initialFocus` | `boolean` | `false` | Focus the selected day on mount |
| `isUnavailable` | `(date: string) => boolean` | — | Refuse individual days |
| `preventDeselect` | `boolean` | `false` | Clicking the selected day again keeps it |
| `label` | `string` | — | Accessible name for the calendar |
| `previousLabel` | `string` | `'Previous month'` | Label for the back control |
| `nextLabel` | `string` | `'Next month'` | Label for the forward control |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Classes for the root |
| `ui` | `object` | — | Per-slot classes |

## `ui` slots

| Slot | Description |
| --- | --- |
| `root` | Outermost element |
| `header` | Row holding the heading and the two nav controls |
| `heading` | The month and year |
| `nav` | Back and forward controls |
| `months` | Row of month grids |
| `grid` | One month's table |
| `headCell` | A weekday heading |
| `cell` | A day's table cell — where a range band is painted |
| `cellTrigger` | The day itself |
