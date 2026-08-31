---
eyebrow: Overlays
---

# IHoverCard

A preview of what a link points at, shown when the pointer rests on it.

<Demo stack>
<template #demo>
<p class="text-sm text-muted-foreground">
Reviewed by
<IHoverCard>
  <template #trigger>
    <a href="#ihovercard" class="font-medium text-foreground underline decoration-dotted underline-offset-4">Avery Lang</a>
  </template>
  <div class="flex gap-3">
    <IAvatar name="Avery Lang" size="lg" />
    <div class="space-y-1">
      <p class="text-sm font-medium">Avery Lang</p>
      <p class="text-xs text-muted-foreground">Staff engineer, Platform. Reviews everything that touches billing.</p>
    </div>
  </div>
</IHoverCard>
on 12 March.
</p>
</template>

```vue
<IHoverCard>
  <template #trigger>
    <a href="/people/avery">Avery Lang</a>
  </template>

  <div class="flex gap-3">
    <IAvatar name="Avery Lang" size="lg" />
    <div class="space-y-1">
      <p class="text-sm font-medium">Avery Lang</p>
      <p class="text-xs text-muted-foreground">Staff engineer, Platform.</p>
    </div>
  </div>
</IHoverCard>
```
</Demo>

## Which of the three

Three components anchor a panel to something on the page, and they are not interchangeable.

| | Opens on | For |
| --- | --- | --- |
| [`ITooltip`](/components/tooltip) | Hover and focus | A short label naming a control |
| `IHoverCard` | Hover and focus | A preview: rich, and safe to skip |
| [`IPopover`](/components/popover) | Click | Content the reader has to be able to operate |

The line that matters is **whether anything is lost by never seeing it**. A hover card is summoned by hover or focus, so a touch user never gets one — nothing inside it may be the only route to an action or the only copy of a fact. Put a link in it by all means; do not put the *only* link in it.

## Delays

`openDelay` is how long the pointer must rest before the card appears, and `closeDelay` is the grace period after it leaves. The second one is not padding: it is what lets the pointer travel from the trigger onto the card without the card disappearing under it.

<Demo stack>
<template #demo>
<div class="flex flex-wrap items-center gap-6 text-sm">
<IHoverCard :open-delay="0" width="sm">
  <template #trigger>
    <IButton variant="outline" size="sm">Instant</IButton>
  </template>
  <p class="text-sm">Opens the moment the pointer arrives.</p>
</IHoverCard>

<IHoverCard :open-delay="1000" width="sm">
  <template #trigger>
    <IButton variant="outline" size="sm">Patient</IButton>
  </template>
  <p class="text-sm">Waits a second, so a pointer crossing the page is left alone.</p>
</IHoverCard>
</div>
</template>

```vue
<IHoverCard :open-delay="0">…</IHoverCard>
<IHoverCard :open-delay="1000" :close-delay="500">…</IHoverCard>
```
</Demo>

The defaults are 700ms and 300ms. Zero is worth avoiding on anything in a list: every trigger the pointer crosses on its way somewhere else will fire.

## Placement

`side`, `align` and `sideOffset` work as they do on [`IPopover`](/components/popover), and `arrow` draws the pointer against the trigger.

<Demo stack>
<template #demo>
<div class="flex flex-wrap items-center gap-6">
<IHoverCard side="top" arrow width="sm">
  <template #trigger>
    <IButton variant="outline" size="sm">Above, with an arrow</IButton>
  </template>
  <p class="text-sm">Anchored above the trigger.</p>
</IHoverCard>

<IHoverCard side="right" align="start" width="sm">
  <template #trigger>
    <IButton variant="outline" size="sm">To the right</IButton>
  </template>
  <p class="text-sm">Anchored to the right, aligned to the top edge.</p>
</IHoverCard>
</div>
</template>

```vue
<IHoverCard side="top" arrow>…</IHoverCard>
<IHoverCard side="right" align="start">…</IHoverCard>
```
</Demo>

## Size

`width` and `padding` match the popover's, and `width="none"` lets the content size itself — for a preview image, or anything that already knows how wide it is.

<Demo stack>
<template #demo>
<div class="flex flex-wrap items-center gap-6">
<IHoverCard width="lg">
  <template #trigger>
    <IButton variant="outline" size="sm">Wide</IButton>
  </template>
  <p class="text-sm">A wider card, for a paragraph that needs the room.</p>
</IHoverCard>

<IHoverCard width="none" padding="none">
  <template #trigger>
    <IButton variant="outline" size="sm">Sized by its content</IButton>
  </template>
  <div class="flex items-center gap-3 p-3">
    <IAvatar name="Rowan Diaz" />
    <span class="text-sm whitespace-nowrap">Rowan Diaz</span>
  </div>
</IHoverCard>
</div>
</template>

```vue
<IHoverCard width="lg">…</IHoverCard>

<IHoverCard width="none" padding="none">
  <div class="p-3">…</div>
</IHoverCard>
```
</Demo>

## Controlling it

`v-model:open` works if you need the state, though a hover card rarely does — it is the one overlay that manages itself.

```vue
<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <IHoverCard v-model:open="open">
    …
  </IHoverCard>
</template>
```

## Touch

`enableTouch` opens the card on a tap as well. It is off by default and worth leaving off: a tap has no hover before it, so the card ends up competing with whatever the trigger does when tapped — usually following a link. If the content matters on a phone, it belongs on the page rather than behind a gesture.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Controlled open state; use `v-model:open` |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Which side of the trigger to anchor to |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment along that side |
| `sideOffset` | `number` | `6` | Gap between trigger and card, in px |
| `arrow` | `boolean` | `false` | Draw the pointer against the trigger |
| `openDelay` | `number` | `700` | Rest time before opening, in ms |
| `closeDelay` | `number` | `300` | Grace period after leaving, in ms |
| `enableTouch` | `boolean` | `false` | Also open on a tap |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Inset around the content |
| `width` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Card width; `none` sizes to content |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Classes for the card |
| `ui` | `{ content?, arrow? }` | — | Per-element class overrides |

## Slots

| Slot | Description |
| --- | --- |
| `trigger` | What the card hangs off. Rendered as-is — pass a link or a button |
| default | The card's content |
