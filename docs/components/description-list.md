---
eyebrow: Data display
---

# IDescriptionList

Term and value pairs — a details panel, an order summary, a record's metadata.

<Demo stack>
<template #demo>
<IDescriptionList
  class="w-full max-w-md"
  :items="[
    { term: 'Invoice', description: 'INV-2048' },
    { term: 'Issued', description: '12 August 2026' },
    { term: 'Due', description: '11 September 2026' },
    { term: 'Amount', description: '€4,280.00' },
  ]"
/>
</template>

```vue
<IDescriptionList
  :items="[
    { term: 'Invoice', description: 'INV-2048' },
    { term: 'Issued', description: '12 August 2026' },
    { term: 'Due', description: '11 September 2026' },
    { term: 'Amount', description: '€4,280.00' },
  ]"
/>
```
</Demo>

## Orientation

`vertical` stacks the description under its term. `horizontal` puts them side by side, with the terms sharing one column — the columns are a subgrid, so every value lines up however long the terms run.

<Demo stack>
<template #demo>
<div class="grid w-full gap-10 sm:grid-cols-2">
<IDescriptionList
  :items="[
    { term: 'Plan', description: 'Team' },
    { term: 'Seats', description: 12 },
    { term: 'Renews', description: '1 October 2026' },
  ]"
/>
<IDescriptionList
  orientation="horizontal"
  :items="[
    { term: 'Plan', description: 'Team' },
    { term: 'Seats', description: 12 },
    { term: 'Renews', description: '1 October 2026' },
  ]"
/>
</div>
</template>

```vue
<IDescriptionList :items="items" />
<IDescriptionList orientation="horizontal" :items="items" />
```
</Demo>

## Divided

`divided` rules the rows apart instead of spacing them, for a long list where the eye needs the row boundary.

<Demo stack>
<template #demo>
<IDescriptionList
  class="w-full max-w-md"
  orientation="horizontal"
  divided
  :items="[
    { term: 'Status', description: 'Paid' },
    { term: 'Method', description: 'Bank transfer' },
    { term: 'Reference', description: 'SI56 1910 0000 0123 438' },
    { term: 'Settled', description: '14 August 2026' },
  ]"
/>
</template>

```vue
<IDescriptionList
  orientation="horizontal"
  divided
  :items="items"
/>
```
</Demo>

## Slots

The `term` and `description` slots take over the rendering of every row, each receiving the `item` and its `index`.

<Demo stack>
<template #demo>
<IDescriptionList
  class="w-full max-w-md"
  orientation="horizontal"
  divided
  :items="[
    { key: 'status', term: 'Status', description: 'Paid' },
    { key: 'owner', term: 'Owner', description: 'Dana Whitfield' },
    { key: 'reference', term: 'Reference', description: 'INV-2048' },
  ]"
>
<template #description="{ item }">
<IBadge v-if="item.key === 'status'" variant="success">{{ item.description }}</IBadge>
<span v-else-if="item.key === 'reference'" class="font-mono text-xs">{{ item.description }}</span>
<template v-else>{{ item.description }}</template>
</template>
</IDescriptionList>
</template>

```vue
<IDescriptionList orientation="horizontal" divided :items="items">
  <template #description="{ item }">
    <IBadge v-if="item.key === 'status'" variant="success">{{ item.description }}</IBadge>
    <span v-else-if="item.key === 'reference'" class="font-mono text-xs">{{ item.description }}</span>
    <template v-else>{{ item.description }}</template>
  </template>
</IDescriptionList>
```
</Demo>

The default slot renders after the items, for a row that does not fit the `items` shape at all. Write it as `<div><dt>…</dt><dd>…</dd></div>` so it keeps the row layout.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `DescriptionListItem[]` | `[]` | The pairs, each `{ term, description?, key? }` |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Stacked, or term and value side by side |
| `divided` | `boolean` | `false` | Rule between rows instead of spacing |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, item?, term?, description? }` | — | Per-element class overrides |

`key` is only an identity — it names the row for the slots and keys the render. Rows fall back to their `term` when it is absent, so give a `key` when two rows share a term.

## Slots

| Slot | When to use it |
| --- | --- |
| `term` | The label needs markup, receiving `{ item, index }` |
| `description` | The value needs markup — a badge, a link, a chip — receiving `{ item, index }` |
| `default` | An extra row that does not fit the `items` shape |
