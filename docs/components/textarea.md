---
eyebrow: Forms
---

<script setup lang="ts">
import { ref } from 'vue'

const notes = ref('')
const grows = ref('This field grows as you type. Add a few more lines and watch the box follow — there is no scrollbar until it hits the cap.')
const bounded = ref('')
const sizeSm = ref('')
const sizeMd = ref('')
const sizeLg = ref('')
const invalid = ref('')
</script>

# ITextarea

A multi-line field, with the same sizes and states as [`IInput`](/components/input).

<Demo stack>
<template #demo>
<ITextarea v-model="notes" placeholder="Notes for this invoice" class="w-full max-w-md" />
</template>

```vue
<ITextarea v-model="notes" placeholder="Notes for this invoice" />
```
</Demo>

The model is a string, and `rows` sets the starting height when you are not using `autosize`.

## Autosize

`autosize` grows the field with its content instead of scrolling it.

<Demo stack>
<template #demo>
<ITextarea v-model="grows" autosize class="w-full max-w-md" />
</template>

```vue
<ITextarea v-model="notes" autosize />
```
</Demo>

Pass an object to bound the growth. `min` and `max` are counted in rows.

<Demo stack>
<template #demo>
<ITextarea v-model="bounded" :autosize="{ min: 2, max: 6 }" placeholder="Between two and six rows" class="w-full max-w-md" />
</template>

```vue
<ITextarea v-model="notes" :autosize="{ min: 2, max: 6 }" placeholder="Between two and six rows" />
```
</Demo>

## Sizes

<Demo stack>
<template #demo>
<ITextarea v-model="sizeSm" size="sm" placeholder="Small" class="w-full max-w-md" />
<ITextarea v-model="sizeMd" size="md" placeholder="Medium" class="w-full max-w-md" />
<ITextarea v-model="sizeLg" size="lg" placeholder="Large" class="w-full max-w-md" />
</template>

```vue
<ITextarea v-model="notes" size="sm" placeholder="Small" />
<ITextarea v-model="notes" size="md" placeholder="Medium" />
<ITextarea v-model="notes" size="lg" placeholder="Large" />
```
</Demo>

## States

<Demo stack>
<template #demo>
<ITextarea v-model="invalid" invalid placeholder="Something is wrong here" class="w-full max-w-md" />
<ITextarea model-value="You cannot edit this." disabled class="w-full max-w-md" />
</template>

```vue
<ITextarea v-model="notes" invalid placeholder="Something is wrong here" />
<ITextarea model-value="You cannot edit this." disabled />
```
</Demo>

Inside an [`IFormField`](/components/form-field), `invalid` is set for you from the validation state.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control scale |
| `rows` | `number` | — | Starting height, when not autosizing |
| `autosize` | `boolean \| { min?, max? }` | `false` | Grow with the content, optionally bounded in rows |
| `placeholder` | `string` | — | Placeholder text |
| `disabled` | `boolean` | `false` | Disables the field |
| `required` | `boolean` | `false` | Marks it required |
| `invalid` | `boolean` | — | Error styling; set automatically inside `IFormField` |
| `id` | `string` | generated | Useful when an external `ILabel` targets it |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |

For a single line use [`IInput`](/components/input); for a number, [`INumberInput`](/components/number-input).
