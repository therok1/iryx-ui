---
eyebrow: Forms
---

<script setup lang="ts">
import { ref } from 'vue'

const born = ref('1994-03-22')
const issued = ref('2026-08-15')
const due = ref(null)
const bounded = ref('2026-09-10')
</script>

# IDateField

A date typed one segment at a time — day, month, year — each its own arrow-key control, ordered by the locale.

<Demo stack>
<template #demo>
<IFormField label="Date of birth">
  <IDateField v-model="born" locale="en-GB" />
</IFormField>
</template>

```vue
<script setup lang="ts">
const born = ref('1994-03-22')
</script>

<template>
  <IFormField label="Date of birth">
    <IDateField v-model="born" locale="en-GB" />
  </IFormField>
</template>
```
</Demo>

The model is an ISO `YYYY-MM-DD` string, the same as [`IDatePicker`](/components/date-picker) and [`ICalendar`](/components/calendar).

## Typing or choosing

Reach for `IDateField` when the reader **already knows the date**: a birthday, an invoice date, a passport expiry. Hunting for 22 March 1994 in a month grid means paging back three hundred and eighty times.

Reach for [`IDatePicker`](/components/date-picker) when the date is being **chosen** rather than recalled — a delivery slot, a meeting — and especially when which day of the week it lands on matters.

They pair well: a field to type into, with a picker beside it for the times the reader wants to see the month.

<Demo stack>
<template #demo>
<IFormField label="Invoice date" help="Type it, or pick it from the calendar">
  <div class="flex items-center gap-2">
    <IDateField v-model="issued" locale="en-GB" />
    <IDatePicker v-model="issued" class="w-auto" placeholder="Pick" />
  </div>
</IFormField>
</template>

```vue
<div class="flex items-center gap-2">
  <IDateField v-model="issued" locale="en-GB" />
  <IDatePicker v-model="issued" />
</div>
```
</Demo>

Both write the same ISO string, so pointing them at one model is all the wiring there is.

## Locale

The locale decides both the order of the segments and the separator — there is no prop for either, because getting it wrong is how a form ends up asking a British reader for `08/15/2026`.

<Demo stack>
<template #demo>
<div class="flex flex-wrap items-center gap-4">
<IDateField v-model="issued" locale="en-GB" />
<IDateField v-model="issued" locale="en-US" />
<IDateField v-model="issued" locale="de-DE" />
</div>
</template>

```vue
<IDateField v-model="issued" locale="en-GB" /> <!-- 15/08/2026 -->
<IDateField v-model="issued" locale="en-US" /> <!-- 08/15/2026 -->
<IDateField v-model="issued" locale="de-DE" /> <!-- 15.08.2026 -->
```
</Demo>

## Bounds and availability

`minValue` and `maxValue` fence the field, and `isUnavailable` refuses individual days — both in ISO strings, as everywhere else.

<Demo stack>
<template #demo>
<IFormField label="Delivery date" help="Weekdays only, this month or next">
  <IDateField
    v-model="bounded"
    locale="en-GB"
    min-value="2026-09-01"
    max-value="2026-10-31"
    :is-unavailable="date => [0, 6].includes(new Date(`${date}T00:00:00`).getDay())"
  />
</IFormField>
</template>

```vue
<IDateField
  v-model="bounded"
  min-value="2026-09-01"
  max-value="2026-10-31"
  :is-unavailable="date => [0, 6].includes(new Date(`${date}T00:00:00`).getDay())"
/>
```
</Demo>

An out-of-bounds value marks the field invalid rather than silently correcting itself — the reader typed something, and having it change under them is worse than being told.

## Empty and invalid

With no model the segments show their placeholders and the field is empty, not zero. `invalid` styles it, and [`IFormField`](/components/form-field) sets that for you from a form's validation.

<Demo stack>
<template #demo>
<div class="flex flex-wrap items-start gap-4">
<IFormField label="Due date">
  <IDateField v-model="due" locale="en-GB" />
</IFormField>

<IFormField label="Due date" error="Enter a date">
  <IDateField v-model="due" locale="en-GB" />
</IFormField>
</div>
</template>

```vue
<IFormField label="Due date" error="Enter a date">
  <IDateField v-model="due" />
</IFormField>
```
</Demo>

## Why not `<input type="date">`

The native control gives no say over the segment order, no way to mark individual days unavailable, and renders a different thing in every browser — including a picker button that cannot be styled or removed. This is three arrow-key spinbuttons with the field chrome the rest of the library uses, which is what makes it sit properly beside an [`IInput`](/components/input) or an [`ITimeField`](/components/time-field).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| null` | — | The date, ISO `YYYY-MM-DD` |
| `minValue` | `string` | — | Earliest allowed date |
| `maxValue` | `string` | — | Latest allowed date |
| `locale` | `string` | — | Orders the segments and picks the separator |
| `isUnavailable` | `(date: string) => boolean` | — | Refuse individual days |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Matches the other fields |
| `disabled` | `boolean` | `false` | — |
| `readonly` | `boolean` | `false` | Shows a date but will not change it |
| `invalid` | `boolean` | — | Red border and ring; set by `IFormField` |
| `id` | `string` | — | Falls back to `IFormField`'s |
| `name` | `string` | — | Submitted with a surrounding native form |
| `required` | `boolean` | `false` | — |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Classes for the field |
| `ui` | `{ root?, segment?, literal? }` | — | Per-element class overrides |
