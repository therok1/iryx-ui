---
eyebrow: Forms
---

<script setup lang="ts">
import { ref } from 'vue'

const title = ref('Q3 revenue report')
const nickname = ref('')
const note = ref('Chase the PO number before sending')
const guarded = ref('acme-production')

const rows = ref([
  { id: 1, name: 'Design retainer', amount: '4,200' },
  { id: 2, name: 'Implementation', amount: '18,600' },
  { id: 3, name: 'Support, year one', amount: '3,900' },
])
</script>

# IEditable

Text that becomes a field where it sits. For changing one value in place, when opening a form or a dialog to edit a single line is more ceremony than the change deserves.

<Demo stack>
<template #demo>
<IEditable v-model="title" />
</template>

```vue
<script setup lang="ts">
const title = ref('Q3 revenue report')
</script>

<template>
  <IEditable v-model="title" />
</template>
```
</Demo>

Click it, or Tab to it and start typing. `Enter` or clicking away commits; `Escape` puts the old value back.

It does not become a form field when you edit it — no border, no box, just a caret in the text. The only chrome is a tint on hover, and only because a value that looks exactly like its surroundings is a value nobody knows they can change.

## Make it look editable

The one real risk with this control is that nobody realises it is one. It hints on hover, but a hint under the pointer does nothing for a reader who never puts a pointer there.

`controls` adds a pencil beside the value, and save and cancel while editing — one set at a time, never all three.

<Demo stack>
<template #demo>
<IEditable v-model="note" controls class="w-96" />
</template>

```vue
<IEditable v-model="note" controls />
```
</Demo>

Use them anywhere the value is not obviously a field: a heading, a table cell, a line of prose. Skip them in a settings list where every row is already visibly editable.

## Empty values

A `placeholder` keeps an empty value clickable. Without one there is nothing to aim at.

<Demo stack>
<template #demo>
<IEditable v-model="nickname" placeholder="Add a nickname" controls />
</template>

```vue
<IEditable v-model="nickname" placeholder="Add a nickname" controls />
```
</Demo>

`startWithEditMode` opens straight into the field — right for a row that was just added and has nothing in it yet.

## When it commits

`submitMode` decides what counts as done: `both` (the default) on `Enter` or on losing focus, `blur` or `enter` for one of the two, `none` for only the save button.

`activationMode` decides what starts an edit. `focus` is the default and the kindest — `dblclick` is invisible to anyone who does not already know it is there, and unreachable from a keyboard.

<Demo stack>
<template #demo>
<div class="flex w-full flex-col gap-3">
<IEditable v-model="guarded" submit-mode="none" controls />
<p class="text-xs text-muted-foreground">Commits only through the save button — clicking away leaves the value alone.</p>
</div>
</template>

```vue
<IEditable v-model="guarded" submit-mode="none" controls />
```
</Demo>

`submit-mode="none"` is the one to reach for when a stray click should not change anything: an environment name, a billing address, anything where a silent commit is expensive.

## In a table

The case this control is really for — a list where any row's name might need a small correction, and a dialog per row would be absurd.

<Demo stack>
<template #demo>
<ITable
  class="w-full"
  :columns="[{ key: 'name', label: 'Line item' }, { key: 'amount', label: 'Amount', align: 'end' }]"
  :rows="rows"
>
  <template #cell-name="{ row }">
    <IEditable v-model="row.name" size="sm" class="w-full" />
  </template>
</ITable>
</template>

```vue
<ITable :columns="columns" :rows="rows">
  <template #cell-name="{ row }">
    <IEditable v-model="row.name" size="sm" />
  </template>
</ITable>
```
</Demo>

`size` sets the text size, and both states share it — a row keeps its height whether it is being read or edited.

## Custom preview

The `preview` slot replaces how the value reads — a heading, a badge, anything — while the field it becomes stays the same.

<Demo stack>
<template #demo>
<IEditable v-model="title" size="lg">
  <template #preview="{ value }">
    <span class="text-lg font-semibold">{{ value }}</span>
  </template>
</IEditable>
</template>

```vue
<IEditable v-model="title" size="lg">
  <template #preview="{ value }">
    <span class="text-lg font-semibold">{{ value }}</span>
  </template>
</IEditable>
```
</Demo>

Both states inherit their typography from whatever surrounds them, and the field sizes itself to its text, so the line does not move when the two swap — an inline edit that shifts the text it replaces makes the reader lose their place.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | — | The value |
| `placeholder` | `string` | — | Shown while empty, and keeps it clickable |
| `activationMode` | `'focus' \| 'dblclick' \| 'none'` | `'focus'` | What starts an edit |
| `submitMode` | `'blur' \| 'enter' \| 'both' \| 'none'` | `'both'` | What commits it |
| `controls` | `boolean` | `false` | Edit, save and cancel buttons |
| `selectOnFocus` | `boolean` | `false` | Select the text so typing replaces it |
| `startWithEditMode` | `boolean` | `false` | Open straight into the field |
| `maxLength` | `number` | — | Character limit |
| `autoResize` | `boolean` | `true` | Size the field to its text, so nothing jumps |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Text size; both states inherit it |
| `disabled` | `boolean` | `false` | — |
| `readonly` | `boolean` | `false` | Reads as text and stays that way |
| `invalid` | `boolean` | — | Colours the text red; set by `IFormField` |
| `id` | `string` | — | Falls back to `IFormField`'s |
| `name` | `string` | — | Submitted with a surrounding native form |
| `required` | `boolean` | `false` | — |
| `editLabel` | `string` | `'Edit'` | Names the pencil button |
| `submitLabel` | `string` | `'Save'` | Names the save button |
| `cancelLabel` | `string` | `'Cancel'` | Names the cancel button |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Classes for the root |
| `ui` | `{ root?, area?, preview?, placeholder?, input?, control? }` | — | Per-element class overrides |

## Events

| Event | Payload | When |
| --- | --- | --- |
| `update:modelValue` | `string` | The value changed |
| `submit` | `string` | The edit was committed |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `preview` | `{ value, isEmpty }` | Replaces the rendered value |
