---
eyebrow: Feedback
---

<script setup lang="ts">
const columns = [
  { key: 'reference', label: 'Reference' },
  { key: 'client', label: 'Client' },
  { key: 'status', label: 'Status' },
]

const rows = [
  { id: 1, reference: 'INV-1042', client: 'Northwind Supply', status: 'paid' },
  { id: 2, reference: 'INV-1043', client: 'Bluepeak Studio', status: 'pending' },
  { id: 3, reference: 'INV-1044', client: 'Harbour Logistics', status: 'overdue' },
]

const variantFor = { paid: 'success', pending: 'warning', overdue: 'danger' }
</script>

# IBadge

A small label for status. Colour lives in the dot rather than the surface, so a column of them stays readable.

<Demo>
<template #demo>
<IBadge variant="success" dot>Paid</IBadge>
<IBadge dot>Draft</IBadge>
<IBadge variant="warning" dot>Pending</IBadge>
<IBadge variant="danger" dot>Overdue</IBadge>
<IBadge variant="info" dot>Scheduled</IBadge>
</template>

```vue
<IBadge variant="success" dot>Paid</IBadge>
<IBadge dot>Draft</IBadge>
<IBadge variant="warning" dot>Pending</IBadge>
<IBadge variant="danger" dot>Overdue</IBadge>
<IBadge variant="info" dot>Scheduled</IBadge>
```
</Demo>

## Without a dot

Drop `dot` and the badge is a plain label. Use it when the text already carries the meaning and there is no state to signal.

<Demo>
<template #demo>
<IBadge>Archived</IBadge>
<IBadge variant="success">Verified</IBadge>
<IBadge variant="info">Beta</IBadge>
</template>

```vue
<IBadge>Archived</IBadge>
<IBadge variant="success">Verified</IBadge>
<IBadge variant="info">Beta</IBadge>
```
</Demo>

## Sizes

<Demo>
<template #demo>
<IBadge size="sm" dot>Small</IBadge>
<IBadge size="md" dot>Medium</IBadge>
<IBadge size="lg" dot>Large</IBadge>
</template>

```vue
<IBadge size="sm" dot>Small</IBadge>
<IBadge size="md" dot>Medium</IBadge>
<IBadge size="lg" dot>Large</IBadge>
```
</Demo>

## In a table

One badge per row, scanned down a column.

<Demo stack>
<template #demo>
<ITable :columns="columns" :rows="rows" class="w-full">
<template #cell-status="{ row }">
<IBadge :variant="variantFor[row.status]" dot>{{ row.status }}</IBadge>
</template>
</ITable>
</template>

```vue
<ITable :columns="columns" :rows="rows">
  <template #cell-status="{ row }">
    <IBadge :variant="variantFor[row.status]" dot>
      {{ row.status }}
    </IBadge>
  </template>
</ITable>
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'neutral' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'neutral'` | Tints the dot, never the surface |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge scale |
| `dot` | `boolean` | `false` | Shows the status dot |
| `label` | `string` | — | Text, as an alternative to the default slot |
| `as` | `string` | `'span'` | Element to render |
| `asChild` | `boolean` | `false` | Render the child instead, forwarding props |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, dot? }` | — | Per-slot class overrides |

For a message with a body rather than a one-word status, use [`IAlert`](/components/alert).
