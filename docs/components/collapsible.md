---
eyebrow: Navigation
---

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const advanced = ref(false)
</script>

# ICollapsible

One region that opens and closes — the bare disclosure behind [`IAccordion`](/components/accordion).

<Demo>
<template #demo>
<div class="w-full max-w-md rounded-xl border border-border p-4">
<ICollapsible v-model:open="open" label="Delivery details">
<p class="pt-2 text-sm text-muted-foreground">
Ships in 2–3 working days. Tracking is emailed once the parcel leaves the warehouse.
</p>
</ICollapsible>
</div>
</template>

```vue
<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <ICollapsible v-model:open="open" label="Delivery details">
    <p>Ships in 2–3 working days.</p>
  </ICollapsible>
</template>
```
</Demo>

## One region, no siblings

Use `ICollapsible` when there is exactly one thing to hide: an "advanced options" block in a form, a stack trace under an error, a long description behind a "read more". [`IAccordion`](/components/accordion) is the one that coordinates a list of panels.

<Demo>
<template #demo>
<div class="grid w-full max-w-md gap-3">
<IInput placeholder="Project name" aria-label="Project name" />
<ICollapsible v-model:open="advanced" label="Advanced options" icon-position="start" class="w-auto">
<div class="grid gap-3 px-1 pt-3 pb-1">
<IInput placeholder="Custom domain" aria-label="Custom domain" />
<ISwitch label="Enable preview builds" />
</div>
</ICollapsible>
</div>
</template>

```vue
<IInput placeholder="Project name" />

<ICollapsible v-model:open="advanced" label="Advanced options" icon-position="start">
  <!-- The content is clipped on every side, so nothing should sit flush -->
  <div class="grid gap-3 px-1 pt-3 pb-1">
    <IInput placeholder="Custom domain" />
    <ISwitch label="Enable preview builds" />
  </div>
</ICollapsible>
```
</Demo>

## Give the content a little inset

The content is clipped on every side while it animates, so anything painting outside its own box — a focus ring, a switch's rounded track — loses a sliver. Pad the content by `p-1` or more on any side that would otherwise sit flush.

```vue
<ICollapsible label="Advanced options">
  <div class="px-1 pt-3 pb-1">…</div>
</ICollapsible>
```

## The trigger

`label` sets the trigger text. For a count, a badge or a two-line summary, use the `trigger` slot, which receives the open state.

```vue
<ICollapsible v-model:open="open">
  <template #trigger="{ open }">
    <span>Attachments</span>
    <IBadge size="sm">3</IBadge>
  </template>

  <FileList />
</ICollapsible>
```

`icon-position` moves the chevron to the leading edge, and `hide-icon` drops it for a trigger that signals its state some other way.

## Unmounting

The content stays in the DOM while closed. `unmount-on-hide` removes it instead, which drops the height animation — use it when the content is expensive to render, or should stay out of the browser's in-page search while shut.

```vue
<ICollapsible label="Raw response" unmount-on-hide>
  <ExpensiveViewer />
</ICollapsible>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Two-way via `v-model:open` |
| `defaultOpen` | `boolean` | `false` | Starting state when uncontrolled |
| `label` | `string` | — | Trigger text; ignored with the `trigger` slot |
| `iconPosition` | `'start' \| 'end'` | `'end'` | Which side the chevron sits on |
| `hideIcon` | `boolean` | `false` | Drop the chevron |
| `unmountOnHide` | `boolean` | `false` | Remove the content while closed |
| `disabled` | `boolean` | `false` | |
| `unstyled` | `boolean` | — | Skip built-in classes |
| `ui` | `{ root?, trigger?, content?, icon? }` | — | Per-slot class overrides |

## Events

| Event | Payload |
| --- | --- |
| `update:open` | `boolean` |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `trigger` | `{ open }` | Replaces the trigger's contents |
| `default` | `{ open }` | The content that opens and closes |

## Accessibility

The trigger is a `<button>` carrying `aria-expanded` and pointing at the content with `aria-controls`, so a screen reader announces what it does and what state it is in.
