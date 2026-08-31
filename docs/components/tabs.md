---
eyebrow: Navigation
---

<script setup lang="ts">
import { ref } from 'vue'

const basic = ref('Overview')
const solid = ref('Overview')
const lined = ref('Details')
const panels = ref('overview')
const vertical = ref('Profile')

const panelItems = [
  { label: 'Overview', value: 'overview' },
  { label: 'Line items', value: 'items' },
  { label: 'History', value: 'history' },
]
</script>

# ITabs

Switches between panels on the same page. Items come from an array, and the indicator animates between triggers.

<Demo stack>
<template #demo>
<ITabs v-model="basic" :items="['Overview', 'Line items', 'History']" class="w-full max-w-md" />
</template>

```vue
<ITabs v-model="tab" :items="['Overview', 'Line items', 'History']" />
```
</Demo>

A string item becomes both the label and the value. Pass objects when the two differ, or when an item needs an icon or should be disabled.

## Variants

`solid` sits the active tab on a filled pill; `line` underlines it, which suits tabs sitting directly above the content they switch.

<Demo stack>
<template #demo>
<ITabs v-model="solid" :items="['Overview', 'Line items', 'History']" variant="solid" class="w-full max-w-md" />
<ITabs v-model="lined" :items="['Details', 'Activity', 'Files']" variant="line" class="w-full max-w-md" />
</template>

```vue
<ITabs v-model="tab" :items="items" variant="solid" />
<ITabs v-model="tab" :items="items" variant="line" />
```
</Demo>

## Panels

Give each item a `value` and fill the matching named slot. Each slot receives the item it belongs to.

<Demo stack>
<template #demo>
<ITabs v-model="panels" :items="panelItems" class="w-full max-w-md">
<template #overview><p class="pt-4 text-sm text-muted-foreground">Four line items totalling €1,240.00.</p></template>
<template #items><p class="pt-4 text-sm text-muted-foreground">Design retainer, hosting, support hours, expenses.</p></template>
<template #history><p class="pt-4 text-sm text-muted-foreground">Sent 2 March. Viewed 3 March. Reminder sent 18 March.</p></template>
</ITabs>
</template>

```vue
<script setup lang="ts">
const items = [
  { label: 'Overview', value: 'overview' },
  { label: 'Line items', value: 'items' },
  { label: 'History', value: 'history' },
]
</script>

<template>
  <ITabs v-model="tab" :items="items">
    <template #overview>
      <p>Four line items totalling €1,240.00.</p>
    </template>
    <template #items="{ item }">
      <p>Panel for {{ item.label }}.</p>
    </template>
  </ITabs>
</template>
```
</Demo>

## Vertical

`orientation="vertical"` stacks the triggers down the side, and arrow-key navigation follows the orientation.

<Demo stack>
<template #demo>
<ITabs v-model="vertical" :items="['Profile', 'Billing', 'Members']" orientation="vertical" variant="line" class="w-full max-w-md" />
</template>

```vue
<ITabs v-model="tab" :items="items" orientation="vertical" variant="line" />
```
</Demo>

## Keeping panels mounted

By default only the active panel is in the DOM. `keepMounted` renders them all and hides the inactive ones, which keeps form state, scroll position and anything expensive to rebuild.

```vue
<ITabs v-model="tab" :items="items" keep-mounted />
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `(TabsItem \| string)[]` | `[]` | Tabs to render |
| `variant` | `'solid' \| 'line'` | `'solid'` | Pill or underline |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Trigger direction, and arrow-key axis |
| `keepMounted` | `boolean` | `false` | Render every panel, hiding the inactive ones |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, list?, indicator?, trigger?, content? }` | — | Per-element class overrides |

The model is the active item's `value`, falling back to its `label`.

```ts
interface TabsItem {
  label: string
  /** Identifies the tab. Defaults to the label. */
  value?: string
  icon?: IconLike
  disabled?: boolean
}
```

## Slots

| Slot | When to use it |
| --- | --- |
| `<value>` | The panel for that item, receiving `{ item }` |
| `trigger` | Custom trigger content, receiving `{ item }` |
| `list` | Replaces the whole trigger row |
| default | Replaces the panel area entirely |

For switching between pages rather than panels, use [`INavigationMenu`](/components/navigation-menu) or plain links.
