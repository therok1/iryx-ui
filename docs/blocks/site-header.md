---
eyebrow: Marketing
---

# ISiteHeader

The bar across the top of a product site: the brand, the section links, the buttons that matter, and — below `md` — all of it folded into a drawer.

```vue
<ISiteHeader name="Iryx Billing" href="/" :links="nav">
  <template #actions>
    <IButton variant="ghost" size="sm">Sign in</IButton>
    <IButton size="sm">Start free</IButton>
  </template>
</ISiteHeader>
```

```ts
const nav = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing', current: true },
  { label: 'Customers', href: '#customers' },
]
```

<Demo stack>
<template #demo>
<div class="w-full overflow-hidden rounded-lg border border-border">
<ISiteHeader
  :sticky="false"
  :bordered="false"
  name="Iryx Billing"
  href="#"
  :links="[{ label: 'Features', href: '#' }, { label: 'Pricing', href: '#', current: true }, { label: 'Customers', href: '#' }]"
>
<template #actions>
<IButton variant="ghost" size="sm">Sign in</IButton>
<IButton size="sm">Start free</IButton>
</template>
</ISiteHeader>
</div>
</template>

```vue
<ISiteHeader name="Iryx Billing" href="/" :links="nav">
  <template #actions>
    <IButton variant="ghost" size="sm">Sign in</IButton>
    <IButton size="sm">Start free</IButton>
  </template>
</ISiteHeader>
```
</Demo>

## Sticky by default

The header sticks to the top of the viewport and blurs whatever scrolls under it. The blur is not its own prop: it only reads as depth over moving content, so it comes and goes with `sticky`.

```vue
<ISiteHeader :sticky="false" :links="nav" />
```

## The mobile menu

Below `md` the links are replaced by a menu button that opens an [`IDrawer`](/components/drawer) holding the same list. Nothing to configure — the links you already passed are what it shows, and choosing one closes it.

**The button appears only when there is something to put behind it.** A header with a brand and two buttons and no `links` renders no menu, because a button that opens an empty panel is worse than no button at all.

Use the `menu` slot when the drawer should hold more than the links — a sign-in entry, say. It receives `close`:

```vue
<ISiteHeader :links="nav">
  <template #menu="{ close }">
    <a v-for="link in nav" :key="link.href" :href="link.href" @click="close">{{ link.label }}</a>
    <ISeparator class="my-2" />
    <button type="button" @click="close(); signIn()">Sign in</button>
  </template>
</ISiteHeader>
```

`v-model:menu-open` is there when a page needs to close the drawer itself, such as after routing.

## Links

Each entry is `{ label, href }`, plus two optional flags. `current` marks the page being viewed, which sets `aria-current="page"` and darkens the label. `external` opens the link in a new tab with the `rel` that needs.

```ts
const nav = [
  { label: 'Pricing', href: '/pricing', current: true },
  { label: 'Docs', href: 'https://docs.example.com', external: true },
]
```

For anything the shape does not cover — a dropdown of products, a router link — use the `links` slot and render your own, or reach for [`INavigationMenu`](/components/navigation-menu) inside it.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | The product's name, in the brand |
| `href` | `string` | `'/'` | Where the brand links to |
| `links` | `SiteLink[]` | — | The section links |
| `sticky` | `boolean` | `true` | Stick to the top, with a blur under it |
| `bordered` | `boolean` | `true` | Rule along the bottom edge |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'xl'` | Container width |
| `mobileMenu` | `boolean` | `true` | Fold the links into a drawer below `md` |
| `menuLabel` | `string` | `'Open the menu'` | Accessible name for the menu button |
| `menuTitle` | `string` | `'Menu'` | Heading inside the drawer |
| `as` | `string` | `'header'` | Element to render |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, container?, brand?, nav?, link?, actions?, menu?, menuLink? }` | — | Per-element class overrides |

`SiteLink` is `{ label, href, current?, external? }`, and is shared with [`ISiteFooter`](/blocks/site-footer).

## Slots

When both a prop and its matching slot are given, the slot wins.

| Slot | Description |
| --- | --- |
| `brand` | Replaces the `name` — a logo, a wordmark |
| `links` | Replaces the generated link row |
| `actions` | The right-hand end: buttons, an appearance toggle |
| `menu` | Replaces the drawer's contents. Receives `close` |

## Models

| Model | Type | Description |
| --- | --- | --- |
| `menuOpen` | `boolean` | Whether the mobile drawer is open |
