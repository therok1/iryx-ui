---
eyebrow: Marketing
---

# IHero

The top section of a marketing page: a heading, a description, the calls to action, an optional announcement, and room for a product shot. Behind all of it sits a moving backdrop.

```vue
<IHero
  grid
  heading="Invoicing that chases the money for you"
  description="Send an invoice, watch it land, and let the reminders go out without you."
  note="Free for five invoices a month. No card."
>
  <template #actions>
    <IButton size="lg">Start free</IButton>
    <IButton size="lg" variant="outline">See a sample invoice</IButton>
  </template>

  <template #media>
    <IBrowserFrame url="app.example/invoices" :ratio="16 / 10" class="mx-auto max-w-4xl">
      <img src="/shot.png" alt="">
    </IBrowserFrame>
  </template>
</IHero>
```

The `heading` renders as an `h1`. A page has a single primary heading, so use the hero once per page.

Every region is optional, and each is omitted entirely rather than rendered empty. `heading`, `description` and `note` each have a matching slot; when both are given, the slot wins.

## Backdrop

The wash behind the content is the part that is hard to write by hand: masked pseudo-elements, blurred gradients, and animation slow enough that nobody watches it.

<Demo stack>
<template #demo>
<div class="w-full overflow-hidden rounded-lg border border-border">
<IHero padding="sm" size="md" backdrop="aurora" heading="Aurora" description="Two counter-rotating conic sweeps." />
</div>
</template>

```vue
<IHero backdrop="aurora" heading="Aurora" />
```
</Demo>

| `backdrop` | Effect |
| --- | --- |
| `aurora` | Two counter-rotating conic sweeps in the brand colour (default) |
| `bloom` | Two blurred blobs, drifting |
| `none` | Nothing behind the content |

Conic rather than radial for `aurora`, because a radial glow has no direction — it sits there. A sweep turns, so the colour arrives and leaves.

Both stop under `prefers-reduced-motion`, and both are `aria-hidden`.

The wash is much fainter in light mode on purpose. It reads as light in a room, and a room that is already white has nothing left to light — at the dark appearance's strength the same gradient is a stain on the paper rather than a glow.

## Grid

`grid` adds a faint ruled grid over the backdrop, masked so it fades out in every direction rather than stopping at an edge. It uses the same border token as component borders, so it follows the light and dark themes on its own.

<Demo stack>
<template #demo>
<div class="w-full overflow-hidden rounded-lg border border-border">
<IHero padding="sm" size="md" grid backdrop="bloom" heading="Bloom, with the grid" />
</div>
</template>

```vue
<IHero grid backdrop="bloom" heading="Bloom, with the grid" />
```
</Demo>

## Regions

The props cover the common text-only case; the matching slots replace that content with arbitrary markup.

| Slot | Renders |
| --- | --- |
| `badge` | Above the heading — an announcement, a version, a status |
| `heading` | Replaces the `heading` prop |
| `description` | Replaces the `description` prop |
| `actions` | A row of buttons, wrapped and centred with the rest |
| `note` | Small print under the actions |
| `media` | A screenshot, video or [`IBrowserFrame`](/blocks/browser-frame) |
| `default` | Anything else, after the regions above |

The `media` region is full width. If its child has a `max-w-*`, give the child `mx-auto` too, or it sits flush left.

## Alignment

`center` is the default. `start` left-aligns everything and caps the heading and description so neither runs the full width.

```vue
<IHero align="start" heading="Aligned to the start" />
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `string` | — | Rendered as an `h1` |
| `description` | `string` | — | Paragraph under the heading |
| `note` | `string` | — | Small print under the actions |
| `backdrop` | `'none' \| 'aurora' \| 'bloom'` | `'aurora'` | The moving wash behind the content |
| `grid` | `boolean` | `false` | Ruled grid over the backdrop |
| `align` | `'start' \| 'center'` | `'center'` | Content alignment |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Vertical rhythm |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'xl'` | Container width |
| `as` | `string` | `'section'` | Element to render |
| `unstyled` | `boolean` | — | Drop built-in classes, including the backdrop |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, container?, badge?, heading?, description?, actions?, note?, media? }` | — | Per-element class overrides |

`unstyled` keeps the structure and the slots but drops every built-in class — the backdrop and grid layers included, since those are classes rather than markup of their own. You get the regions and nothing else.

## Reusing the backdrop elsewhere

The layers are plain classes in `theme.css`, so a panel that is not a hero can borrow them — the sign-in page in the [marketing example](https://github.com/therok1/iryx-ui/tree/main/examples/marketing) re-anchors the same aurora to its bottom-left corner:

```css
.panel-treatment .iryx-hero-aurora {
  inset: auto auto -30rem -26rem;
  width: 74rem;
  height: 68rem;
}
```

Put `iryx-hero` on the clipping parent — it sets `position: relative`, `isolation` and `overflow: hidden`, which the layers rely on.
