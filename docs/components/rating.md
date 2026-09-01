---
eyebrow: Forms
---

<script setup lang="ts">
import { FavouriteIcon } from '@hugeicons/core-free-icons'
import { ref } from 'vue'

const score = ref(3)
</script>

# IRating

A score out of five, read or set. Read-only by default — most ratings on a page are being shown, not collected.

<Demo stack>
<template #demo>
<div class="flex w-full flex-col items-center gap-4">
<IRating :model-value="4" />
<IRating :model-value="3.7" show-value />
<IRating :model-value="4.5" size="lg" show-value />
</div>
</template>

```vue
<IRating :model-value="4" />
<IRating :model-value="3.7" show-value />
<IRating :model-value="4.5" size="lg" show-value />
```
</Demo>

## Fractions are painted, not rounded

A score of 3.7 fills seven tenths of the fourth star. The filled icon is layered over the empty one and clipped, so a partial star is the same shape cut short rather than a second icon that has to line up with the first — which is what makes any icon work, not just a star.

```vue
<IRating :model-value="3.7" />
```

## Collecting one

`interactive` lets the reader set the value. It is one tab stop, not five: arrow keys move by a step, <IKbd>Home</IKbd> and <IKbd>End</IKbd> go to the ends, and a click sets the value directly.

<Demo stack>
<template #demo>
<div class="flex w-full flex-col items-center gap-3">
<IRating v-model="score" interactive size="lg" label="Rate this reply" />
<span class="text-sm text-muted-foreground">Chosen: {{ score }}</span>
</div>
</template>

```vue
<IRating v-model="score" interactive label="Rate this reply" />
```
</Demo>

### Half stars

`step` is the smallest amount the reader can choose. Display is continuous either way.

```vue
<IRating v-model="score" interactive :step="0.5" />
```

## Another icon

Any Hugeicons export, or any component that renders an SVG. The fill colour comes from `ui.fill`, so a heart can be red without touching the rest.

<Demo stack>
<template #demo>
<IRating :model-value="4" :icon="FavouriteIcon" :ui="{ fill: 'text-danger' }" />
</template>

```vue
<script setup lang="ts">
import { FavouriteIcon } from '@hugeicons/core-free-icons'
</script>

<template>
  <IRating :model-value="4" :icon="FavouriteIcon" :ui="{ fill: 'text-danger' }" />
</template>
```
</Demo>

## Accessibility

The two modes announce differently, because they are different things.

Read-only, the row is one image with a text alternative: a screen reader hears "Overall rating: 4 out of 5", not five icons in a row. Interactive, it is a `slider` — one value between a minimum and a maximum, which is what the reader is actually setting, and the role brings the arrow keys they already expect.

Either way it needs a name. `label` is that name, and the default of "Rating" is only right when the page has one.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number` | `0` | The score. Clamped to the range |
| `max` | `number` | `5` | How many icons |
| `interactive` | `boolean` | `false` | Let the reader set it |
| `step` | `number` | `1` | Smallest amount the reader can choose |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Icon size |
| `disabled` | `boolean` | `false` | Dim it and ignore input |
| `icon` | `IconLike` | `StarIcon` | The icon to repeat |
| `label` | `string` | `'Rating'` | Accessible name |
| `showValue` | `boolean` | `false` | Print the score beside the icons |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, items?, item?, empty?, fill?, label? }` | — | Per-element class overrides |
