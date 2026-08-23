---
"iryx-ui": minor
---

Add `IToggle` and `IToggleGroup` — a button that stays pressed, and a row of them sharing one Tab stop.

`IToggle` borrows `IButton`'s geometry exactly: the same five heights, so the two line up in a toolbar, and the same `data-icon="inline-start"` / `"inline-end"` markers, so the padding tightens on the side an icon sits on. There is one look on purpose — a toggle has to read as a button whether or not it is pressed.

`IToggleGroup` is items-driven like `ITabs` and works in `single` or `multiple` mode. Its `joined` and `plain` variants decide only how the items are spaced, since an item is exactly the button `IToggle` renders. With `icon-only`, each item's hidden label becomes its accessible name rather than being thrown away.
