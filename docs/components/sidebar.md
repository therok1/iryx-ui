---
eyebrow: Layout
---

<script setup lang="ts">
import {
  CreditCardIcon,
  DashboardSquare01Icon,
  File01Icon,
  Invoice01Icon,
  PackageIcon,
  Settings01Icon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'
import { ref } from 'vue'

const collapsed = ref(false)
const collapsedDemo = ref(true)

const items = [
  { label: 'Overview', href: '#', icon: DashboardSquare01Icon, active: true },
  { label: 'Invoices', href: '#', icon: Invoice01Icon, badge: 12 },
  { label: 'Clients', href: '#', icon: UserGroupIcon },
]

const sectioned = [
  {
    section: 'Billing',
    items: [
      { label: 'Invoices', href: '#', icon: Invoice01Icon, badge: 12, active: true },
      { label: 'Estimates', href: '#', icon: File01Icon },
      { label: 'Payments', href: '#', icon: CreditCardIcon },
    ],
  },
  {
    section: 'Records',
    items: [
      { label: 'Clients', href: '#', icon: UserGroupIcon },
      { label: 'Products', href: '#', icon: PackageIcon },
    ],
  },
]

const grouped = [
  { label: 'Overview', href: '#', icon: DashboardSquare01Icon },
  {
    label: 'Billing',
    icon: Invoice01Icon,
    defaultOpen: true,
    items: [
      { label: 'Invoices', href: '#', active: true },
      { label: 'Estimates', href: '#' },
      { label: 'Payments', href: '#' },
    ],
  },
  {
    label: 'Settings',
    icon: Settings01Icon,
    items: [
      { label: 'Workspace', href: '#' },
      { label: 'Members', href: '#' },
    ],
  },
]
</script>

# ISidebar

The app's primary navigation column — sections, collapsible groups, badges, and a collapse-to-icons mode. It works with or without [`IAppShell`](/components/app-shell); it is a column, and it needs a height.

<Demo stack>
<template #demo>
<div class="h-64 w-full max-w-3xl overflow-hidden rounded-lg border border-border">
<ISidebar :items="items" class="w-60" />
</div>
</template>

```vue
<script setup lang="ts">
import { DashboardSquare01Icon, Invoice01Icon, UserGroupIcon } from '@hugeicons/core-free-icons'

const items = [
  { label: 'Overview', href: '/', icon: DashboardSquare01Icon, active: true },
  { label: 'Invoices', href: '/invoices', icon: Invoice01Icon, badge: 12 },
  { label: 'Clients', href: '/clients', icon: UserGroupIcon },
]
</script>

<template>
  <ISidebar :items="items" class="w-60" />
</template>
```
</Demo>

A link with `href` renders an `<a>`. Omit it and you get a `<button>` instead, so `onSelect` can hand navigation to your router without a full page load.

## Sections

An entry with a `section` key is a labelled run of links under a small heading. A collapsible group carries `items` under a `label` instead, which is what tells the two apart.

<Demo stack>
<template #demo>
<div class="h-72 w-full max-w-3xl overflow-hidden rounded-lg border border-border">
<ISidebar :items="sectioned" class="w-60" />
</div>
</template>

```vue
const items = [
  {
    section: 'Billing',
    items: [
      { label: 'Invoices', href: '/invoices', icon: Invoice01Icon, badge: 12 },
      { label: 'Estimates', href: '/estimates', icon: File01Icon },
    ],
  },
  {
    section: 'Records',
    items: [{ label: 'Clients', href: '/clients', icon: UserGroupIcon }],
  },
]
```
</Demo>

Links written before or between sections keep their position.

## Collapsible groups

A link with its own `items` becomes a group that opens and closes in place. `defaultOpen` starts it open.

<Demo stack>
<template #demo>
<div class="h-80 w-full max-w-3xl overflow-hidden rounded-lg border border-border">
<ISidebar :items="grouped" class="w-60" />
</div>
</template>

```vue
const items = [
  { label: 'Overview', href: '/', icon: DashboardSquare01Icon },
  {
    label: 'Billing',
    icon: Invoice01Icon,
    defaultOpen: true,
    items: [
      { label: 'Invoices', href: '/invoices' },
      { label: 'Estimates', href: '/estimates' },
    ],
  },
]
```
</Demo>

The panel animates its height, so the rows below slide rather than jump. Inside the group, the rule sits on the centre of the parent's icon and each child's label lines up with the parent's.

## Collapse to icons

`v-model:collapsed` narrows the column to its icons. The labels are removed rather than visually hidden, and every link carries an `aria-label` in their place.

<Demo stack>
<template #demo>
<div class="flex h-72 w-full max-w-3xl overflow-hidden rounded-lg border border-border">
<ISidebar v-model:collapsed="collapsed" :items="sectioned" />
<div class="flex flex-1 items-start p-4">
<IButton size="sm" variant="outline" @click="collapsed = !collapsed">
{{ collapsed ? 'Expand' : 'Collapse' }}
</IButton>
</div>
</div>
</template>

```vue
<script setup lang="ts">
const collapsed = ref(false)
</script>

<template>
  <ISidebar v-model:collapsed="collapsed" :items="items" />
  <IButton @click="collapsed = !collapsed">
    Toggle
  </IButton>
</template>
```
</Demo>

Badges and section headings fold away with the labels; the group chevron goes too, since there is no room to show what it would open.

## Header and footer

Both slots stay pinned, with the link list as the only scrolling region. Each receives `collapsed`, so a wordmark can become a monogram.

<Demo stack>
<template #demo>
<div class="h-80 w-full max-w-3xl overflow-hidden rounded-lg border border-border">
<ISidebar :items="sectioned" class="w-60">
<template #header="{ collapsed: c }">
<span class="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">N</span>
<span v-if="!c" class="text-sm font-semibold">Northwind</span>
</template>
<template #footer="{ collapsed: c }">
<div class="flex w-full items-center gap-2 px-1">
<span class="size-8 shrink-0 rounded-full bg-muted" />
<span v-if="!c" class="text-sm text-muted-foreground">Signed in</span>
</div>
</template>
</ISidebar>
</div>
</template>

```vue
<ISidebar :items="items">
  <template #header="{ collapsed }">
    <Logo />
    <span v-if="!collapsed">Northwind</span>
  </template>

  <template #footer="{ collapsed }">
    <AccountRow :compact="collapsed" />
  </template>
</ISidebar>
```
</Demo>

## A right-hand sidebar

`side` decides which edge carries the border. Pair it with [`IAppShell`](/components/app-shell)'s `sidebar-position` to move the column itself.

<Demo stack>
<template #demo>
<div class="flex h-64 w-full max-w-3xl overflow-hidden rounded-lg border border-border">
<div class="flex-1" />
<ISidebar :items="items" side="right" class="w-60" />
</div>
</template>

```vue
<IAppShell sidebar-position="right">
  <template #sidebar><ISidebar :items="items" side="right" /></template>
</IAppShell>
```
</Demo>

## Collapsed, in full

<Demo stack>
<template #demo>
<div class="h-72 w-full max-w-3xl overflow-hidden rounded-lg border border-border">
<ISidebar v-model:collapsed="collapsedDemo" :items="grouped" />
</div>
</template>

```vue
<ISidebar :collapsed="true" :items="items" />
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `(SidebarLink \| SidebarSection)[]` | — | Links, optionally grouped into labelled sections |
| `side` | `'left' \| 'right'` | `'left'` | Which edge carries the border |
| `label` | `string` | `'Sidebar'` | Accessible name for the navigation landmark |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, header?, nav?, footer?, section?, sectionLabel?, link?, linkLabel?, linkBadge?, groupIcon?, groupContent?, groupInner? }` | — | Per-slot class overrides |

`v-model:collapsed` is a boolean model, defaulting to `false`.

## Slots

| Slot | Props | When to use it |
| --- | --- | --- |
| default | `{ collapsed }` | Replace the whole link list |
| `header` | `{ collapsed }` | Wordmark, workspace switcher — pinned above the list |
| `footer` | `{ collapsed }` | Account row, version — pinned below the list |
| `link` | `{ link, collapsed }` | Render one link yourself, keeping the row chrome |

## Item shapes

```ts
interface SidebarLink {
  label: string
  href?: string
  icon?: IconLike
  badge?: string | number
  disabled?: boolean
  active?: boolean
  onSelect?: () => void
  items?: SidebarLink[]
  defaultOpen?: boolean
}

interface SidebarSection {
  section: string
  items: SidebarLink[]
}
```

`active` is reflected as both `data-active` and `aria-current`, so a router integration only has to compute a boolean.
