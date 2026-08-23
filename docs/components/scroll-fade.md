---
eyebrow: Layout
---

<script setup lang="ts">
const rows = Array.from({ length: 14 }, (_, i) => `Invoice INV-10${42 - i}`)
const tags = ['Paid', 'Draft', 'Pending', 'Overdue', 'Archived', 'Disputed', 'Refunded', 'Written off', 'On hold', 'Scheduled']
</script>

# IScrollFade

A scroll container that fades the edges it can still scroll past, so a cropped list shows there is more without waiting for a scrollbar.

<Demo stack>
<template #demo>
<IScrollFade class="h-56 w-full max-w-sm p-1">
<ul class="flex flex-col gap-2 text-sm">
<li v-for="row in rows" :key="row" class="rounded-lg border border-border px-3 py-2">{{ row }}</li>
</ul>
</IScrollFade>
</template>

```vue
<IScrollFade class="h-56">
  <ul>
    <li v-for="invoice in invoices" :key="invoice.id">{{ invoice.id }}</li>
  </ul>
</IScrollFade>
```
</Demo>

Scroll it: the top edge stays sharp until something has moved past it, and the bottom fade disappears at the end of the list.

## Horizontal

<Demo stack>
<template #demo>
<IScrollFade orientation="horizontal" class="w-full max-w-sm py-1">
<div class="flex w-max gap-2">
<IBadge v-for="tag in tags" :key="tag" dot>{{ tag }}</IBadge>
</div>
</IScrollFade>
</template>

```vue
<IScrollFade orientation="horizontal">
  <div class="flex w-max gap-2">
    <IBadge v-for="tag in tags" :key="tag">{{ tag }}</IBadge>
  </div>
</IScrollFade>
```
</Demo>

A horizontal strip is where this earns its keep — on a trackpad the scrollbar never appears at all.

## The fade is a mask

The edges are masked rather than covered by a gradient, so the component needs no background colour of its own and works on a card, a coloured panel or an image.

The mask applies to everything the element paints: a border on the component fades at the corners, the scrollbar fades with it, and anything `position: sticky` inside fades too. Put the frame — and any sticky header — on a wrapper instead.

<Demo stack>
<template #demo>
<div class="w-full max-w-sm rounded-xl bg-primary/10 p-4">
<IScrollFade class="h-40">
<ul class="flex flex-col gap-2 text-sm">
<li v-for="row in rows" :key="row">{{ row }}</li>
</ul>
</IScrollFade>
</div>
</template>

```vue
<!-- No background colour is passed, and none is needed -->
<div class="rounded-xl bg-primary/10 p-4">
  <IScrollFade class="h-40">…</IScrollFade>
</div>
```
</Demo>

## Fade length, and fading one edge only

`size` takes any CSS length. `fadeStart` and `fadeEnd` switch an edge off entirely, for when something else already covers it.

<Demo stack>
<template #demo>
<IScrollFade size="4rem" :fade-start="false" class="h-40 w-full max-w-sm p-1">
<ul class="flex flex-col gap-2 text-sm">
<li v-for="row in rows" :key="row">{{ row }}</li>
</ul>
</IScrollFade>
</template>

```vue
<IScrollFade size="4rem" :fade-start="false" class="h-40">…</IScrollFade>
```
</Demo>

## Reacting to the edges

`data-at-start`, `data-at-end` and `data-overflowing` land on the root, so a "scroll for more" hint outside the container needs no script at all. Scroll the list to watch the line under it change.

<Demo stack>
<template #demo>
<div class="edge-demo w-full max-w-sm">
<IScrollFade class="h-40 p-1">
<ul class="flex flex-col gap-2 text-sm">
<li v-for="row in rows" :key="row">{{ row }}</li>
</ul>
</IScrollFade>
<p class="edge-hint mt-3 text-xs text-muted-foreground" />
</div>
</template>

```vue
<div class="edge-demo">
  <IScrollFade class="h-40">
    <ul>…</ul>
  </IScrollFade>
  <p class="edge-hint" />
</div>

<style>
/* Each rule is more specific than the last, so the right one wins. */
.edge-hint::before { content: 'Everything fits'; }
.edge-demo [data-overflowing] + .edge-hint::before { content: 'More below'; }
.edge-demo [data-overflowing][data-at-end] + .edge-hint::before { content: 'You have reached the end'; }
</style>
```
</Demo>

The default slot receives the same three as props, for content that has to react in script rather than in CSS:

```vue
<IScrollFade v-slot="{ atEnd, overflowing }">
  <ul>…</ul>
  <button v-if="overflowing && !atEnd" @click="loadMore()">Load more</button>
</IScrollFade>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Which way it scrolls |
| `size` | `string` | `'2rem'` | Length of the fade, as any CSS length |
| `fadeStart` | `boolean` | `true` | Fade the leading edge |
| `fadeEnd` | `boolean` | `true` | Fade the trailing edge |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes; put the height here |

| Slot prop | Type | |
| --- | --- | --- |
| `atStart` | `boolean` | Nothing has scrolled past the leading edge |
| `atEnd` | `boolean` | Everything is in view |
| `overflowing` | `boolean` | There is anything to scroll at all |

## How the edges are measured

The edges are re-measured on scroll, when the container or its content resizes, and when rows are added or removed — so the fades stay correct through a reflow or a filtered list, with no work on your side.

<style>
.edge-hint::before { content: 'Everything fits'; }
.edge-demo [data-overflowing] + .edge-hint::before { content: 'More below'; }
.edge-demo [data-overflowing][data-at-end] + .edge-hint::before { content: 'You have reached the end'; }
</style>
