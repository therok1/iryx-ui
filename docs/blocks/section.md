---
eyebrow: Marketing
---

# ISection

The band a page section sits in. Handles the four things every section on a marketing page repeats — vertical rhythm, an optional tint, an optional top rule, and a centred heading block — so the page itself is left holding only its content.

```vue
<ISection
  id="pricing"
  heading="One price, whatever you invoice"
  description="No percentage of what you bill."
  tone="muted"
  bordered
>
  <div class="grid gap-4 lg:grid-cols-3">
    <ICard v-for="plan in plans" :key="plan.name">…</ICard>
  </div>
</ISection>
```

`ISection` includes an [`IContainer`](/components/container). Put the section's content directly inside it; do not add another container.

That split is the whole layout model: `tone`, `bordered` and `padding` belong to the full-width band, and `size` controls the content container inside it.

## Heading

`eyebrow`, `heading` and `description` are all optional, and each has a matching slot for markup. The heading renders as an `h2` — a page section sits under the page's own `h1`.

<Demo stack>
<template #demo>
<ISection heading="Everything the money side needs" description="Not a general ledger. The part of it that decides whether you get paid this month." padding="sm" eyebrow="Features" />
</template>

```vue
<ISection
  eyebrow="Features"
  heading="Everything the money side needs"
  description="Not a general ledger. The part of it that decides whether you get paid this month."
/>
```
</Demo>

Leave all three out and no heading block renders at all — no empty element, and no gap above the body.

## Alignment

`center` is the default, and caps the heading block at `max-w-2xl` so a description never runs the full width of a wide page. `start` left-aligns it and caps the description alone, so the heading is free to run wider than the line under it.

<Demo stack>
<template #demo>
<div class="flex w-full flex-col gap-6">
<ISection align="start" heading="Aligned to the start" description="For a section whose body is left-aligned too." padding="none" />
<ISection heading="Centred" description="The default." padding="none" />
</div>
</template>

```vue
<ISection align="start" heading="Aligned to the start" />
<ISection heading="Centred" />
```
</Demo>

## Tone and the top rule

`tone="muted"` tints the band so it separates from the sections either side, and `bordered` draws a rule along the top edge. They are separate props because a rule without a tint is a common way to close a page.

<Demo stack>
<template #demo>
<div class="w-full overflow-hidden rounded-lg border border-border">
<ISection padding="sm" heading="Default" />
<ISection padding="sm" tone="muted" bordered heading="Muted, bordered" />
<ISection padding="sm" bordered heading="Bordered only" />
</div>
</template>

```vue
<ISection heading="Default" />
<ISection tone="muted" bordered heading="Muted, bordered" />
<ISection bordered heading="Bordered only" />
```
</Demo>

Alternating `default` and `muted` down a page is what gives a marketing site its banding, and it costs one prop per section rather than a class each time.

## Rhythm

`padding` sets the vertical rhythm through a small scale rather than a raw number. Each step is responsive — `md` is `py-20` on a phone and `py-24` from `sm` — so the rhythm scales down on small screens.

| `padding` | Space |
| --- | --- |
| `none` | None; you take it over |
| `sm` | `py-12 sm:py-16` |
| `md` | `py-20 sm:py-24` (default) |
| `lg` | `py-24 sm:py-32` |

The gap between the heading block and the body is fixed at `mt-12`, and disappears with the heading block.

## Width

`size` goes straight through to the container. A section of prose or an accordion reads better narrowed:

```vue
<ISection size="md" heading="Questions people ask first">
  <IAccordion :items="questions" />
</ISection>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `eyebrow` | `string` | — | Small line above the heading |
| `heading` | `string` | — | Rendered as an `h2` |
| `description` | `string` | — | Paragraph under the heading |
| `tone` | `'default' \| 'muted'` | `'default'` | Tint of the band |
| `bordered` | `boolean` | `false` | Rule along the top edge |
| `align` | `'start' \| 'center'` | `'center'` | Heading block alignment |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Vertical rhythm |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'xl'` | Container width |
| `as` | `string` | `'section'` | Element to render |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, container?, header?, eyebrow?, heading?, description?, body? }` | — | Per-slot class overrides |

The default `section` is the semantic element a page section wants. Reach for `as` when the surrounding document structure needs something else.

## Slots

When both a prop and its matching slot are given, the slot wins.

| Slot | Description |
| --- | --- |
| `default` | The section's body |
| `eyebrow` | Replaces the `eyebrow` prop |
| `heading` | Replaces the `heading` prop |
| `description` | Replaces the `description` prop |
