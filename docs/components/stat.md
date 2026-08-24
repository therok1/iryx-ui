---
eyebrow: Data display
---

# IStat

A single headline number with its movement, built for a row of tiles across the top of a dashboard.

<Demo stack>
<template #demo>
<div class="grid w-full gap-8 sm:grid-cols-3">
<IStat label="Revenue" value="€48,290" :delta="18.4" hint="vs. last quarter" />
<IStat label="Invoices sent" value="312" :delta="4.1" hint="vs. last quarter" />
<IStat label="Days to payment" value="21" :delta="-6.2" hint="vs. last quarter" />
</div>
</template>

```vue
<IStat label="Revenue" value="€48,290" :delta="18.4" hint="vs. last quarter" />
<IStat label="Invoices sent" value="312" :delta="4.1" hint="vs. last quarter" />
<IStat label="Days to payment" value="21" :delta="-6.2" hint="vs. last quarter" />
```
</Demo>

The delta sits on its own line, so a row of tiles keeps its lines aligned however long each value is.

## Trend

The sign of `delta` decides the direction, and zero is neutral.

<Demo stack>
<template #demo>
<div class="grid w-full gap-8 sm:grid-cols-3">
<IStat label="Up" value="1,204" :delta="12.5" />
<IStat label="Flat" value="1,204" :delta="0" />
<IStat label="Down" value="1,204" :delta="-8.1" />
</div>
</template>

```vue
<IStat label="Up" value="1,204" :delta="12.5" />
<IStat label="Flat" value="1,204" :delta="0" />
<IStat label="Down" value="1,204" :delta="-8.1" />
```
</Demo>

Override it with `trend` when a rising number is bad news — days to payment, error rate, churn.

`trend` colours the delta and nothing else. The arrow keeps following the sign of the number, because an arrow that disagrees with the figure printed beside it — "↑ -14%" — reads as a bug rather than as nuance. Down and green means the number fell and that was the good outcome.

<Demo stack>
<template #demo>
<div class="grid w-full gap-8 sm:grid-cols-2">
<IStat label="Days to payment" value="34" :delta="9.4" trend="down" hint="rising is worse" />
<IStat label="Overdue balance" value="€3,940" :delta="-22.0" trend="up" hint="falling is better" />
</div>
</template>

```vue
<IStat label="Days to payment" value="34" :delta="9.4" trend="down" hint="rising is worse" />
<IStat label="Overdue balance" value="€3,940" :delta="-22.0" trend="up" hint="falling is better" />
```
</Demo>

## Formatting the delta

`formatDelta` receives the raw number, for when a percentage is the wrong unit.

<Demo stack>
<template #demo>
<div class="grid w-full gap-8 sm:grid-cols-2">
<IStat label="New clients" value="18" :delta="5" :format-delta="d => `${d > 0 ? '+' : ''}${d} this month`" />
<IStat label="Revenue" value="€48,290" :delta="7400" :format-delta="d => `${d > 0 ? '+' : ''}€${Math.abs(d).toLocaleString()}`" />
</div>
</template>

```vue
<IStat
  label="New clients"
  value="18"
  :delta="5"
  :format-delta="d => `${d > 0 ? '+' : ''}${d} this month`"
/>
<IStat
  label="Revenue"
  value="€48,290"
  :delta="7400"
  :format-delta="d => `${d > 0 ? '+' : ''}€${Math.abs(d).toLocaleString()}`"
/>
```
</Demo>

## Sizes

<Demo stack>
<template #demo>
<div class="grid w-full gap-8 sm:grid-cols-3">
<IStat size="sm" label="Small" value="€48,290" :delta="18.4" />
<IStat size="md" label="Medium" value="€48,290" :delta="18.4" />
<IStat size="lg" label="Large" value="€48,290" :delta="18.4" />
</div>
</template>

```vue
<IStat size="sm" label="Revenue" value="€48,290" :delta="18.4" />
<IStat size="md" label="Revenue" value="€48,290" :delta="18.4" />
<IStat size="lg" label="Revenue" value="€48,290" :delta="18.4" />
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | What the number measures |
| `value` | `string \| number` | — | The headline figure |
| `delta` | `number` | — | Change since the comparison period |
| `trend` | `'up' \| 'down' \| 'neutral'` | from `delta` | Colours the delta; the arrow still follows the sign |
| `hint` | `string` | — | Names the comparison, e.g. "vs. last quarter" |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Overall scale |
| `formatDelta` | `(delta: number) => string` | percentage | Formats the delta text |
| `as` | `string` | `'div'` | Element to render |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, label?, value?, delta?, hint?, row? }` | — | Per-slot class overrides |

Colour is carried by the delta text rather than a filled surface, and the arrow beside it is decorative — the sign already says which way it went.

## Slots

| Slot | When to use it |
| --- | --- |
| `label` / `hint` | Either needs markup |
| `delta` | Full control of the change line, receiving `{ trend }` |

Pair one with [`ISparkline`](/components/sparkline) when the shape of the change matters as much as its size.
