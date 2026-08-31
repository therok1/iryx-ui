---
eyebrow: Layout
---

<script setup lang="ts">
import { CreditCardIcon, Invoice01Icon, UserGroupIcon } from '@hugeicons/core-free-icons'
import { ref } from 'vue'

const single = ref('Payment terms')
const multiple = ref<string[]>(['Payment terms'])
const outlined = ref('Billing')

const faqs = [
  { label: 'Payment terms', content: 'Net 30 by default. Change it per client, or per invoice when a job warrants it.' },
  { label: 'Editing a sent invoice', content: 'A sent invoice is a record, so it is corrected with a credit note rather than edited in place.' },
  { label: 'Refunds', content: 'Issue a credit note against the original invoice; the balance follows automatically.' },
]

const withIcons = [
  { label: 'Billing', icon: Invoice01Icon, content: 'Invoices, estimates and payment terms.' },
  { label: 'Clients', icon: UserGroupIcon, content: 'Companies, contacts and their addresses.' },
  { label: 'Payments', icon: CreditCardIcon, content: 'What has come in, and what is still owed.' },
]
</script>

# IAccordion

A list of panels where opening one is the whole interaction. Use it for questions with long answers, or settings a reader visits rarely — not for content they need side by side, which wants [`ITabs`](/components/tabs) or no disclosure at all.

<Demo stack>
<template #demo>
<IAccordion v-model="single" :items="faqs" class="w-full max-w-lg" />
</template>

```vue
<script setup lang="ts">
const open = ref('Payment terms')

const faqs = [
  { label: 'Payment terms', content: 'Net 30 by default…' },
  { label: 'Editing a sent invoice', content: 'A sent invoice is a record…' },
]
</script>

<template>
  <IAccordion v-model="open" :items="faqs" />
</template>
```
</Demo>

The panel animates its height, so the rows below slide rather than jump. `v-model` holds the open item's value, which defaults to its label — give an item an explicit `value` when the label is long or likely to be reworded.

## One panel or several

`type="multiple"` lets any number stand open, and the model becomes an array.

<Demo stack>
<template #demo>
<IAccordion v-model="multiple" :items="faqs" type="multiple" class="w-full max-w-lg" />
</template>

```vue
<script setup lang="ts">
const open = ref(['Payment terms'])
</script>

<template>
  <IAccordion v-model="open" :items="faqs" type="multiple" />
</template>
```
</Demo>

In `single` mode, `collapsible` (on by default) lets the open panel be closed again by clicking its own trigger. Turn it off when something must always be showing.

## Outline

<Demo stack>
<template #demo>
<IAccordion v-model="outlined" :items="withIcons" variant="outline" class="w-full max-w-lg" />
</template>

```vue
<IAccordion v-model="open" :items="items" variant="outline" />
```
</Demo>

`plain` is rules between rows and nothing else — the quieter of the two, and right when the accordion *is* the page. `outline` gives each item its own panel, which holds together better on a busy page where the rules would compete with everything around them.

An item can carry an `icon`, on either variant.

## Markup in a panel

`content` is for text. Anything else goes in the `content` slot, which receives the item.

<Demo stack>
<template #demo>
<IAccordion :items="withIcons" variant="outline" class="w-full max-w-lg">
<template #content="{ item }">
<div class="flex flex-col gap-3">
<p>{{ item.content }}</p>
<div class="flex gap-2">
<IButton size="sm" variant="outline">Open {{ item.label }}</IButton>
<IButton size="sm" variant="ghost">Learn more</IButton>
</div>
</div>
</template>
</IAccordion>
</template>

```vue
<IAccordion :items="items" variant="outline">
  <template #content="{ item }">
    <div class="flex flex-col gap-3">
      <p>{{ item.content }}</p>
      <div class="flex gap-2">
        <IButton size="sm" variant="outline">
          Open {{ item.label }}
        </IButton>
        <IButton size="sm" variant="ghost">
          Learn more
        </IButton>
      </div>
    </div>
  </template>
</IAccordion>
```
</Demo>

The `trigger` slot replaces the row's own content the same way — a badge beside the label, a count, a second line.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `AccordionItemData[]` | — | The rows |
| `type` | `'single' \| 'multiple'` | `'single'` | One panel open, or several |
| `collapsible` | `boolean` | `true` | Let the open panel close again. `single` only |
| `variant` | `'plain' \| 'outline'` | `'plain'` | Rules between rows, or a panel each |
| `disabled` | `boolean` | — | Disable every row |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, item?, header?, trigger?, icon?, content?, contentInner? }` | — | Per-element class overrides |

`v-model` is a `string` for `single` and a `string[]` for `multiple`.

## Slots

| Slot | Props | When to use it |
| --- | --- | --- |
| `trigger` | `{ item }` | Replace the row's label — a badge, a count, a second line |
| `content` | `{ item }` | Panel contents with markup |

## Item shape

```ts
interface AccordionItemData {
  label: string
  content?: string
  /** Identity in the model. Defaults to the label. */
  value?: string
  icon?: IconLike
  disabled?: boolean
}
```

Panel spacing lives on an inner wrapper, reachable as `ui.contentInner`. Put padding there rather than on `ui.content`, whose height is animated.
