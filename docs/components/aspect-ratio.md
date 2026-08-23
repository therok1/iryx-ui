---
eyebrow: Layout & structure
---

# IAspectRatio

Holds a box at a fixed ratio whatever its width. Reach for it before the content arrives: an image or an embed that sizes itself shifts everything below it when it finally loads, and a reserved box is what stops the page jumping.

<Demo>
<template #demo>
<div class="w-full max-w-sm">
<IAspectRatio :ratio="16 / 9" class="bg-muted">
<div class="grid size-full place-items-center text-sm text-muted-foreground">16 / 9</div>
</IAspectRatio>
</div>
</template>

```vue
<IAspectRatio :ratio="16 / 9" class="bg-muted">
  <div class="grid size-full place-items-center text-sm text-muted-foreground">
    16 / 9
  </div>
</IAspectRatio>
```
</Demo>

The ratio is width divided by height, given as a number so the arithmetic reads as the ratio it is: `16 / 9`, `4 / 3`, `1`.

## Common ratios

<Demo>
<template #demo>
<div class="grid w-full gap-4 sm:grid-cols-3">
<IAspectRatio :ratio="1" class="bg-muted">
<div class="grid size-full place-items-center text-sm text-muted-foreground">1 / 1</div>
</IAspectRatio>
<IAspectRatio :ratio="4 / 3" class="bg-muted">
<div class="grid size-full place-items-center text-sm text-muted-foreground">4 / 3</div>
</IAspectRatio>
<IAspectRatio :ratio="21 / 9" class="bg-muted">
<div class="grid size-full place-items-center text-sm text-muted-foreground">21 / 9</div>
</IAspectRatio>
</div>
</template>

```vue
<IAspectRatio :ratio="1">…</IAspectRatio>
<IAspectRatio :ratio="4 / 3">…</IAspectRatio>
<IAspectRatio :ratio="21 / 9">…</IAspectRatio>
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `ratio` | `number` | `1` | Width divided by height |
| `unstyled` | `boolean` | — | Drop the clip and radius |

The component sets the geometry, a clip and a radius. Give it a surface of its own through `class`:

```vue
<IAspectRatio :ratio="16 / 9" class="rounded-xl border border-border">
  <img src="/cover.jpg" alt="" class="size-full object-cover">
</IAspectRatio>
```
