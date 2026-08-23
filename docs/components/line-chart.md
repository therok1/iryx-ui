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
  { label: 'Jul', value: 36400 },
  { label: 'Aug', value: 34100 },
]

const gappy = [
  { label: 'Jan', value: 18200 },
  { label: 'Feb', value: 22400 },
  { label: 'Mar', value: null },
  { label: 'Apr', value: 27600 },
  { label: 'May', value: 31200 },
  { label: 'Jun', value: null },
  { label: 'Jul', value: 36400 },
  { label: 'Aug', value: 34100 },
]

const byRegion = [
  { label: 'Jan', north: 8200, south: 5400, east: 3100 },
  { label: 'Feb', north: 9600, south: 6100, east: 3800 },
  { label: 'Mar', north: 9100, south: 7400, east: 4200 },
  { label: 'Apr', north: 11800, south: 8200, east: 5900 },
  { label: 'May', north: 12600, south: 9100, east: 6400 },
  { label: 'Jun', north: 14200, south: 9800, east: 7100 },
]

const regions = [
  { key: 'north', name: 'North' },
  { key: 'south', name: 'South' },
  { key: 'east', name: 'East' },
]

const flat = [
  { label: 'Mon', value: 8120 },
  { label: 'Tue', value: 8240 },
  { label: 'Wed', value: 8190 },
  { label: 'Thu', value: 8310 },
  { label: 'Fri', value: 8260 },
]

const currency = { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 } as const
</script>

# ILineChart

A line over ordered categories, in plain SVG with no charting dependency. Hovering anywhere in the plot drops a crosshair on the nearest category and marks the point.

<Demo stack>
<template #demo>
<ILineChart :data="monthly" :format="currency" class="w-full" label="Revenue by month" />
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
  <ILineChart
    :data="monthly"
    :format="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }"
    label="Revenue by month"
  />
</template>
```
</Demo>

The width fills the container and `height` (240px by default) is the only dimension you set. `locale` and `format` feed one `Intl.NumberFormat`, used for the ticks and the tooltip alike.

The examples below pass `currency` as `format`:

```ts
const currency = { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }
```

## Area

`area` adds a wash beneath the line. It is ignored for multiple series.

<Demo stack>
<template #demo>
<ILineChart :data="monthly" variant="area" :format="currency" class="w-full" label="Revenue by month" />
</template>

```vue
<ILineChart :data="monthly" variant="area" :format="currency" label="Revenue by month" />
```
</Demo>

## Several series

<Demo stack>
<template #demo>
<ILineChart :data="byRegion" :series="regions" :format="currency" class="w-full" label="Revenue by month and region" />
</template>

```vue
<script setup lang="ts">
const byRegion = [
  { label: 'Jan', north: 8200, south: 5400, east: 3100 },
  { label: 'Feb', north: 9600, south: 6100, east: 3800 },
]

const regions = [
  { key: 'north', name: 'North' },
  { key: 'south', name: 'South' },
  { key: 'east', name: 'East' },
]
</script>

<template>
  <ILineChart
    :data="byRegion"
    :series="regions"
    :format="currency"
    label="Revenue by month and region"
  />
</template>
```
</Demo>

A legend appears automatically from two series up; `legend` is honoured only for a single series. When series come and go, give each one a `slot` so its colour stays with the entity.

## Where the axis starts

Zero is off by default, unlike [`IBarChart`](/components/bar-chart): the axis is fitted to the data so the shape of the line stays readable.

<Demo stack>
<template #demo>
<ILineChart :data="flat" :format="currency" class="w-full" label="Daily balance, axis fitted to the data" />
<ILineChart :data="flat" zero :format="currency" class="w-full" label="Daily balance, axis from zero" />
</template>

```vue
<ILineChart :data="balance" :format="currency" label="Daily balance, axis fitted to the data" />
<ILineChart :data="balance" zero :format="currency" label="Daily balance, axis from zero" />
```
</Demo>

Turn `zero` on when the question is about magnitude rather than movement: the first chart above draws a 2% wobble across the full height of the plot.

## Gaps

`null` is a missing reading, and the line breaks rather than bridging it.

<Demo stack>
<template #demo>
<ILineChart :data="gappy" :format="currency" class="w-full" label="Revenue by month, with two months missing" />
</template>

```vue
<ILineChart
  :data="[{ label: 'Mar', value: null }, …]"
  :format="currency"
  label="Revenue by month, with two months missing"
/>
```
</Demo>

## Bare

<Demo stack>
<template #demo>
<ILineChart :data="monthly" :axis="false" :height="120" variant="area" class="w-full" label="Revenue by month" />
</template>

```vue
<ILineChart
  :data="monthly"
  :axis="false"
  :height="120"
  variant="area"
  label="Revenue by month"
/>
```
</Demo>

For something smaller still — a trend inside a table cell or a stat tile, with no axis, tooltip or crosshair at all — use [`ISparkline`](/components/sparkline).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `LineChartDatum[]` | `[]` | One entry per category, in order |
| `series` | `ChartSeries[]` | — | Two or more measures per category |
| `variant` | `'line' \| 'area'` | `'line'` | `area` adds a wash; ignored for multiple series |
| `height` | `number` | `240` | Rendered height in px; width fills the container |
| `ticks` | `number` | `5` | Target tick count; the axis lands on round numbers |
| `axis` | `boolean` | `true` | Draw the value axis and its gridlines |
| `legend` | `boolean` | `true` | Only honoured for a single series |
| `zero` | `boolean` | `false` | Force zero onto the axis |
| `locale` | `string` | — | Locale for every number in the chart |
| `format` | `Intl.NumberFormatOptions` | — | Options for every number in the chart |
| `label` | `string` | — | Accessible name for the figure |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, svg?, grid?, tick?, category?, line?, area?, crosshair?, marker?, markerRing?, tooltip?, tooltipLabel?, tooltipValue?, table? }` | — | Per-slot class overrides |

## Slots

| Slot | Props | When to use it |
| --- | --- | --- |
| `underlay` | layout geometry | Draw behind the line — a target band, a shaded period |
| `overlay` | layout geometry | Draw in front — an annotation, a threshold line |

## Data shapes

```ts
interface LineChartDatum {
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

The line is hidden from assistive technology and the data is exposed as a table instead, so a screen reader gets the numbers rather than a shape. `label` names that table.
