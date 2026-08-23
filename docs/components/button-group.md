---
eyebrow: Actions
---

<script setup lang="ts">
const sendOptions = [
  { label: 'Send now', onSelect: () => {} },
  { label: 'Schedule…', onSelect: () => {} },
  { label: 'Send a test copy', onSelect: () => {} },
]
</script>

# IButtonGroup

Joins buttons into one control. The children keep their own props; the group handles the seams and hands down a `size`.

<Demo>
<template #demo>
<IButtonGroup>
<IButton variant="outline">Day</IButton>
<IButton variant="outline">Week</IButton>
<IButton variant="outline">Month</IButton>
</IButtonGroup>
</template>

```vue
<IButtonGroup>
  <IButton variant="outline">Day</IButton>
  <IButton variant="outline">Week</IButton>
  <IButton variant="outline">Month</IButton>
</IButtonGroup>
```
</Demo>

A button group is layout. For a choice *between* options, use [`ITabs`](/components/tabs), [`IToggleGroup`](/components/toggle-group) or [`IRadioGroup`](/components/radio-group) — each has a model and the keyboard behaviour that goes with one.

## One size for the group

`size` is inherited by every child that does not set its own.

<Demo stack>
<template #demo>
<IButtonGroup size="sm">
<IButton variant="outline">Small</IButton>
<IButton variant="outline">Group</IButton>
</IButtonGroup>
<IButtonGroup size="lg">
<IButton variant="outline">Large</IButton>
<IButton variant="outline">Group</IButton>
</IButtonGroup>
</template>

```vue
<IButtonGroup size="sm">
  <IButton variant="outline">Small</IButton>
  <IButton variant="outline">Group</IButton>
</IButtonGroup>

<IButtonGroup size="lg">
  <IButton variant="outline">Large</IButton>
  <IButton variant="outline">Group</IButton>
</IButtonGroup>
```
</Demo>

## Split buttons

The common shape: a primary action with a menu beside it.

<Demo>
<template #demo>
<IButtonGroup>
<IButton>Send invoice</IButton>
<IDropdownMenu :items="sendOptions" align="end">
<template #trigger>
<IButton square aria-label="More send options">
<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
</IButton>
</template>
</IDropdownMenu>
</IButtonGroup>
</template>

```vue
<IButtonGroup>
  <IButton>Send invoice</IButton>
  <IDropdownMenu :items="sendOptions" align="end">
    <template #trigger>
      <IButton square aria-label="More send options">
        <ChevronDownIcon />
      </IButton>
    </template>
  </IDropdownMenu>
</IButtonGroup>
```
</Demo>

## Vertical

<Demo>
<template #demo>
<IButtonGroup orientation="vertical">
<IButton variant="outline">Duplicate</IButton>
<IButton variant="outline">Archive</IButton>
<IButton variant="outline">Delete</IButton>
</IButtonGroup>
</template>

```vue
<IButtonGroup orientation="vertical">
  <IButton variant="outline">Duplicate</IButton>
  <IButton variant="outline">Archive</IButton>
  <IButton variant="outline">Delete</IButton>
</IButtonGroup>
```
</Demo>

## Filling the width

<Demo stack>
<template #demo>
<IButtonGroup block class="w-full max-w-md">
<IButton variant="outline">Cancel</IButton>
<IButton>Confirm</IButton>
</IButtonGroup>
</template>

```vue
<IButtonGroup block>
  <IButton variant="outline">Cancel</IButton>
  <IButton>Confirm</IButton>
</IButtonGroup>
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction the buttons join along |
| `size` | `ButtonSize` | — | Inherited by children that don't set their own |
| `block` | `boolean` | `false` | Fills the container width |
| `as` | `string` | `'div'` | Element to render |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |

Give the buttons in a group the same `variant`, apart from the split-button pairing above.
