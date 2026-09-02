---
eyebrow: Feedback
---

<script setup lang="ts">
const gb = (value: number) => `${value} GB`
</script>

# IProgress

A determinate bar for work with a known end, with an indeterminate mode, a stacked mode and a ring.

<Demo stack>
<template #demo>
<IProgress :model-value="62" class="w-full max-w-md" />
</template>

```vue
<IProgress :model-value="62" />
```
</Demo>

## Label and value

`label` renders above the track and is tied to the bar with `aria-labelledby`. `showValue` adds the percentage on the right.

<Demo stack>
<template #demo>
<IProgress :model-value="62" label="Storage used" show-value class="w-full max-w-md" />
</template>

```vue
<IProgress :model-value="62" label="Storage used" show-value />
```
</Demo>

## Formatting the value

`formatValue` receives the value and the max, so the readout can say something more useful than a percentage.

<Demo stack>
<template #demo>
<IProgress
  :model-value="6.2"
  :max="10"
  label="Storage used"
  show-value
  :format-value="(value, max) => `${value} of ${max} GB`"
  class="w-full max-w-md"
/>
</template>

```vue
<IProgress
  :model-value="6.2"
  :max="10"
  label="Storage used"
  show-value
  :format-value="(value, max) => `${value} of ${max} GB`"
/>
```
</Demo>

## Variants

<Demo stack>
<template #demo>
<IProgress :model-value="62" class="w-full max-w-md" />
<IProgress :model-value="62" variant="success" class="w-full max-w-md" />
<IProgress :model-value="62" variant="warning" class="w-full max-w-md" />
<IProgress :model-value="62" variant="danger" class="w-full max-w-md" />
<IProgress :model-value="62" variant="info" class="w-full max-w-md" />
</template>

```vue
<IProgress :model-value="62" />
<IProgress :model-value="62" variant="success" />
<IProgress :model-value="62" variant="warning" />
<IProgress :model-value="62" variant="danger" />
<IProgress :model-value="62" variant="info" />
```
</Demo>

## Sizes

<Demo stack>
<template #demo>
<IProgress :model-value="62" size="sm" class="w-full max-w-md" />
<IProgress :model-value="62" size="md" class="w-full max-w-md" />
<IProgress :model-value="62" size="lg" class="w-full max-w-md" />
</template>

```vue
<IProgress :model-value="62" size="sm" />
<IProgress :model-value="62" size="md" />
<IProgress :model-value="62" size="lg" />
```
</Demo>

## Indeterminate

Set `indeterminate`, or leave the model `null`, when the work has no measurable end. The bar animates without claiming a position.

<Demo stack>
<template #demo>
<IProgress indeterminate label="Importing" class="w-full max-w-md" />
</template>

```vue
<IProgress indeterminate label="Importing" />

<!-- Equivalent: a null model is treated as indeterminate. -->
<IProgress :model-value="null" />
```
</Demo>

## Circle

`shape="circle"` draws the same value as a ring with the readout in the middle. Everything else is unchanged — `variant`, `size`, `formatValue` and the indeterminate mode all behave as they do on the bar.

<Demo stack>
<template #demo>
<div class="flex flex-wrap items-center justify-center gap-8">
<IProgress shape="circle" :model-value="72" show-value />
<IProgress shape="circle" :model-value="41" show-value label="Uploaded" variant="success" />
<IProgress shape="circle" indeterminate />
</div>
</template>

```vue
<IProgress shape="circle" :model-value="72" show-value />
<IProgress shape="circle" :model-value="41" show-value label="Uploaded" variant="success" />
<IProgress shape="circle" indeterminate />
```
</Demo>

`size` sets the ring's diameter; the stroke scales with it.

<Demo stack>
<template #demo>
<div class="flex flex-wrap items-center justify-center gap-8">
<IProgress shape="circle" size="sm" :model-value="60" show-value />
<IProgress shape="circle" size="md" :model-value="60" show-value />
<IProgress shape="circle" size="lg" :model-value="60" show-value />
</div>
</template>

```vue
<IProgress shape="circle" size="sm" :model-value="60" show-value />
<IProgress shape="circle" size="md" :model-value="60" show-value />
<IProgress shape="circle" size="lg" :model-value="60" show-value />
```
</Demo>

`angle` shortens the track to part of a circle — `180` for a half, `270` for a gauge. The arc is centred at the top, so the gap sits at the bottom, and the value is measured against the track rather than the whole ring: half of a half circle is a quarter turn.

<Demo stack>
<template #demo>
<div class="flex flex-wrap items-center justify-center gap-8">
<IProgress shape="circle" :angle="180" :model-value="50" show-value label="Half" />
<IProgress shape="circle" :angle="270" :model-value="64" show-value label="Gauge" variant="warning" />
<IProgress shape="circle" :angle="90" :model-value="80" show-value />
</div>
</template>

```vue
<IProgress shape="circle" :angle="180" :model-value="50" show-value label="Half" />
<IProgress shape="circle" :angle="270" :model-value="64" show-value label="Gauge" variant="warning" />
<IProgress shape="circle" :angle="90" :model-value="80" show-value />
```
</Demo>

A ring ignores `segments`. A broken-up ring is a donut chart, and [`IDonutChart`](/components/donut-chart) is the component for that.

## Stacked

`segments` breaks one track into runs — storage by file type, a budget by category, a release by status. Each run carries its own value and variant, and `modelValue` is ignored; the accessible value is their sum.

<Demo stack>
<template #demo>
<IProgress
  label="Storage"
  show-value
  size="lg"
  class="w-full max-w-md"
  :max="500"
  :format-value="gb"
  :segments="[
    { value: 180, label: 'Documents', variant: 'primary' },
    { value: 120, label: 'Images', variant: 'success' },
    { value: 60, label: 'Video', variant: 'warning' },
    { value: 25, label: 'Other' },
  ]"
/>
</template>

```vue
<IProgress
  label="Storage"
  show-value
  size="lg"
  :max="500"
  :format-value="(value, max) => `${value} GB`"
  :segments="[
    { value: 180, label: 'Documents', variant: 'primary' },
    { value: 120, label: 'Images', variant: 'success' },
    { value: 60, label: 'Video', variant: 'warning' },
    { value: 25, label: 'Other' },
  ]"
/>
```
</Demo>

A run with a `label` gets a legend row beneath the track, which is where the breakdown is readable. Leave the labels off for a bare stacked bar.

<Demo stack>
<template #demo>
<IProgress
  class="w-full max-w-md"
  :segments="[
    { value: 45, variant: 'success' },
    { value: 25, variant: 'warning' },
    { value: 15, variant: 'danger' },
  ]"
/>
</template>

```vue
<IProgress
  :segments="[
    { value: 45, variant: 'success' },
    { value: 25, variant: 'warning' },
    { value: 15, variant: 'danger' },
  ]"
/>
```
</Demo>

A run with no `variant` takes the neutral fill.

### More than the track holds

Runs can sum past `max` — a disk that grew, a budget overspent. They are clamped cumulatively rather than scaled, so the bar fills and stops.

<Demo stack>
<template #demo>
<IProgress
  label="Budget"
  show-value
  class="w-full max-w-md"
  :segments="[
    { value: 70, label: 'Committed', variant: 'primary' },
    { value: 55, label: 'Requested', variant: 'danger' },
  ]"
/>
</template>

```vue
<!-- 70 + 55 exceeds the default max of 100 -->
<IProgress
  label="Budget"
  show-value
  :segments="[
    { value: 70, label: 'Committed', variant: 'primary' },
    { value: 55, label: 'Requested', variant: 'danger' },
  ]"
/>
```
</Demo>

The legend still shows each run's own value, so the overspend stays readable as a number.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number \| null` | — | Current value; `null` means indeterminate |
| `max` | `number` | `100` | Value representing full |
| `shape` | `'linear' \| 'circle'` | `'linear'` | A bar, or a ring with the readout in the middle |
| `angle` | `number` | `360` | Degrees of the ring the track covers |
| `variant` | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'neutral'` | `'primary'` | Bar colour |
| `segments` | `ProgressSegment[]` | — | Runs sharing one track; supersedes `modelValue` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Track thickness |
| `indeterminate` | `boolean` | `false` | Animate without a position |
| `label` | `string` | — | Text above the track, wired to the bar |
| `showValue` | `boolean` | `false` | Show the readout on the right |
| `formatValue` | `(value, max) => string` | percentage | Formats that readout |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, header?, label?, value?, track?, indicator?, segment?, legend?, legendItem?, legendSwatch?, legendValue? }` | — | Per-element class overrides |

The value is clamped to `0…max`.

```ts
interface ProgressSegment {
  value: number
  label?: string
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
}
```

With no `label`, put an `aria-label` on the component: attributes reach the progressbar itself.

For a trend rather than a proportion, use [`ISparkline`](/components/sparkline); for a wait inside a button, [`IButton`](/components/button)'s `loading`.
