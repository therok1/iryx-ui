---
eyebrow: Layout & structure
---

# ICard

A panel with an optional header and footer. Two variants, four paddings, and no opinion about what goes inside it.

<Demo stack>
<template #demo>
<ICard title="Invoice INV-1042" description="Northwind Supply · due 14 March" class="w-full max-w-md">
<p class="text-sm text-muted-foreground">Four line items totalling €1,240.00.</p>
<template #footer>
<IButton size="sm">Send</IButton>
<IButton size="sm" variant="outline">Edit</IButton>
</template>
</ICard>
</template>

```vue
<ICard title="Invoice INV-1042" description="Northwind Supply · due 14 March">
  <p>Four line items totalling €1,240.00.</p>

  <template #footer>
    <IButton size="sm">Send</IButton>
    <IButton size="sm" variant="outline">Edit</IButton>
  </template>
</ICard>
```
</Demo>

## Variants

`outline` draws a border on the page background. `soft` fills instead, for a panel that should sit back rather than stand out.

<Demo>
<template #demo>
<ICard class="w-56"><span class="text-sm">Outline</span></ICard>
<ICard variant="soft" class="w-56"><span class="text-sm">Soft</span></ICard>
</template>

```vue
<ICard>Outline</ICard>
<ICard variant="soft">Soft</ICard>
```
</Demo>

## Padding

Use `none` when the content draws its own edges — a table, a list of rows, an image — and pair it with `overflow-hidden` so the corners clip.

<Demo stack>
<template #demo>
<ICard padding="none" class="w-full max-w-md overflow-hidden">
<div class="divide-y divide-border">
<div class="px-4 py-3 text-sm">Design retainer</div>
<div class="px-4 py-3 text-sm">Hosting, March</div>
<div class="px-4 py-3 text-sm">Support hours</div>
</div>
</ICard>
</template>

```vue
<ICard padding="none" class="overflow-hidden">
  <div class="divide-y divide-border">
    <div class="px-4 py-3 text-sm">Design retainer</div>
    <div class="px-4 py-3 text-sm">Hosting, March</div>
    <div class="px-4 py-3 text-sm">Support hours</div>
  </div>
</ICard>
```
</Demo>

An [`ITable`](/components/table) is the other common occupant of a `none` card.

## Header and footer slots

`title` and `description` are shorthands for the header. Use the slots when either needs markup — an action on the right of the title, say.

<Demo stack>
<template #demo>
<ICard class="w-full max-w-md">
<template #header>
<div class="flex items-center justify-between gap-3">
<span class="font-semibold">Usage</span>
<IBadge variant="success" dot>Healthy</IBadge>
</div>
</template>
<IProgress :model-value="62" label="Storage" show-value />
</ICard>
</template>

```vue
<ICard>
  <template #header>
    <div class="flex items-center justify-between gap-3">
      <span class="font-semibold">Usage</span>
      <IBadge variant="success" dot>Healthy</IBadge>
    </div>
  </template>

  <IProgress :model-value="62" label="Storage" show-value />
</ICard>
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'outline' \| 'soft'` | `'outline'` | Bordered or filled |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Inner spacing |
| `title` | `string` | — | Header title, without writing the slot |
| `description` | `string` | — | Header description |
| `as` | `string` | `'div'` | Element to render |
| `asChild` | `boolean` | `false` | Render the child instead, forwarding props |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, header?, title?, description?, body?, footer? }` | — | Per-slot class overrides |

## Slots

| Slot | When to use it |
| --- | --- |
| default | The card body |
| `header` | Replaces `title` / `description` entirely |
| `title` | Keeps the header layout, replaces just the title |
| `description` | Same, for the description |
| `footer` | Actions or a summary along the bottom. Laid out as a row |
