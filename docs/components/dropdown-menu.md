---
eyebrow: Actions
---

<script setup lang="ts">
import { ref } from 'vue'

const picked = ref('')
const noop = (what) => () => { picked.value = what }

const items = [
  { label: 'Edit', onSelect: noop('Edit') },
  { label: 'Duplicate', onSelect: noop('Duplicate') },
  '-',
  { label: 'Move to', items: [
    { label: 'Drafts', onSelect: noop('Move to Drafts') },
    { label: 'Archive', onSelect: noop('Move to Archive') },
  ] },
  '-',
  { label: 'Delete', danger: true, onSelect: noop('Delete') },
]

const account = [
  { label: 'Account settings', onSelect: noop('Account settings') },
  { label: 'Sign out', danger: true, onSelect: noop('Sign out') },
]

const labelled = [
  { label: 'This entry has no onSelect, so it is a heading' },
  { label: 'Edit', onSelect: noop('Edit') },
  { label: 'Duplicate', onSelect: noop('Duplicate') },
]

const sides = [
  { label: 'First', onSelect: noop('First') },
  { label: 'Second', onSelect: noop('Second') },
  { label: 'Third', onSelect: noop('Third') },
]
</script>

# IDropdownMenu

A menu opened from a button. Entries are data, and their shape decides what they render as — the same rule `ISelect` and `INavigationMenu` follow.

<Demo stack>
<template #demo>
<IDropdownMenu :items="items">
<template #trigger>
<IButton variant="outline">Actions</IButton>
</template>
</IDropdownMenu>
<p class="text-sm text-muted-foreground">{{ picked ? `You chose: ${picked}` : 'Nothing chosen yet.' }}</p>
</template>

```vue
<script setup lang="ts">
const items = [
  { label: 'Edit', onSelect: () => edit() },
  { label: 'Duplicate', onSelect: () => duplicate() },
  '-',
  { label: 'Move to', items: [
    { label: 'Drafts', onSelect: () => moveTo('drafts') },
    { label: 'Archive', onSelect: () => moveTo('archive') },
  ] },
  '-',
  { label: 'Delete', danger: true, onSelect: () => remove() },
]
</script>

<template>
  <IDropdownMenu :items="items">
    <template #trigger>
      <IButton variant="outline">
        Actions
      </IButton>
    </template>
  </IDropdownMenu>
</template>
```
</Demo>

Four shapes, one array, decided in this order:

| The entry | Renders as |
| --- | --- |
| The string `'-'` | A separator |
| Has its own `items` | A submenu |
| Has an `onSelect` | A menu item |
| Has neither | A **group label** |

Group labels are the intended use:

<Demo>
<template #demo>
<IDropdownMenu :items="labelled">
<template #trigger>
<IButton variant="outline">With a heading</IButton>
</template>
</IDropdownMenu>
</template>

```vue
<script setup lang="ts">
const items = [
  // No onSelect and no items: a heading.
  { label: 'Invoice actions' },
  { label: 'Edit', onSelect: () => edit() },
  { label: 'Duplicate', onSelect: () => duplicate() },
]
</script>
```
</Demo>

## Danger items

`danger` colours a destructive entry. It does not confirm anything — pair it with `useConfirm()` when the action cannot be undone.

```ts
const items = [
  { label: 'Archive', onSelect: () => archive() },
  '-',
  {
    label: 'Delete invoice',
    danger: true,
    onSelect: async () => {
      if (await confirm({ title: 'Delete this invoice?' }))
        remove()
    },
  },
]
```

## Placement

`side` and `align` position the menu against its trigger, and `sideOffset` sets the distance. Like the tooltip, `side` is a preference — the menu flips when there is not enough room.

<Demo>
<template #demo>
<IDropdownMenu :items="sides" side="bottom" align="start">
<template #trigger><IButton variant="outline" size="sm">Bottom start</IButton></template>
</IDropdownMenu>
<IDropdownMenu :items="sides" side="bottom" align="end">
<template #trigger><IButton variant="outline" size="sm">Bottom end</IButton></template>
</IDropdownMenu>
<IDropdownMenu :items="sides" side="right" align="start">
<template #trigger><IButton variant="outline" size="sm">Right</IButton></template>
</IDropdownMenu>
</template>

```vue
<IDropdownMenu :items="items" side="bottom" align="end">
  <template #trigger>
    <IButton variant="outline">Actions</IButton>
  </template>
</IDropdownMenu>
```
</Demo>

## Icons

An entry's `icon` takes a Hugeicons icon or any component that renders an SVG.

```ts
import { Delete02Icon, PencilEdit02Icon } from '@hugeicons/core-free-icons'

const items = [
  { label: 'Edit', icon: PencilEdit02Icon, onSelect: () => edit() },
  { label: 'Delete', icon: Delete02Icon, danger: true, onSelect: () => remove() },
]
```

## A header

The `header` slot puts a block above the items — an account's name and address, the current workspace, a plan. It is read, not chosen: it takes no stop in the arrow-key order and typeahead ignores it, which a menu entry used as a label cannot say.

<Demo stack>
<template #demo>
<IDropdownMenu :items="account" align="start" class="min-w-56">
<template #trigger>
<IButton variant="outline" size="sm">Account</IButton>
</template>
<template #header>
<div class="flex items-center gap-2.5">
<IAvatar name="Rae Lindqvist" size="sm" />
<div class="min-w-0">
<p class="truncate text-sm font-medium">Rae Lindqvist</p>
<p class="truncate text-xs text-muted-foreground">rae@northwind.example</p>
</div>
</div>
</template>
</IDropdownMenu>
</template>

```vue
<IDropdownMenu :items="account" class="min-w-56">
  <template #trigger>
    <IButton variant="outline">Account</IButton>
  </template>

  <template #header>
    <div class="flex items-center gap-2.5">
      <IAvatar :name="user.name" size="sm" />
      <div class="min-w-0">
        <p class="truncate text-sm font-medium">{{ user.name }}</p>
        <p class="truncate text-xs text-muted-foreground">{{ user.email }}</p>
      </div>
    </div>
  </template>
</IDropdownMenu>
```
</Demo>

An entry with no `onSelect` renders as a group label, which is the right thing for "Recent files" above a list of them — but wrong for an identity block, which is neither a heading for the items below nor something to act on.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `DropdownMenuEntry[]` | `[]` | The menu contents |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Alignment against the trigger |
| `alignOffset` | `number` | — | Offset from the `start` or `end` alignment options, in px. |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side; flips when it will not fit |
| `sideOffset` | `number` | `4` | Distance from the trigger, in px |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ content?, header?, item?, label?, separator?, subTrigger?, subContent? }` | — | Per-slot class overrides |

```ts
interface DropdownMenuItemOption {
  label: string
  icon?: IconLike
  disabled?: boolean
  danger?: boolean
  onSelect?: () => void
  /** Makes this entry a submenu. */
  items?: DropdownMenuEntry[]
}

type DropdownMenuEntry = DropdownMenuItemOption | '-'
```

## Slots

| Slot | When to use it |
| --- | --- |
| `trigger` | The button that opens the menu. **Required** |
| `header` | A block above the items — an identity, a workspace, a plan |
| default | Replaces the items entirely |

A dropdown menu is for *actions*. For choosing a value, use [`ISelect`](/components/select) — it has a model, the right ARIA roles, and typeahead.
