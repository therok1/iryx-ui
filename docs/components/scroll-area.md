---
eyebrow: Layout & structure
---

<script setup lang="ts">
const rows = Array.from({ length: 24 }, (_, i) => `Line item ${i + 1}`)
</script>

# IScrollArea

A scroll container with a thin, themed scrollbar in place of the platform's.

Only the bar is replaced. The viewport still scrolls natively, so wheel, trackpad, keyboard and touch behave as the platform intends.

<Demo>
<template #demo>
<IScrollArea class="h-56 w-full max-w-sm rounded-xl border border-border">
<div class="grid gap-2 p-4">
<div v-for="row in rows" :key="row" class="text-sm text-muted-foreground">{{ row }}</div>
</div>
</IScrollArea>
</template>

```vue
<IScrollArea class="h-56 rounded-xl border border-border">
  <div class="grid gap-2 p-4">
    <div v-for="row in rows" :key="row">{{ row }}</div>
  </div>
</IScrollArea>
```
</Demo>

Give the root a height. A scroll area with nothing constraining it has nothing to scroll.

## Compared with IScrollFade

[`IScrollFade`](/components/scroll-fade) keeps the native scrollbar and fades the content edges instead. Use it when a scrollbar would be noise, and `IScrollArea` when the bar should be part of the design.

## When the bars show

`type` decides. `hover` is the quietest and the default; `always` is the most discoverable; `auto` behaves like a native bar, appearing only when there is something to scroll; `scroll` shows them only while scrolling.

<Demo>
<template #demo>
<div class="flex w-full flex-wrap gap-4">
<IScrollArea type="always" class="h-40 w-48 rounded-xl border border-border">
<div class="grid gap-2 p-3">
<div v-for="row in rows.slice(0, 12)" :key="row" class="text-sm text-muted-foreground">{{ row }}</div>
</div>
</IScrollArea>
<IScrollArea type="auto" class="h-40 w-48 rounded-xl border border-border">
<div class="grid gap-2 p-3">
<div v-for="row in rows.slice(0, 12)" :key="row" class="text-sm text-muted-foreground">{{ row }}</div>
</div>
</IScrollArea>
</div>
</template>

```vue
<IScrollArea type="always" class="h-40">…</IScrollArea>
<IScrollArea type="auto" class="h-40">…</IScrollArea>
```
</Demo>

## Both axes

<Demo>
<template #demo>
<IScrollArea type="always" orientation="both" class="h-40 w-full max-w-sm rounded-xl border border-border">
<div class="w-[40rem] p-3">
<div v-for="row in rows.slice(0, 12)" :key="row" class="text-sm whitespace-nowrap text-muted-foreground">{{ row }} — with enough text on this line to run past the right-hand edge</div>
</div>
</IScrollArea>
</template>

```vue
<IScrollArea type="always" orientation="both" class="h-40">
  <div class="w-[40rem] p-3">…</div>
</IScrollArea>
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'auto' \| 'always' \| 'scroll' \| 'hover'` | `'hover'` | When the bars show |
| `orientation` | `'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | Which axes get a bar |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Bar thickness |
| `scrollHideDelay` | `number` | — | How long bars linger, for `scroll` and `hover` |
| `unstyled` | `boolean` | — | Skip built-in classes |
| `ui` | `{ root?, viewport?, scrollbar?, thumb?, corner? }` | — | Per-slot class overrides |

## Accessibility

The scrolling is native, so the keyboard scrolls the viewport, the content stays selectable, and a screen reader treats it as an ordinary scrollable region.
