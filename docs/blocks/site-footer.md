---
eyebrow: Marketing
---

# ISiteFooter

The band that closes a product site: the brand, a row of links, and the line of small print. One row on a desktop, stacked on a phone.

```vue
<ISiteFooter
  name="Iryx Billing"
  :links="[...nav, { label: 'Status', href: '/status' }, { label: 'Privacy', href: '/privacy' }]"
  note="© 2026 Iryx Billing"
/>
```

<Demo stack>
<template #demo>
<div class="w-full overflow-hidden rounded-lg border border-border">
<ISiteFooter
  :bordered="false"
  padding="sm"
  name="Iryx Billing"
  :links="[{ label: 'Features', href: '#' }, { label: 'Pricing', href: '#' }, { label: 'Status', href: '#' }]"
  note="© 2026 Iryx Billing"
/>
</div>
</template>

```vue
<ISiteFooter name="Iryx Billing" :links="nav" note="© 2026 Iryx Billing" />
```
</Demo>

Every region is optional and each is omitted rather than rendered empty, so a footer of nothing but a copyright line is one prop.

## The brand is a link only if you say so

Pass `href` and the brand becomes a link; leave it out and it renders as plain text. The page a footer sits on is usually the page its brand would point at, and a link back to where you already are is noise.

```vue
<ISiteFooter name="Iryx Billing" href="/" />
```

## Links

The same `SiteLink` shape as [`ISiteHeader`](/blocks/site-header) — `{ label, href }`, with optional `current` and `external` — so a site's navigation can be defined once and passed to both, with the footer's extras spread in:

```ts
const nav = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
]

const footerLinks = [...nav, { label: 'Privacy', href: '/privacy' }]
```

For more than one column of links, use the default slot and lay them out yourself — the footer's own row is the single-row case, and a link matrix is a grid the footer should not own.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | The product's name, in the brand |
| `href` | `string` | — | Where the brand links to; plain text without it |
| `links` | `SiteLink[]` | — | The row of links |
| `note` | `string` | — | Small print, usually a copyright |
| `bordered` | `boolean` | `true` | Rule along the top edge |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Vertical rhythm |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'xl'` | Container width |
| `as` | `string` | `'footer'` | Element to render |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, container?, brand?, nav?, link?, note? }` | — | Per-element class overrides |

## Slots

When both a prop and its matching slot are given, the slot wins.

| Slot | Description |
| --- | --- |
| `brand` | Replaces the `name` — a logo, a wordmark |
| `links` | Replaces the generated link row |
| `note` | Replaces the `note` prop |
| `default` | After the regions above — a language picker, social links |
