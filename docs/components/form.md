---
eyebrow: Forms
---

<script setup lang="ts">
import { reactive, ref } from 'vue'

const state = reactive({ client: '', email: '', amount: '' })
const submitted = ref('')

function validate(s) {
  const errors = []
  if (!s.client)
    errors.push({ name: 'client', message: 'Who is this invoice for?' })
  if (!s.email)
    errors.push({ name: 'email', message: 'An email is required to send it.' })
  else if (!s.email.includes('@'))
    errors.push({ name: 'email', message: 'That does not look like an email address.' })
  if (!s.amount)
    errors.push({ name: 'amount', message: 'Enter an amount.' })
  return errors
}

function onSubmit(event) {
  submitted.value = JSON.stringify(event.data)
}
</script>

# IForm

A form wrapper that validates. Point it at any [Standard Schema](https://standardschema.dev) validator — Zod, Valibot, ArkType — or hand it a plain function, and errors land on the matching `IFormField` by name.

<Demo stack>
<template #demo>
<IForm :state="state" :validate="validate" class="flex w-full max-w-md flex-col gap-4" @submit="onSubmit">
<IFormField name="client" label="Client" required>
<IInput v-model="state.client" placeholder="Northwind Supply" />
</IFormField>
<IFormField name="email" label="Email" required>
<IInput v-model="state.email" type="email" placeholder="billing@example.com" />
</IFormField>
<IFormField name="amount" label="Amount" required>
<INumberInput v-model="state.amount" :precision="2" class="w-full" />
</IFormField>
<IButton type="submit">Create invoice</IButton>
<p v-if="submitted" class="text-xs text-muted-foreground">Submitted: <code>{{ submitted }}</code></p>
</IForm>
</template>

```vue
<script setup lang="ts">
const state = reactive({ client: '', email: '', amount: '' })

function onSubmit(event) {
  // Only fires when validation passes.
  createInvoice(event.data)
}
</script>

<template>
  <IForm :state="state" :schema="schema" @submit="onSubmit">
    <IFormField name="client" label="Client" required>
      <IInput v-model="state.client" placeholder="Northwind Supply" />
    </IFormField>
    <IFormField name="email" label="Email" required>
      <IInput v-model="state.email" type="email" placeholder="billing@example.com" />
    </IFormField>
    <IFormField name="amount" label="Amount" required>
      <INumberInput v-model="state.amount" :precision="2" class="w-full" />
    </IFormField>

    <IButton type="submit">
      Create invoice
    </IButton>
  </IForm>
</template>
```
</Demo>

Try submitting it empty, then fix the fields one at a time — each re-validates as you leave it.

## With a schema

`schema` takes any Standard Schema validator. The library ships none, so bring your own.

```vue
<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  client: z.string().min(1, 'Who is this invoice for?'),
  email: z.string().email('That does not look like an email address.'),
  amount: z.string().min(1, 'Enter an amount.'),
})

const state = reactive({ client: '', email: '', amount: '' })
</script>

<template>
  <IForm :state="state" :schema="schema" @submit="createInvoice($event.data)">
    …
  </IForm>
</template>
```

The `name` on each field is a **dot-path** into the state, so nested objects work: `name="address.city"` picks up an error the schema reported for that path.

## With a function

For rules a schema cannot express — a value that depends on another field, or a check against the server — pass `validate` instead. It returns an array of errors and may be async. The demo at the top of this page uses one.

```ts
async function validate(state) {
  const errors = []

  if (state.due < state.issued)
    errors.push({ name: 'due', message: 'The due date cannot precede the issue date.' })

  if (await referenceTaken(state.reference))
    errors.push({ name: 'reference', message: 'That reference is already used.' })

  return errors
}
```

`schema` and `validate` can be used together — both run, and their errors merge.

## When it validates

`validateOn` controls re-validation of a field after the first submit. Submitting always validates everything, whatever this is set to.

```vue
<!-- The default. -->
<IForm :state="state" :schema="schema" :validate-on="['blur', 'change']" />

<!-- Stricter: check as they type. -->
<IForm :state="state" :schema="schema" :validate-on="['input']" />
```

Validating on `input` marks a field invalid while it is still being typed, which is why `blur` is in the default instead.

## Disabling

`disabled` disables every control inside — useful while a submit is in flight.

```vue
<IForm :state="state" :schema="schema" :disabled="saving" @submit="save">
  …
  <IButton type="submit" :loading="saving">
    Save
  </IButton>
</IForm>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `state` | `object` | — | **Required.** The reactive object the fields write to |
| `schema` | Standard Schema | — | Any compliant validator |
| `validate` | `(state) => FormError[] \| Promise<FormError[]>` | — | Your own rules; merges with `schema` |
| `validateOn` | `('blur' \| 'input' \| 'change')[]` | `['blur', 'change']` | When a field re-validates |
| `disabled` | `boolean` | `false` | Disables every control inside |
| `class` | `string` | — | Classes on the `<form>` |

## Events

| Event | Payload | When |
| --- | --- | --- |
| `submit` | `{ data }` | Validation passed |
| `error` | `FormError[]` | Validation failed |

```ts
interface FormError {
  /** Dot-path into the state; matches a field's `name`. */
  name?: string
  message: string
}
```

An error with no `name` belongs to the form rather than a field — a failed request, say. Render those yourself from the `error` event.

## Without the markup

[`useForm()`](/composables/use-form) is the same validation logic without the markup, and `useFormField()` is how a control of your own joins the wiring of the field around it.
