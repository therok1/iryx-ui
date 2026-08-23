---
eyebrow: Data display
---

<script setup lang="ts">
import { Copy01Icon, Delete02Icon, ViewIcon } from '@hugeicons/core-free-icons'
import { ref, watch } from 'vue'

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

const lastAction = ref('')
const rowActions = row => [
  { label: 'View', icon: ViewIcon, onSelect: () => (lastAction.value = `View ${row.reference}`) },
  { label: 'Duplicate', icon: Copy01Icon, onSelect: () => (lastAction.value = `Duplicate ${row.reference}`) },
  '-',
  { label: 'Delete', icon: Delete02Icon, danger: true, onSelect: () => (lastAction.value = `Delete ${row.reference}`) },
]

/*
 * The server-mode demo below talks to a fake backend: a local array behind an
 * artificial delay, sorted and sliced the way a real endpoint would do it.
 */
const clients = [
  'Northwind Supply', 'Bluepeak Studio', 'Harbour Logistics', 'Cedar & Co',
  'Ridgeline Foods', 'Atlas Print Works', 'Verity Tooling', 'Marrow & Fen',
]
const statuses = ['paid', 'pending', 'overdue']

const invoices = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  reference: `INV-${1100 + i}`,
  client: clients[i % clients.length],
  status: statuses[i % statuses.length],
  amount: Math.round((240 + i * 137.5) * 100) / 100,
}))

const serverColumns = [
  { key: 'reference', label: 'Reference' },
  { key: 'client', label: 'Client', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'amount', label: 'Amount', sortable: true, numeric: true },
]

const perPage = 5
const serverRows = ref([])
const serverTotal = ref(invoices.length)
const serverPage = ref(1)
const serverSort = ref(null)
const serverLoading = ref(false)

/*
 * Every request takes a ticket, and a reply is dropped unless it holds the
 * latest one. Without it, a slow first response can land after a fast second
 * and put the wrong page on screen.
 */
let latestRequest = 0

async function loadInvoices() {
  const ticket = ++latestRequest
  serverLoading.value = true

  await new Promise(resolve => setTimeout(resolve, 450))
  if (ticket !== latestRequest)
    return

  const ordered = [...invoices]
  if (serverSort.value) {
    const { key, order } = serverSort.value
    const direction = order === 'asc' ? 1 : -1
    ordered.sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * direction)
  }

  const start = (serverPage.value - 1) * perPage
  serverRows.value = ordered.slice(start, start + perPage)
  serverTotal.value = invoices.length
  serverLoading.value = false
}

watch([serverPage, serverSort], loadInvoices, { immediate: true })

const money = value => `€${value.toFixed(2)}`
</script>

# ITable

Sorting, selection, expansion and per-cell slots. Columns are plain objects, and the rows are yours to supply — in client or server mode.

<Demo stack>
<template #demo>
<ICard padding="none" class="w-full overflow-hidden">
<ITable :columns="columns" :rows="rows" row-key="id">
<template #cell-status="{ row }">
<IBadge :variant="variant[row.status]" dot>{{ row.status }}</IBadge>
</template>
</ITable>
</ICard>
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
  <ICard padding="none" class="overflow-hidden">
    <ITable :columns="columns" :rows="rows" row-key="id">
      <template #cell-status="{ row }">
        <IBadge :variant="variantFor(row.status)" dot>
          {{ row.status }}
        </IBadge>
      </template>
    </ITable>
  </ICard>
</template>
```
</Demo>

A `#cell-<key>` slot replaces the content of that column's cells and receives `{ row, value }`. Everything else falls back to the raw value.

## Row actions

Fill the `row-actions` slot and the table adds a trailing column for it, as narrow as its content and pinned to the end. The header is blank, named for screen readers by `actionsLabel`.

<Demo stack>
<template #demo>
<ICard padding="none" class="w-full overflow-hidden">
<ITable :columns="columns" :rows="rows" row-key="id">
<template #cell-status="{ row }">
<IBadge :variant="variant[row.status]" dot>{{ row.status }}</IBadge>
</template>
<template #row-actions="{ row }">
<IDropdownMenu :items="rowActions(row)" align="end">
<template #trigger>
<IButton variant="ghost" size="sm" square :aria-label="`Actions for ${row.reference}`">
<svg class="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" /></svg>
</IButton>
</template>
</IDropdownMenu>
</template>
</ITable>
</ICard>
<p class="text-sm text-muted-foreground">{{ lastAction ? `You chose: ${lastAction}` : 'Nothing chosen yet.' }}</p>
</template>

```vue
<ITable :columns="columns" :rows="rows" row-key="id">
  <template #row-actions="{ row }">
    <IDropdownMenu :items="actionsFor(row)" align="end">
      <template #trigger>
        <IButton variant="ghost" size="sm" square :aria-label="`Actions for ${row.reference}`">
          <MoreVerticalIcon />
        </IButton>
      </template>
    </IDropdownMenu>
  </template>
</ITable>
```
</Demo>

Build the entries from the row, so each menu acts on the record beside it:

```ts
function actionsFor(invoice) {
  return [
    { label: 'View', icon: ViewIcon, onSelect: () => open(invoice) },
    { label: 'Duplicate', icon: CopyIcon, onSelect: () => duplicate(invoice) },
    '-',
    { label: 'Delete', icon: TrashIcon, danger: true, onSelect: () => remove(invoice) },
  ]
}
```

A click inside the column never reaches the row, so `clickableRows` and a menu can coexist. Pair a destructive entry with [`useConfirm()`](/composables/use-confirm).

## Selection

Bind `v-model:selection` to get a checkbox column, with the header checkbox handling the indeterminate state for you. It holds row keys, not row objects.

<Demo stack>
<template #demo>
<ICard padding="none" class="w-full overflow-hidden">
<ITable v-model:selection="selected" :columns="columns" :rows="rows" row-key="id" selectable>
<template #cell-status="{ row }">
<IBadge :variant="variant[row.status]" dot>{{ row.status }}</IBadge>
</template>
</ITable>
</ICard>
<p class="text-sm text-muted-foreground">Selected: {{ selected.length ? selected.join(', ') : 'none' }}</p>
</template>

```vue
<ITable
  v-model:selection="selected"
  :columns="columns"
  :rows="rows"
  row-key="id"
  selectable
>
  <template #cell-status="{ row }">
    <IBadge :variant="variantFor(row.status)" dot>
      {{ row.status }}
    </IBadge>
  </template>
</ITable>
```
</Demo>

## Client or server

The presence of `total` decides the mode, and nothing else:

- **Absent** — client mode. The table sorts and slices the rows it was given.
- **Present** — server mode. The table renders exactly the rows you pass and emits state changes for you to act on.

In server mode the table tells you when the page or sort changes and renders what you hand back. Fetching, caching and cancellation stay in your data layer.

## Server mode

Bind `v-model:page` and `v-model:sort`, watch them, and pass back the page the server returned along with `total`. Sort a column or change the page below — each one issues a request, and `loading` holds the row skeleton while it is in flight.

<Demo stack>
<template #demo>
<ICard padding="none" class="w-full overflow-hidden">
<ITable
  v-model:page="serverPage"
  v-model:sort="serverSort"
  :columns="serverColumns"
  :rows="serverRows"
  :total="serverTotal"
  :loading="serverLoading"
  :skeleton-rows="5"
  row-key="id"
  label="Invoices"
>
<template #cell-status="{ row }">
<IBadge :variant="variant[row.status]" dot>{{ row.status }}</IBadge>
</template>
<template #cell-amount="{ value }">{{ money(value) }}</template>
</ITable>
</ICard>
<IPagination v-model:page="serverPage" :total="serverTotal" :items-per-page="5" />
</template>

```vue
<script setup lang="ts">
import type { TableSort } from 'iryx-ui'
import { ref, watch } from 'vue'

const rows = ref<Invoice[]>([])
const total = ref(0)
const loading = ref(false)

const page = ref(1)
const sort = ref<TableSort | null>(null)

watch([page, sort], async ([currentPage, currentSort], _old, onCleanup) => {
  const controller = new AbortController()
  onCleanup(() => controller.abort())

  loading.value = true
  try {
    const response = await fetch(
      `/api/invoices?page=${currentPage}&sort=${currentSort?.key ?? ''}&order=${currentSort?.order ?? ''}`,
      { signal: controller.signal },
    )
    const data = await response.json()
    rows.value = data.rows
    total.value = data.total
  }
  finally {
    loading.value = false
  }
}, { immediate: true })
</script>

<template>
  <ITable
    v-model:page="page"
    v-model:sort="sort"
    :columns="columns"
    :rows="rows"
    :total="total"
    :loading="loading"
    row-key="id"
  />
  <IPagination v-model:page="page" :total="total" :items-per-page="10" />
</template>
```
</Demo>

`sort` is `{ key, order }` or `null`, where `key` is the column's `sortKey` when it has one and its `key` otherwise — so a column can display `customer.name` and sort by `customer_name`.

`onCleanup` runs when the inputs change again, which makes it the place to abort the previous request — otherwise a slow first response can land after a fast second one and leave the wrong page on screen.

## State ownership

Every model is optional. Bind one and you own that piece of state; leave it unbound and the table keeps it internally — so the page, sort and selection can live in a store, in the URL, or nowhere at all:

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

## Without the markup

[`useDataTable()`](/composables/use-data-table) is the sorting, paging and selection logic on its own, for when you want the behaviour but not the markup:

```ts
const table = useDataTable({
  rows: () => rows.value,
  columns: () => columns,
})
// table.pageRows, table.toggleSort, table.headerSelection, …
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `rows` | `T[]` | `[]` | The rows to render; in server mode, the page the server returned |
| `columns` | `TableColumn[]` | `[]` | Column definitions |
| `total` | `number` | — | Total rows on the server. Its presence switches to server mode |
| `rowKey` | `string` | `'id'` | Field identifying a row, used by selection and expansion |
| `loading` | `boolean` | — | Skeleton rows on the first load, a refresh bar after that |
| `skeletonRows` | `number` | `5` | How many skeleton rows the first load shows |
| `selectable` | `boolean` | — | Adds the checkbox column |
| `isRowSelectable` | `(row) => boolean` | — | Veto selection per row |
| `expandable` | `boolean` | — | Adds the expand chevron and the `expanded` slot |
| `canExpandRow` | `(row) => boolean` | — | Veto expansion per row |
| `clickableRows` | `boolean` | — | Emit `rowClick`, and show a pointer cursor |
| `striped` | `boolean` | — | Alternate row backgrounds |
| `hoverable` | `boolean` | `true` | Highlight the row under the pointer |
| `stickyHeader` | `boolean` | — | Keep the header visible while the body scrolls |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Row density |
| `emptyText` | `string` | `'No results.'` | Line shown when there are no rows |
| `actionsLabel` | `string` | `'Actions'` | Names the blank header of the `row-actions` column |
| `label` | `string` | — | Accessible name for the table |
| `caption` | `string` | — | Visible caption |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, table?, thead?, tbody?, tr?, th?, td?, empty?, caption? }` | — | Per-slot class overrides |

Models: `v-model:sort`, `v-model:page`, `v-model:perPage`, `v-model:selection` and `v-model:expanded`.

## Column shape

```ts
interface TableColumn<T = any> {
  /** Accessor path into the row, dot-notation for nested values. Also the slot suffix. */
  key: string
  label?: string
  sortable?: boolean
  /** Sort by a different field than the one displayed. */
  sortKey?: string
  align?: 'start' | 'center' | 'end'
  /** Tabular figures; implies end alignment unless `align` says otherwise. */
  numeric?: boolean
  /** Inline width, e.g. '12rem', or '1px' to shrink to content. */
  width?: string
  /** Extra classes on every cell in the column; a function receives the row. */
  class?: string | ((row: T) => string)
  /** Hide the column outright, or per row (the cell renders empty). */
  hidden?: boolean | ((row: T) => boolean)
}

interface TableSort {
  key: string
  order: 'asc' | 'desc'
}
```

## Events

| Event | Payload | When |
| --- | --- | --- |
| `rowClick` | `row` | A row was clicked, with `clickableRows` set |

## Slots

| Slot | Props | When to use it |
| --- | --- | --- |
| `cell-<key>` | `{ row, column, value }` | Replace the contents of that column's cells |
| `row-actions` | `{ row }` | A per-row menu, in a trailing column of its own |
| `header-<key>` | `{ column }` | Replace that column's header |
| `expanded` | `{ row }` | The panel under an expanded row |
| `empty` | — | Replace the no-rows line |
| `caption` | — | Replace the caption |
