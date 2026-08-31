---
eyebrow: Data display
---

<script setup lang="ts">
const team = [
  { name: 'Ana Ruiz' },
  { name: 'Bo Lindqvist' },
  { name: 'Cai Wen' },
  { name: 'Dara Okoye' },
  { name: 'Eli Nakamura' },
  { name: 'Farida Haddad' },
]
</script>

# IAvatar

A person or an organisation, at a glance, with initials when there is no image.

<Demo stack>
<template #demo>
<div class="flex items-center gap-3">
<IAvatar name="Ana Ruiz" />
<IAvatar name="Bo Lindqvist" />
<IAvatar name="Cai Wen" shape="square" />
</div>
</template>

```vue
<IAvatar name="Ana Ruiz" />
<IAvatar name="Bo Lindqvist" />
<IAvatar name="Cai Wen" shape="square" />
```
</Demo>

## Initials

`name` is enough: the first letters of the first and last words are used, so "Ana María Ruiz Vega" gives AV. A single name gives one letter. Pass `initials` to override.

<Demo stack>
<template #demo>
<div class="flex items-center gap-3">
<IAvatar name="Ana Ruiz" />
<IAvatar name="Ana María Ruiz Vega" />
<IAvatar name="Prince" />
<IAvatar name="Ana Ruiz" initials="AZ" />
</div>
</template>

```vue
<IAvatar name="Ana Ruiz" />              <!-- AR -->
<IAvatar name="Ana María Ruiz Vega" />   <!-- AV -->
<IAvatar name="Prince" />                <!-- P  -->
<IAvatar name="Ana Ruiz" initials="AZ" />
```
</Demo>

## With an image

The initials show while the image loads and stay if it fails. Set `delay-ms` to hold them back briefly, so a fast connection goes straight to the photo.

```vue
<IAvatar src="/ana.jpg" name="Ana Ruiz" :delay-ms="400" />
```

`alt` defaults to empty, since an avatar usually sits beside the same person's name. Give it an `alt` when the image is the only mention of who this is.

## Sizes and shapes

Circle for a person, square for a company or a project.

<Demo stack>
<template #demo>
<div class="flex items-center gap-3">
<IAvatar name="Ana Ruiz" size="xs" />
<IAvatar name="Ana Ruiz" size="sm" />
<IAvatar name="Ana Ruiz" size="md" />
<IAvatar name="Ana Ruiz" size="lg" />
<IAvatar name="Ana Ruiz" size="xl" />
</div>
</template>

```vue
<IAvatar name="Ana Ruiz" size="xs" />
<IAvatar name="Ana Ruiz" size="sm" />
<IAvatar name="Ana Ruiz" size="md" />
<IAvatar name="Ana Ruiz" size="lg" />
<IAvatar name="Ana Ruiz" size="xl" />
```
</Demo>

## Status

A presence dot in the corner, ringed in the page background.

<Demo stack>
<template #demo>
<div class="flex items-center gap-3">
<IAvatar name="Ana Ruiz" status="online" />
<IAvatar name="Bo Lindqvist" status="busy" status-label="In a meeting" />
<IAvatar name="Cai Wen" status="away" />
<IAvatar name="Dara Okoye" status="offline" />
</div>
</template>

```vue
<IAvatar name="Ana Ruiz" status="online" />
<IAvatar name="Bo Lindqvist" status="busy" status-label="In a meeting" />
<IAvatar name="Cai Wen" status="away" />
<IAvatar name="Dara Okoye" status="offline" />
```
</Demo>

The dot carries a name, defaulting to the status word. Pass `status-label` for something more specific.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | — | |
| `alt` | `string` | `''` | Leave empty beside a visible name |
| `name` | `string` | — | Drives the initials |
| `initials` | `string` | — | Overrides the derived initials |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | |
| `shape` | `'circle' \| 'square'` | `'circle'` | |
| `status` | `'online' \| 'busy' \| 'away' \| 'offline'` | — | Presence dot |
| `statusLabel` | `string` | the status word | Names that dot |
| `delayMs` | `number` | — | Hold the fallback back while the image loads |
| `unstyled` | `boolean` | — | Skip built-in classes |
| `ui` | `{ root?, image?, fallback?, status? }` | — | Per-element class overrides |

## Slots

| Slot | Description |
| --- | --- |
| `fallback` | Replaces the initials — an icon, say |


See [`IAvatarGroup`](/components/avatar-group) for stacking several of them together.
