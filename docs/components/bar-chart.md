---
eyebrow: Charts
---

<script setup lang="ts">
const monthly = [
  { label: 'Jan', value: 18200 },
  { label: 'Feb', value: 22400 },
  { label: 'Mar', value: 19800 },
  { label: 'Apr', value: 27600 },
  { label: 'May', value: 31200 },
  { label: 'Jun', value: 29900 },
]

const channels = [
  { label: 'Direct', value: 41200 },
  { label: 'Partner referrals', value: 28800 },
  { label: 'Marketplace', value: 19400 },
  { label: 'Outbound', value: 12100 },
]

const byRegion = [
  { label: 'Q1', north: 18200, south: 12400, east: 9100 },
  { label: 'Q2', north: 22600, south: 15100, east: 11800 },
  { label: 'Q3', north: 20100, south: 17400, east: 14200 },
  { label: 'Q4', north: 26800, south: 19200, east: 16900 },
]

const regions = [
  { key: 'north', name: 'North' },
  { key: 'south', name: 'South' },
  { key: 'east', name: 'East' },
]

const netChange = [
  { label: 'Jan', value: 4200 },
  { label: 'Feb', value: -1800 },
  { label: 'Mar', value: 3100 },
  { label: 'Apr', value: -900 },
  { label: 'May', value: 5600 },
]
</script>

# IBarChart

Bars, in plain SVG with no charting dependency. It inherits the theme like everything else, so it follows light and dark for free.

<Demo stack>
<template #demo>
<IBarChart :data="monthly" :format="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }" class="w-full" label="Revenue by month" />
</template>

```vue
<script setup lang="ts">
const monthly = [
  { label: 'Jan', value: 18200 },
  { label: 'Feb', value: 22400 },
  { label: 'Mar', value: 19800 },
]
</script>

<template>
  <IBarChart
    :data="monthly"
    :format="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }"
    label="Revenue by month"
  />
</template>
```
</Demo>

The width fills the container and `height` (240px by default) is the only dimension you set. The value axis always includes zero and lands on round numbers, so `ticks` is a target count rather than an exact one.

Hovering a category raises a tooltip with the value formatted exactly as the ticks are: `locale` and `format` feed one `Intl.NumberFormat` used everywhere in the chart.

## Horizontal

Turn the chart when the category names are long or numerous — a horizontal chart gives every name a full row.

<Demo stack>
<template #demo>
<IBarChart :data="channels" orientation="horizontal" :format="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }" class="w-full" label="Revenue by channel" />
</template>

```vue
<IBarChart
  :data="channels"
  orientation="horizontal"
  :format="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }"
  label="Revenue by channel"
/>
```
</Demo>

## Several series

Pass `series` to read more than one measure out of each datum. Each series names the key it reads and, optionally, how it should be labelled.

<Demo stack>
<template #demo>
<IBarChart :data="byRegion" :series="regions" :format="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }" class="w-full" label="Revenue by quarter and region" />
</template>

```vue
<script setup lang="ts">
const byRegion = [
  { label: 'Q1', north: 18200, south: 12400, east: 9100 },
  { label: 'Q2', north: 22600, south: 15100, east: 11800 },
]

const regions = [
  { key: 'north', name: 'North' },
  { key: 'south', name: 'South' },
  { key: 'east', name: 'East' },
]
</script>

<template>
  <IBarChart
    :data="byRegion"
    :series="regions"
    :format="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }"
    label="Revenue by quarter and region"
  />
</template>
```
</Demo>

A legend appears automatically from two series up; `legend` is honoured only for a single series. When you filter series in and out, give each one a `slot` so its colour stays with the entity rather than with its position in the list.

## Stacked

<Demo stack>
<template #demo>
<IBarChart :data="byRegion" :series="regions" stacked :format="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }" class="w-full" label="Total revenue by quarter, split by region" />
</template>

```vue
<IBarChart
  :data="byRegion"
  :series="regions"
  stacked
  :format="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }"
  label="Total revenue by quarter, split by region"
/>
```
</Demo>

Stacking answers "what makes up the total"; grouping answers "how do these compare". The stacked tooltip adds a sum row, labelled by `totalLabel`.

## Negative values

<Demo stack>
<template #demo>
<IBarChart :data="netChange" :format="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }" class="w-full" label="Net change by month" />
</template>

```vue
<IBarChart
  :data="netChange"
  :format="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }"
  label="Net change by month"
/>
```
</Demo>

Bars below zero hang from the zero line rather than from the axis floor.

## Bare bars

Drop the axis and gridlines for a chart that sits inside a tile, where the shape is the whole message.

<Demo stack>
<template #demo>
<IBarChart :data="monthly" :axis="false" :height="120" class="w-full" label="Revenue by month" />
</template>

```vue
<IBarChart :data="monthly" :axis="false" :height="120" label="Revenue by month" />
```
</Demo>

## Gaps

`null` is a missing reading, not a zero — no bar is drawn at all, which is not the same as a bar of no height.

## Animation

The bars grow out of the baseline on the first paint, staggered a little across the categories so the row reads left to right. They grow from the *baseline*, not from their own box, so a negative bar drops rather than rising into the plot on its way down.

<Demo stack>
<template #demo>
<ChartReplay v-slot="{ key, animate }">
<IBarChart :key="key" :data="monthly" :animate="animate" label="Revenue by month" class="w-full" />
</ChartReplay>
</template>

```vue
<IBarChart :data="monthly" :animate="{ easing: 'ease-out', duration: 700 }" />

<!-- Off entirely -->
<IBarChart :data="monthly" :animate="false" />
```
</Demo>

`animate` takes `false` to switch the reveal off, or an object to tune it: `duration` in milliseconds and `easing`, one of `ease-out` (the default), `ease-in`, `ease-in-out` or `linear`.

It plays **once**, on the first paint with something to draw — not again when the data changes underneath it, which on a polling dashboard would read as a fault rather than as polish. A reader who has asked for reduced motion gets the finished chart with no animation at all.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `BarChartDatum[]` | `[]` | One entry per category |
| `series` | `ChartSeries[]` | — | Two or more measures per category |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Bars up, or categories down the side |
| `stacked` | `boolean` | — | One bar per category instead of a group |
| `height` | `number` | `240` | Rendered height in px; width fills the container |
| `ticks` | `number` | `5` | Target tick count; the axis lands on round numbers |
| `axis` | `boolean` | `true` | Draw the value axis and its gridlines |
| `animate` | `boolean` or `{ duration, easing }` | `true` | Reveal on the first paint; `false` turns it off |
| `legend` | `boolean` | `true` | Only honoured for a single series |
| `totalLabel` | `string` | `'Total'` | Word for the stacked tooltip's sum |
| `locale` | `string` | — | Locale for every number in the chart |
| `format` | `Intl.NumberFormatOptions` | — | Options for every number in the chart |
| `label` | `string` | — | Accessible name for the figure |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, svg?, grid?, tick?, category?, bar?, tooltip?, tooltipLabel?, tooltipValue?, table? }` | — | Per-slot class overrides |

## Slots

| Slot | Props | When to use it |
| --- | --- | --- |
| `underlay` | layout geometry | Draw behind the bars — a target band, a shaded period |
| `overlay` | layout geometry | Draw in front — an annotation, a threshold line |

## Data shapes

```ts
interface BarChartDatum {
  label: string
  value?: number | null
  [key: string]: unknown
}

interface ChartSeries {
  key: string
  name?: string
  slot?: number
}
```

The bars are hidden from assistive technology and the same data is exposed as a table, named by `label`.
