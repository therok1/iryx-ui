---
eyebrow: Forms
---

<script setup lang="ts">
import { ref } from 'vue'

const start = ref('09:00')
const precise = ref('09:30:00')
const twelve = ref('14:15')
const invalid = ref('23:59')
const bounded = ref('10:00')
</script>

# ITimeField

A time entered one segment at a time — hour, minute, optionally seconds — each its own arrow-key control.

<Demo stack>
<template #demo>
<ITimeField v-model="start" aria-label="Start time" />
<p class="text-sm text-muted-foreground">Value: {{ start ?? '—' }}</p>
</template>

```vue
<script setup lang="ts">
const start = ref('09:00')
</script>

<template>
  <ITimeField v-model="start" aria-label="Start time" />
</template>
```
</Demo>

## The model is a string

`HH:mm`, or `HH:mm:ss` when there are seconds — on a 24-hour clock, zero-padded, and carrying no date or time zone. Padded that way it sorts and compares as a plain string.

```ts
const start = ref('09:00') //     not new Date(...)
const exact = ref('09:30:15') //  with granularity="second"
```

A malformed value is treated as no selection rather than an error, so a stale draft or a URL parameter cannot break the render.

## Granularity

<Demo stack>
<template #demo>
<ITimeField v-model="start" aria-label="To the minute" />
<ITimeField v-model="precise" granularity="second" aria-label="To the second" />
</template>

```vue
<ITimeField v-model="start" aria-label="To the minute" />
<ITimeField v-model="exact" granularity="second" aria-label="To the second" />
```
</Demo>

## Hour cycle

Left unset it follows the locale. The model stays 24-hour either way.

<Demo stack>
<template #demo>
<ITimeField v-model="twelve" :hour-cycle="12" aria-label="12-hour" />
<ITimeField v-model="twelve" :hour-cycle="24" aria-label="24-hour" />
<p class="text-sm text-muted-foreground">Both hold: {{ twelve }}</p>
</template>

```vue
<ITimeField v-model="value" :hour-cycle="12" aria-label="12-hour" />
<ITimeField v-model="value" :hour-cycle="24" aria-label="24-hour" />
```
</Demo>

## Bounds and steps

`min-value` and `max-value` take the same `HH:mm` form. `step` sets how far each arrow key press moves a segment.

<Demo stack>
<template #demo>
<ITimeField
  v-model="bounded"
  min-value="09:00"
  max-value="17:00"
  :step="{ minute: 15 }"
  aria-label="Appointment"
/>
</template>

```vue
<ITimeField
  v-model="slot"
  min-value="09:00"
  max-value="17:00"
  :step="{ minute: 15 }"
  aria-label="Appointment"
/>
```
</Demo>

## Sizes and states

<Demo stack>
<template #demo>
<div class="flex flex-wrap items-center gap-3">
<ITimeField v-model="start" size="sm" aria-label="Small" />
<ITimeField v-model="start" size="md" aria-label="Medium" />
<ITimeField v-model="start" size="lg" aria-label="Large" />
</div>
<div class="flex flex-wrap items-center gap-3">
<ITimeField v-model="invalid" invalid aria-label="Invalid" />
<ITimeField v-model="start" disabled aria-label="Disabled" />
</div>
</template>

```vue
<ITimeField v-model="value" size="sm" aria-label="Small" />
<ITimeField v-model="value" size="md" aria-label="Medium" />
<ITimeField v-model="value" size="lg" aria-label="Large" />

<ITimeField v-model="value" invalid aria-label="Invalid" />
<ITimeField v-model="value" disabled aria-label="Disabled" />
```
</Demo>

Inside an [`IFormField`](/components/form-field) the id, the invalid state and the error's `aria-describedby` are all inherited.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| null` | — | `HH:mm` or `HH:mm:ss`, 24-hour |
| `granularity` | `'hour' \| 'minute' \| 'second'` | `'minute'` | |
| `hourCycle` | `12 \| 24` | from `locale` | Display only; the model stays 24-hour |
| `locale` | `string` | browser default | |
| `step` | `{ hour?, minute?, second? }` | `1` each | Movement per arrow key press |
| `minValue` | `string` | — | |
| `maxValue` | `string` | — | |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `disabled` | `boolean` | `false` | |
| `readonly` | `boolean` | `false` | |
| `invalid` | `boolean` | — | Inherited from `IFormField` when unset |
| `unstyled` | `boolean` | — | Skip built-in classes |
| `ui` | `{ root?, segment?, literal? }` | — | Per-element class overrides |

## Helpers

`toTime()` and `toIsoTime()` are exported for converting at your own boundaries — see the [date helpers](/composables/dates).

## Accessibility

Each segment is a `spinbutton`: arrow keys change it, left and right move between segments, and typing digits fills it and advances. A screen reader announces each part by name rather than reading one opaque string.

The separator between segments is plain text rather than another stop on the way through the field, and the digits are tabular so the segments do not jitter while they change.
