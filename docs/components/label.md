---
eyebrow: Forms
---

<script setup lang="ts">
import { ref } from 'vue'

const reference = ref('')
const email = ref('')
</script>

# ILabel

The text naming a field. It renders a real `<label>`, so clicking it focuses the control.

<Demo stack>
<template #demo>
<div class="flex w-full max-w-md flex-col gap-1.5">
<ILabel for="demo-reference">Invoice reference</ILabel>
<IInput id="demo-reference" v-model="reference" placeholder="INV-1042" />
</div>
</template>

```vue
<ILabel for="reference">Invoice reference</ILabel>
<IInput id="reference" v-model="reference" placeholder="INV-1042" />
```
</Demo>

`for` must match the control's `id`. Every field component accepts an `id` prop for exactly this.

## Required

`required` appends an asterisk. It is decorative, so mark the control itself `required` as well.

<Demo stack>
<template #demo>
<div class="flex w-full max-w-md flex-col gap-1.5">
<ILabel for="demo-email" required>Email</ILabel>
<IInput id="demo-email" v-model="email" type="email" required placeholder="billing@example.com" />
</div>
</template>

```vue
<ILabel for="email" required>Email</ILabel>
<IInput id="email" v-model="email" type="email" required placeholder="billing@example.com" />
```
</Demo>

## When to reach for it

Use `ILabel` when you are laying a field out by hand. Otherwise let [`IFormField`](/components/form-field) do it — it renders the label, wires `for` to a generated id, and links the description, hint and error in one go.

```vue
<!-- Preferred: the field owns the label and the wiring. -->
<IFormField name="reference" label="Invoice reference">
  <IInput v-model="reference" />
</IFormField>
```

[`ICheckbox`](/components/checkbox), [`ISwitch`](/components/switch) and [`IRadioGroup`](/components/radio-group) items take their own `label` prop and wire it themselves.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `for` | `string` | — | The `id` of the control this names |
| `required` | `boolean` | `false` | Appends a decorative asterisk |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |

Reka UI's `Label` props are forwarded.
