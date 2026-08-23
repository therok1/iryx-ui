---
"iryx-ui": minor
---

Add `ITree` and `ITimeField`.

`ITree` is an expandable nested list — a file browser, a category hierarchy. Both models are arrays of **values**: `v-model` for what is selected, `v-model:expanded` for what is open. Reka tracks the selection as item objects; that stays inside the component, because a list of strings is what survives a round trip through a URL, a store or a request body. Depth is padding on the row rather than a nested container, so a row's hover and selection background still spans the full width of the tree.

`ITimeField` enters a time one segment at a time, each its own arrow-key control. The model is a zero-padded `HH:mm` (or `HH:mm:ss`) **string** on a 24-hour clock, never a `Date` — a `Date` carries a date and a time zone nobody asked for, and padding means the value sorts and compares as a plain string. `hourCycle` is a display choice only; the model stays 24-hour either way. `toTime()` and `toIsoTime()` are exported alongside the existing date helpers.
