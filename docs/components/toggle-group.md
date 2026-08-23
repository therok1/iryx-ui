---
eyebrow: Forms
---

<script setup lang="ts">
import { ref } from 'vue'
import { Calendar03Icon, Grid02Icon, LeftToRightListBulletIcon, TextBoldIcon, TextItalicIcon, TextUnderlineIcon } from '@hugeicons/core-free-icons'

const view = ref('Board')
const joined = ref('Board')
const plain = ref('Board')
const marks = ref(['Bold'])
const range = ref('Month')
const iconView = ref('board')
const blocked = ref('Board')
const stacked = ref('Board')

const views = ['List', 'Board', 'Calendar']
const iconViews = [
  { label: 'List', value: 'list', icon: LeftToRightListBulletIcon },
  { label: 'Board', value: 'board', icon: Grid02Icon },
  { label: 'Calendar', value: 'calendar', icon: Calendar03Icon },
]
const formatting = [
  { label: 'Bold', icon: TextBoldIcon },
  { label: 'Italic', icon: TextItalicIcon },
  { label: 'Underline', icon: TextUnderlineIcon },
]
</script>

# IToggleGroup

A row of [toggles](/components/toggle) sharing one model — a view switcher, a date range, a formatting toolbar. The group is one Tab stop, with the arrow keys moving between items.

<Demo stack>
<template #demo>
<IToggleGroup v-model="view" :items="views" />
</template>

```vue
<script setup lang="ts">
const view = ref('Board')
</script>

<template>
  <IToggleGroup v-model="view" :items="['List', 'Board', 'Calendar']" />
</template>
```
</Demo>

## Single or multiple

`single` is the default and behaves like a segmented control — one item on at a time, with the model holding that item's value. `multiple` lets any number be on, and the model becomes an array.

<Demo stack>
<template #demo>
<IToggleGroup v-model="marks" :items="formatting" type="multiple" icon-only />
<p class="text-sm text-muted-foreground">Active: {{ marks.length ? marks.join(', ') : 'none' }}</p>
</template>

```vue
<script setup lang="ts">
const marks = ref(['Bold'])
</script>

<template>
  <IToggleGroup
    v-model="marks"
    :items="[
      { label: 'Bold', icon: BoldIcon },
      { label: 'Italic', icon: ItalicIcon },
      { label: 'Underline', icon: UnderlineIcon },
    ]"
    type="multiple"
    icon-only
  />
</template>
```
</Demo>

## Items

A bare string becomes both the label and the value. Pass objects when the two differ, or when an item needs an icon, an `ariaLabel` or disabling.

```ts
const items = [
  'List', //                                    label and value both "List"
  { label: 'Board', value: 'board' }, //         value differs from the label
  { label: 'Calendar', icon: CalendarIcon }, //  icon beside the label
  { label: 'Timeline', disabled: true }, //      present but not selectable
]
```

## Variants

`variant` decides how the items are spaced. `joined`, the default, squares them where they meet and collapses their adjacent borders, as [`IButtonGroup`](/components/button-group) does. `plain` leaves them as free-standing buttons with a gap.

<Demo stack>
<template #demo>
<IToggleGroup v-model="joined" :items="views" variant="joined" />
<IToggleGroup v-model="plain" :items="views" variant="plain" />
</template>

```vue
<IToggleGroup v-model="view" :items="views" variant="joined" />
<IToggleGroup v-model="view" :items="views" variant="plain" />
```
</Demo>

Either way an item is the same button [`IToggle`](/components/toggle) renders, so a group and a lone toggle sit together.

## Icon-only

`icon-only` hides the labels and squares the items. Each label becomes its item's accessible name; pass `ariaLabel` on an item when the label is too terse to stand alone.

<Demo stack>
<template #demo>
<IToggleGroup v-model="iconView" :items="iconViews" icon-only />
</template>

```vue
<IToggleGroup
  v-model="view"
  :items="[
    { label: 'List', value: 'list', icon: ListIcon },
    { label: 'Board', value: 'board', icon: GridIcon },
    { label: 'Calendar', value: 'calendar', icon: CalendarIcon },
  ]"
  icon-only
/>
```
</Demo>

## Sizes

The same five sizes as [`IToggle`](/components/toggle) and [`IButton`](/components/button).

<Demo stack>
<template #demo>
<IToggleGroup :model-value="range" :items="['Day', 'Week', 'Month']" size="xs" />
<IToggleGroup :model-value="range" :items="['Day', 'Week', 'Month']" size="sm" />
<IToggleGroup :model-value="range" :items="['Day', 'Week', 'Month']" size="md" />
<IToggleGroup :model-value="range" :items="['Day', 'Week', 'Month']" size="lg" />
</template>

```vue
<IToggleGroup v-model="range" :items="['Day', 'Week', 'Month']" size="xs" />
<IToggleGroup v-model="range" :items="['Day', 'Week', 'Month']" size="sm" />
<IToggleGroup v-model="range" :items="['Day', 'Week', 'Month']" size="md" />
<IToggleGroup v-model="range" :items="['Day', 'Week', 'Month']" size="lg" />
```
</Demo>

## Full width

`block` stretches the group and splits the width evenly between its items.

<Demo stack>
<template #demo>
<div class="w-full max-w-sm">
<IToggleGroup v-model="blocked" :items="views" block />
</div>
</template>

```vue
<IToggleGroup v-model="view" :items="views" block />
```
</Demo>

## Vertical

<Demo>
<template #demo>
<IToggleGroup v-model="stacked" :items="views" orientation="vertical" />
</template>

```vue
<IToggleGroup v-model="view" :items="views" orientation="vertical" />
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `(string \| ToggleGroupItemOption)[]` | `[]` | |
| `type` | `'single' \| 'multiple'` | `'single'` | Decides whether the model is a value or an array |
| `modelValue` | `string \| string[]` | — | |
| `variant` | `'joined' \| 'plain'` | `'joined'` | Whether the items touch or stand apart |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Also decides which arrow keys move focus |
| `iconOnly` | `boolean` | `false` | Hide labels, square the items, keep the names |
| `block` | `boolean` | `false` | Stretch to fill, splitting the width |
| `disabled` | `boolean` | `false` | Disables the whole group |
| `loop` | `boolean` | `false` | Wrap from the last item back to the first |
| `unstyled` | `boolean` | — | Skip built-in classes |
| `ui` | `{ root?, item? }` | — | Per-slot class overrides |

### `ToggleGroupItemOption`

| Field | Type | Description |
| --- | --- | --- |
| `label` | `string` | |
| `value` | `string` | Defaults to the label |
| `icon` | `IconLike` | |
| `disabled` | `boolean` | |
| `ariaLabel` | `string` | Names the item when `iconOnly` hides its label |

## Events

| Event | Payload |
| --- | --- |
| `update:modelValue` | `string \| string[]` |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `item` | `{ item }` | Replaces an item's contents |

## Accessibility

The group is one Tab stop; arrow keys move between items from there, along the axis `orientation` sets. Set `loop` to wrap around at the ends. With `icon-only`, each item's hidden label becomes its `aria-label`, so the group never reaches a screen reader as a row of unnamed buttons.
