---
eyebrow: Forms
---

<script setup lang="ts">
import { ref } from 'vue'

const client = ref('')
const unmatched = ref('')
const sizeSm = ref('acme')
const sizeMd = ref('acme')
const sizeLg = ref('acme')
const grouped = ref('')
const invalidClient = ref('')
const newClient = ref('')
const sku = ref('')

const clients = [
  { label: 'Acme Industries', value: 'acme' },
  { label: 'Bolt Logistics', value: 'bolt' },
  { label: 'Cirrus Systems', value: 'cirrus' },
  { label: 'Delta Foundry', value: 'delta' },
  { label: 'Everline Media', value: 'everline' },
  { label: 'Fathom Analytics', value: 'fathom' },
]

const groupedClients = [
  { label: 'Recent', items: ['Acme Industries', 'Bolt Logistics'] },
  {
    label: 'Archived',
    items: [
      { label: 'Cirrus Systems', value: 'cirrus' },
      { label: 'Delta Foundry', value: 'delta' },
    ],
  },
]

const creatable = ref([...clients])

const skus = Array.from({ length: 5000 }, (_, i) => ({
  label: `SKU-${String(i + 1).padStart(5, '0')}`,
  value: `sku-${i + 1}`,
}))

function addClient(query: string) {
  const value = query.toLowerCase().replace(/\s+/g, '-')
  creatable.value = [...creatable.value, { label: query, value }]
  newClient.value = value
}
</script>

# ICombobox

A select you can type into. It takes the same `items` as [`ISelect`](/components/select) and filters them against the query. The field shows the selected option's **label**; the model holds its `value`.

<Demo stack>
<template #demo>
<ICombobox v-model="client" :items="clients" placeholder="Search clients" class="w-64" />
</template>

```vue
<script setup lang="ts">
const client = ref('')

const clients = [
  { label: 'Acme Industries', value: 'acme' },
  { label: 'Bolt Logistics', value: 'bolt' },
  { label: 'Cirrus Systems', value: 'cirrus' },
]
</script>

<template>
  <ICombobox v-model="client" :items="clients" placeholder="Search clients" />
</template>
```
</Demo>

A plain string is expanded to `{ label: value, value }`, so a list of names needs no shaping.

## Groups

An entry with its own `items` becomes a labelled run of options. A group disappears once nothing inside it matches — type `cir` and watch "Recent" go.

<Demo stack>
<template #demo>
<ICombobox v-model="grouped" :items="groupedClients" placeholder="Search clients" class="w-64" />
</template>

```vue
<ICombobox
  v-model="client"
  placeholder="Search clients"
  :items="[
    { label: 'Recent', items: ['Acme Industries', 'Bolt Logistics'] },
    {
      label: 'Archived',
      items: [
        { label: 'Cirrus Systems', value: 'cirrus' },
        { label: 'Delta Foundry', value: 'delta' },
      ],
    },
  ]"
/>
```
</Demo>

## Sizes

<Demo stack>
<template #demo>
<ICombobox v-model="sizeSm" :items="clients" size="sm" class="w-64" />
<ICombobox v-model="sizeMd" :items="clients" size="md" class="w-64" />
<ICombobox v-model="sizeLg" :items="clients" size="lg" class="w-64" />
</template>

```vue
<ICombobox v-model="client" :items="clients" size="sm" />
<ICombobox v-model="client" :items="clients" size="md" />
<ICombobox v-model="client" :items="clients" size="lg" />
```
</Demo>

## Empty results

`emptyText` is the line shown when the query matches nothing. The `empty` slot replaces that markup entirely and receives the current `query`.

<Demo stack>
<template #demo>
<ICombobox v-model="unmatched" :items="clients" placeholder="Type something unmatched" empty-text="No clients match that." class="w-64" />
</template>

```vue
<ICombobox
  v-model="client"
  :items="clients"
  placeholder="Type something unmatched"
  empty-text="No clients match that."
/>
```
</Demo>

## Create from the query

Set `create` to offer a row for whatever was typed when nothing matches. Choosing it emits `create` with the trimmed query and leaves the model alone — add the option and select it yourself.

<Demo stack>
<template #demo>
<ICombobox v-model="newClient" :items="creatable" placeholder="Search or add a client" create :create-label="q => `Add ${q}`" class="w-64" @create="addClient" />
</template>

```vue
<script setup lang="ts">
const client = ref('')
const clients = ref([{ label: 'Acme Industries', value: 'acme' }])

function onCreate(query: string) {
  const value = slugify(query)
  clients.value.push({ label: query, value })
  client.value = value
}
</script>

<template>
  <ICombobox
    v-model="client"
    :items="clients"
    placeholder="Search or add a client"
    create
    :create-label="query => `Add ${query}`"
    @create="onCreate"
  />
</template>
```
</Demo>

## Virtualized rows

For lists in the thousands, `virtual` renders only the rows on screen. The field below holds 5,000 options.

<Demo stack>
<template #demo>
<ICombobox v-model="sku" :items="skus" virtual placeholder="Search 5,000 SKUs" class="w-64" />
</template>

```vue
<ICombobox
  v-model="sku"
  :items="fiveThousandItems"
  virtual
  placeholder="Search 5,000 SKUs"
/>
```
</Demo>

`virtual` cannot be combined with grouped items: groups are flattened and their labels dropped, with a warning in dev. `estimateSize` is the assumed row height in px, used to size the scrollbar before the rows are measured — set it when you have restyled rows to a different height.

Use `virtual` for lists in the thousands.

## Invalid

<Demo stack>
<template #demo>
<ICombobox v-model="invalidClient" :items="clients" placeholder="Search clients" invalid class="w-64" />
</template>

```vue
<ICombobox v-model="client" :items="clients" placeholder="Search clients" invalid />
```
</Demo>

Inside an [`IFormField`](/components/form-field) the field passes its own validity down, so `invalid` rarely needs setting by hand.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `(ComboboxItemOption \| ComboboxItemGroup \| string)[]` | — | Options to render |
| `placeholder` | `string` | — | Shown while the field is empty |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control scale |
| `invalid` | `boolean` | — | Red border and ring; inherited from `IFormField` when unset |
| `id` | `string` | — | Id for the input; `IFormField` supplies one |
| `emptyText` | `string` | `'No results found.'` | Line shown when nothing matches |
| `create` | `boolean` | — | Offer a "create" row for an unmatched query |
| `createLabel` | `(query: string) => string` | `Create "…"` | Label for that row |
| `virtual` | `boolean` | — | Render only the rows in view; flattens groups |
| `estimateSize` | `number` | `32` | Assumed row height in px, before rows are measured |
| `overscan` | `number` | `12` | Rows rendered beyond the viewport on each side |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ anchor?, input?, trigger?, content?, viewport?, item?, empty?, group?, groupLabel? }` | — | Per-slot class overrides |

`disabled`, `multiple`, `dir` and the rest of Reka UI's `ComboboxRoot` props are forwarded.

## Events

| Event | Payload | When |
| --- | --- | --- |
| `create` | `query: string` | The create row was chosen. The model is left alone |

Reka UI's own `ComboboxRoot` events are re-emitted unchanged.

## Slots

| Slot | Props | When to use it |
| --- | --- | --- |
| `empty` | `{ query }` | Replace the no-results line with your own markup |
| `create` | `{ query }` | Replace the create row's label with your own markup |

## Item shapes

```ts
interface ComboboxItemOption {
  label: string
  value: string
  disabled?: boolean
}

interface ComboboxItemGroup {
  label: string
  items: (ComboboxItemOption | string)[]
}
```

Attributes you set land on the input, so `aria-label` and friends reach the control the reader types into.
