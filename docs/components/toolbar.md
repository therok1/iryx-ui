---
eyebrow: Navigation
---

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowTurnBackwardIcon, ArrowTurnForwardIcon, Copy01Icon, Delete02Icon, PrinterIcon, Scissor01Icon } from '@hugeicons/core-free-icons'

const last = ref('')
const marks = ref(['Bold'])
const pick = (label: string) => () => (last.value = label)

const items = [
  { label: 'Undo', icon: ArrowTurnBackwardIcon, onSelect: pick('Undo') },
  { label: 'Redo', icon: ArrowTurnForwardIcon, onSelect: pick('Redo') },
  '-',
  { label: 'Cut', icon: Scissor01Icon, onSelect: pick('Cut') },
  { label: 'Copy', icon: Copy01Icon, onSelect: pick('Copy') },
  '-',
  { label: 'Delete', icon: Delete02Icon, onSelect: pick('Delete') },
]

const iconItems = [
  { label: 'Undo', icon: ArrowTurnBackwardIcon, iconOnly: true, onSelect: pick('Undo') },
  { label: 'Redo', icon: ArrowTurnForwardIcon, iconOnly: true, onSelect: pick('Redo') },
  '-',
  { label: 'Print', icon: PrinterIcon, iconOnly: true, onSelect: pick('Print') },
]

const formatting = [
  { label: 'Bold' },
  { label: 'Italic' },
  { label: 'Underline' },
]
</script>

# IToolbar

A bar of controls sharing one Tab stop, with arrow keys moving between them.

<Demo stack>
<template #demo>
<IToolbar :items="items" aria-label="Editing" />
<p class="text-sm text-muted-foreground">Last action: {{ last || '—' }}</p>
</template>

```vue
<script setup lang="ts">
const items = [
  { label: 'Undo', icon: UndoIcon, onSelect: undo },
  { label: 'Redo', icon: RedoIcon, onSelect: redo },
  '-',
  { label: 'Cut', icon: ScissorsIcon, onSelect: cut },
  { label: 'Copy', icon: CopyIcon, onSelect: copy },
  '-',
  { label: 'Delete', icon: TrashIcon, onSelect: remove },
]
</script>

<template>
  <IToolbar :items="items" aria-label="Editing" />
</template>
```
</Demo>

## Entries

Three kinds: a button, a link (give it an `href`), and `'-'` for a separator between groups. Each control is a ghost [`IButton`](/components/button).

```ts
const items: ToolbarEntry[] = [
  { label: 'Undo', icon: UndoIcon, onSelect: undo },
  { label: 'Docs', icon: BookIcon, href: '/docs' },
  '-',
  { label: 'Delete', icon: TrashIcon, disabled: true },
]
```

## Icon-only

`iconOnly` hides the label and squares the control, keeping the label as the control's accessible name.

<Demo stack>
<template #demo>
<IToolbar :items="iconItems" aria-label="History" />
</template>

```vue
<IToolbar
  :items="[
    { label: 'Undo', icon: UndoIcon, iconOnly: true, onSelect: undo },
    { label: 'Redo', icon: RedoIcon, iconOnly: true, onSelect: redo },
  ]"
  aria-label="History"
/>
```
</Demo>

## Anything else goes in the slot

Entries cover buttons, links and separators. For a toggle group, a select or a search field, use the default slot. [`IToggleGroup`](/components/toggle-group) brings its own arrow-key handling and nests inside without fighting the toolbar for the same keys.

<Demo stack>
<template #demo>
<IToolbar aria-label="Formatting">
<IToggleGroup v-model="marks" :items="formatting" type="multiple" size="sm" />
<div class="mx-1 h-5 w-px shrink-0 bg-border" />
<IButton variant="ghost" size="sm" @click="last = 'Clear'">Clear</IButton>
</IToolbar>
<p class="text-sm text-muted-foreground">Marks: {{ marks.join(', ') || 'none' }}</p>
</template>

```vue
<IToolbar aria-label="Formatting">
  <IToggleGroup v-model="marks" :items="formatting" type="multiple" size="sm" />
  <div class="mx-1 h-5 w-px shrink-0 bg-border" />
  <IButton variant="ghost" size="sm" @click="clear">Clear</IButton>
</IToolbar>
```
</Demo>

## Vertical

<Demo>
<template #demo>
<IToolbar :items="iconItems" orientation="vertical" aria-label="History" />
</template>

```vue
<IToolbar :items="items" orientation="vertical" aria-label="History" />
```
</Demo>

## Bare

Drops the container so the controls sit directly on the page.

<Demo stack>
<template #demo>
<IToolbar :items="iconItems" bare aria-label="History" />
</template>

```vue
<IToolbar :items="items" bare aria-label="History" />
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `ToolbarEntry[]` | `[]` | Ignored when the default slot is used |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Also decides which arrow keys move focus |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'` | |
| `bare` | `boolean` | `false` | Drop the container |
| `loop` | `boolean` | `false` | Wrap from the last control back to the first |
| `ariaLabel` | `string` | — | Names the bar |
| `unstyled` | `boolean` | — | Skip built-in classes |
| `ui` | `{ root?, button?, separator? }` | — | Per-element class overrides |

### `ToolbarButtonOption`

| Field | Type | Description |
| --- | --- | --- |
| `label` | `string` | |
| `icon` | `IconLike` | |
| `onSelect` | `() => void` | Ignored on a link |
| `href` | `string` | Renders a link instead of a button |
| `disabled` | `boolean` | |
| `iconOnly` | `boolean` | Hide the label, keep it as the name |
| `ariaLabel` | `string` | Overrides that name |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Replaces the generated controls entirely |

## Accessibility

Give the bar a name with `ariaLabel`. It takes a single Tab stop, and arrow keys move between the controls along the axis `orientation` sets. Set `loop` to wrap around at the ends.
