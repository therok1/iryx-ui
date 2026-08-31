---
eyebrow: Forms
---

<script setup lang="ts">
import { ref } from 'vue'

const volume = ref(60)
const opacity = ref(40)
const price = ref([200, 750])
const quality = ref(2)
const sizeSm = ref(30)
const sizeMd = ref(50)
const sizeLg = ref(70)
const vertical = ref(65)
const committed = ref(50)
const lastSaved = ref(50)
const disabled = ref(40)

const money = (v: number) => `$${v}`
</script>

# ISlider

A control for a value where the approximate size matters more than the exact number — volume, opacity, a price ceiling. Where a precise figure is typed, use [`INumberInput`](/components/number-input).

<Demo stack>
<template #demo>
<ISlider v-model="volume" label="Volume" show-value />
</template>

```vue
<script setup lang="ts">
const volume = ref(60)
</script>

<template>
  <ISlider v-model="volume" label="Volume" show-value />
</template>
```
</Demo>

## The model keeps its shape

Pass a number and you get a number back; pass an array and you get an array.

```ts
const volume = ref(60) //        → 60
const price = ref([200, 750]) // → [200, 750]
```

## Range

Two thumbs on one track. `minStepsBetweenThumbs` keeps them from crossing or stacking.

<Demo stack>
<template #demo>
<ISlider
  v-model="price"
  label="Price"
  :min="0"
  :max="1000"
  :step="10"
  :min-steps-between-thumbs="1"
  :format-value="money"
  show-value
  show-scale
/>
</template>

```vue
<ISlider
  v-model="price"
  label="Price"
  :min="0"
  :max="1000"
  :step="10"
  :min-steps-between-thumbs="1"
  :format-value="v => `$${v}`"
  show-value
  show-scale
/>
```
</Demo>

## Formatting

`formatValue` drives the displayed value, the scale captions and each thumb's accessible label at once.

<Demo stack>
<template #demo>
<ISlider v-model="opacity" label="Opacity" :format-value="v => `${v}%`" show-value show-scale />
</template>

```vue
<ISlider v-model="opacity" label="Opacity" :format-value="v => `${v}%`" show-value show-scale />
```
</Demo>

## Steps

A coarse `step` turns the track into a small set of choices. Use `formatValue` to name them rather than showing the raw index.

<Demo stack>
<template #demo>
<ISlider
  v-model="quality"
  label="Export quality"
  :min="0"
  :max="3"
  :format-value="v => ['Draft', 'Standard', 'High', 'Maximum'][v]"
  show-value
/>
</template>

```vue
<ISlider
  v-model="quality"
  label="Export quality"
  :min="0"
  :max="3"
  :format-value="v => ['Draft', 'Standard', 'High', 'Maximum'][v]"
  show-value
/>
```
</Demo>

## Sizes

The track and thumb scale together, with the thumb staying larger than the track at every size.

<Demo stack>
<template #demo>
<ISlider v-model="sizeSm" size="sm" label="Small" />
<ISlider v-model="sizeMd" size="md" label="Medium" />
<ISlider v-model="sizeLg" size="lg" label="Large" />
</template>

```vue
<ISlider v-model="value" size="sm" label="Small" />
<ISlider v-model="value" size="md" label="Medium" />
<ISlider v-model="value" size="lg" label="Large" />
```
</Demo>

## Vertical

`orientation="vertical"` stands the track up. `showScale` is horizontal only.

<Demo>
<template #demo>
<ISlider v-model="vertical" orientation="vertical" label="Level" show-value />
</template>

```vue
<ISlider v-model="vertical" orientation="vertical" label="Level" show-value />
```
</Demo>

## Saving on release

`update:modelValue` fires on every step; `valueCommit` fires once, when the drag or key repeat ends. Send the committed value to the server.

<Demo stack>
<template #demo>
<ISlider v-model="committed" label="Threshold" show-value @value-commit="v => (lastSaved = v)" />
<p class="text-sm text-muted-foreground">Last saved: {{ lastSaved }}</p>
</template>

```vue
<ISlider v-model="threshold" label="Threshold" show-value @value-commit="save" />
```
</Demo>

## Disabled

<Demo stack>
<template #demo>
<ISlider v-model="disabled" label="Volume" show-value disabled />
</template>

```vue
<ISlider v-model="volume" label="Volume" show-value disabled />
```
</Demo>

## Accessibility

The name lands on the thumb, which is the element carrying `role="slider"`. With a `label`, a single thumb takes the label and a range names each end after it — "Price minimum", "Price maximum". Rename those ends with `rangeLabels`:

```vue
<ISlider v-model="price" label="Preis" :range-labels="['von', 'bis']" />
```

Without a label, each thumb falls back to its own formatted value. Arrow keys step by `step`, `Home` and `End` jump to `min` and `max`, and `PageUp`/`PageDown` move in larger jumps.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number \| number[] \| null` | `min` | One thumb for a number, one per entry for an array |
| `min` | `number` | `0` | |
| `max` | `number` | `100` | |
| `step` | `number` | `1` | |
| `minStepsBetweenThumbs` | `number` | — | Keeps range thumbs from crossing |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | |
| `inverted` | `boolean` | `false` | Fills from the far end |
| `disabled` | `boolean` | `false` | |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `label` | `string` | — | Shown above the track and used as the accessible name |
| `showValue` | `boolean` | `false` | Show the current value beside the label |
| `showScale` | `boolean` | `false` | `min`/`max` captions under the track; horizontal only |
| `formatValue` | `(value: number) => string` | `String` | Drives the value, the scale and the thumb labels |
| `rangeLabels` | `[string, string]` | `['minimum', 'maximum']` | How each end of a range is named |
| `unstyled` | `boolean` | — | Skip built-in classes |
| `ui` | `Record<string, string>` | — | Per-element class overrides |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `number \| number[]` | Every step, as the value changes |
| `valueCommit` | `number \| number[]` | Once, when the interaction ends |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `label` | — | Replaces the label text |
| `value` | `{ values, text }` | Replaces the value readout |

## Styling

Slots: `root`, `header`, `label`, `value`, `slider`, `track`, `range`, `thumb`, `scale`.

<Demo stack>
<template #demo>
<ISlider :model-value="70" label="Custom" :ui="{ range: 'bg-success', thumb: 'border-success size-5' }" />
</template>

```vue
<ISlider
  v-model="value"
  label="Custom"
  :ui="{ range: 'bg-success', thumb: 'border-success size-5' }"
/>
```
</Demo>
