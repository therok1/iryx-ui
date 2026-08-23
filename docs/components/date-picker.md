---
eyebrow: Forms
---

<script setup lang="ts">
import { ref } from 'vue'

const issuedOn = ref<string | null>('2026-08-15')
const empty = ref<string | null>(null)
const bounded = ref<string | null>(null)
const formatted = ref<string | null>('2026-08-15')
const localised = ref<string | null>('2026-08-15')
const clearable = ref<string | null>('2026-08-15')
const sizeSm = ref<string | null>('2026-08-15')
const sizeMd = ref<string | null>('2026-08-15')
const sizeLg = ref<string | null>('2026-08-15')
const invalid = ref<string | null>(null)
const disabled = ref<string | null>('2026-08-15')
</script>

# IDatePicker

A calendar in a popover. The model is an ISO `YYYY-MM-DD` **string**, never a `Date`.

<Demo stack>
<template #demo>
<IDatePicker v-model="issuedOn" class="w-64" />
</template>

```vue
<script setup lang="ts">
const issuedOn = ref<string | null>('2026-08-15')
</script>

<template>
  <IDatePicker v-model="issuedOn" />
</template>
```
</Demo>

The string carries no time zone, so the date stays the day that was picked wherever it is read. Format it on the way out with `Intl`, `dayjs` or anything else.

With nothing selected the model is `null` and the trigger shows `placeholder`.

<Demo stack>
<template #demo>
<IDatePicker v-model="empty" placeholder="Select an issue date" class="w-64" />
</template>

```vue
<IDatePicker v-model="issuedOn" placeholder="Select an issue date" />
```
</Demo>

## Bounds

`min` and `max` are ISO strings too. Dates outside the window are rendered disabled rather than hidden, so the reader can see where the limit falls.

<Demo stack>
<template #demo>
<IDatePicker v-model="bounded" min="2026-08-10" max="2026-08-24" placeholder="Within one fortnight" class="w-64" />
</template>

```vue
<IDatePicker
  v-model="date"
  min="2026-08-10"
  max="2026-08-24"
  placeholder="Within one fortnight"
/>
```
</Demo>

## Formatting the trigger

`format` takes `Intl.DateTimeFormatOptions` and decides how the selected date reads on the button. The calendar itself is unaffected.

<Demo stack>
<template #demo>
<IDatePicker v-model="formatted" :format="{ dateStyle: 'full' }" class="w-72" />
<IDatePicker v-model="formatted" :format="{ day: '2-digit', month: 'short', year: 'numeric' }" class="w-72" />
</template>

```vue
<IDatePicker v-model="date" :format="{ dateStyle: 'full' }" />
<IDatePicker v-model="date" :format="{ day: '2-digit', month: 'short', year: 'numeric' }" />
```
</Demo>

## Locale and week start

`locale` drives the month names, the weekday initials and the trigger's text. `weekStartsOn` overrides the locale's own convention when you need to — `0` is Sunday.

<Demo stack>
<template #demo>
<IDatePicker v-model="localised" locale="de-DE" previous-label="Voriger Monat" next-label="Nächster Monat" today-label="Heute" class="w-64" />
<IDatePicker v-model="localised" locale="en-US" :week-starts-on="0" class="w-64" />
</template>

```vue
<IDatePicker
  v-model="date"
  locale="de-DE"
  today-label="Heute"
  previous-label="Voriger Monat"
  next-label="Nächster Monat"
/>

<IDatePicker v-model="date" locale="en-US" :week-starts-on="0" />
```
</Demo>

Every visible string is a prop: `todayLabel`, `clearLabel`, `previousLabel` and `nextLabel`.

## Clearable

`clearable` adds a clear action beside "Today" in the footer. It sets the model back to `null`.

<Demo stack>
<template #demo>
<IDatePicker v-model="clearable" clearable class="w-64" />
</template>

```vue
<IDatePicker v-model="issuedOn" clearable />
```
</Demo>

## Sizes

<Demo stack>
<template #demo>
<IDatePicker v-model="sizeSm" size="sm" class="w-64" />
<IDatePicker v-model="sizeMd" size="md" class="w-64" />
<IDatePicker v-model="sizeLg" size="lg" class="w-64" />
</template>

```vue
<IDatePicker v-model="date" size="sm" />
<IDatePicker v-model="date" size="md" />
<IDatePicker v-model="date" size="lg" />
```
</Demo>

## Invalid and disabled

<Demo stack>
<template #demo>
<IDatePicker v-model="invalid" invalid placeholder="Pick a date" class="w-64" />
<IDatePicker v-model="disabled" disabled class="w-64" />
</template>

```vue
<IDatePicker v-model="date" invalid placeholder="Pick a date" />
<IDatePicker v-model="date" disabled />
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control scale |
| `placeholder` | `string` | `'Pick a date'` | Shown while nothing is selected |
| `disabled` | `boolean` | — | Trigger cannot be opened |
| `invalid` | `boolean` | — | Red border and ring; inherited from `IFormField` when unset |
| `id` | `string` | — | Id for the trigger; `IFormField` supplies one |
| `min` | `string` | — | Earliest selectable date, ISO `YYYY-MM-DD` |
| `max` | `string` | — | Latest selectable date, ISO `YYYY-MM-DD` |
| `locale` | `string` | — | Month names, weekday initials and trigger text |
| `format` | `Intl.DateTimeFormatOptions` | — | How the selected date reads on the trigger |
| `weekStartsOn` | `0`–`6` | — | `0` is Sunday. Defaults to the locale's convention |
| `clearable` | `boolean` | — | Adds a clear action to the footer |
| `todayLabel` | `string` | `'Today'` | Footer action label |
| `clearLabel` | `string` | `'Clear'` | Clear action label |
| `previousLabel` | `string` | `'Previous month'` | Accessible name for the back arrow |
| `nextLabel` | `string` | `'Next month'` | Accessible name for the forward arrow |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Applied to the trigger, which carries the field chrome |
| `ui` | `{ trigger?, placeholder?, content?, header?, heading?, nav?, months?, grid?, headCell?, cell?, cellTrigger?, footer?, action? }` | — | Per-slot class overrides |

## Model

```ts
const issuedOn = ref<string | null>(null)
```

For a span rather than a single day, use [`IDateRangePicker`](/components/date-range-picker).
