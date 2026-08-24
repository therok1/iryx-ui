---
eyebrow: Layout
---

<script setup lang="ts">
import {
  DashboardSquare01Icon,
  Invoice01Icon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'

const nav = [
  { label: 'Overview', href: '#', icon: DashboardSquare01Icon, active: true },
  { label: 'Invoices', href: '#', icon: Invoice01Icon, badge: 12 },
  { label: 'Clients', href: '#', icon: UserGroupIcon },
]

const rows = Array.from({ length: 12 }, (_, i) => `Row ${i + 1}`)

// The shell is built to own the viewport, so every demo below caps its own
// height instead — otherwise each one would be a screen tall.
const framed = { root: 'h-72 rounded-lg border border-border' }

// `page` mode sticks to the document and sizes its sidebar against `100svh`.
// Boxed into a panel that is wrong on both counts, so the frame becomes the
// scroll container and the rail is measured against the frame instead.
const paged = {
  root: 'h-72 min-h-0 overflow-y-auto rounded-lg border border-border',
  // The body must take its content height, not flex to the frame: a body
  // shorter than the rail leaves sticky nothing to stick inside.
  body: 'flex-none',
  sidebar: 'h-[calc(18rem-var(--iryx-shell-header-height,0px))] max-h-none',
}
</script>

# IAppShell

The page frame: header, sidebar, main and footer. Every slot takes whatever you put in it — navigation, account menu and routing stay yours, and [`ISidebar`](/components/sidebar) works with or without the shell.

<Demo stack>
<template #demo>
<IAppShell :ui="framed" class="w-full">
<template #header>
<div class="flex h-14 items-center gap-3 border-b border-border px-4">
<span class="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">N</span>
<span class="text-sm font-semibold">Northwind</span>
</div>
</template>
<template #sidebar>
<ISidebar :items="nav" class="h-full w-56" />
</template>
<div class="space-y-2 p-4">
<p v-for="row in rows" :key="row" class="rounded-md border border-border px-3 py-2 text-sm">{{ row }}</p>
</div>
<template #footer>
<div class="flex h-10 items-center border-t border-border px-4 text-xs text-muted-foreground">Version 1.4.0</div>
</template>
</IAppShell>
</template>

```vue
<IAppShell>
  <template #header><AppHeader /></template>
  <template #sidebar><ISidebar :items="nav" /></template>

  <IContainer>
    <IPageHeader title="Overview" />
    <!-- the page -->
  </IContainer>

  <template #footer><AppFooter /></template>
</IAppShell>
```
</Demo>

Each of `header`, `sidebar` and `footer` is rendered only when you fill it, so a shell with just a header is a header and a content column, with no empty rails left behind.

## Two scroll models

`scroll` picks between two layouts.

**`main`**, the default, pins the shell to the viewport and scrolls only the content column. The header and sidebar never move — what a data app wants.

**`page`** scrolls the document, with a sticky header and a sticky sidebar. Anchor links and the browser's scroll restoration work in this mode, so content and marketing pages want it. Being sticky rather than fixed, the sidebar travels up with the end of the body and the footer pushes it off screen.

<Demo stack>
<template #demo>
<IAppShell scroll="page" :ui="paged" class="w-full">
<template #header>
<div class="flex h-14 items-center border-b border-border bg-background px-4 text-sm font-semibold">Header</div>
</template>
<template #sidebar>
<ISidebar :items="nav" class="h-full w-56" />
</template>
<div class="space-y-2 p-4">
<p v-for="row in rows" :key="row" class="rounded-md border border-border px-3 py-2 text-sm">{{ row }}</p>
</div>
<template #footer>
<div class="flex h-10 items-center border-t border-border px-4 text-xs text-muted-foreground">Version 1.4.0</div>
</template>
</IAppShell>
</template>

```vue
<IAppShell scroll="page">
  <template #header><AppHeader /></template>
  <template #sidebar><ISidebar :items="nav" /></template>
  <template #footer><AppFooter /></template>
</IAppShell>
```
</Demo>

The shell itself is the scroll container here, and the header sticks within it.

`page` mode sizes its sidebar against `100svh`, so the boxed demo above overrides three values to keep the rail inside its frame:

```vue
<IAppShell
  scroll="page"
  :ui="{
    root: 'h-72 min-h-0 overflow-y-auto',
    body: 'flex-none',
    sidebar: 'h-[calc(18rem-var(--iryx-shell-header-height,0px))] max-h-none',
  }"
>
```

A full-page shell needs none of that.

In `page` mode the shell measures its own header and publishes the height as `--iryx-shell-header-height`. Use that variable to offset anything you stick below the header yourself.

## Sidebar on the right

<Demo stack>
<template #demo>
<IAppShell sidebar-position="right" :ui="framed" class="w-full">
<template #header>
<div class="flex h-14 items-center border-b border-border px-4 text-sm font-semibold">Northwind</div>
</template>
<template #sidebar>
<ISidebar :items="nav" side="right" class="h-full w-56" />
</template>
<div class="space-y-2 p-4">
<p v-for="row in rows.slice(0, 6)" :key="row" class="rounded-md border border-border px-3 py-2 text-sm">{{ row }}</p>
</div>
<template #footer>
<div class="flex h-10 items-center border-t border-border px-4 text-xs text-muted-foreground">Version 1.4.0</div>
</template>
</IAppShell>
</template>

```vue
<IAppShell sidebar-position="right">
  <template #sidebar><ISidebar :items="nav" side="right" /></template>
</IAppShell>
```
</Demo>

`sidebarPosition` moves the column; `ISidebar`'s own `side` decides which edge carries its border. Set both.

## Where the footer sits

Without a sidebar the shell is a header, a content column and the footer.

<Demo stack>
<template #demo>
<IAppShell :ui="framed" class="w-full">
<template #header>
<div class="flex h-12 items-center border-b border-border px-4 text-sm font-semibold">Northwind</div>
</template>
<div class="space-y-2 p-4">
<p v-for="row in rows.slice(0, 8)" :key="row" class="rounded-md border border-border px-3 py-2 text-sm">{{ row }}</p>
</div>
<template #footer>
<div class="flex h-10 items-center border-t border-border px-4 text-xs text-muted-foreground">Version 1.4.0</div>
</template>
</IAppShell>
</template>

```vue
<IAppShell>
  <template #header><AppHeader /></template>
  <template #footer><AppFooter /></template>
</IAppShell>
```
</Demo>

In `main` mode the footer is pinned below the scrolling column, so it stays visible however long the page is. In `page` mode it sits at the end of the document, where a footer normally lives.

## Navigation on a phone

Below `md` the sidebar column is hidden and the same `#sidebar` slot is rendered inside a drawer instead, with a trigger the shell puts in the header itself. Nothing needs wiring up: a shell with a sidebar has usable navigation on a phone by default.

A sidebar narrow enough for a phone is not a sidebar, and one that merely squeezes takes the content column down with it.

```vue
<IAppShell>
  <template #header><!-- your bar --></template>
  <template #sidebar>
    <ISidebar :items="items" class="w-60" />
  </template>
</IAppShell>
```

The breakpoint is CSS, not a media query read in script, so server-rendered markup and the first client frame agree on what to draw.

The slot is rendered twice — once as the column, once in the drawer — and is told which is which, so a brand or a footer can appear in only one of them:

```vue
<IAppShell>
  <template #sidebar="{ inDrawer }">
    <ISidebar :items="items" class="w-60">
      <template v-if="inDrawer" #header>
        <MyWordmark />
      </template>
    </ISidebar>
  </template>
</IAppShell>
```

Set `mobileNav` to `false` to turn the whole thing off. To place the trigger yourself rather than take the shell's, the `#header` slot receives `navOpen` and `toggleNav`.

::: warning The header slot sits in a row
To make room for that trigger, the shell wraps `#header` in a flex row. A bar that draws its own bottom rule should move it to `ui.header` — from inside the content column, the rule stops short of the trigger.
:::

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string` | `'div'` | Element or component to render as |
| `scroll` | `'main' \| 'page'` | `'main'` | Scroll the content column, or the document |
| `sidebarPosition` | `'left' \| 'right'` | `'left'` | Which side the sidebar rail sits on |
| `mobileNav` | `boolean` | `true` | Move the sidebar into a drawer below `md` |
| `navLabel` | `string` | `'Open navigation'` | Accessible name for the drawer trigger |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, header?, headerRow?, headerContent?, navTrigger?, navDrawer?, navDrawerBody?, body?, sidebar?, main?, footer? }` | — | Per-slot class overrides |

## Slots

| Slot | When to use it |
| --- | --- |
| default | The page itself, inside `<main>` |
| `header` | App bar. Receives `navOpen` and `toggleNav`. Measured in `page` mode to position the sticky sidebar |
| `sidebar` | The navigation rail — usually [`ISidebar`](/components/sidebar). Receives `inDrawer`, and is rendered again inside the mobile drawer |
| `footer` | Pinned below the content in `main` mode, at the end of the document in `page` mode |

Pair it with [`IContainer`](/components/container) for the content width and [`IPageHeader`](/components/page-header) for the title row.
