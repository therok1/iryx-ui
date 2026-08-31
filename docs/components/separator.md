---
eyebrow: Layout & structure
---

# ISeparator

A rule between groups of content, horizontal or vertical, with an optional label sitting in the line.

<Demo stack>
<template #demo>
<div class="w-full max-w-md">
<p class="text-sm text-muted-foreground">Invoice details</p>
<ISeparator class="my-4" />
<p class="text-sm text-muted-foreground">Payment terms</p>
</div>
</template>

```vue
<p>Invoice details</p>
<ISeparator class="my-4" />
<p>Payment terms</p>
```
</Demo>

## With a label

The label sits in the rule rather than above it.

<Demo stack>
<template #demo>
<ISeparator label="or" class="w-full max-w-md" />
<ISeparator label="Payment terms" class="w-full max-w-md" />
</template>

```vue
<ISeparator label="or" />
<ISeparator label="Payment terms" />
```
</Demo>

## Vertical

A vertical separator takes its height from its container, so give the container one.

<Demo>
<template #demo>
<div class="flex h-6 items-center gap-3 text-sm text-muted-foreground">
<span>Draft</span>
<ISeparator orientation="vertical" />
<span>Sent</span>
<ISeparator orientation="vertical" />
<span>Paid</span>
</div>
</template>

```vue
<div class="flex h-6 items-center gap-3">
  <span>Draft</span>
  <ISeparator orientation="vertical" />
  <span>Sent</span>
</div>
```
</Demo>

## Decorative or semantic

Separators are `decorative` by default and hidden from assistive technology. Set `:decorative="false"` when the rule marks a boundary a screen reader should hear about.

```vue
<ISeparator :decorative="false" />
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Rule direction |
| `label` | `string` | — | Text set into the rule |
| `decorative` | `boolean` | `true` | Hides it from assistive technology |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, line?, label? }` | — | Per-element class overrides |

[`ITable`](/components/table) and [`ICard`](/components/card) draw their own rules, so a separator on top of one gives you two lines.
