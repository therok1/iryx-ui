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

# IAvatarGroup

A row of avatars overlapped into a stack: who is on a thread, who is assigned to an issue.

<Demo stack>
<template #demo>
<IAvatarGroup :items="team" :max="4" />
</template>

```vue
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

<template>
  <IAvatarGroup :items="team" :max="4" />
</template>
```
</Demo>

`max` closes the stack with a "+n" chip. Without it, every avatar renders.

## Sizes

The overlap scales with the avatar.

<Demo stack>
<template #demo>
<div class="grid gap-3">
<IAvatarGroup :items="team" :max="4" size="xs" />
<IAvatarGroup :items="team" :max="4" size="sm" />
<IAvatarGroup :items="team" :max="4" size="md" />
<IAvatarGroup :items="team" :max="4" size="lg" />
</div>
</template>

```vue
<IAvatarGroup :items="team" :max="4" size="xs" />
<IAvatarGroup :items="team" :max="4" size="sm" />
<IAvatarGroup :items="team" :max="4" size="md" />
<IAvatarGroup :items="team" :max="4" size="lg" />
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `AvatarGroupItem[]` | `[]` | Each takes `IAvatar`'s own props |
| `max` | `number` | — | Cap the stack, counting the rest in a chip |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Applied to every avatar |
| `shape` | `'circle' \| 'square'` | `'circle'` | |
| `unstyled` | `boolean` | — | Skip built-in classes |
| `ui` | `{ root?, item?, overflow? }` | — | Per-slot class overrides |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `overflow` | `{ count }` | Replaces the "+n" chip |

## Accessibility

Each avatar rings itself in the page background so the overlap reads as depth, and earlier avatars paint over later ones. The visible order is the order of `items`.
