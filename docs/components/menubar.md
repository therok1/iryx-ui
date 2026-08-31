---
eyebrow: Navigation
---

<script setup lang="ts">
import { ref } from 'vue'

const last = ref('')
const pick = (label: string) => () => (last.value = label)

const menus = [
  {
    label: 'File',
    items: [
      { label: 'New invoice', onSelect: pick('New invoice') },
      { label: 'Open…', onSelect: pick('Open') },
      '-',
      {
        label: 'Export as',
        items: [
          { label: 'PDF', onSelect: pick('Export PDF') },
          { label: 'CSV', onSelect: pick('Export CSV') },
        ],
      },
    ],
  },
  {
    label: 'Edit',
    items: [
      { label: 'Undo', onSelect: pick('Undo') },
      { label: 'Redo', onSelect: pick('Redo') },
      '-',
      { label: 'Delete', danger: true, onSelect: pick('Delete') },
    ],
  },
  {
    label: 'View',
    items: [
      { label: 'Zoom in', onSelect: pick('Zoom in') },
      { label: 'Zoom out', onSelect: pick('Zoom out') },
    ],
  },
]
</script>

# IMenubar

An application menubar — File, Edit, View. Once one menu is open, hovering another swaps to it without a second click.

<Demo stack>
<template #demo>
<IMenubar :menus="menus" />
<p class="text-sm text-muted-foreground">Last action: {{ last || '—' }}</p>
</template>

```vue
<script setup lang="ts">
const menus = [
  {
    label: 'File',
    items: [
      { label: 'New invoice', onSelect: create },
      '-',
      { label: 'Export as', items: [{ label: 'PDF', onSelect: exportPdf }] },
    ],
  },
  { label: 'Edit', items: [{ label: 'Undo', onSelect: undo }] },
]
</script>

<template>
  <IMenubar :menus="menus" />
</template>
```
</Demo>

## When to reach for one

A menubar suits a document-like application with a large set of commands. For a handful of actions on a page, use an [`IToolbar`](/components/toolbar) or a single [`IDropdownMenu`](/components/dropdown-menu).

## Menus and entries

Each menu takes the same entry shape as [`IDropdownMenu`](/components/dropdown-menu): separators, submenus, `danger` and icons all behave the same way.

A menu's `value` identifies it, and falls back to the label.

```ts
const menus = [
  { label: 'File', value: 'file', items: fileItems },
  { label: 'Edit', items: editItems }, //     value is "Edit"
  { label: 'Tools', disabled: true, items: [] }, // present but not openable
]
```

## Controlling which menu is open

`v-model` holds the value of the open menu, or `undefined` when none is.

```vue
<IMenubar v-model="openMenu" :menus="menus" />
```

## Bare

Drops the container so the triggers sit directly on the page — for an app shell that already provides its own bar.

<Demo stack>
<template #demo>
<IMenubar :menus="menus" bare />
</template>

```vue
<IMenubar :menus="menus" bare />
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `menus` | `MenubarMenuOption[]` | `[]` | |
| `modelValue` | `string` | — | Value of the open menu; `v-model` |
| `bare` | `boolean` | `false` | Drop the container |
| `loop` | `boolean` | `false` | Wrap from the last menu back to the first |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | How each panel aligns to its trigger |
| `sideOffset` | `number` | `6` | Gap between panel and trigger |
| `unstyled` | `boolean` | — | Skip built-in classes |
| `ui` | `{ root?, trigger?, content?, item?, label?, separator?, subTrigger?, subContent? }` | — | Per-element class overrides |

### `MenubarMenuOption`

| Field | Type | Description |
| --- | --- | --- |
| `label` | `string` | |
| `value` | `string` | Defaults to the label |
| `disabled` | `boolean` | |
| `items` | `DropdownMenuEntry[]` | The menu's entries |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `trigger` | `{ menu }` | Replaces a trigger's contents |

## Accessibility

The bar is one Tab stop. Arrow keys move between menus, <IKbd keys="enter" size="xs" /> or <IKbd keys="arrowdown" size="xs" /> opens one, and while a menu is open the left and right arrows move to its neighbours. Escape closes and returns focus to the trigger.
