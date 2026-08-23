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
<p class="text-xs text-muted-foreground">{{ picked ? `You chose: ${picked}` : 'Nothing chosen yet.' }}</p>
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

<IAlert variant="warning" title="An entry with no onSelect and no items is a heading" class="not-prose my-6">
Not a disabled item, and not a broken one: it renders with no hover, no focus and no click. That is deliberate — it is how you write a group label — but it also means forgetting <code>onSelect</code> silently turns an action into a heading. If an item does nothing when you click it, this is why.
</IAlert>

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

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `DropdownMenuEntry[]` | `[]` | The menu contents |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Alignment against the trigger |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side; flips when it will not fit |
| `sideOffset` | `number` | `4` | Distance from the trigger, in px |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ content?, item?, label?, separator?, subTrigger?, subContent? }` | — | Per-slot class overrides |

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

A dropdown menu is for *actions*. For choosing a value, use [`ISelect`](/components/select) — it has a model, the right ARIA roles, and typeahead.
