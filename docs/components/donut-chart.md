---
eyebrow: Charts
---

<script setup lang="ts">
const sources = [
  { label: 'Direct', value: 4820 },
  { label: 'Referral', value: 2140 },
  { label: 'Organic', value: 3600 },
  { label: 'Social', value: 1180 },
]

const pinned = [
  { label: 'Referral', value: 2140, slot: 1 },
  { label: 'Organic', value: 3600, slot: 2 },
]

const plans = [
  { label: 'Starter', value: 1240 },
  { label: 'Team', value: 860 },
  { label: 'Enterprise', value: 210 },
]

const storage = [
  { label: 'Used', value: 68 },
  { label: 'Free', value: 32 },
]
</script>

# IDonutChart

A ring of slices, for the one question a bar chart answers badly: what a total is made of. Each slice is read by the length of its arc, so the parts stay comparable without a shared baseline.

<Demo stack>
<template #demo>
<IDonutChart :data="sources" label="Traffic by source" />
</template>

```vue
<script setup lang="ts">
const sources = [
  { label: 'Direct', value: 4820 },
  { label: 'Referral', value: 2140 },
  { label: 'Organic', value: 3600 },
  { label: 'Social', value: 1180 },
]
</script>

<template>
  <IDonutChart :data="sources" label="Traffic by source" />
</template>
```
</Demo>

A row with a `null` value is a missing reading and is left out of the ring — which is not the same as a zero. A negative value is dropped too, with a warning in development: a share of a whole has no way to be less than nothing, and [`IBarChart`](/components/bar-chart) is the chart with a baseline to hang one off.

## Use it for parts of one whole

A donut says "these add up to that". If the numbers are not parts of a total — three regions in different currencies, this year against last — the ring is claiming a relationship that is not there, and a bar chart is the honest shape.

Past about six slices the small arcs stop being separable and the legend turns into a reading exercise. Fold the tail into an "Other" row before that happens.

## The hole

The `center` slot is given the `total` and its `formatted` form, so the figure the slices add up to sits where the reader is already looking.

<Demo stack>
<template #demo>
<IDonutChart :data="sources" label="Traffic by source">
  <template #center="{ formatted }">
    <span class="text-2xl font-semibold tabular-nums">{{ formatted }}</span>
    <span class="text-xs text-muted-foreground">visits</span>
  </template>
</IDonutChart>
</template>

```vue
<IDonutChart :data="sources" label="Traffic by source">
  <template #center="{ formatted }">
    <span class="text-2xl font-semibold tabular-nums">{{ formatted }}</span>
    <span class="text-xs text-muted-foreground">visits</span>
  </template>
</IDonutChart>
```
</Demo>

The slot is sized to the hole, so long content wraps inside the ring rather than running out over the slices, and it never takes pointer events — the slice underneath still hovers at the edges.

## Thickness

`thickness` is the width of the ring in pixels, defaulting to two fifths of the radius. A thinner ring reads as a gauge; a thicker one reads as a total that has been divided up.

<Demo stack>
<template #demo>
<div class="grid w-full grid-cols-3 gap-8">
<IDonutChart :data="storage" :size="160" :thickness="10" :legend="false" label="Storage, thin" />
<IDonutChart :data="storage" :size="160" :legend="false" label="Storage, default" />
<IDonutChart :data="storage" :size="160" :thickness="60" :legend="false" label="Storage, thick" />
</div>
</template>

```vue
<div class="grid w-full grid-cols-3 gap-8">
  <IDonutChart :data="storage" :size="160" :thickness="10" />
  <IDonutChart :data="storage" :size="160" />
  <IDonutChart :data="storage" :size="160" :thickness="60" />
</div>
```
</Demo>

`size` is the rendered height in pixels and, once the container is wide enough, the ring's diameter — the circle is centred in whatever width it is given. The root fills the width it is in, so a row of charts wants a grid or an explicit width on each; dropped straight into a flex row they each claim the full line.

## Pie

`pie` fills the middle in. The ring is the better default: a pie asks the reader to compare angles and areas rather than arc lengths, and it gives up the hole, which is the most valuable space on the chart.

<Demo stack>
<template #demo>
<IDonutChart :data="plans" pie label="Accounts by plan" />
</template>

```vue
<IDonutChart :data="plans" pie label="Accounts by plan" />
```
</Demo>

## The gap between slices

`gap` is the space between neighbours, in pixels — `0` closes it and lets them touch.

<Demo stack>
<template #demo>
<div class="grid w-full grid-cols-3 gap-8">
<IDonutChart :data="plans" :size="160" :gap="0" :legend="false" label="Plans, no gap" />
<IDonutChart :data="plans" :size="160" :legend="false" label="Plans, default gap" />
<IDonutChart :data="plans" :size="160" :gap="8" :legend="false" label="Plans, wide gap" />
</div>
</template>

```vue
<div class="grid w-full grid-cols-3 gap-8">
  <IDonutChart :data="plans" :size="160" :gap="0" />
  <IDonutChart :data="plans" :size="160" />
  <IDonutChart :data="plans" :size="160" :gap="8" />
</div>
```
</Demo>

It is a width, not an angle, and it stays that width the whole way across. Each edge is pushed half a gap off its own radius rather than turned by a fixed angle, which is the difference between a divider that reads as a line and one that reads as a wedge widening towards the rim.

A pie is drawn the same way, which is why its slices stop a hair short of the middle: two parallel edges meet before they reach the centre, and that meeting point is the tip. Wide gaps make that blunt tip visible — another reason the ring is the better default.

## Colour follows the entity

A slice takes its colour from its position in the array unless you pin it with `slot`. Pin every slice that can be filtered in and out, so its colour survives the ones around it disappearing.

<Demo stack>
<template #demo>
<div class="grid w-full grid-cols-2 gap-8">
<IDonutChart :data="sources" :size="160" label="All sources" />
<IDonutChart :data="pinned" :size="160" label="Two sources, colours pinned" />
</div>
</template>

```vue
<IDonutChart :data="sources" />

<IDonutChart
  :data="[
    { label: 'Referral', value: 2140, slot: 1 },
    { label: 'Organic', value: 3600, slot: 2 },
  ]"
/>
```
</Demo>

The palette defines eight categorical slots. Past the eighth the last one repeats and a warning is emitted — two identities sharing a colour is worse than being told about it.

## Formatting

`locale` and `format` go to `Intl.NumberFormat` and cover every value the chart shows. The share is always a percent, whatever `format` says: it is a proportion, and currency options applied to `0.42` would render it as money.

<Demo stack>
<template #demo>
<IDonutChart
  :data="plans"
  locale="de-DE"
  :format="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }"
  label="Revenue by plan"
>
  <template #center="{ formatted }">
    <span class="text-xl font-semibold tabular-nums">{{ formatted }}</span>
  </template>
</IDonutChart>
</template>

```vue
<IDonutChart
  :data="plans"
  locale="de-DE"
  :format="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }"
/>
```
</Demo>

## Accessibility

The slices are `aria-hidden`, and the data is exposed instead as a table with a column for the value and a column for the share. `label` names it — pass one, or the figure reaches assistive tech unnamed.

## Animation

Every slice is on screen from the first frame, all of them stacked at twelve o'clock, and they unfurl together into place. Not a hand sweeping round the clock, which would reveal them in turn.

<Demo stack>
<template #demo>
<ChartReplay v-slot="{ key, animate }">
<IDonutChart :key="key" :data="sources" :animate="animate" label="Traffic by source" class="w-full">
  <template #center="{ formatted }">
    <span class="text-2xl font-semibold tabular-nums">{{ formatted }}</span>
  </template>
</IDonutChart>
</ChartReplay>
</template>

```vue
<IDonutChart :data="sources" :animate="{ easing: 'ease-out', duration: 700 }" />

<!-- Off entirely -->
<IDonutChart :data="sources" :animate="false" />
```
</Demo>

`animate` takes `false` to switch the reveal off, or an object to tune it: `duration` in milliseconds and `easing`, one of `ease-out` (the default), `ease-in`, `ease-in-out` or `linear`.

This is the one chart whose reveal is not a CSS transition. A path's `d` is not an animatable property, so the geometry is recomputed each frame against an eased progress value — which is why the easing is a named curve rather than any CSS timing function: the same control points have to be solvable in JavaScript.

It plays **once**, on the first paint with something to draw — not again when the data changes underneath it. A reader who has asked for reduced motion gets the finished chart with no animation at all.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `DonutChartDatum[]` | `[]` | Rows of `{ label, value, slot? }` |
| `size` | `number` | `240` | Rendered height in px, and the diameter once the box is wide enough |
| `thickness` | `number` | — | Ring width in px; defaults to two fifths of the radius |
| `pie` | `boolean` | `false` | Fill the middle in |
| `gap` | `number` | `2` | Space between neighbouring slices in px; `0` closes it |
| `animate` | `boolean` or `{ duration, easing }` | `true` | Reveal on the first paint; `false` turns it off |
| `legend` | `boolean` | `true` | Show the legend |
| `locale` | `string` | — | Passed to `Intl.NumberFormat` |
| `format` | `Intl.NumberFormatOptions` | — | Passed to `Intl.NumberFormat` |
| `label` | `string` | — | Accessible name for the figure and its data table |
| `unstyled` | `boolean` | — | Skip built-in classes |
| `class` | `string` | — | Classes for the root |
| `ui` | `object` | — | Per-slot classes |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `center` | `{ total, formatted }` | Content for the hole; ignored when `pie` |

## `ui` slots

| Slot | Description |
| --- | --- |
| `root` | Outermost element |
| `svg` | The drawing surface |
| `slice` | Every sector, and the circle a lone slice becomes |
| `center` | The hole's content box |
| `tooltip` | Hover tooltip |
| `tooltipLabel` | The slice's name inside the tooltip |
| `tooltipValue` | The value inside the tooltip |
| `tooltipShare` | The percentage inside the tooltip |
| `table` | The visually hidden data table |
