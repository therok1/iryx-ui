---
eyebrow: Forms
---

<script setup lang="ts">
import { ref } from 'vue'

const reference = ref('')
const email = ref('')
const vat = ref('')
const notes = ref('')
const broken = ref('not-an-email')
</script>

# IFormField

The label, description, hint, help and error around a control. It generates an id, points the label at it, links the description and error with `aria-describedby`, and sets `invalid` on the control.

<Demo stack>
<template #demo>
<IFormField label="Invoice reference" description="Shown to the client on the PDF." class="w-full max-w-md">
<IInput v-model="reference" placeholder="INV-1042" />
</IFormField>
</template>

```vue
<IFormField label="Invoice reference" description="Shown to the client on the PDF.">
  <IInput v-model="reference" placeholder="INV-1042" />
</IFormField>
```
</Demo>

You do not pass an `id` — the field makes one and wires both ends.

## Hint and help

`hint` sits at the end of the label row — for "Optional", a character count, a link to a definition. `help` sits under the control, for guidance that is not an error.

<Demo stack>
<template #demo>
<IFormField label="VAT number" hint="Optional" help="Leave blank if the client is outside the EU." class="w-full max-w-md">
<IInput v-model="vat" placeholder="SI12345678" />
</IFormField>
</template>

```vue
<IFormField
  label="VAT number"
  hint="Optional"
  help="Leave blank if the client is outside the EU."
>
  <IInput v-model="vat" placeholder="SI12345678" />
</IFormField>
```
</Demo>

## Required

<Demo stack>
<template #demo>
<IFormField label="Email" required class="w-full max-w-md">
<IInput v-model="email" type="email" placeholder="billing@example.com" />
</IFormField>
</template>

```vue
<IFormField label="Email" required>
  <IInput v-model="email" type="email" placeholder="billing@example.com" />
</IFormField>
```
</Demo>

## Errors

Inside an [`IForm`](/components/form), `name` connects the field to a validation error and the message appears on its own. Set `error` by hand only outside a form.

<Demo stack>
<template #demo>
<IFormField label="Email" error="Enter a valid email address." class="w-full max-w-md">
<IInput v-model="broken" type="email" />
</IFormField>
</template>

```vue
<!-- Inside an IForm: the message comes from validation. -->
<IFormField name="email" label="Email">
  <IInput v-model="state.email" type="email" />
</IFormField>

<!-- Outside one: set it yourself. -->
<IFormField label="Email" error="Enter a valid email address.">
  <IInput v-model="email" type="email" />
</IFormField>
```
</Demo>

An error replaces the help text rather than stacking with it.

## Any control

The wiring reaches every field in the library, including composed ones like [`IPasswordInput`](/components/password-input) and multi-part ones like [`ISelect`](/components/select), whose attributes land on the trigger.

<Demo stack>
<template #demo>
<IFormField label="Notes" description="Only you can see these." class="w-full max-w-md">
<ITextarea v-model="notes" :autosize="{ min: 2, max: 5 }" />
</IFormField>
</template>

```vue
<IFormField label="Notes" description="Only you can see these.">
  <ITextarea v-model="notes" :autosize="{ min: 2, max: 5 }" />
</IFormField>
```
</Demo>

[`ICheckbox`](/components/checkbox), [`ISwitch`](/components/switch) and [`IRadioGroup`](/components/radio-group) carry their own `label`. Inside a field, set the text on the field and leave the control's own label off, or it is announced twice.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | Dot-path connecting the field to a form error |
| `label` | `string` | — | Label text |
| `description` | `string` | — | Text under the label, linked to the control |
| `hint` | `string` | — | End of the label row |
| `help` | `string` | — | Under the control; replaced by an error |
| `required` | `boolean` | `false` | Adds the asterisk |
| `error` | `string` | — | Error message; supplied by `IForm` when inside one |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, header?, label?, hint?, description?, error?, help? }` | — | Per-element class overrides |

## Slots

| Slot | When to use it |
| --- | --- |
| default | The control |
| `hint` | The hint needs markup, such as a link |
