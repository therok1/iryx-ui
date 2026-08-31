---
eyebrow: Layout & structure
---

<script setup lang="ts">
const trail = [
  { label: 'Clients', href: '#' },
  { label: 'Northwind Supply', href: '#' },
  { label: 'INV-1042' },
]
</script>

# IPageHeader

The title block at the top of a page: a heading, an optional description, and a right-aligned row of actions. Title and actions share a line from `sm` up and stack below it.

<Demo stack>
<template #demo>
<IPageHeader title="Invoices" description="Everything you have sent this year." class="w-full">
<template #actions>
<IButton size="sm" variant="outline">Export</IButton>
<IButton size="sm">New invoice</IButton>
</template>
</IPageHeader>
</template>

```vue
<IPageHeader title="Invoices" description="Everything you have sent this year.">
  <template #actions>
    <IButton size="sm" variant="outline">Export</IButton>
    <IButton size="sm">New invoice</IButton>
  </template>
</IPageHeader>
```
</Demo>

## With a breadcrumb

The `breadcrumb` slot sits above the title.

<Demo stack>
<template #demo>
<IPageHeader title="INV-1042" description="Sent 2 March · due 14 March" class="w-full">
<template #breadcrumb>
<IBreadcrumb :items="trail" />
</template>
<template #actions>
<IButton size="sm" variant="outline">Duplicate</IButton>
</template>
</IPageHeader>
</template>

```vue
<IPageHeader title="INV-1042" description="Sent 2 March · due 14 March">
  <template #breadcrumb>
    <IBreadcrumb :items="trail" />
  </template>
  <template #actions>
    <IButton size="sm" variant="outline">Duplicate</IButton>
  </template>
</IPageHeader>
```
</Demo>

## Bordered

`bordered` draws a rule under the header, separating it from the content below.

<Demo stack>
<template #demo>
<IPageHeader title="Settings" description="Billing, members and integrations." bordered class="w-full" />
</template>

```vue
<IPageHeader title="Settings" description="Billing, members and integrations." bordered />
```
</Demo>

## Heading level

The title renders as an `<h1>` by default. Drop it to `2` or `3` when the header sits inside a section that already has a heading above it.

<Demo stack>
<template #demo>
<IPageHeader title="Members" description="A section heading, not the page's." :level="2" class="w-full" />
</template>

```vue
<IPageHeader title="Members" description="A section heading, not the page's." :level="2" />
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | The heading text |
| `description` | `string` | — | A line under it |
| `level` | `1 \| 2 \| 3` | `1` | Which heading element the title renders as |
| `bordered` | `boolean` | — | Rule under the header |
| `as` | `string` | `'header'` | Element to render |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, top?, row?, heading?, title?, description?, actions? }` | — | Per-element class overrides |

## Slots

| Slot | When to use it |
| --- | --- |
| `breadcrumb` | Above the title |
| `title` / `description` | Either needs markup — a badge beside the title, say |
| `actions` | The right-aligned action row |

Pair it with [`IContainer`](/components/container) for the measure, inside `IAppShell`'s main region.
