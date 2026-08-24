---
"iryx-ui": minor
---

Export `IIcon` and the `IconLike` type. It is the icon renderer every other component already used internally — it takes both shapes an icon comes in, a Hugeicons data array or any component that renders an SVG, so your own controls can accept an `icon` prop on the same terms the library does.

Icons stay decorative by default (`aria-hidden`). A new `label` prop swaps that for `role="img"` and an `aria-label`, for the case where the icon is the only thing naming a control.
