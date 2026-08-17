<script setup lang="ts">
import { ref } from 'vue'

const columns = [
  { key: 'reference', label: 'Reference' },
  { key: 'client', label: 'Client', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'total', label: 'Total', sortable: true, numeric: true },
]

const rows = [
  { id: 1, reference: 'INV-1042', client: 'Northwind Supply', status: 'paid', total: '€1,240.00' },
  { id: 2, reference: 'INV-1043', client: 'Bluepeak Studio', status: 'pending', total: '€480.50' },
  { id: 3, reference: 'INV-1044', client: 'Harbour Logistics', status: 'overdue', total: '€3,900.00' },
  { id: 4, reference: 'INV-1045', client: 'Cedar & Co', status: 'paid', total: '€225.00' },
]

const selected = ref([])
const variant = { paid: 'success', pending: 'warning', overdue: 'danger' }
</script>

# Table

Sorting, selection, expansion and per-cell slots. Columns are plain objects rather than render functions, and the component never fetches anything.

<Demo stack>
<template #demo>
<ITable :columns="columns" :rows="rows" row-key="id">
<template #cell-status="{ row }">
<IBadge :variant="variant[row.status]" dot>{{ row.status }}</IBadge>
</template>
</ITable>
</template>

```vue
<script setup lang="ts">
const columns = [
  { key: 'reference', label: 'Reference' },
  { key: 'client', label: 'Client', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'total', label: 'Total', sortable: true, numeric: true },
]
</script>

<template>
  <ITable :columns="columns" :rows="rows" row-key="id">
    <template #cell-status="{ row }">
      <IBadge :variant="variantFor(row.status)" dot>
        {{ row.status }}
      </IBadge>
    </template>
  </ITable>
</template>
```
</Demo>

A `#cell-<key>` slot replaces the content of that column's cells and receives `{ row, value }`. Everything else falls back to the raw value.

## Selection

Bind `v-model:selection` to get a checkbox column, with the header checkbox handling the indeterminate state for you. It holds row keys, not row objects.

<Demo stack>
<template #demo>
<ITable v-model:selection="selected" :columns="columns" :rows="rows" row-key="id" selectable>
<template #cell-status="{ row }">
<IBadge :variant="variant[row.status]" dot>{{ row.status }}</IBadge>
</template>
</ITable>
<p class="text-sm text-muted-foreground">Selected: {{ selected.length ? selected.join(', ') : 'none' }}</p>
</template>

```vue
<ITable
  v-model:selection="selected"
  :columns="columns"
  :rows="rows"
  row-key="id"
  selectable
/>
```
</Demo>

## Client or server

The presence of `total` decides the mode, and nothing else:

- **Absent** — client mode. The table sorts and slices the rows it was given.
- **Present** — server mode. The table renders exactly the rows you pass and emits state changes for you to act on.

There is no `url` prop and there will not be one. Fetching, caching, cancellation and auth belong to your data layer, which already knows about your API — a table that fetches ends up reimplementing a worse version of it.

## State ownership

Every model is optional, declared with a default. Bind it and you own the state; leave it unbound and the table keeps it internally.

That is what makes Pinia, the URL, or a plain `useState` all viable without the library knowing which you picked:

```vue
<ITable
  v-model:page="page"
  v-model:sort="sort"
  v-model:selection="selected"
  :columns="columns"
  :rows="rows"
  :total="total"
/>
```

## Deliberately not included

Virtualization, grouping, and column reorder or resize. These are decisions rather than gaps — virtualization in particular would be a structural rewrite, not an addition, and the honest answer for a hundred thousand rows is a different component.

Columns are plain objects on purpose too. A render-function column API buys flexibility that slots already provide, at the cost of putting markup in your script block.

## Without the markup

`useDataTable()` is the sorting, paging and selection logic on its own, for when you want the behaviour but not the table:

```ts
const table = useDataTable({
  rows: () => rows.value,
  columns: () => columns,
})
// table.pageRows, table.toggleSort, table.headerSelection, …
```
