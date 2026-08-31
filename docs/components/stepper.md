---
eyebrow: Navigation
---

<script setup lang="ts">
import { ref } from 'vue'

const step = ref(2)
const linear = ref(1)
const vertical = ref(2)

const steps = [
  { title: 'Client', description: 'Who the invoice is for.' },
  { title: 'Line items', description: 'What you are charging for.' },
  { title: 'Review', description: 'Check it before sending.' },
]
</script>

# IStepper

Progress through a task with a known number of stages, for when seeing how much is left helps the reader.

<Demo stack>
<template #demo>
<IStepper v-model="step" :items="steps" class="w-full" />
</template>

```vue
<script setup lang="ts">
const step = ref(2)

const steps = [
  { title: 'Client', description: 'Who the invoice is for.' },
  { title: 'Line items', description: 'What you are charging for.' },
  { title: 'Review', description: 'Check it before sending.' },
]
</script>

<template>
  <IStepper v-model="step" :items="steps" />
</template>
```
</Demo>

The model is the current step number, starting at 1. A string item is expanded to `{ title }`.

## Titles only

<Demo stack>
<template #demo>
<IStepper v-model="step" :items="['Client', 'Line items', 'Review']" class="w-full" />
</template>

```vue
<IStepper v-model="step" :items="['Client', 'Line items', 'Review']" />
```
</Demo>

## Linear

By default any step can be clicked. `linear` restricts the reader to steps already reached, for when a later step depends on an earlier one.

<Demo stack>
<template #demo>
<IStepper v-model="linear" :items="steps" linear class="w-full" />
</template>

```vue
<IStepper v-model="step" :items="steps" linear />
```
</Demo>

## Vertical

<Demo stack>
<template #demo>
<IStepper v-model="vertical" :items="steps" orientation="vertical" class="w-full max-w-md" />
</template>

```vue
<IStepper v-model="step" :items="steps" orientation="vertical" />
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `(StepperItemOption \| string)[]` | `[]` | The steps |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout and arrow-key axis |
| `linear` | `boolean` | `false` | Only allow steps already reached |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, item?, trigger?, indicator?, content?, title?, description?, separator? }` | — | Per-element class overrides |

```ts
interface StepperItemOption {
  title: string
  description?: string
  disabled?: boolean
}
```

## Slots

| Slot | When to use it |
| --- | --- |
| `indicator` | Replaces the number in the circle, receiving the step |

A stepper shows where you are, not what has been filled in. Validation belongs to [`IForm`](/components/form).
