---
eyebrow: Navigation
---

<script setup lang="ts">
const trail = [
  { label: 'Clients', href: '#' },
  { label: 'Northwind Supply', href: '#' },
  { label: 'INV-1042' },
]
</script>

# IBreadcrumb

The path to where you are. The last item is the current page and carries no link.

<Demo stack>
<template #demo>
<IBreadcrumb :items="trail" />
</template>

```vue
<script setup lang="ts">
const trail = [
  { label: 'Clients', href: '/clients' },
  { label: 'Northwind Supply', href: '/clients/northwind' },
  // No href: this is the page you are on.
  { label: 'INV-1042' },
]
</script>

<template>
  <IBreadcrumb :items="trail" />
</template>
```
</Demo>

Omitting `href` marks the current page, which is announced with `aria-current="page"`.

## With a router

Use `onSelect` instead of `href` when navigation goes through a router rather than the browser.

```vue
<script setup lang="ts">
const router = useRouter()

const trail = [
  { label: 'Clients', onSelect: () => router.push('/clients') },
  { label: 'Northwind Supply', onSelect: () => router.push('/clients/northwind') },
  { label: 'INV-1042' },
]
</script>
```

## Icons

An item can carry an `icon`. One on the root of the trail is usually enough.

```vue
<script setup lang="ts">
import { Home01Icon } from '@hugeicons/core-free-icons'

const trail = [
  { label: 'Home', href: '/', icon: Home01Icon },
  { label: 'Clients', href: '/clients' },
  { label: 'Northwind Supply' },
]
</script>
```

## A custom separator

The `separator` slot replaces the divider between crumbs.

<Demo stack>
<template #demo>
<IBreadcrumb :items="trail">
<template #separator><span class="text-muted-foreground">/</span></template>
</IBreadcrumb>
</template>

```vue
<IBreadcrumb :items="trail">
  <template #separator>
    <span class="text-muted-foreground">/</span>
  </template>
</IBreadcrumb>
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `BreadcrumbItem[]` | `[]` | The trail, root first |
| `label` | `string` | `'Breadcrumb'` | Accessible name for the navigation region |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, list?, item?, link?, current?, separator? }` | — | Per-slot class overrides |

```ts
interface BreadcrumbItem {
  label: string
  /** Omit on the current page. */
  href?: string
  icon?: IconLike
  /** Handle navigation yourself, e.g. with a router. */
  onSelect?: () => void
}
```

A breadcrumb describes where a page sits in the hierarchy, not the route the reader took to reach it. [`IPageHeader`](/components/page-header) has a slot for one.
