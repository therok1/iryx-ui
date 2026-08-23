---
eyebrow: Forms
---

<script setup lang="ts">
import { ref } from 'vue'

const basic = ref('')
const meter = ref('correct horse battery')
const noToggle = ref('')
const sizeSm = ref('')
const sizeMd = ref('')
const sizeLg = ref('')
</script>

# IPasswordInput

A masked field with a show/hide toggle and an optional strength meter. It composes [`IInput`](/components/input), so sizes, states and form wiring behave the same way.

<Demo stack>
<template #demo>
<IPasswordInput v-model="basic" placeholder="Your password" class="w-full max-w-md" />
</template>

```vue
<IPasswordInput v-model="password" placeholder="Your password" />
```
</Demo>

The toggle is a button in the trailing slot, reachable by keyboard, and it announces its state.

## Strength meter

`strength` adds a four-segment meter under the field. Type into it to see it move.

<Demo stack>
<template #demo>
<IPasswordInput v-model="meter" strength class="w-full max-w-md" />
</template>

```vue
<IPasswordInput v-model="password" strength />
```
</Demo>

The meter scores what has been typed and nothing else. Enforce your actual policy in the validator on your [`IForm`](/components/form), where it can refuse the submit:

```ts
const schema = z.object({
  password: z.string()
    .min(12, 'Use at least 12 characters.')
    .refine(notBreached, 'That password has appeared in a data breach.'),
})
```

`strengthLabels` renames the four steps, weakest first.

## Custom strength labels

<Demo stack>
<template #demo>
<IPasswordInput
  v-model="meter"
  strength
  :strength-labels="['Too short', 'Getting there', 'Decent', 'Excellent']"
  class="w-full max-w-md"
/>
</template>

```vue
<IPasswordInput
  v-model="password"
  strength
  :strength-labels="['Too short', 'Getting there', 'Decent', 'Excellent']"
/>
```
</Demo>

## Without the toggle

<Demo stack>
<template #demo>
<IPasswordInput v-model="noToggle" :toggle="false" placeholder="No reveal" class="w-full max-w-md" />
</template>

```vue
<IPasswordInput v-model="password" :toggle="false" placeholder="No reveal" />
```
</Demo>

The toggle only ever reveals what is being typed now, so leaving it on is usually the friendlier choice.

## Sizes

<Demo stack>
<template #demo>
<IPasswordInput v-model="sizeSm" size="sm" placeholder="Small" class="w-full max-w-md" />
<IPasswordInput v-model="sizeMd" size="md" placeholder="Medium" class="w-full max-w-md" />
<IPasswordInput v-model="sizeLg" size="lg" placeholder="Large" class="w-full max-w-md" />
</template>

```vue
<IPasswordInput v-model="password" size="sm" placeholder="Small" />
<IPasswordInput v-model="password" size="md" placeholder="Medium" />
<IPasswordInput v-model="password" size="lg" placeholder="Large" />
```
</Demo>

## In a form

Inside an [`IFormField`](/components/form-field) the id, `invalid` state and `aria-describedby` are wired for you, exactly as for a plain input.

```vue
<IFormField name="password" label="Password" required>
  <IPasswordInput v-model="state.password" strength />
</IFormField>
```

Set `autocomplete` so password managers recognise the field: `new-password` on a sign-up, `current-password` on a sign-in. It falls through to the input.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control scale |
| `toggle` | `boolean` | `true` | Shows the reveal button |
| `strength` | `boolean` | `false` | Shows the strength meter |
| `strengthLabels` | `[string, string, string, string]` | `['Weak', 'Fair', 'Good', 'Strong']` | Meter labels, weakest first |
| `showLabel` | `string` | `'Show password'` | Accessible name while masked |
| `hideLabel` | `string` | `'Hide password'` | Accessible name while revealed |
| `placeholder` | `string` | — | Placeholder text |
| `disabled` | `boolean` | `false` | Disables the field |
| `required` | `boolean` | `false` | Marks it required |
| `invalid` | `boolean` | — | Error styling; set automatically inside `IFormField` |
| `id` | `string` | generated | Useful when an external `ILabel` targets it |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, input?, toggle?, meter?, track?, segment?, label? }` | — | Per-slot class overrides |
