---
eyebrow: Forms
---

<script setup lang="ts">
import { ref } from 'vue'

const terms = ref('net-30')
const plan = ref('pro')
const delivery = ref('email')
const sizeSm = ref('a')
const sizeMd = ref('a')
const sizeLg = ref('a')

const planItems = [
  { label: 'Free', value: 'free', description: 'Up to three invoices a month.' },
  { label: 'Pro', value: 'pro', description: 'Unlimited invoices and reminders.' },
  { label: 'Team', value: 'team', description: 'Everything in Pro, plus shared clients.', disabled: true },
]
</script>

# IRadioGroup

One choice from a handful of visible options. Past five or six, use an [`ISelect`](/components/select) instead.

<Demo stack>
<template #demo>
<IRadioGroup v-model="terms" :items="['Due on receipt', 'Net 14 days', 'Net 30 days']" />
</template>

```vue
<IRadioGroup v-model="terms" :items="['Due on receipt', 'Net 14 days', 'Net 30 days']" />
```
</Demo>

A string item is expanded to `{ label, value }` with both the same.

## Descriptions

An item can carry a `description`, shown under its label.

<Demo stack>
<template #demo>
<IRadioGroup v-model="plan" :items="planItems" />
</template>

```vue
<script setup lang="ts">
const planItems = [
  { label: 'Free', value: 'free', description: 'Up to three invoices a month.' },
  { label: 'Pro', value: 'pro', description: 'Unlimited invoices and reminders.' },
  { label: 'Team', value: 'team', description: 'Everything in Pro, plus shared clients.', disabled: true },
]
</script>

<template>
  <IRadioGroup v-model="plan" :items="planItems" />
</template>
```
</Demo>

## Horizontal

`orientation="horizontal"` lays the options out in a row, and arrow-key navigation follows the orientation.

<Demo stack>
<template #demo>
<IRadioGroup v-model="delivery" :items="['Email', 'Post', 'Both']" orientation="horizontal" />
</template>

```vue
<IRadioGroup v-model="delivery" :items="['Email', 'Post', 'Both']" orientation="horizontal" />
```
</Demo>

## Sizes

<Demo stack>
<template #demo>
<IRadioGroup v-model="sizeSm" :items="[{ label: 'Small', value: 'a' }, { label: 'Another', value: 'b' }]" size="sm" />
<IRadioGroup v-model="sizeMd" :items="[{ label: 'Medium', value: 'a' }, { label: 'Another', value: 'b' }]" size="md" />
<IRadioGroup v-model="sizeLg" :items="[{ label: 'Large', value: 'a' }, { label: 'Another', value: 'b' }]" size="lg" />
</template>

```vue
<IRadioGroup v-model="choice" :items="items" size="sm" />
<IRadioGroup v-model="choice" :items="items" size="md" />
<IRadioGroup v-model="choice" :items="items" size="lg" />
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `(RadioGroupItemOption \| string)[]` | `[]` | Options to render |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control scale |
| `invalid` | `boolean` | — | Mark as failing validation. Taken from the enclosing `IFormField` when omitted |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, item?, label?, description? }` | — | Per-element class overrides |

`disabled`, `required`, `name`, `orientation` and `dir` are forwarded to Reka UI's `RadioGroupRoot`, so the group posts in a plain `<form>`.

```ts
interface RadioGroupItemOption {
  label: string
  value: string
  description?: string
  disabled?: boolean
}
```

A radio group cannot be cleared once a choice is made. Include an explicit "None" or "Any" option when no answer is a valid answer.
