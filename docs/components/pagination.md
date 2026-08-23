---
eyebrow: Navigation
---

<script setup lang="ts">
import { ref } from 'vue'

const basic = ref(4)
const siblings = ref(6)
const edges = ref(6)
const aligned = ref(2)
const sizeSm = ref(3)
const sizeMd = ref(3)
const sizeLg = ref(3)
</script>

# IPagination

Page controls for a list that is too long to show at once. It holds no data: it reports which page was asked for, and you fetch or slice accordingly.

<Demo stack>
<template #demo>
<IPagination v-model:page="basic" :total="248" :items-per-page="20" />
</template>

```vue
<IPagination v-model:page="page" :total="248" :items-per-page="20" />
```
</Demo>

`total` is the number of items, not pages; the component divides by `itemsPerPage` itself.

## With a table

In server mode [`ITable`](/components/table) takes the same `page` model, so both can bind to one ref.

```vue
<ITable v-model:page="page" :rows="rows" :columns="columns" :total="total" />
<IPagination v-model:page="page" :total="total" :items-per-page="20" />
```

See the [server-mode example](/components/table) for the full loop, including the request in between.

## How many pages show

`siblingCount` is how many pages sit either side of the current one. The first and last are always reachable, with an ellipsis standing in for the gap.

<Demo stack>
<template #demo>
<IPagination v-model:page="siblings" :total="400" :items-per-page="20" :sibling-count="1" />
<IPagination v-model:page="siblings" :total="400" :items-per-page="20" :sibling-count="2" />
<IPagination v-model:page="siblings" :total="400" :items-per-page="20" :sibling-count="3" />
</template>

```vue
<IPagination v-model:page="page" :total="400" :items-per-page="20" :sibling-count="1" />
<IPagination v-model:page="page" :total="400" :items-per-page="20" :sibling-count="2" />
<IPagination v-model:page="page" :total="400" :items-per-page="20" :sibling-count="3" />
```
</Demo>

`showEdges` drops the first and last pages when you would rather keep the control narrow.

<Demo stack>
<template #demo>
<IPagination v-model:page="edges" :total="400" :items-per-page="20" :show-edges="false" />
</template>

```vue
<IPagination v-model:page="page" :total="400" :items-per-page="20" :show-edges="false" />
```
</Demo>

## Alignment

Centred by default, since pagination usually sits under a full-width list.

<Demo stack>
<template #demo>
<IPagination v-model:page="aligned" :total="100" :items-per-page="20" align="start" class="w-full" />
<IPagination v-model:page="aligned" :total="100" :items-per-page="20" align="center" class="w-full" />
<IPagination v-model:page="aligned" :total="100" :items-per-page="20" align="end" class="w-full" />
</template>

```vue
<IPagination v-model:page="page" :total="100" :items-per-page="20" align="start" />
<IPagination v-model:page="page" :total="100" :items-per-page="20" align="center" />
<IPagination v-model:page="page" :total="100" :items-per-page="20" align="end" />
```
</Demo>

## Sizes

<Demo stack>
<template #demo>
<IPagination v-model:page="sizeSm" :total="100" :items-per-page="20" size="sm" />
<IPagination v-model:page="sizeMd" :total="100" :items-per-page="20" size="md" />
<IPagination v-model:page="sizeLg" :total="100" :items-per-page="20" size="lg" />
</template>

```vue
<IPagination v-model:page="page" :total="100" :items-per-page="20" size="sm" />
<IPagination v-model:page="page" :total="100" :items-per-page="20" size="md" />
<IPagination v-model:page="page" :total="100" :items-per-page="20" size="lg" />
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `total` | `number` | `0` | Total **items**, not pages |
| `itemsPerPage` | `number` | `10` | Page size |
| `siblingCount` | `number` | `1` | Pages shown either side of the current one |
| `showEdges` | `boolean` | `true` | Always show the first and last page |
| `size` | `'sm' \| 'md' \| 'lg'` | `'sm'` | Control scale |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Horizontal alignment |
| `prevLabel` | `string` | `'Previous page'` | Accessible name for the previous control |
| `nextLabel` | `string` | `'Next page'` | Accessible name for the next control |
| `label` | `string` | `'Pagination'` | Accessible name for the navigation region |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, list?, item?, ellipsis? }` | — | Per-slot class overrides |

The model is `v-model:page`, one-based.

## Slots

| Slot | When to use it |
| --- | --- |
| `prev` / `next` | Replace the previous and next controls |
