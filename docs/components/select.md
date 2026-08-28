---
eyebrow: Forms
---

<script setup lang="ts">
import { ref } from 'vue'

const terms = ref('net-30')
const currency = ref('')
const country = ref('')
const sizeSm = ref('net-30')
const sizeMd = ref('net-14')
const sizeLg = ref('receipt')
const lockedTerms = ref('net-30')

const termItems = [
  { label: 'Due on receipt', value: 'receipt' },
  { label: 'Net 14 days', value: 'net-14' },
  { label: 'Net 30 days', value: 'net-30' },
  { label: 'Net 60 days', value: 'net-60', disabled: true },
]

const grouped = [
  { label: 'Europe', items: [
    { label: 'Euro', value: 'eur' },
    { label: 'Pound sterling', value: 'gbp' },
    { label: 'Swiss franc', value: 'chf' },
  ] },
  { label: 'Americas', items: [
    { label: 'US dollar', value: 'usd' },
    { label: 'Canadian dollar', value: 'cad' },
  ] },
]
</script>

# ISelect

A listbox driven by an `items` array, with keyboard navigation and typeahead. For a list long enough that typing beats scrolling, use [`ICombobox`](/components/combobox).

<Demo stack>
<template #demo>
<ISelect v-model="terms" :items="termItems" class="w-64" />
</template>

```vue
<script setup lang="ts">
const terms = ref('net-30')

const termItems = [
  { label: 'Due on receipt', value: 'receipt' },
  { label: 'Net 14 days', value: 'net-14' },
  { label: 'Net 30 days', value: 'net-30' },
  { label: 'Net 60 days', value: 'net-60', disabled: true },
]
</script>

<template>
  <ISelect v-model="terms" :items="termItems" />
</template>
```
</Demo>

## Strings as items

A plain string is expanded to `{ label: value, value }`.

<Demo stack>
<template #demo>
<ISelect v-model="country" :items="['Austria', 'Belgium', 'Denmark', 'Estonia']" placeholder="Select a country" class="w-64" />
</template>

```vue
<ISelect
  v-model="country"
  :items="['Austria', 'Belgium', 'Denmark', 'Estonia']"
  placeholder="Select a country"
/>
```
</Demo>

## Groups

An item with its own `items` becomes a labelled run of options under a heading.

<Demo stack>
<template #demo>
<ISelect v-model="currency" :items="grouped" placeholder="Select a currency" class="w-64" />
</template>

```vue
<script setup lang="ts">
const grouped = [
  { label: 'Europe', items: [
    { label: 'Euro', value: 'eur' },
    { label: 'Pound sterling', value: 'gbp' },
  ] },
  { label: 'Americas', items: [
    { label: 'US dollar', value: 'usd' },
  ] },
]
</script>

<template>
  <ISelect v-model="currency" :items="grouped" placeholder="Select a currency" />
</template>
```
</Demo>

## Sizes

<Demo stack>
<template #demo>
<ISelect v-model="sizeSm" :items="termItems" size="sm" class="w-64" />
<ISelect v-model="sizeMd" :items="termItems" size="md" class="w-64" />
<ISelect v-model="sizeLg" :items="termItems" size="lg" class="w-64" />
</template>

```vue
<ISelect v-model="terms" :items="termItems" size="sm" />
<ISelect v-model="terms" :items="termItems" size="md" />
<ISelect v-model="terms" :items="termItems" size="lg" />
```
</Demo>

## Disabled

Disable the whole control, or a single option with `disabled` on the item — "Net 60 days" above is disabled that way.

<Demo stack>
<template #demo>
<ISelect v-model="lockedTerms" :items="termItems" disabled class="w-64" />
</template>

```vue
<ISelect v-model="terms" :items="termItems" disabled />
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `(SelectItemOption \| SelectItemGroup \| string)[]` | `[]` | Options to render |
| `placeholder` | `string` | — | Shown while nothing is selected |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control scale |
| `id` | `string` | — | Lands on the trigger, so a `<label for>` names the control |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ trigger?, content?, viewport?, item?, group?, groupLabel? }` | — | Per-slot class overrides |

`disabled`, `required`, `name` and `dir` are forwarded to Reka UI's `SelectRoot`.

## Item shapes

```ts
interface SelectItemOption {
  label: string
  value: string
  disabled?: boolean
}

interface SelectItemGroup {
  label: string
  items: (SelectItemOption | string)[]
}
```

Attributes you set land on the trigger, so `aria-label` names the button the reader operates.
