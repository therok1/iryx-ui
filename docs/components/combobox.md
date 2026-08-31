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
const clearable = ref('acme')
const tags = ref(['acme', 'bolt'])

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

## Clearing

`clearable` turns the dropdown arrow into a clear button as soon as something is selected — the arrow is only useful while the field is empty, and two targets in the same corner of a 36px field is a mis-click waiting to happen.

<Demo stack>
<template #demo>
<ICombobox v-model="clearable" :items="clients" placeholder="Search clients" clearable class="w-64" />
</template>

```vue
<ICombobox v-model="client" :items="clients" placeholder="Search clients" clearable />
```
</Demo>

Clearing empties the query, returns focus to the input and sets the model to `null` — or to `[]` when `multiple`.

Rename it for a non-English app with `clearLabel`, which is its accessible name.

## Multiple

`multiple` lets the field hold several values. The model becomes an array and chosen rows keep their tick.

<Demo stack>
<template #demo>
<ICombobox v-model="tags" :items="clients" placeholder="Search clients" multiple clearable class="w-72" />
</template>

```vue
<script setup lang="ts">
const selected = ref(['acme', 'bolt'])
</script>

<template>
  <ICombobox v-model="selected" :items="clients" multiple clearable />
</template>
```
</Demo>

Each value is drawn as a removable chip inside the field, and the input stays a query box — so the labels are readable at a glance and there is still somewhere to type. Remove one with its cross, or with <IKbd keys="backspace" size="xs" /> while the query is empty — the first press marks the last chip and the next removes it, as in [`ITagsInput`](/components/tags-input). The field wraps and grows rather than clipping, the same trade [`ITagsInput`](/components/tags-input) makes.

The popup stays open as you tick rows, so a run of choices is one visit rather than one visit each.

Reach for [`ITagsInput`](/components/tags-input) instead when the values are free text rather than a fixed list, and for [`ICheckbox`](/components/checkbox) when there are only a handful of options and hiding them behind a popup buys nothing.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `(ComboboxItemOption \| ComboboxItemGroup \| string)[]` | — | Options to render |
| `placeholder` | `string` | — | Shown while the field is empty |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control scale |
| `invalid` | `boolean` | — | Red border and ring; inherited from `IFormField` when unset |
| `id` | `string` | — | Id for the input; `IFormField` supplies one |
| `emptyText` | `string` | `'No results found.'` | Line shown when nothing matches |
| `clearable` | `boolean` | — | Swap the arrow for a clear button once a value is set |
| `clearLabel` | `string` | `'Clear'` | Accessible name for that button |
| `multiple` | `boolean` | — | Hold several values as chips; the model becomes an array |
| `removeLabel` | `(label: string) => string` | `Remove …` | Accessible name for a chip's remove button |
| `create` | `boolean` | — | Offer a "create" row for an unmatched query |
| `createLabel` | `(query: string) => string` | `Create "…"` | Label for that row |
| `virtual` | `boolean` | — | Render only the rows in view; flattens groups |
| `estimateSize` | `number` | `32` | Assumed row height in px, before rows are measured |
| `overscan` | `number` | `12` | Rows rendered beyond the viewport on each side |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ anchor?, input?, trigger?, clear?, tag?, tagText?, tagDelete?, content?, viewport?, item?, empty?, group?, groupLabel? }` | — | Per-element class overrides |

`disabled`, `dir` and the rest of Reka UI's `ComboboxRoot` props are forwarded.

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
| `tag` | `{ option, remove }` | Replace a chip's contents; call `remove()` to drop that value |

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
