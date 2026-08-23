---
eyebrow: Actions
---

<script setup lang="ts">
import { withBase } from 'vitepress'
</script>

# IButton

The standard action control. Four variants, five sizes, and polymorphic — it can render as an anchor, a router link, or anything else.

<Demo>
<template #demo>
<IButton>Solid</IButton>
<IButton variant="outline">Outline</IButton>
<IButton variant="ghost">Ghost</IButton>
<IButton variant="link">Link</IButton>
</template>

```vue
<IButton>Solid</IButton>
<IButton variant="outline">Outline</IButton>
<IButton variant="ghost">Ghost</IButton>
<IButton variant="link">Link</IButton>
```
</Demo>

## Sizes

<Demo>
<template #demo>
<IButton size="xs">Extra small</IButton>
<IButton size="sm">Small</IButton>
<IButton size="md">Medium</IButton>
<IButton size="lg">Large</IButton>
<IButton size="xl">Extra large</IButton>
</template>

```vue
<IButton size="xs">Extra small</IButton>
<IButton size="sm">Small</IButton>
<IButton size="md">Medium</IButton>
<IButton size="lg">Large</IButton>
<IButton size="xl">Extra large</IButton>
```
</Demo>

## States

`loading` shows a spinner and disables the button. `disabled` does the latter only.

<Demo>
<template #demo>
<IButton loading>Saving</IButton>
<IButton variant="outline" loading>Saving</IButton>
<IButton disabled>Disabled</IButton>
</template>

```vue
<IButton loading>Saving</IButton>
<IButton variant="outline" loading>Saving</IButton>
<IButton disabled>Disabled</IButton>
```
</Demo>

## Block and square

`block` fills the width of its container. `square` drops the horizontal padding for an icon-only button — pair it with an `aria-label`, since there is no text to name it.

<Demo stack>
<template #demo>
<IButton block>Continue</IButton>
<div class="flex justify-center gap-2">
<IButton square aria-label="Settings">
<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></svg>
</IButton>
<IButton square variant="outline" aria-label="Delete">
<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>
</IButton>
<IButton square variant="ghost" aria-label="More">
<svg class="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>
</IButton>
</div>
</template>

```vue
<IButton block>Continue</IButton>

<IButton square aria-label="Settings">
  <SettingsIcon />
</IButton>
<IButton square variant="outline" aria-label="Delete">
  <DeleteIcon />
</IButton>
<IButton square variant="ghost" aria-label="More">
  <MoreIcon />
</IButton>
```
</Demo>

`aria-label` is the only thing naming a `square` button, so give every one of them a label.

## Polymorphic

`as` changes the rendered element; `asChild` renders your own child instead, keeping the styling and passing the props down. Use `asChild` for a `RouterLink`.

<Demo>
<template #demo>
<IButton as="a" :href="withBase('/components/')" variant="outline">A link that looks like a button</IButton>
</template>

```vue
<IButton as="a" href="/pricing">Pricing</IButton>

<IButton as-child>
  <RouterLink to="/pricing">
    Pricing
  </RouterLink>
</IButton>
```
</Demo>

## Overriding styles

`class` is merged with the built-in classes, so a conflicting utility replaces the built-in one rather than sitting beside it:

<Demo>
<template #demo>
<IButton class="rounded-full">Pill button</IButton>
<IButton variant="outline" class="border-dashed">Dashed</IButton>
</template>

```vue
<IButton class="rounded-full">Pill button</IButton>
<IButton variant="outline" class="border-dashed">Dashed</IButton>
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'solid' \| 'outline' \| 'ghost' \| 'link'` | `'solid'` | Visual weight |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Control scale |
| `loading` | `boolean` | `false` | Spinner, and disables the button |
| `disabled` | `boolean` | `false` | Disables without a spinner |
| `block` | `boolean` | `false` | Fills the container width |
| `square` | `boolean` | `false` | Equal padding, for icon-only buttons |
| `as` | `string` | `'button'` | Element to render |
| `asChild` | `boolean` | `false` | Render the child instead, forwarding props |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |

`size` is inherited from an enclosing `IButtonGroup` when it isn't set explicitly.

For an icon beside a label, mark it with `data-icon` and the padding tightens on that side:

```vue
<IButton>
  <SendIcon data-icon="inline-start" />
  Send invoice
</IButton>

<IButton variant="outline">
  Next
  <ArrowRightIcon data-icon="inline-end" />
</IButton>
```
