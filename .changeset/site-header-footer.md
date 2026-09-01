---
"iryx-ui": minor
---

Add `ISiteHeader` and `ISiteFooter`, the chrome around a marketing page.

`ISiteHeader` is the bar across the top: the brand, the section links, a slot
for the buttons that matter, and — below `md` — the links folded into a drawer
behind a menu button. It sticks to the top with a blur under it by default. The
menu button is rendered only when the links or the `menu` slot give it something
to open, and `v-model:menu-open` lets a page close the drawer itself after
routing.

`ISiteFooter` is the band that closes the page: the brand, a row of links and a
line of small print, in one row on a desktop and stacked on a phone. Its brand
is a link only when given an `href`, since the page a footer sits on is usually
the one its brand would point at.

Both take the same `SiteLink` shape — `{ label, href, current?, external? }` —
so a site's navigation is defined once and passed to each.
