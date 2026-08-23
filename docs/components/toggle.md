---
eyebrow: Forms
---

<script setup lang="ts">
import { ref } from 'vue'

const bold = ref(true)
const italic = ref(false)
const starred = ref(false)
const xs = ref(true)
const sm = ref(true)
const md = ref(true)
const lg = ref(true)
</script>

# IToggle

A button that stays pressed — **bold** in an editor, a filter that is either on or off. For a setting rather than an action, use [`ISwitch`](/components/switch).

<Demo stack>
<template #demo>
<IToggle v-model="starred">
<svg data-icon="inline-start" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" /></svg>
Starred
</IToggle>
</template>

```vue
<script setup lang="ts">
const starred = ref(false)
</script>

<template>
  <IToggle v-model="starred">
    <StarIcon data-icon="inline-start" />
    Starred
  </IToggle>
</template>
```
</Demo>

Content comes from the default slot, as in [`IButton`](/components/button) — an icon, a label, or both. Mark an icon with `data-icon="inline-start"` or `"inline-end"` and the padding tightens on that side.

## Sizes

The heights match [`IButton`](/components/button), so the two line up in a toolbar.

<Demo stack>
<template #demo>
<div class="flex flex-wrap items-center gap-2">
<IToggle v-model="xs" size="xs">Extra small</IToggle>
<IToggle v-model="sm" size="sm">Small</IToggle>
<IToggle v-model="md" size="md">Medium</IToggle>
<IToggle v-model="lg" size="lg">Large</IToggle>
</div>
</template>

```vue
<IToggle v-model="value" size="xs">Extra small</IToggle>
<IToggle v-model="value" size="sm">Small</IToggle>
<IToggle v-model="value" size="md">Medium</IToggle>
<IToggle v-model="value" size="lg">Large</IToggle>
```
</Demo>

## Icon-only

`square` drops the horizontal padding, so the icon needs no `data-icon` mark. With no text to name it, pass an `aria-label`.

<Demo stack>
<template #demo>
<div class="flex items-center gap-1">
<IToggle v-model="bold" square aria-label="Bold">
<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4h7a4 4 0 0 1 0 8H6zM6 12h8a4 4 0 0 1 0 8H6z" /></svg>
</IToggle>
<IToggle v-model="italic" square aria-label="Italic">
<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M19 4h-9M14 20H5M15 4 9 20" /></svg>
</IToggle>
</div>
</template>

```vue
<IToggle v-model="bold" square aria-label="Bold">
  <BoldIcon />
</IToggle>
<IToggle v-model="italic" square aria-label="Italic">
  <ItalicIcon />
</IToggle>
```
</Demo>

## Uncontrolled

Leave `v-model` off and pass `default-value` to let the toggle keep its own state.

```vue
<IToggle default-value>Notifications</IToggle>
```

## Disabled

<Demo stack>
<template #demo>
<div class="flex items-center gap-2">
<IToggle :model-value="true" disabled>Pressed</IToggle>
<IToggle :model-value="false" disabled>Not pressed</IToggle>
</div>
</template>

```vue
<IToggle :model-value="true" disabled>Pressed</IToggle>
<IToggle :model-value="false" disabled>Not pressed</IToggle>
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean \| null` | — | Pressed or not; two-way via `v-model` |
| `defaultValue` | `boolean` | `false` | Starting state when uncontrolled |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Matches `IButton` |
| `square` | `boolean` | `false` | Icon-only; drops the horizontal padding |
| `block` | `boolean` | `false` | Stretch to the container width |
| `disabled` | `boolean` | `false` | |
| `unstyled` | `boolean` | — | Skip built-in classes |

## Events

| Event | Payload |
| --- | --- |
| `update:modelValue` | `boolean` |

## Accessibility

The toggle renders a `<button>` carrying `aria-pressed`, reachable by Tab and operated with Space or Enter. Attributes you set land on that button, so `aria-label` names the control.
