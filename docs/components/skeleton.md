---
eyebrow: Feedback
---

# ISkeleton

A placeholder in the shape of the content that is coming. Match it to what will land, or the layout jumps when the real thing arrives.

<Demo stack>
<template #demo>
<ISkeleton variant="text" :lines="3" class="w-full max-w-md" />
</template>

```vue
<ISkeleton variant="text" :lines="3" />
```
</Demo>

## Variants

`text` sizes itself to the current line height. `rect` is a block, and `circle` an avatar or icon.

<Demo stack>
<template #demo>
<ISkeleton variant="text" :lines="2" class="w-full max-w-md" />
<ISkeleton variant="rect" class="h-24 w-full max-w-md" />
<ISkeleton variant="circle" class="size-10" />
</template>

```vue
<ISkeleton variant="text" :lines="2" />
<ISkeleton variant="rect" class="h-24 w-full max-w-md" />
<ISkeleton variant="circle" class="size-10" />
```
</Demo>

`rect` and `circle` take their size from `class`.

## Composing a shape

Skeletons are plain boxes; build a shape out of several.

<Demo stack>
<template #demo>
<div class="flex w-full max-w-md gap-3">
<ISkeleton variant="circle" class="size-10 shrink-0" />
<div class="flex min-w-0 flex-1 flex-col gap-2">
<ISkeleton variant="rect" class="h-4 w-32" />
<ISkeleton variant="text" :lines="2" />
</div>
</div>
</template>

```vue
<div class="flex gap-3">
  <ISkeleton variant="circle" class="size-10 shrink-0" />
  <div class="flex flex-1 flex-col gap-2">
    <ISkeleton variant="rect" class="h-4 w-32" />
    <ISkeleton variant="text" :lines="2" />
  </div>
</div>
```
</Demo>

## Announcing the wait

Every skeleton carries `label` as its accessible name, defaulting to `Loading`. Name the thing being waited for when several are on screen at once.

```vue
<ISkeleton :lines="3" label="Loading invoices" />
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'text' \| 'rect' \| 'circle'` | `'rect'` | Placeholder shape |
| `lines` | `number` | `1` | Number of lines, for `text` |
| `label` | `string` | `'Loading'` | Accessible name for the wait |
| `as` | `string` | `'div'` | Element to render |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |

[`ITable`](/components/table) renders its own skeleton rows while loading its first page, then switches to a refresh bar once rows are on screen.
