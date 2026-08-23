---
eyebrow: Navigation
---

<script setup lang="ts">
import {
  ChartLineData01Icon,
  CreditCardIcon,
  File01Icon,
  Invoice01Icon,
  PackageIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'

const flat = [
  { label: 'Overview', href: '#', active: true },
  { label: 'Invoices', href: '#' },
  { label: 'Clients', href: '#' },
  { label: 'Reports', href: '#' },
]

const panels = [
  { label: 'Overview', href: '#', active: true },
  {
    label: 'Billing',
    items: [
      { label: 'Invoices', href: '#', icon: Invoice01Icon, description: 'Draft, send and track what you are owed' },
      { label: 'Estimates', href: '#', icon: File01Icon, description: 'Quotes that turn into invoices in one step' },
      { label: 'Payments', href: '#', icon: CreditCardIcon, description: 'Everything that has come in' },
    ],
  },
  {
    label: 'Records',
    columns: 2,
    items: [
      { label: 'Clients', href: '#', icon: UserGroupIcon, description: 'Companies and the people at them' },
      { label: 'Products', href: '#', icon: PackageIcon, description: 'What you sell, and for how much' },
      { label: 'Reports', href: '#', icon: ChartLineData01Icon, description: 'Revenue, ageing and tax summaries' },
      { label: 'Archive', href: '#', icon: File01Icon, description: 'Closed records, kept for the auditor' },
    ],
  },
  { label: 'Settings', href: '#' },
]
</script>

# INavigationMenu

A horizontal app nav where an entry can open a panel of links. An entry with its own `items` is a panel trigger; everything else is a plain link.

<Demo stack>
<template #demo>
<INavigationMenu :items="flat" />
</template>

```vue
<script setup lang="ts">
const items = [
  { label: 'Overview', href: '/', active: true },
  { label: 'Invoices', href: '/invoices' },
  { label: 'Clients', href: '/clients' },
  { label: 'Reports', href: '/reports' },
]
</script>

<template>
  <INavigationMenu :items="items" />
</template>
```
</Demo>

## Panels

Give an entry `items` and it becomes a trigger. Every panel shares one viewport, so the panel resizes and slides as you move between triggers.

<Demo stack>
<template #demo>
<INavigationMenu :items="panels" />
</template>

```vue
<script setup lang="ts">
import { Invoice01Icon, UserGroupIcon } from '@hugeicons/core-free-icons'

const items = [
  { label: 'Overview', href: '/', active: true },
  {
    label: 'Billing',
    items: [
      {
        label: 'Invoices',
        href: '/invoices',
        icon: Invoice01Icon,
        description: 'Draft, send and track what you are owed',
      },
    ],
  },
  { label: 'Settings', href: '/settings' },
]
</script>

<template>
  <INavigationMenu :items="items" />
</template>
```
</Demo>

`description` is a second line under the label and shows only inside a panel. `columns` splits a panel into two or three — set it on the menu for every panel, or on one entry to override it there, as "Records" does above.

## Vertical

The same data laid out as a column. For a primary side navigation with sections, badges and a collapse mode, use [`ISidebar`](/components/sidebar).

<Demo stack>
<template #demo>
<INavigationMenu :items="panels" orientation="vertical" class="w-56" />
</template>

```vue
<INavigationMenu :items="items" orientation="vertical" class="w-56" />
```
</Demo>

## Opening on click

Panels open on hover after `delayDuration` milliseconds. `disableHoverTrigger` switches them to click, which is what a touch-first app wants.

<Demo stack>
<template #demo>
<INavigationMenu :items="panels" disable-hover-trigger />
</template>

```vue
<INavigationMenu :items="items" disable-hover-trigger />
<INavigationMenu :items="items" :delay-duration="0" />
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `NavigationMenuEntry[]` | — | Top-level entries; one with `items` opens a panel |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout of the top-level list |
| `columns` | `1 \| 2 \| 3` | `1` | Columns in a panel; an entry can override it |
| `label` | `string` | `'Main'` | Accessible name for the navigation landmark |
| `delayDuration` | `number` | — | Milliseconds a pointer must rest before a panel opens |
| `disableHoverTrigger` | `boolean` | — | Open on click only |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, list?, item?, link?, triggerIcon?, viewportWrapper?, viewport?, content?, panelLink?, panelLabel?, panelDescription?, panelIcon? }` | — | Per-slot class overrides |

## Slots

| Slot | Props | When to use it |
| --- | --- | --- |
| `list` | — | Replace the whole top-level list |
| `trigger` | `{ item }` | Render a panel trigger yourself |
| `panel` | `{ item }` | Replace a panel's contents entirely |
| `item` | `{ item }` | Render one top-level link yourself |

## Item shapes

```ts
interface NavigationMenuLinkItem {
  label: string
  href?: string
  target?: string
  icon?: IconLike
  description?: string
  disabled?: boolean
  active?: boolean
  onSelect?: () => void
}

interface NavigationMenuGroupItem extends NavigationMenuLinkItem {
  items: NavigationMenuLinkItem[]
  columns?: 1 | 2 | 3
}
```

An entry without `href` renders a `<button>`, so `onSelect` can hand navigation to a router. `active` is reflected as both `data-active` and `aria-current`.
