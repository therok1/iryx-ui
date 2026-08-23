---
eyebrow: Composables
---

# useForm / useFormField

The read side of what [`IForm`](/components/form) and [`IFormField`](/components/form-field) provide, so a control you wrote yourself behaves like a built-in one.

Both return `undefined` outside their provider, so a control can support being used on its own and inside a field with the same code.

## useFormField

A field has already worked out an id, whether it is invalid, and which elements describe it. `useFormField()` hands your control the same three answers the built-ins get.

```vue
<script setup lang="ts">
import { useFormField } from 'iryx-ui'

const field = useFormField()
</script>

<template>
  <input
    :id="field?.id.value"
    :aria-invalid="field?.invalid.value || undefined"
    :aria-describedby="field?.describedBy.value"
  >
</template>
```

Dropped inside a field, that control is labelled, marked invalid when validation fails, and pointed at the description and error text — with no props passed down:

```vue
<IFormField name="reference" label="Invoice reference" description="Shown on the PDF">
  <MyOwnInput />
</IFormField>
```

| Property | Type | Description |
| --- | --- | --- |
| `id` | `ComputedRef<string>` | The id the field's `<label for>` points at |
| `name` | `ComputedRef<string \| undefined>` | The field's name, for error lookup |
| `invalid` | `ComputedRef<boolean>` | Whether this field currently has an error |
| `describedBy` | `ComputedRef<string \| undefined>` | Ids of the description, hint and error text |

Every control in the library reads the same context, which is why none of them need `invalid` passed by hand inside a field.

## useForm

The form as a whole: its errors, its state, and when it validates.

```ts
import { useForm } from 'iryx-ui'

const form = useForm()

// Disable a submit button while the form has errors.
const hasErrors = computed(() => (form?.errors.value.length ?? 0) > 0)
```

| Property | Type | Description |
| --- | --- | --- |
| `errors` | `Ref<FormError[]>` | Every current error, each with a `name` and `message` |
| `state` | `ComputedRef<Record<string, unknown>>` | The form's current values |
| `validateOn` | `ComputedRef<FormValidateOn[]>` | `'blur'`, `'input'` or `'change'` |
| `disabled` | `ComputedRef<boolean>` | Whether the whole form is disabled |
| `errorFor(name)` | `string \| undefined` | The message for one field |
| `validateField(name)` | `Promise<void>` | Validate a single field now |

## When you need neither

For a control that lives inside an `IFormField`, `useFormField` is enough. `useForm` is for the wider view — an error summary elsewhere on the page, or a submit button reacting to the form's state.

See [`IForm`](/components/form) for validation with Zod, Valibot, ArkType or a plain function, and [`IFormField`](/components/form-field) for the label, description, hint and error layout.
