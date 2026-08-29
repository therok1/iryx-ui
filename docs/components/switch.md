---
eyebrow: Forms
---

<script setup lang="ts">
import { ref } from 'vue'

const notify = ref(true)
const digest = ref(false)
const sizeSm = ref(true)
const sizeMd = ref(true)
const sizeLg = ref(true)
const standalone = ref(false)
</script>

# ISwitch

A toggle for a setting that takes effect immediately. Where the change is saved with the rest of a form, use [`ICheckbox`](/components/checkbox).

<Demo stack>
<template #demo>
<ISwitch v-model="notify" label="Email me when an invoice is paid" />
</template>

```vue
<ISwitch v-model="notify" label="Email me when an invoice is paid" />
```
</Demo>

## With a description

`description` sits under the label and is wired to the switch, so it is announced as part of the control.

<Demo stack>
<template #demo>
<ISwitch
  v-model="digest"
  label="Weekly digest"
  description="A Monday summary of everything sent, paid and overdue."
/>
</template>

```vue
<ISwitch
  v-model="digest"
  label="Weekly digest"
  description="A Monday summary of everything sent, paid and overdue."
/>
```
</Demo>

## Sizes

The track, thumb and travel scale together.

<Demo stack>
<template #demo>
<ISwitch v-model="sizeSm" size="sm" label="Small" />
<ISwitch v-model="sizeMd" size="md" label="Medium" />
<ISwitch v-model="sizeLg" size="lg" label="Large" />
</template>

```vue
<ISwitch v-model="enabled" size="sm" label="Small" />
<ISwitch v-model="enabled" size="md" label="Medium" />
<ISwitch v-model="enabled" size="lg" label="Large" />
```
</Demo>

## Disabled

<Demo stack>
<template #demo>
<ISwitch :model-value="true" disabled label="Locked on by your plan" />
<ISwitch :model-value="false" disabled label="Not available on this plan" />
</template>

```vue
<ISwitch :model-value="true" disabled label="Locked on by your plan" />
<ISwitch :model-value="false" disabled label="Not available on this plan" />
```
</Demo>

## Without a label

Leave `label` off and the switch renders alone. Give it an `aria-label`, or point a separate [`ILabel`](/components/label) at it with `id`.

<Demo>
<template #demo>
<ISwitch v-model="standalone" aria-label="Enable marketing emails" />
</template>

```vue
<ISwitch v-model="enabled" aria-label="Enable marketing emails" />
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Text beside the switch, wired to it |
| `description` | `string` | — | Secondary line under the label |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control scale |
| `id` | `string` | generated | Useful when an external `ILabel` targets it |
| `invalid` | `boolean` | — | Mark as failing validation. Taken from the enclosing `IFormField` when omitted |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ wrapper?, root?, thumb?, content?, label?, description? }` | — | Per-slot class overrides |

`disabled`, `required`, `name` and `value` are forwarded to Reka UI's `SwitchRoot`, so the switch posts in a plain `<form>`.

Inside an [`IFormField`](/components/form-field) the label, description and error come from the field — set them there rather than here.
