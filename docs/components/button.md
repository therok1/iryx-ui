<script setup lang="ts">
import { withBase } from 'vitepress'
</script>

# Button

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
</template>

```vue
<IButton block>Continue</IButton>

<IButton square aria-label="Settings">
  <SettingsIcon />
</IButton>
```
</Demo>

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

`class` is merged rather than concatenated, so a conflicting utility wins instead of fighting:

<Demo>
<template #demo>
<IButton class="rounded-full">Pill button</IButton>
<IButton variant="outline" class="border-dashed">Dashed</IButton>
</template>

```vue
<IButton class="rounded-full">
  Pill button
</IButton>
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

For an icon *beside* a label rather than alone, mark the icon with `data-icon="inline-start"` or `data-icon="inline-end"` — the padding then tightens on that side, instead of using `square`.
