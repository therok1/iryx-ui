---
eyebrow: Data display
---

<script setup lang="ts">
import { Invoice01Icon, StarIcon, UserGroupIcon } from '@hugeicons/core-free-icons'
</script>

# IIcon

The icon renderer every other component uses. It takes both shapes an icon comes in — a Hugeicons data array, or any component that renders an SVG — so a single `icon` prop can accept either.

<Demo stack>
<template #demo>
<div class="flex items-center gap-4">
<IIcon :icon="StarIcon" class="size-6" />
<IIcon :icon="Invoice01Icon" class="size-6" />
<IIcon :icon="UserGroupIcon" class="size-6" />
</div>
</template>

```vue
<script setup lang="ts">
import { Invoice01Icon, StarIcon, UserGroupIcon } from '@hugeicons/core-free-icons'
</script>

<template>
  <IIcon :icon="StarIcon" class="size-6" />
  <IIcon :icon="Invoice01Icon" class="size-6" />
  <IIcon :icon="UserGroupIcon" class="size-6" />
</template>
```
</Demo>

You rarely need it directly — every component that takes an `icon` prop renders this internally. Reach for it when you are building your own control and want the same two-shape handling, or when you are writing a component that passes an `IconLike` straight through.

## Why it exists

Hugeicons ships icons as **data arrays**, not components, so `<component :is="icon" />` does not work for them. Most other icon sets ship components, where it does. `IIcon` branches on the shape so callers never have to:

```vue
<!-- a Hugeicons export -->
<IIcon :icon="StarIcon" />

<!-- any component that renders an SVG -->
<IIcon :icon="MyCustomIcon" />
```

That is the same contract as the `IconLike` type, exported alongside it:

```ts
import type { IconLike } from 'iryx-ui'

defineProps<{ icon?: IconLike }>()
```

## Sizing and colour

There is no `size` prop. The icon inherits `currentColor` and takes its dimensions from classes, so it sizes with the type around it:

<Demo stack>
<template #demo>
<div class="flex items-center gap-4 text-[var(--iryx-color-primary-600)]">
<IIcon :icon="StarIcon" class="size-4" />
<IIcon :icon="StarIcon" class="size-6" />
<IIcon :icon="StarIcon" class="size-8" />
</div>
</template>

```vue
<IIcon :icon="StarIcon" class="size-4" />
<IIcon :icon="StarIcon" class="size-6" />
<IIcon :icon="StarIcon" class="size-8" />
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `IconLike` | — | A Hugeicons array, or any component rendering an SVG. Renders nothing when absent |
| `label` | `string` | — | Names the icon for assistive technology. Omit for decorative icons |
| `class` | `string` | — | Applied to the rendered SVG |

## Accessibility

**Icons are decorative by default** and carry `aria-hidden="true"`, because in nearly every case the text beside them already says what they mean — announcing both is a stutter, not a service.

Set `label` only when the icon is the sole carrier of meaning, such as inside a control with no visible text. It swaps the hiding for `role="img"` and an `aria-label`:

```vue
<!-- decorative: the button's text already says it -->
<IButton :icon="Invoice01Icon">New invoice</IButton>

<!-- meaningful: nothing else names this control -->
<button type="button">
  <IIcon :icon="Invoice01Icon" label="New invoice" class="size-5" />
</button>
```

When the icon sits inside a control you own, prefer naming the **control** — `aria-label` on the button — over naming the icon. The label reaches the same place and survives the icon being swapped or removed.
