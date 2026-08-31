---
eyebrow: Data display
---

<script setup lang="ts">
import { ref } from 'vue'
import { File01Icon, Folder01Icon } from '@hugeicons/core-free-icons'

const selected = ref<string[]>([])
const expanded = ref(['src', 'components'])
const checked = ref<string[]>(['index.ts'])

const files = [
  {
    label: 'src',
    icon: Folder01Icon,
    children: [
      {
        label: 'components',
        icon: Folder01Icon,
        children: [
          { label: 'Button.vue', icon: File01Icon },
          { label: 'Input.vue', icon: File01Icon },
        ],
      },
      { label: 'index.ts', icon: File01Icon },
    ],
  },
  {
    label: 'docs',
    icon: Folder01Icon,
    children: [{ label: 'guide.md', icon: File01Icon }],
  },
  { label: 'README.md', icon: File01Icon },
]

const counted = [
  {
    label: 'src',
    icon: Folder01Icon,
    count: 24,
    children: [
      { label: 'components', icon: Folder01Icon, count: 18 },
      { label: 'composables', icon: Folder01Icon, count: 6 },
      { label: 'index.ts', icon: File01Icon },
    ],
  },
  { label: 'docs', icon: Folder01Icon, count: 9 },
  { label: 'archive', icon: Folder01Icon, count: 0 },
]
</script>

# ITree

A nested list that can be expanded and collapsed — a file browser, a category hierarchy, an org chart.

<Demo>
<template #demo>
<div class="w-full max-w-xs">
<ITree
  v-model="selected"
  v-model:expanded="expanded"
  :items="files"
  aria-label="Project files"
/>
</div>
</template>

```vue
<script setup lang="ts">
const selected = ref<string[]>([])
const expanded = ref(['src', 'components'])

const files = [
  {
    label: 'src',
    icon: FolderIcon,
    children: [
      { label: 'components', icon: FolderIcon, children: [{ label: 'Button.vue', icon: FileIcon }] },
      { label: 'index.ts', icon: FileIcon },
    ],
  },
  { label: 'README.md', icon: FileIcon },
]
</script>

<template>
  <ITree
    v-model="selected"
    v-model:expanded="expanded"
    :items="files"
    aria-label="Project files"
  />
</template>
```
</Demo>

## Values, not objects

Both models are arrays of values: `v-model` holds what is selected, `v-model:expanded` holds what is open. A node's `value` identifies it, falling back to its label — so both models survive a round trip through a URL, a store or a request body.

```ts
const items = [
  { label: 'src', value: 'src-dir', children: srcChildren },
  { label: 'README.md' }, //  value is "README.md"
]
```

## Multiple selection

`multiple` lets several nodes be selected. Add `propagate-select` and choosing a folder chooses everything beneath it.

<Demo>
<template #demo>
<div class="w-full max-w-xs">
<ITree
  v-model="checked"
  :items="files"
  :expanded="['src']"
  multiple
  propagate-select
  aria-label="Files to export"
/>
<p class="mt-3 text-sm text-muted-foreground">Selected: {{ checked.join(', ') || '—' }}</p>
</div>
</template>

```vue
<ITree
  v-model="checked"
  :items="files"
  :expanded="['src']"
  multiple
  propagate-select
  aria-label="Files to export"
/>
```
</Demo>

## Counts

A node's `count` sits against the row's trailing edge, so the numbers line up in a column rather than stepping inward with each level.

<Demo>
<template #demo>
<div class="w-full max-w-xs">
<ITree :items="counted" :expanded="['src']" aria-label="Files by folder" />
</div>
</template>

```vue
<ITree
  :expanded="['src']"
  aria-label="Files by folder"
  :items="[
    {
      label: 'src',
      icon: FolderIcon,
      count: 24,
      children: [
        { label: 'components', icon: FolderIcon, count: 18 },
        { label: 'composables', icon: FolderIcon, count: 6 },
        { label: 'index.ts', icon: FileIcon },
      ],
    },
    { label: 'docs', icon: FolderIcon, count: 9 },
    { label: 'archive', icon: FolderIcon, count: 0 },
  ]"
/>
```
</Demo>

A `count` of `0` still renders.

## Indentation

Depth is padding on the row rather than a nested container, so hover and selection backgrounds span the full width at every level.

`indent` sets how many pixels each level adds, on top of a small fixed inset.

```vue
<ITree :items="files" :indent="24" />
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `TreeItemOption[]` | `[]` | |
| `modelValue` | `string[]` | `[]` | Selected values; `v-model` |
| `expanded` | `string[]` | `[]` | Open values; `v-model:expanded` |
| `multiple` | `boolean` | `false` | |
| `propagateSelect` | `boolean` | `false` | Selecting a parent selects its descendants; needs `multiple` |
| `size` | `'sm' \| 'md'` | `'md'` | |
| `indent` | `number` | `16` | Pixels added per level |
| `disabled` | `boolean` | `false` | |
| `ariaLabel` | `string` | — | Names the tree |
| `unstyled` | `boolean` | — | Skip built-in classes |
| `ui` | `{ root?, item?, expander?, spacer?, icon?, label?, count? }` | — | Per-element class overrides |

### `TreeItemOption`

| Field | Type | Description |
| --- | --- | --- |
| `label` | `string` | |
| `value` | `string` | Defaults to the label |
| `icon` | `IconLike` | |
| `disabled` | `boolean` | |
| `count` | `number` | Shown against the row's trailing edge; `0` still renders |
| `children` | `TreeItemOption[]` | Makes the node expandable |

## Events

| Event | Payload |
| --- | --- |
| `update:modelValue` | `string[]` |
| `update:expanded` | `string[]` |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `item` | `{ item, level, expanded }` | Replaces a row's contents |

## Accessibility

Arrow keys move across the whole tree whatever the nesting: up and down walk the visible rows, right opens a branch, left closes it, and typing jumps to a matching label. A leaf reserves the same space a chevron takes, so the labels stay in one column.

Give the tree a name with `ariaLabel`.
