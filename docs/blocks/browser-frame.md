---
eyebrow: Marketing
---

# IBrowserFrame

Browser chrome around a screenshot. A flat image of an interface reads as a picture; the same image behind a window bar reads as a running product.

```vue
<IBrowserFrame url="app.example/invoices" :ratio="16 / 10">
  <img src="/shot.png" alt="The invoice list">
</IBrowserFrame>
```

<Demo stack>
<template #demo>
<IBrowserFrame url="app.example/invoices" :ratio="16 / 10" class="w-full">
<div class="grid h-full w-full place-items-center bg-muted">
<span class="text-sm text-muted-foreground">Product screenshot</span>
</div>
</IBrowserFrame>
</template>

```vue
<IBrowserFrame url="app.example/invoices" :ratio="16 / 10">
  <img src="/shot.png" alt="The invoice list">
</IBrowserFrame>
```
</Demo>

The `url` is decorative — nothing is fetched from it. Use it for the product's own address.

## Accessibility

The chrome is decoration: the dots are empty and carry no accessible name. The `url` is real text, though, so it is announced — keep it short, and do not put anything there a screen reader would be worse off hearing.

The description of the screenshot belongs on the content, not the frame. Give the image `alt` text saying what the interface shows. `alt=""` is right only when the surrounding copy already says the same thing and the image adds nothing — a hero's product shot under a heading that describes it is the usual case.

## Reserving the box

Pass `ratio` when the content needs a predictable shape before it has loaded, such as an image. It holds the box at a fixed shape whatever the width, which prevents layout shift when the content finally arrives. Internally it is an [`IAspectRatio`](/components/aspect-ratio).

Leave `ratio` out when the content sizes itself — a table, a rendered UI, anything with its own height.

```vue
<IBrowserFrame url="app.example">
  <ITable :columns="columns" :rows="rows" />
</IBrowserFrame>
```

## Shadow

The frame lifts off the page by default, which is what separates it from a hero's backdrop. Drop it to `none` on a surface that already has depth.

| `shadow` | Use |
| --- | --- |
| `none` | When the surrounding surface already has depth |
| `sm` / `md` | On a flat section |
| `lg` | A prominent product shot, such as under a hero (default) |

## In a hero

The hero's `media` region is full width. When you constrain the frame with `max-w-*`, add `mx-auto` to centre it:

```vue
<IHero heading="Invoicing that chases the money for you">
  <template #media>
    <IBrowserFrame url="app.example/invoices" :ratio="16 / 10" class="mx-auto max-w-4xl">
      <img src="/shot.png" alt="">
    </IBrowserFrame>
  </template>
</IHero>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `url` | `string` | — | Decorative address in the bar |
| `ratio` | `number` | — | Hold the body at a fixed ratio, e.g. `16 / 10` |
| `shadow` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'lg'` | Lift off the page |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, bar?, dot?, url?, body? }` | — | Per-element class overrides |

## Slots

| Slot | Description |
| --- | --- |
| `default` | What sits behind the chrome |
