---
eyebrow: Data display
---

# IKbd

A keyboard shortcut, drawn as one chip per key.

<Demo stack>
<template #demo>
<div class="flex flex-wrap items-center gap-4">
<IKbd keys="mod+k" />
<IKbd keys="mod+shift+p" />
<IKbd keys="escape" />
<IKbd :keys="['g', 'i']" />
</div>
</template>

```vue
<IKbd keys="mod+k" />
<IKbd keys="mod+shift+p" />
<IKbd keys="escape" />
<IKbd :keys="['g', 'i']" />
```
</Demo>

Display only: it shows what to press and binds nothing.

## The `mod` key

`mod` renders as **⌘** on Apple platforms and **Ctrl** everywhere else. It is the same vocabulary `matchesHotkey` reads, so one string can drive both what you bind and what you show:

```ts
// bound
if (matchesHotkey(event, 'mod+k'))
  open()
```

```vue
<!-- shown -->
<IKbd keys="mod+k" />
```

The platform is resolved after mount, so server-rendered markup shows `Ctrl` until the component hydrates.

## Keys it knows

Modifiers: `mod`, `meta`, `cmd`, `ctrl`, `shift`, `alt` / `option`.

Named keys: `enter`, `escape`, `backspace`, `delete`, `tab`, `space`, `capslock`, `pageup`, `pagedown`, `home`, `end`, and the arrows as either `up` or `arrowup`.

Anything else prints as given, with a lone character capitalised.

<Demo stack>
<template #demo>
<div class="flex flex-wrap items-center gap-3">
<IKbd keys="enter" />
<IKbd keys="backspace" />
<IKbd keys="tab" />
<IKbd keys="arrowup" />
<IKbd keys="pagedown" />
<IKbd keys="F12" />
</div>
</template>

```vue
<IKbd keys="enter" />
<IKbd keys="backspace" />
<IKbd keys="tab" />
<IKbd keys="arrowup" />
<IKbd keys="pagedown" />
<IKbd keys="F12" />
```
</Demo>

## Joined

`joined` puts a `+` between the chips, for a combination that needs spelling out.

<Demo stack>
<template #demo>
<div class="flex flex-wrap items-center gap-4">
<IKbd keys="mod+shift+k" />
<IKbd keys="mod+shift+k" joined />
</div>
</template>

```vue
<IKbd keys="mod+shift+k" />
<IKbd keys="mod+shift+k" joined />
```
</Demo>

## Sizes

<Demo stack>
<template #demo>
<div class="flex flex-wrap items-center gap-4">
<IKbd keys="mod+k" size="xs" />
<IKbd keys="mod+k" size="sm" />
<IKbd keys="mod+k" size="md" />
</div>
</template>

```vue
<IKbd keys="mod+k" size="xs" />
<IKbd keys="mod+k" size="sm" />
<IKbd keys="mod+k" size="md" />
```
</Demo>

## In context

[`ICommandPalette`](/components/command-palette) renders its items' shortcuts with this component, so palette rows and chips beside a button match.

<Demo stack>
<template #demo>
<div class="flex flex-wrap items-center gap-3">
<IButton variant="outline" size="sm">
Search
<IKbd keys="mod+k" size="xs" class="ms-1" />
</IButton>
<span class="text-sm text-muted-foreground">Press <IKbd keys="escape" size="xs" /> to close</span>
</div>
</template>

```vue
<IButton variant="outline" size="sm">
  Search
  <IKbd keys="mod+k" size="xs" class="ms-1" />
</IButton>

<span>Press <IKbd keys="escape" size="xs" /> to close</span>
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `keys` | `string \| string[]` | `[]` | `'mod+k'`, or `['mod', 'k']` |
| `size` | `'xs' \| 'sm' \| 'md'` | `'sm'` | |
| `joined` | `boolean` | `false` | Draw a `+` between chips |
| `ariaLabel` | `string` | the spoken combination | Overrides the spoken name |
| `unstyled` | `boolean` | — | Skip built-in classes |
| `ui` | `{ root?, key?, separator? }` | — | Per-slot class overrides |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `key` | `{ item }` | Replaces a chip's contents |

## Helpers

`parseHotkey(keys, isApple)` and `useApplePlatform()` are exported for building your own shortcut UI.

## Accessibility

The chips are hidden from assistive technology and the group carries the spoken form instead: `mod+shift+k` announces as "Command Shift K" on a Mac and "Control Shift K" elsewhere. Override it with `ariaLabel`.

When the shortcut belongs to a specific control, put `aria-keyshortcuts` on that control as well.
