---
eyebrow: Forms
---

<script setup lang="ts">
import { ref } from 'vue'

const terms = ref(false)
const backup = ref(true)
const partial = ref('indeterminate')
const sizeSm = ref(true)
const sizeMd = ref(true)
const sizeLg = ref(true)
const slotted = ref(false)
</script>

# ICheckbox

A checkbox for a choice that is submitted rather than applied on the spot. The model is tri-state: `true`, `false`, or `'indeterminate'` for a parent whose children disagree. For a setting that takes effect immediately, use [`ISwitch`](/components/switch).

<Demo stack>
<template #demo>
<ICheckbox v-model="terms" label="I agree to the terms" />
</template>

```vue
<ICheckbox v-model="agreed" label="I agree to the terms" />
```
</Demo>

## With a description

<Demo stack>
<template #demo>
<ICheckbox
  v-model="backup"
  label="Keep a copy"
  description="Store a PDF of every invoice you send, for seven years."
/>
</template>

```vue
<ICheckbox
  v-model="backup"
  label="Keep a copy"
  description="Store a PDF of every invoice you send, for seven years."
/>
```
</Demo>

## Indeterminate

Set the model to the string `'indeterminate'` for the mixed state. A "select all" checkbox is then one binding derived from its children, which is what [`ITable`](/components/table)'s header checkbox does.

<Demo stack>
<template #demo>
<ICheckbox v-model="partial" label="Select all invoices" />
<p class="text-sm text-muted-foreground">Model: <code>{{ String(partial) }}</code></p>
</template>

```vue
<script setup lang="ts">
const all = computed({
  get: () => {
    if (selected.value.length === 0)
      return false
    if (selected.value.length === rows.length)
      return true
    return 'indeterminate'
  },
  set: value => selected.value = value ? rows.map(r => r.id) : [],
})
</script>

<template>
  <ICheckbox v-model="all" label="Select all invoices" />
</template>
```
</Demo>

## Sizes

<Demo stack>
<template #demo>
<ICheckbox v-model="sizeSm" size="sm" label="Small" />
<ICheckbox v-model="sizeMd" size="md" label="Medium" />
<ICheckbox v-model="sizeLg" size="lg" label="Large" />
</template>

```vue
<ICheckbox v-model="checked" size="sm" label="Small" />
<ICheckbox v-model="checked" size="md" label="Medium" />
<ICheckbox v-model="checked" size="lg" label="Large" />
```
</Demo>

## Disabled

<Demo stack>
<template #demo>
<ICheckbox :model-value="true" disabled label="Required by your plan" />
<ICheckbox :model-value="false" disabled label="Not available yet" />
</template>

```vue
<ICheckbox :model-value="true" disabled label="Required by your plan" />
<ICheckbox :model-value="false" disabled label="Not available yet" />
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Text beside the box, wired to it |
| `description` | `string` | — | Secondary line under the label |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control scale |
| `id` | `string` | generated | Useful when an external `ILabel` targets it |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ wrapper?, root?, indicator?, content?, label?, description? }` | — | Per-slot class overrides |

The model is `boolean | 'indeterminate'`. `disabled`, `required`, `name` and `value` are forwarded to the underlying control, so the checkbox posts in a plain `<form>`.

## Slots

| Slot | When to use it |
| --- | --- |
| `label` | The label needs markup, such as a link inside it |
| `description` | Same, for the description |

<Demo stack>
<template #demo>
<ICheckbox v-model="slotted">
<template #label>I agree to the <a href="#" class="underline">terms of service</a></template>
</ICheckbox>
</template>

```vue
<ICheckbox v-model="agreed">
  <template #label>
    I agree to the <a href="/terms">terms of service</a>
  </template>
</ICheckbox>
```
</Demo>
