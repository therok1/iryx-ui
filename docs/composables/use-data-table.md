---
eyebrow: Composables
---

<script setup lang="ts">
import { useDataTable } from 'iryx-ui'
import { computed, ref } from 'vue'

const invoices = [
  { id: 'INV-1042', client: 'Acme Industries', total: 4820, status: 'Paid' },
  { id: 'INV-1041', client: 'Bolt Logistics', total: 1290, status: 'Overdue' },
  { id: 'INV-1040', client: 'Cirrus Systems', total: 9600, status: 'Draft' },
  { id: 'INV-1039', client: 'Delta Foundry', total: 320, status: 'Paid' },
  { id: 'INV-1038', client: 'Everline Media', total: 7450, status: 'Pending' },
]

const columns = [
  { key: 'id', label: 'Invoice', sortable: true },
  { key: 'client', label: 'Client', sortable: true },
  { key: 'total', label: 'Total', sortable: true, numeric: true },
]

const table = useDataTable({
  rows: () => invoices,
  columns: () => columns,
  rowKey: () => 'id',
})

table.perPage.value = 3
</script>

# useDataTable

Everything [`ITable`](/components/table) does, with none of the markup: sorting, pagination, selection and expansion. Use it when the rows are laid out as cards, a list or a board rather than a `<table>`.

<Demo stack>
<template #demo>
<div class="w-full max-w-lg space-y-3">
<div class="flex flex-wrap gap-2">
<IButton v-for="column in columns" :key="column.key" size="sm" variant="outline" @click="table.toggleSort(column)">
{{ column.label }}
<span class="ml-1 text-muted-foreground">{{ table.sortOrderFor(column) ?? '—' }}</span>
</IButton>
</div>
<div v-for="row in table.pageRows.value" :key="row.id" class="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
<span>
<span class="font-mono text-xs text-muted-foreground">{{ row.id }}</span>
<span class="ml-2">{{ row.client }}</span>
</span>
<span class="tabular-nums">€{{ row.total.toLocaleString('en-GB') }}</span>
</div>
<IPagination v-model:page="table.page.value" :total="table.total.value" :items-per-page="table.perPage.value" />
</div>
</template>

```vue
<script setup lang="ts">
import { useDataTable } from 'iryx-ui'

const table = useDataTable({
  rows: () => invoices,
  columns: () => columns,
  rowKey: () => 'id',
})
</script>

<template>
  <IButton @click="table.toggleSort(column)">
    {{ column.label }} {{ table.sortOrderFor(column) }}
  </IButton>

  <article v-for="row in table.pageRows.value" :key="row.id">
    …
  </article>

  <IPagination
    v-model:page="table.page.value"
    :total="table.total.value"
    :items-per-page="table.perPage.value"
  />
</template>
```
</Demo>

## Options

`rows` and `columns` are getters rather than values, so the composable stays reactive to whatever holds them — a `ref`, a prop, or a store.

| Option | Type | What it does |
| --- | --- | --- |
| `rows` | `() => T[]` | The data. Required |
| `columns` | `() => TableColumn<T>[]` | Column definitions. Required |
| `total` | `() => number \| undefined` | Row count on the server. **Its presence switches modes** |
| `rowKey` | `() => string` | Field identifying a row, for selection and expansion |
| `sort` | `ModelRef<TableSort \| null>` | Controlled sort; omit for internal state |
| `page` | `ModelRef<number>` | Controlled page |
| `perPage` | `ModelRef<number>` | Controlled page size |
| `selection` | `ModelRef<(string \| number)[]>` | Controlled selection |
| `expanded` | `ModelRef<(string \| number)[]>` | Controlled expansion |
| `isRowSelectable` | `(row: T) => boolean` | Rows the header checkbox skips |

Every model is optional. Bind one and you own that piece of state; leave it out and the composable keeps its own — so the page, sort and selection can live in a store, in the URL, or nowhere at all.

## Client and server mode

Passing `total` is the switch. Without it the composable sorts and slices the rows you gave it. With it, the rows you passed are already the page the server returned, so sorting and paging only change state — watch `sort` and `page`, and fetch.

```ts
const table = useDataTable({
  rows: () => data.value.rows,
  columns: () => columns,
  total: () => data.value.total, // server mode
})

watch([table.sort, table.page, table.perPage], fetchPage)
```

`isServerMode` is exposed so your own UI can branch on it.

## What you get back

| Returned | Type | |
| --- | --- | --- |
| `sort` / `page` / `perPage` | refs | The state, controlled or internal |
| `selection` / `expanded` | refs | Arrays of row keys |
| `isServerMode` | computed | `true` when `total` was supplied |
| `visibleColumns` | computed | Columns left after `hidden` is applied |
| `pageRows` | computed | The rows to render, sorted and sliced in client mode |
| `total` | computed | Server total, or the row count |
| `pageCount` | computed | Pages at the current size |
| `keyOf(row)` | fn | The row's key, via `rowKey` |
| `toggleSort(column)` | fn | Cycles ascending → descending → none |
| `sortOrderFor(column)` | fn | `'asc'`, `'desc'` or `undefined` |
| `headerSelection` | computed | `true`, `false` or `'indeterminate'` |
| `isSelected` / `toggleRow` | fn | Per-row selection |
| `toggleAll` | fn | Selects the selectable rows on the page |
| `isExpanded` / `toggleExpanded` | fn | Per-row expansion |
| `getRowValue(row, path)` | fn | Dot-notation accessor, exported separately too |

## Columns

```ts
interface TableColumn<T = any> {
  key: string
  label?: string
  sortable?: boolean
  sortKey?: string
  align?: 'start' | 'center' | 'end'
  numeric?: boolean
  width?: string
  class?: string | ((row: T) => string)
  hidden?: boolean | ((row: T) => boolean)
}
```

`sortKey` covers the case where the field you display and the field the server sorts by have different names — `customer.name` against `customer_name`.

As with [`ITable`](/components/table), fetching and caching stay in your data layer.
