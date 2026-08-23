---
eyebrow: Charts
---

<script setup lang="ts">
import { ref } from 'vue'

const regions = [
  { key: 'north', name: 'North' },
  { key: 'south', name: 'South' },
  { key: 'east', name: 'East' },
]

const pinned = [
  { key: 'south', name: 'South', slot: 1 },
  { key: 'east', name: 'East', slot: 2 },
]

const bare = [{ key: 'north' }, { key: 'south' }, { key: 'east' }]

const active = ref(1)

const byRegion = [
  { label: 'Q1', north: 18200, south: 12400, east: 9100 },
  { label: 'Q2', north: 22600, south: 15100, east: 11800 },
  { label: 'Q3', north: 20100, south: 17400, east: 14200 },
]
</script>

# IChartLegend

The legend [`IBarChart`](/components/bar-chart) and [`ILineChart`](/components/line-chart) draw for themselves, available on its own to place beside a title, in a card header, or above two charts that share a scale.

<Demo stack>
<template #demo>
<IChartLegend :series="regions" />
</template>

```vue
<script setup lang="ts">
const regions = [
  { key: 'north', name: 'North' },
  { key: 'south', name: 'South' },
  { key: 'east', name: 'East' },
]
</script>

<template>
  <IChartLegend :series="regions" />
</template>
```
</Demo>

A series without a `name` is labelled by its `key`, so the shape you already pass to a chart works here unchanged.

<Demo stack>
<template #demo>
<IChartLegend :series="bare" />
</template>

```vue
<IChartLegend :series="[{ key: 'north' }, { key: 'south' }, { key: 'east' }]" />
```
</Demo>

## Colour follows the entity

A series takes its colour from its position in the array unless you pin it with `slot`. Pin every series that can be filtered in and out, so its colour survives the ones around it disappearing.

<Demo stack>
<template #demo>
<div class="space-y-3">
<IChartLegend :series="regions" />
<IChartLegend :series="pinned" />
</div>
</template>

```vue
<IChartLegend :series="regions" />

<!-- North filtered out, the survivors keep their colours -->
<IChartLegend
  :series="[
    { key: 'south', name: 'South', slot: 1 },
    { key: 'east', name: 'East', slot: 2 },
  ]"
/>
```
</Demo>

The palette defines eight categorical slots, and repeats beyond that.

## Highlighting one

`active` is the index of the highlighted entry, and dims the rest. Drive it from your own hover handling.

<Demo stack>
<template #demo>
<div class="space-y-3">
<IChartLegend :series="regions" :active="active" />
<div class="flex gap-2">
<IButton v-for="(region, index) in regions" :key="region.key" size="sm" variant="outline" @click="active = index">{{ region.name }}</IButton>
</div>
</div>
</template>

```vue
<IChartLegend :series="regions" :active="active" />

<IButton
  v-for="(region, index) in regions"
  :key="region.key"
  size="sm"
  variant="outline"
  @click="active = index"
>
  {{ region.name }}
</IButton>
```
</Demo>

## Beside a chart

A chart with two or more series draws its own legend, so pass `:legend="false"` before placing one yourself — otherwise the page shows two.

<Demo stack>
<template #demo>
<ICard class="w-full">
<div class="mb-3 flex items-center justify-between">
<p class="text-sm font-medium">Revenue by quarter</p>
<IChartLegend :series="regions" />
</div>
<IBarChart :data="byRegion" :series="regions" :legend="false" :height="200" :format="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }" label="Revenue by quarter and region" />
</ICard>
</template>

```vue
<ICard>
  <div class="mb-3 flex items-center justify-between">
    <p>Revenue by quarter</p>
    <IChartLegend :series="regions" />
  </div>

  <IBarChart
    :data="byRegion"
    :series="regions"
    :legend="false"
    :height="200"
    :format="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }"
    label="Revenue by quarter and region"
  />
</ICard>
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `series` | `ChartSeries[]` | — | Entries to label. **Required** |
| `active` | `number` | — | Index to highlight; the rest are dimmed |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, item?, swatch?, name? }` | — | Per-slot class overrides |

```ts
interface ChartSeries {
  key: string
  name?: string
  slot?: number
}
```
