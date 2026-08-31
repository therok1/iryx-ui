---
eyebrow: Overlays
---

<script setup lang="ts">
import { ref } from 'vue'

const min = ref(0)
const max = ref(1000)
const nickname = ref('')
</script>

# IPopover

A panel anchored to whatever opened it, for content too big for a tooltip and too small for a dialog. Unlike [`ITooltip`](/components/tooltip) it takes focus and can hold interactive content; unlike [`IDialog`](/components/dialog) it leaves the page usable behind it.

<Demo>
<template #demo>
<IPopover aria-label="About this metric">
<template #trigger>
<IButton variant="outline">What is MRR?</IButton>
</template>
<p class="text-sm text-muted-foreground">Monthly recurring revenue — the predictable subscription income for a month, ignoring one-off charges.</p>
</IPopover>
</template>

```vue
<IPopover aria-label="About this metric">
  <template #trigger>
    <IButton variant="outline">What is MRR?</IButton>
  </template>

  <p class="text-sm text-muted-foreground">
    Monthly recurring revenue — the predictable subscription income for a month.
  </p>
</IPopover>
```
</Demo>

## Holding a form

Set `modal` when the panel contains something to fill in: focus is trapped and the page behind goes inert. The default slot receives a `close` function.

<Demo>
<template #demo>
<IPopover modal show-close title="Price range" width="sm">
<template #trigger>
<IButton variant="outline">Price range</IButton>
</template>
<template #default="{ close }">
<div class="grid gap-3">
<div class="flex w-full items-center gap-2">
<INumberInput v-model="min" size="sm" aria-label="Minimum" class="min-w-0 flex-1" />
<span class="shrink-0 text-muted-foreground">–</span>
<INumberInput v-model="max" size="sm" aria-label="Maximum" class="min-w-0 flex-1" />
</div>
<IButton size="sm" block @click="close">Apply</IButton>
</div>
</template>
</IPopover>
</template>

```vue
<IPopover modal show-close title="Price range" width="sm">
  <template #trigger>
    <IButton variant="outline">Price range</IButton>
  </template>

  <template #default="{ close }">
    <div class="grid gap-3">
      <div class="flex w-full items-center gap-2">
        <INumberInput v-model="min" size="sm" aria-label="Minimum" class="min-w-0 flex-1" />
        <span class="shrink-0 text-muted-foreground">–</span>
        <INumberInput v-model="max" size="sm" aria-label="Maximum" class="min-w-0 flex-1" />
      </div>
      <IButton size="sm" block @click="close">Apply</IButton>
    </div>
  </template>
</IPopover>
```
</Demo>

## Placement

`side` and `align` position the panel against its trigger, and `arrow` draws a pointer back to it.

<Demo>
<template #demo>
<div class="flex flex-wrap gap-2">
<IPopover side="top" arrow width="sm" aria-label="Top">
<template #trigger><IButton variant="outline" size="sm">Top</IButton></template>
<p class="text-sm">Above the trigger.</p>
</IPopover>
<IPopover side="right" arrow width="sm" aria-label="Right">
<template #trigger><IButton variant="outline" size="sm">Right</IButton></template>
<p class="text-sm">Beside the trigger.</p>
</IPopover>
<IPopover side="bottom" align="start" arrow width="sm" aria-label="Bottom start">
<template #trigger><IButton variant="outline" size="sm">Bottom start</IButton></template>
<p class="text-sm">Aligned to the trigger's leading edge.</p>
</IPopover>
</div>
</template>

```vue
<IPopover side="top" arrow aria-label="Top">…</IPopover>
<IPopover side="right" arrow aria-label="Right">…</IPopover>
<IPopover side="bottom" align="start" arrow aria-label="Bottom start">…</IPopover>
```
</Demo>

The panel flips to the opposite side rather than running off the viewport, so `side` is a preference.

## Width and padding

The panel has a width by default. Set `width="none"` for content that knows its own size — a colour grid, a menu, an image.

<Demo>
<template #demo>
<IPopover width="none" padding="none" aria-label="Swatches">
<template #trigger>
<IButton variant="outline">Pick a colour</IButton>
</template>
<div class="grid grid-cols-4 gap-1 p-2">
<button v-for="c in ['bg-red-500','bg-orange-500','bg-amber-500','bg-lime-500','bg-emerald-500','bg-cyan-500','bg-blue-500','bg-violet-500']" :key="c" :class="['size-6 rounded-md', c]" :aria-label="c" />
</div>
</IPopover>
</template>

```vue
<IPopover width="none" padding="none" aria-label="Swatches">
  <template #trigger>
    <IButton variant="outline">Pick a colour</IButton>
  </template>

  <div class="grid grid-cols-4 gap-1 p-2">…</div>
</IPopover>
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Two-way via `v-model:open` |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side; flips to stay on screen |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | |
| `sideOffset` | `number` | `6` | Gap between panel and trigger |
| `arrow` | `boolean` | `false` | Draw a pointer back to the trigger |
| `modal` | `boolean` | `false` | Trap focus and make the page inert |
| `showClose` | `boolean` | `false` | Close button in the corner |
| `closeLabel` | `string` | `'Close'` | Names that button |
| `title` | `string` | — | Heading line; the only row inset to clear the close button |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | |
| `width` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | `none` lets the content size itself |
| `ariaLabel` | `string` | — | Names the panel |
| `unstyled` | `boolean` | — | Skip built-in classes |
| `ui` | `{ content?, arrow?, close? }` | — | Per-element class overrides |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `trigger` | — | What opens the popover |
| `title` | — | Replaces the heading line |
| `default` | `{ close }` | The panel's content |

## Accessibility

The panel is a dialog to assistive technology, so name it with `ariaLabel`. Escape closes it and focus returns to the trigger; with `modal`, focus is trapped inside while it is open.

The close button overlaps the panel's own padding, so content still reaches the full width. Only `title` is inset to make room for it.
