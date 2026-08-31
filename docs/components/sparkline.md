---
eyebrow: Charts
---

<script setup lang="ts">
const revenue = [18, 22, 19, 27, 31, 29, 36, 34, 41, 44, 42, 48]
const churn = [9, 8, 8.5, 7, 6.4, 6.8, 5.9, 5.2, 5.4, 4.8, 4.6, 4.1]
const gappy = [12, 15, null, null, 21, 24, 22, 27, null, 30, 33, 35]
</script>

# ISparkline

A trend line small enough to sit inside a sentence or a stat tile, in plain SVG with no charting dependency.

<Demo stack>
<template #demo>
<ISparkline :data="revenue" class="w-full" />
</template>

```vue
<script setup lang="ts">
const revenue = [18, 22, 19, 27, 31, 29, 36, 34, 41, 44, 42, 48]
</script>

<template>
  <ISparkline :data="revenue" />
</template>
```
</Demo>

The width always fills the container; `height` (32px by default) is the only dimension you set. Values are oldest first — there is no x axis, so the order in the array is the time axis.

## Area and the end dot

`area` adds a wash beneath the line, which holds up better on a busy surface — the same downward-fading gradient [`ILineChart`](/components/line-chart) uses, so the two read as one family. `endDot` marks the most recent point.

<Demo stack>
<template #demo>
<ISparkline :data="revenue" variant="area" class="w-full max-w-md" />
<ISparkline :data="revenue" variant="area" end-dot class="w-full max-w-md" />
<ISparkline :data="revenue" end-dot class="w-full max-w-md" />
</template>

```vue
<ISparkline :data="revenue" variant="area" />
<ISparkline :data="revenue" variant="area" end-dot />
<ISparkline :data="revenue" end-dot />
```
</Demo>

`baseline` decides where the wash stops: `min` (the default) fills from the lowest point and shows the shape; `zero` fills from nothing and shows the magnitude.

<Demo stack>
<template #demo>
<ISparkline :data="revenue" variant="area" baseline="min" class="w-full max-w-md" />
<ISparkline :data="revenue" variant="area" baseline="zero" class="w-full max-w-md" />
</template>

```vue
<ISparkline :data="revenue" variant="area" baseline="min" />
<ISparkline :data="revenue" variant="area" baseline="zero" />
```
</Demo>

## Gaps

`null` is a missing reading rather than a zero, and the line breaks rather than bridging it.

<Demo stack>
<template #demo>
<ISparkline :data="gappy" end-dot class="w-full" />
</template>

```vue
<ISparkline :data="[12, 15, null, null, 21, 24]" end-dot />
```
</Demo>

## One scale across several

Each sparkline scales to its own data. Pin `min` and `max` on both to put two of them on one scale.

<Demo stack>
<template #demo>
<div class="grid w-full max-w-md gap-3 sm:grid-cols-2">
<ICard><p class="text-xs text-muted-foreground">Revenue</p><ISparkline class="mt-2" :data="revenue" :min="0" :max="50" /></ICard>
<ICard><p class="text-xs text-muted-foreground">Churn</p><ISparkline class="mt-2" :data="churn" :min="0" :max="50" /></ICard>
</div>
</template>

```vue
<ISparkline :data="revenue" :min="0" :max="50" />
<ISparkline :data="churn" :min="0" :max="50" />
```
</Demo>

## Muted

`muted` draws in de-emphasised ink, for a trend that supports a number rather than competing with it — the case inside an [`IStat`](/components/stat) tile.

<Demo stack>
<template #demo>
<ICard class="w-full max-w-xs">
<p class="text-sm text-muted-foreground">Revenue</p>
<p class="text-2xl font-semibold tabular-nums">€48,200</p>
<ISparkline :data="revenue" muted variant="area" class="mt-3" />
</ICard>
</template>

```vue
<ICard>
  <p class="text-sm text-muted-foreground">Revenue</p>
  <p class="text-2xl font-semibold">€48,200</p>
  <ISparkline :data="revenue" muted variant="area" />
</ICard>
```
</Demo>

## Height

<Demo stack>
<template #demo>
<ISparkline :data="revenue" :height="16" class="w-full max-w-md" />
<ISparkline :data="revenue" :height="32" class="w-full max-w-md" />
<ISparkline :data="revenue" :height="64" class="w-full max-w-md" />
</template>

```vue
<ISparkline :data="revenue" :height="16" />
<ISparkline :data="revenue" :height="32" />
<ISparkline :data="revenue" :height="64" />
```
</Demo>

## Accessibility

Without a `label` the sparkline is decorative and hidden from assistive technology, which is right beside a value that already states the number. Give it a `label` when the trend is the only place the information lives.

```vue
<ISparkline :data="revenue" label="Revenue over the last twelve months, rising from 18 to 48" />
```

## Animation

A sparkline can reveal itself like [`ILineChart`](/components/line-chart) does — the line and its wash uncovered together, left to right — but it is **off by default** here. A sparkline usually sits in a stat tile or a table row, and twenty of them animating at once is a distraction rather than an arrival.

<Demo stack>
<template #demo>
<ChartReplay v-slot="{ key, animate }">
<ISparkline :key="key" :data="revenue" variant="area" end-dot :height="64" :animate="animate" class="w-full" label="Revenue, last 12 months" />
</ChartReplay>
</template>

```vue
<ISparkline :data="revenue" variant="area" end-dot :animate="{ easing: 'ease-out', duration: 700 }" />

<!-- The default -->
<ISparkline :data="revenue" />
```
</Demo>

`animate` takes `true` for the default reveal, or an object to tune it: `duration` in milliseconds and `easing`, one of `ease-out` (the default), `ease-in`, `ease-in-out` or `linear`.

It plays **once** per instance, and a reader who has asked for reduced motion gets the finished sparkline with no animation at all.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `(number \| null \| undefined)[]` | `[]` | Values, oldest first. `null` is a gap |
| `variant` | `'line' \| 'area'` | `'line'` | `area` adds a wash beneath the line |
| `endDot` | `boolean` | — | Mark the most recent point |
| `baseline` | `'min' \| 'zero'` | `'min'` | Lower edge of the `area` wash |
| `min` | `number` | — | Pin the bottom of the domain |
| `max` | `number` | — | Pin the top of the domain |
| `muted` | `boolean` | — | Draw in de-emphasised ink |
| `label` | `string` | — | Accessible description; without one it is decorative |
| `height` | `number` | `32` | Rendered height in px; width fills the container |
| `animate` | `boolean` or `{ duration, easing }` | `false` | Draw the line on; off by default here |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, plot?, line?, area?, dot?, ring? }` | — | Per-element class overrides |

For an axis, a tooltip and more than one series, use [`ILineChart`](/components/line-chart).
