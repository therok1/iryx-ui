---
"iryx-ui": minor
---

Add `IPopover`, `IContextMenu`, `IMenubar` and `IToolbar`.

`IPopover` anchors a panel to its trigger, for content too big for a tooltip and too small for a dialog — with `modal` to trap focus when it holds a form, an optional close button the panel reserves room for, and a `close` function handed to the default slot. A width is part of the default on purpose: an unconstrained popover lets a paragraph stretch across the viewport.

`IContextMenu` and `IMenubar` share `IDropdownMenu`'s entry shape, renderer and theme rather than duplicating them — Reka's context, menubar and dropdown parts are all thin wrappers over the same `Menu` primitives, so there is one menu in this library wearing three ways of being opened. `IContextMenu` reports opening through `update:open` rather than taking a `v-model:open`: a context menu appears where the pointer is, so opening one from code would have nowhere to put it.

`IToolbar` gives a row of controls a single Tab stop with arrow keys moving between them. Its buttons are `IButton`s in ghost form, so a toolbar button and a button elsewhere cannot drift apart, and anything beyond buttons, links and separators goes in the default slot — `IToggleGroup` nests inside without fighting it for the same keys.
