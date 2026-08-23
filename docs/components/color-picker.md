---
eyebrow: Forms
---

<script setup lang="ts">
import { ref } from 'vue'

const brand = ref('#16a372')
const overlay = ref('#3b82f6cc')
const preset = ref('#ff5733')

const swatches = ['#16a372', '#3b82f6', '#8b5cf6', '#ff5733', '#f59e0b', '#64748b']
</script>

# IColorPicker

A saturation/brightness plane, a hue ramp, an optional opacity ramp, a hex field and optional presets.

<Demo>
<template #demo>
<IColorPicker v-model="brand" />
</template>

```vue
<script setup lang="ts">
const brand = ref('#16a372')
</script>

<template>
  <IColorPicker v-model="brand" />
</template>
```
</Demo>

## The model is a hex string

`#16a372`, or eight digits with `alpha` — the form that goes straight into a stylesheet, a database column or a design token.

```ts
const brand = ref('#16a372') //     six digits
const overlay = ref('#3b82f6cc') // eight, with alpha
```

## Opacity

`alpha` adds an opacity ramp and two more hex digits. The ramp sits on a chequerboard so the transparent end is readable.

<Demo>
<template #demo>
<IColorPicker v-model="overlay" alpha />
</template>

```vue
<IColorPicker v-model="overlay" alpha />
```
</Demo>

## Presets

`swatches` offers a set of ready colours under the picker. Pair it with `hide-field` when the spectrum is not the point and you only want the presets.

<Demo>
<template #demo>
<IColorPicker v-model="preset" :swatches="swatches" />
</template>

```vue
<IColorPicker
  v-model="colour"
  :swatches="['#16a372', '#3b82f6', '#8b5cf6', '#ff5733', '#f59e0b', '#64748b']"
/>
```
</Demo>

For a handful of *named* options — "Red", "Green", "Blue" — use [`IRadioGroup`](/components/radio-group) instead.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `'#000000'` | Hex string; eight digits with `alpha` |
| `alpha` | `boolean` | `false` | Add an opacity ramp |
| `hideField` | `boolean` | `false` | Hide the hex field |
| `fieldLabel` | `string` | `'Hex colour'` | Names the hex input, which sits among unnamed visual controls |
| `swatches` | `string[]` | — | Preset colours |
| `disabled` | `boolean` | `false` | |
| `unstyled` | `boolean` | — | Skip built-in classes |
| `ui` | `{ root?, area?, thumb?, slider?, checkerboard?, track?, field?, input?, preview?, swatches?, swatch? }` | — | Per-slot class overrides |

## Events

| Event | Payload |
| --- | --- |
| `update:modelValue` | `string` |

## Styling

The saturation plane and each channel ramp are painted as inline backgrounds. Style their geometry, radius and rings through `ui`, but leave `area`, `track` and `swatch` without a background of your own — it covers the colour being picked.

## Accessibility

The plane is a two-dimensional slider: arrow keys move it in both axes, and it announces each channel by name and value. Each ramp is a slider with its own label, so hue and opacity can be set from the keyboard.
