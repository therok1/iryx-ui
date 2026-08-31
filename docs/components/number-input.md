---
eyebrow: Forms
---

<script setup lang="ts">
import { ref } from 'vue'

const quantity = ref('3')
const amount = ref('1240.00')
const rate = ref('0.215')
const bare = ref('10')
const bounded = ref('5')
const sizeSm = ref('1')
const sizeMd = ref('1')
const sizeLg = ref('1')
</script>

# INumberInput

A numeric field whose model is a string rather than a number, so a value never passes through a JavaScript float on its way to your API.

<Demo stack>
<template #demo>
<INumberInput v-model="quantity" class="w-full max-w-xs" />
</template>

```vue
<script setup lang="ts">
// A string, deliberately.
const quantity = ref('3')
</script>

<template>
  <INumberInput v-model="quantity" />
</template>
```
</Demo>

Keep the value a string end to end and do the arithmetic with the [decimal helpers](/composables/decimals), a decimal library, or on the server.

## Precision

`precision` fixes the number of decimal places, so `1240` shows and submits as `1240.00`.

<Demo stack>
<template #demo>
<INumberInput v-model="amount" :precision="2" class="w-full max-w-xs" />
<INumberInput v-model="rate" :precision="3" step="0.001" class="w-full max-w-xs" />
</template>

```vue
<INumberInput v-model="amount" :precision="2" />
<INumberInput v-model="rate" :precision="3" step="0.001" />
```
</Demo>

## Bounds and step

`min`, `max` and `step` are strings too, for the same reason the model is.

<Demo stack>
<template #demo>
<INumberInput v-model="bounded" min="1" max="10" step="1" class="w-full max-w-xs" />
</template>

```vue
<INumberInput v-model="seats" min="1" max="10" step="1" />
```
</Demo>

## Without the stepper

The stepper buttons are on by default. Drop them where the value is typed rather than nudged.

<Demo stack>
<template #demo>
<INumberInput v-model="bare" :stepper="false" class="w-full max-w-xs" />
</template>

```vue
<INumberInput v-model="amount" :stepper="false" />
```
</Demo>

## Locale

`locale` decides how the value is displayed and which decimal separator is accepted while typing. The model stays a plain machine-readable string.

```vue
<INumberInput v-model="amount" :precision="2" locale="de-DE" />
```

## Sizes

<Demo stack>
<template #demo>
<INumberInput v-model="sizeSm" size="sm" class="w-full max-w-xs" />
<INumberInput v-model="sizeMd" size="md" class="w-full max-w-xs" />
<INumberInput v-model="sizeLg" size="lg" class="w-full max-w-xs" />
</template>

```vue
<INumberInput v-model="quantity" size="sm" />
<INumberInput v-model="quantity" size="md" />
<INumberInput v-model="quantity" size="lg" />
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `min` / `max` | `string` | — | Bounds, as strings |
| `step` | `string` | `'1'` | Stepper increment |
| `precision` | `number` | — | Fixed decimal places |
| `locale` | `string` | — | Display and separator handling |
| `stepper` | `boolean` | `true` | Shows the increment/decrement buttons |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control scale |
| `placeholder` | `string` | — | Placeholder text |
| `disabled` | `boolean` | `false` | Disables the field |
| `required` | `boolean` | `false` | Marks it required |
| `invalid` | `boolean` | — | Error styling; set automatically inside `IFormField` |
| `id` | `string` | generated | Useful when an external `ILabel` targets it |
| `incrementLabel` | `string` | `'Increment'` | Accessible name for the up button |
| `decrementLabel` | `string` | `'Decrement'` | Accessible name for the down button |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, input?, stepper?, step? }` | — | Per-element class overrides |

### Sizing it

`class` lands on the root, the box the whole control occupies — size the field there, and reach the `<input>` itself with `ui.input`.

```vue
<INumberInput v-model="amount" class="max-w-xs" />
```

Attributes go to the input, so with no visible label put `aria-label` on the component.
