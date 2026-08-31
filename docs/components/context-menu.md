---
eyebrow: Overlays
---

<script setup lang="ts">
import { ref } from 'vue'
import { Copy01Icon, Delete02Icon, PencilEdit02Icon, Share08Icon } from '@hugeicons/core-free-icons'

const last = ref('')

const items = [
  { label: 'Rename', icon: PencilEdit02Icon, onSelect: () => (last.value = 'Rename') },
  { label: 'Duplicate', icon: Copy01Icon, onSelect: () => (last.value = 'Duplicate') },
  {
    label: 'Share',
    icon: Share08Icon,
    items: [
      { label: 'Copy link', onSelect: () => (last.value = 'Copy link') },
      { label: 'Invite people', onSelect: () => (last.value = 'Invite people') },
    ],
  },
  '-',
  { label: 'Delete', icon: Delete02Icon, danger: true, onSelect: () => (last.value = 'Delete') },
]
</script>

# IContextMenu

The same menu as [`IDropdownMenu`](/components/dropdown-menu), opened by right-click on a region instead of by pressing a trigger.

<Demo>
<template #demo>
<IContextMenu :items="items">
<template #trigger>
<div class="grid h-32 w-full max-w-md place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
Right-click anywhere in here
</div>
</template>
</IContextMenu>
<p class="text-sm text-muted-foreground">Last action: {{ last || '—' }}</p>
</template>

```vue
<script setup lang="ts">
const items = [
  { label: 'Rename', icon: PencilIcon, onSelect: rename },
  { label: 'Duplicate', icon: CopyIcon, onSelect: duplicate },
  '-',
  { label: 'Delete', icon: TrashIcon, danger: true, onSelect: remove },
]
</script>

<template>
  <IContextMenu :items="items">
    <template #trigger>
      <div class="…">
        Right-click anywhere in here
      </div>
    </template>
  </IContextMenu>
</template>
```
</Demo>

## Keep the actions somewhere visible too

A context menu is invisible until it is invoked, so put whatever is in it somewhere visible as well — a row's overflow menu, a toolbar, a details panel.

## Entries

Entries take the same shape as [`IDropdownMenu`](/components/dropdown-menu): a `'-'` renders a separator, an entry with `items` opens a submenu, `danger` styles a destructive action, and an entry with neither `items` nor `onSelect` is a non-interactive group label.

```ts
const items: DropdownMenuEntry[] = [
  { label: 'Rename', icon: PencilIcon, onSelect: rename },
  { label: 'Share', items: [{ label: 'Copy link', onSelect: copy }] },
  '-',
  { label: 'Delete', danger: true, onSelect: remove },
]
```

## Opening is reported, not controlled

There is no `v-model:open` — the menu appears wherever the pointer is. Listen for `update:open` when you need to know it opened.

```vue
<IContextMenu :items="items" @update:open="onOpenChange">…</IContextMenu>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `DropdownMenuEntry[]` | `[]` | |
| `collisionPadding` | `number` | — | Distance kept from the viewport edge |
| `unstyled` | `boolean` | — | Skip built-in classes |
| `ui` | `{ content?, item?, label?, separator?, subTrigger?, subContent? }` | — | Per-element class overrides |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `boolean` | The menu opened or closed |

## Slots

| Slot | Description |
| --- | --- |
| `trigger` | The region that responds to right-click |
| `default` | Replaces the generated entries entirely |

## Accessibility

The menu opens from the keyboard through the platform's context-menu key or <IKbd keys="shift+f10" size="xs" />. Arrow keys move between entries, typing jumps to a matching one, Escape closes, and focus returns to the region afterwards.
