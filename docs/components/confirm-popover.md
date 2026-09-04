---
eyebrow: Overlays
---

<script setup lang="ts">
import { useToast } from 'iryx-ui'
import { Delete02Icon, PinIcon } from '@hugeicons/core-free-icons'
import { ref } from 'vue'

const toast = useToast()

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
]

const seed = [
  { id: 1, name: 'Avery Lindqvist', role: 'Owner' },
  { id: 2, name: 'Rowan Adeyemi', role: 'Editor' },
  { id: 3, name: 'Mika Sørensen', role: 'Viewer' },
]

const rows = ref([...seed])

function deleteRow(id: number) {
  rows.value = rows.value.filter(row => row.id !== id)
  toast.success('Row deleted')
}
</script>

# IConfirmPopover

A yes/no question anchored to whatever opened it — for confirmations that don't warrant a modal.

Unlike [`IConfirmDialog`](/components/confirm-dialog), there is no backdrop: the page behind remains interactive and keeps its place in the screen reader's reading order. Use the dialog when the action is significant enough to warrant stopping the user first.

<Demo>
<template #demo>
<IConfirmPopover
  title="Remove this tag?"
  danger
  confirm-label="Remove"
  @confirm="toast.success('Tag removed')"
>
<template #trigger>
<IButton variant="outline" size="sm">Backend</IButton>
</template>
</IConfirmPopover>
</template>

```vue
<IConfirmPopover
  title="Remove this tag?"
  danger
  confirm-label="Remove"
  @confirm="removeTag"
>
  <template #trigger>
    <IButton variant="outline" size="sm">Backend</IButton>
  </template>
</IConfirmPopover>
```
</Demo>

## Description

A second line of detail goes under the question.

<Demo>
<template #demo>
<IConfirmPopover
  title="Unpin this post?"
  description="It moves back into the regular feed order."
  confirm-label="Unpin"
  @confirm="toast.success('Post unpinned')"
>
<template #trigger>
<IButton variant="ghost" size="sm" square aria-label="Unpin post">
<IIcon :icon="PinIcon" data-icon />
</IButton>
</template>
</IConfirmPopover>
</template>

```vue
<IConfirmPopover
  title="Unpin this post?"
  description="It moves back into the regular feed order."
  confirm-label="Unpin"
  @confirm="unpin"
>
  <template #trigger>
    <IButton variant="ghost" size="sm" square aria-label="Unpin post">
      <IIcon :icon="PinIcon" data-icon />
    </IButton>
  </template>
</IConfirmPopover>
```
</Demo>

## In a table row

The common case: a per-row delete action too frequent and too low-stakes to interrupt the whole page for.

<Demo stack>
<template #demo>
<ICard padding="none" class="w-full overflow-hidden">
<ITable :columns="columns" :rows="rows" row-key="id" empty-text="Every row is gone.">
<template #row-actions="{ row }">
<IConfirmPopover
  title="Delete this row?"
  :description="`${row.name} loses access immediately.`"
  danger
  confirm-label="Delete"
  side="left"
  @confirm="deleteRow(row.id)"
>
<template #trigger>
<IButton variant="ghost" size="sm" square :aria-label="`Delete ${row.name}`">
<IIcon :icon="Delete02Icon" data-icon />
</IButton>
</template>
</IConfirmPopover>
</template>
</ITable>
</ICard>
<IButton v-if="!rows.length" size="sm" variant="outline" @click="rows = [...seed]">Restore rows</IButton>
</template>

```vue
<ITable :columns="columns" :rows="rows" row-key="id">
  <template #row-actions="{ row }">
    <IConfirmPopover
      title="Delete this row?"
      :description="`${row.name} loses access immediately.`"
      danger
      confirm-label="Delete"
      side="left"
      @confirm="deleteRow(row.id)"
    >
      <template #trigger>
        <IButton variant="ghost" size="sm" square :aria-label="`Delete ${row.name}`">
          <IIcon :icon="Delete02Icon" data-icon />
        </IButton>
      </template>
    </IConfirmPopover>
  </template>
</ITable>
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | The question |
| `description` | `string` | — | Secondary detail under the question |
| `confirmLabel` | `string` | `'Confirm'` | Text for the confirming button |
| `cancelLabel` | `string` | `'Cancel'` | Text for the dismissing button |
| `danger` | `boolean` | — | Style the confirming button as destructive |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Which side of the trigger the panel opens on |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment along that side |
| `sideOffset` | `number` | `6` | Gap between the trigger and the panel |
| `arrow` | `boolean` | `true` | Render the little pointer against the trigger |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ content?, title?, description?, actions?, cancel?, confirm? }` | — | Per-element class overrides |

## Events

| Event | Payload | When |
| --- | --- | --- |
| `confirm` | — | The confirming button was clicked |
| `cancel` | — | The cancelling button was clicked |

## Slots

| Slot | When to use it |
| --- | --- |
| `trigger` | The element that opens the panel — required |
| `description` | The detail line needs markup |
