---
eyebrow: Layout & structure
---

<script setup lang="ts">
import { ref } from 'vue'

const sizes = ref<number[]>([])
</script>

# ISplitter

Resizable panes divided by a draggable handle — a list beside a detail view, an editor above a preview.

<Demo>
<template #demo>
<div class="h-56 w-full overflow-hidden rounded-xl border border-border">
<ISplitter :panels="[{ size: 35, minSize: 20 }, { size: 65, minSize: 30 }]">
<template #panel-0>
<div class="grid size-full place-items-center bg-muted/40 text-sm text-muted-foreground">List</div>
</template>
<template #panel-1>
<div class="grid size-full place-items-center text-sm text-muted-foreground">Detail</div>
</template>
</ISplitter>
</div>
</template>

```vue
<ISplitter :panels="[{ size: 35, minSize: 20 }, { size: 65, minSize: 30 }]">
  <template #panel-0>
    <div>List</div>
  </template>
  <template #panel-1>
    <div>Detail</div>
  </template>
</ISplitter>
```
</Demo>

Panels come from the `panels` prop and their content from numbered slots — `#panel-0`, `#panel-1`, and so on. The splitter fills its container, so give that container a height.

## Sizes

Every size is a percentage of the group. `size` is where a panel starts, `minSize` and `maxSize` are how far it can be dragged.

```ts
const panels = [
  { size: 25, minSize: 15, maxSize: 40 },
  { size: 75 },
]
```

Leave `panels` off entirely for two panels split evenly.

## Vertical

<Demo>
<template #demo>
<div class="h-64 w-full overflow-hidden rounded-xl border border-border">
<ISplitter direction="vertical" :panels="[{ size: 60 }, { size: 40, minSize: 15 }]">
<template #panel-0>
<div class="grid size-full place-items-center text-sm text-muted-foreground">Editor</div>
</template>
<template #panel-1>
<div class="grid size-full place-items-center bg-muted/40 text-sm text-muted-foreground">Output</div>
</template>
</ISplitter>
</div>
</template>

```vue
<ISplitter direction="vertical" :panels="[{ size: 60 }, { size: 40, minSize: 15 }]">
  <template #panel-0><Editor /></template>
  <template #panel-1><Output /></template>
</ISplitter>
```
</Demo>

## Three panes

A handle goes between panels, so three panels get two handles.

<Demo>
<template #demo>
<div class="h-48 w-full overflow-hidden rounded-xl border border-border">
<ISplitter :panels="[{ size: 25, minSize: 15 }, { size: 50 }, { size: 25, minSize: 15 }]" @layout="s => (sizes = s)">
<template #panel-0>
<div class="grid size-full place-items-center bg-muted/40 text-sm text-muted-foreground">Nav</div>
</template>
<template #panel-1>
<div class="grid size-full place-items-center text-sm text-muted-foreground">Main</div>
</template>
<template #panel-2>
<div class="grid size-full place-items-center bg-muted/40 text-sm text-muted-foreground">Inspector</div>
</template>
</ISplitter>
</div>
<p class="text-sm text-muted-foreground">Sizes: {{ sizes.map(s => Math.round(s)).join(' / ') || '—' }}</p>
</template>

```vue
<ISplitter
  :panels="[{ size: 25, minSize: 15 }, { size: 50 }, { size: 25, minSize: 15 }]"
  @layout="onLayout"
>
  <template #panel-0><Nav /></template>
  <template #panel-1><Main /></template>
  <template #panel-2><Inspector /></template>
</ISplitter>
```
</Demo>

## Collapsing

`collapsible` lets a panel be dragged shut past its `minSize`; `collapsedSize` is what "shut" means, as a percentage. `0` hides it entirely.

```ts
const panels = [
  { size: 25, minSize: 15, collapsible: true, collapsedSize: 0 },
  { size: 75 },
]
```

## Remembering the arrangement

Give `auto-save-id` a stable key and the layout is stored in `localStorage`, surviving a reload.

```vue
<ISplitter auto-save-id="inbox-layout" :panels="panels" />
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `panels` | `SplitterPanelOption[]` | two even panels | |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | |
| `autoSaveId` | `string` | — | Remember the arrangement under this key |
| `keyboardResizeBy` | `number` | — | Percentage moved per arrow key press |
| `unstyled` | `boolean` | — | Skip built-in classes |
| `ui` | `{ root?, panel?, handle?, rule? }` | — | Per-slot class overrides |

### `SplitterPanelOption`

| Field | Type | Description |
| --- | --- | --- |
| `size` | `number` | Starting size, as a percentage |
| `minSize` | `number` | |
| `maxSize` | `number` | |
| `collapsible` | `boolean` | Allow dragging shut past `minSize` |
| `collapsedSize` | `number` | What "shut" means, as a percentage |
| `id` | `string` | Needed when panels are conditionally rendered |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `layout` | `number[]` | The new sizes, as percentages |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `panel-{n}` | `{ panel, index }` | Content of the nth panel |
| `handle` | — | Replaces the handle's rule |

## Accessibility

The handle is a focusable `separator`, reachable by Tab and moved with the arrow keys; `keyboardResizeBy` sets how far each press goes. Its hit area is padded well beyond the visible rule.
