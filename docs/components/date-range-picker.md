---
eyebrow: Forms
---

<script setup lang="ts">
import { ref } from 'vue'

const period = ref({ start: '2026-08-01', end: '2026-08-31' })
const empty = ref({ start: null, end: null })
const bounded = ref({ start: null, end: null })
const single = ref({ start: '2026-08-04', end: '2026-08-12' })
const triple = ref({ start: '2026-08-04', end: '2026-10-12' })
const formatted = ref({ start: '2026-08-01', end: '2026-08-31' })
const separated = ref({ start: '2026-08-01', end: '2026-08-31' })
const clearable = ref({ start: '2026-08-01', end: '2026-08-31' })
const sizeSm = ref({ start: '2026-08-01', end: '2026-08-31' })
const sizeMd = ref({ start: '2026-08-01', end: '2026-08-31' })
const sizeLg = ref({ start: '2026-08-01', end: '2026-08-31' })
const invalid = ref({ start: null, end: null })
</script>

# IDateRangePicker

A two-month calendar for picking a span — a reporting period, a filter window, a stay. The model is a pair of ISO `YYYY-MM-DD` **strings**, like [`IDatePicker`](/components/date-picker).

<Demo stack>
<template #demo>
<IDateRangePicker v-model="period" class="w-80" />
</template>

```vue
<script setup lang="ts">
const period = ref({ start: '2026-08-01', end: '2026-08-31' })
</script>

<template>
  <IDateRangePicker v-model="period" />
</template>
```
</Demo>

Both ends are `null` while nothing is chosen, and the first click sets `start` with `end` still `null`. Guard on `period.end` before querying with the range.

<Demo stack>
<template #demo>
<IDateRangePicker v-model="empty" placeholder="Select a reporting period" class="w-80" />
</template>

```vue
<IDateRangePicker v-model="period" placeholder="Select a reporting period" />
```
</Demo>

## Months shown

Two months side by side is the default, since most ranges cross a month boundary. Drop to one where the popover has no room, or go to three for long ranges.

<Demo stack>
<template #demo>
<IDateRangePicker v-model="single" :months="1" placeholder="One month" class="w-80" />
<IDateRangePicker v-model="triple" :months="3" placeholder="Three months" class="w-80" />
</template>

```vue
<IDateRangePicker v-model="period" :months="1" placeholder="One month" />
<IDateRangePicker v-model="period" :months="3" placeholder="Three months" />
```
</Demo>

## Bounds

<Demo stack>
<template #demo>
<IDateRangePicker v-model="bounded" min="2026-08-01" max="2026-09-15" placeholder="Within the window" class="w-80" />
</template>

```vue
<IDateRangePicker
  v-model="period"
  min="2026-08-01"
  max="2026-09-15"
  placeholder="Within the window"
/>
```
</Demo>

## Formatting and separator

`format` takes `Intl.DateTimeFormatOptions` and applies to both ends; `separator` is the text between them.

<Demo stack>
<template #demo>
<IDateRangePicker v-model="formatted" :format="{ day: '2-digit', month: 'short', year: 'numeric' }" class="w-80" />
<IDateRangePicker v-model="separated" separator=" to " class="w-80" />
</template>

```vue
<IDateRangePicker
  v-model="period"
  :format="{ day: '2-digit', month: 'short', year: 'numeric' }"
/>
<IDateRangePicker v-model="period" separator=" to " />
```
</Demo>

## Locale and week start

<Demo stack>
<template #demo>
<IDateRangePicker v-model="period" locale="de-DE" previous-label="Voriger Monat" next-label="Nächster Monat" class="w-80" />
<IDateRangePicker v-model="period" locale="en-US" :week-starts-on="0" class="w-80" />
</template>

```vue
<IDateRangePicker
  v-model="period"
  locale="de-DE"
  previous-label="Voriger Monat"
  next-label="Nächster Monat"
/>

<IDateRangePicker v-model="period" locale="en-US" :week-starts-on="0" />
```
</Demo>

`clearLabel`, `previousLabel` and `nextLabel` are props as well.

## Clearable

<Demo stack>
<template #demo>
<IDateRangePicker v-model="clearable" clearable class="w-80" />
</template>

```vue
<IDateRangePicker v-model="period" clearable />
```
</Demo>

Clearing sets both ends back to `null`.

## Sizes

<Demo stack>
<template #demo>
<IDateRangePicker v-model="sizeSm" size="sm" class="w-80" />
<IDateRangePicker v-model="sizeMd" size="md" class="w-80" />
<IDateRangePicker v-model="sizeLg" size="lg" class="w-80" />
</template>

```vue
<IDateRangePicker v-model="period" size="sm" />
<IDateRangePicker v-model="period" size="md" />
<IDateRangePicker v-model="period" size="lg" />
```
</Demo>

## Invalid

<Demo stack>
<template #demo>
<IDateRangePicker v-model="invalid" invalid placeholder="Pick a range" class="w-80" />
</template>

```vue
<IDateRangePicker v-model="period" invalid placeholder="Pick a range" />
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control scale |
| `placeholder` | `string` | `'Pick a date range'` | Shown while nothing is selected |
| `disabled` | `boolean` | — | Trigger cannot be opened |
| `invalid` | `boolean` | — | Red border and ring; inherited from `IFormField` when unset |
| `id` | `string` | — | Id for the trigger; `IFormField` supplies one |
| `min` | `string` | — | Earliest selectable date, ISO `YYYY-MM-DD` |
| `max` | `string` | — | Latest selectable date, ISO `YYYY-MM-DD` |
| `locale` | `string` | — | Month names, weekday initials and trigger text |
| `format` | `Intl.DateTimeFormatOptions` | — | How each end reads on the trigger |
| `weekStartsOn` | `0`–`6` | — | `0` is Sunday. Defaults to the locale's convention |
| `months` | `number` | `2` | Months shown side by side |
| `clearable` | `boolean` | — | Adds a clear action to the footer |
| `separator` | `string` | `' – '` | Text between the two dates on the trigger |
| `clearLabel` | `string` | `'Clear'` | Clear action label |
| `previousLabel` | `string` | `'Previous month'` | Accessible name for the back arrow |
| `nextLabel` | `string` | `'Next month'` | Accessible name for the forward arrow |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Applied to the trigger, which carries the field chrome |
| `ui` | `{ trigger?, placeholder?, content?, header?, heading?, nav?, months?, grid?, headCell?, cell?, cellTrigger?, footer?, action? }` | — | Per-element class overrides |

## Model

```ts
interface DateRange {
  start: string | null
  end: string | null
}
```

The popover closes once both ends are set.
