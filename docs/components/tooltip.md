---
eyebrow: Overlays
---

# ITooltip

A short label for a control that cannot say what it does in the space it has. Opens on hover *and* on keyboard focus, so it is not mouse-only.

<Demo>
<template #demo>
<ITooltip text="Duplicate this invoice">
<template #trigger><IButton variant="outline" square aria-label="Duplicate">⧉</IButton></template>
</ITooltip>
</template>

```vue
<ITooltip text="Duplicate this invoice">
  <template #trigger>
    <IButton variant="outline" square aria-label="Duplicate">
      <CopyIcon />
    </IButton>
  </template>
</ITooltip>
```
</Demo>

An icon-only trigger still needs its own `aria-label`: the tooltip adds to the name rather than supplying it.

## Sides

<Demo>
<template #demo>
<ITooltip text="Above" side="top"><template #trigger><IButton variant="outline" size="sm">Top</IButton></template></ITooltip>
<ITooltip text="To the right" side="right"><template #trigger><IButton variant="outline" size="sm">Right</IButton></template></ITooltip>
<ITooltip text="Below" side="bottom"><template #trigger><IButton variant="outline" size="sm">Bottom</IButton></template></ITooltip>
<ITooltip text="To the left" side="left"><template #trigger><IButton variant="outline" size="sm">Left</IButton></template></ITooltip>
</template>

```vue
<ITooltip text="Above" side="top">…</ITooltip>
<ITooltip text="To the right" side="right">…</ITooltip>
<ITooltip text="Below" side="bottom">…</ITooltip>
<ITooltip text="To the left" side="left">…</ITooltip>
```
</Demo>

The side is a preference: the tooltip flips when there is not enough room on that edge.

## Alignment and offset

<Demo>
<template #demo>
<ITooltip text="Aligned to the start" align="start"><template #trigger><IButton variant="outline" size="sm">Start</IButton></template></ITooltip>
<ITooltip text="Centred" align="center"><template #trigger><IButton variant="outline" size="sm">Center</IButton></template></ITooltip>
<ITooltip text="Aligned to the end" align="end"><template #trigger><IButton variant="outline" size="sm">End</IButton></template></ITooltip>
<ITooltip text="Pushed further out" :side-offset="16"><template #trigger><IButton variant="outline" size="sm">Offset 16</IButton></template></ITooltip>
</template>

```vue
<ITooltip text="Aligned to the start" align="start">…</ITooltip>
<ITooltip text="Centred" align="center">…</ITooltip>
<ITooltip text="Aligned to the end" align="end">…</ITooltip>
<ITooltip text="Pushed further out" :side-offset="16">…</ITooltip>
```
</Demo>

## Arrow

<Demo>
<template #demo>
<ITooltip text="With an arrow" arrow><template #trigger><IButton variant="outline" size="sm">Arrow</IButton></template></ITooltip>
<ITooltip text="Without one"><template #trigger><IButton variant="outline" size="sm">None</IButton></template></ITooltip>
</template>

```vue
<ITooltip text="With an arrow" arrow>…</ITooltip>
<ITooltip text="Without one">…</ITooltip>
```
</Demo>

## Delay

`delay` is how long the pointer must rest before the tooltip opens, in milliseconds. Lower it for a toolbar the reader scans across; raise it where a passing hover should open nothing.

<Demo>
<template #demo>
<ITooltip text="Opens immediately" :delay="0"><template #trigger><IButton variant="outline" size="sm">0 ms</IButton></template></ITooltip>
<ITooltip text="The default"><template #trigger><IButton variant="outline" size="sm">300 ms</IButton></template></ITooltip>
<ITooltip text="Deliberate hovers only" :delay="800"><template #trigger><IButton variant="outline" size="sm">800 ms</IButton></template></ITooltip>
</template>

```vue
<ITooltip text="Opens immediately" :delay="0">…</ITooltip>
<ITooltip text="The default">…</ITooltip>
<ITooltip text="Deliberate hovers only" :delay="800">…</ITooltip>
```
</Demo>

## Rich content

Use the `content` slot when the tooltip needs markup. It closes as soon as the pointer leaves, so anything the reader has to interact with belongs in an [`IPopover`](/components/popover) or a dialog.

<Demo>
<template #demo>
<ITooltip>
<template #trigger><IButton variant="outline" size="sm">Keyboard shortcut</IButton></template>
<template #content>
<span>Save and send <IKbd :keys="['mod', 'enter']" size="xs" class="ml-1" /></span>
</template>
</ITooltip>
</template>

```vue
<ITooltip>
  <template #trigger>
    <IButton variant="outline">Keyboard shortcut</IButton>
  </template>

  <template #content>
    Save and send <IKbd :keys="['mod', 'enter']" size="xs" />
  </template>
</ITooltip>
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | — | Tooltip text, as an alternative to the `content` slot |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Preferred edge; flips when it will not fit |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment along that edge |
| `sideOffset` | `number` | `6` | Distance from the trigger, in px |
| `delay` | `number` | `300` | Hover delay before opening, in ms |
| `arrow` | `boolean` | `false` | Draws a pointer toward the trigger |
| `disabled` | `boolean` | `false` | Never opens |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ content?, arrow? }` | — | Per-element class overrides |

`v-model:open` controls it directly when you need to open one programmatically.

## Slots

| Slot | When to use it |
| --- | --- |
| `trigger` | The element the tooltip describes. **Required** — there is no default slot |
| `content` | Tooltip content with markup, instead of `text` |

Tooltips do not open on touch, so keep anything essential readable without one.
