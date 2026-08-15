---
"iryx-ui": minor
---

Add `IDrawer` — a panel or sheet attached to any viewport edge, built on Reka's drawer primitive.

`side` picks the edge (`right`, `left`, `top`, `bottom`) and doubles as the direction you drag to dismiss; `size` reads as a width on a side drawer and a maximum height on a sheet. Sheets get a drag handle by default, and `snapPoints` with `v-model:snapPoint` gives a sheet that rests part-way and can be dragged to full. `modal` accepts `'trap-focus'` for a side panel that leaves the page interactive. Slots, `dismissible`, `showClose` and `closeLabel` match `IDialog`.

This bumps `reka-ui` to `^2.10.3`, which moves the hidden form input in `Checkbox` and `Switch` from inside the control to a sibling of it, fixing a `nested-interactive` accessibility violation. Both components now bind `$attrs` explicitly so attributes still reach the control — and in the labelled layout they reach the control rather than the wrapper, which they did not before.
