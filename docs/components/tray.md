---
eyebrow: Layout & structure
---

# ITray

A muted panel with a titled header. Put flat cards, a chart or a table inside; direct children get the tray's inner radius and lose their shadow. Children sit side by side, and stack below `lg`.

<Demo stack>
<template #demo>
<ITray label="Collected" class="w-full">
<template #actions>
<IButton size="xs" variant="outline">Export</IButton>
</template>
<ICard padding="sm" class="flex-1"><IStat value="€9,707" :delta="12.1" hint="vs. target" /></ICard>
<ICard padding="sm" class="flex-1"><IStat value="27 days" :delta="-4" trend="up" hint="to pay" /></ICard>
</ITray>
</template>

```vue
<ITray label="Collected" :icon="CheckmarkCircle02Icon">
  <template #actions>
    <IButton size="xs" variant="outline">Export</IButton>
  </template>

  <ICard padding="sm" class="flex-1">…</ICard>
  <ICard padding="sm" class="flex-1">…</ICard>
</ITray>
```
</Demo>

## Slots

`#actions` sits at the right of the header — filters, toggles, a small button. `#header` replaces the icon and label.

## Styling

Slots for `ui`: `root`, `header`, `icon`, `actions`, `body`.
