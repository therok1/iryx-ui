---
"iryx-ui": minor
---

Add `IEditable`, text that becomes a field in place

For changing one value where it sits — a title, a table cell, a note — without a form or a dialog for a single line. Both states are plain text: no border, no box, just a caret, with a hover tint as the only chrome. `controls` adds edit, save and cancel buttons; `submitMode` decides what commits (`both` by default, so `Enter` works); `preview` re-renders the value however you like.

Blur is handled here rather than by Reka, whose blur-commit rides on its dismissable-layer stack and treats a second editable further down the page as a layer above the first — leaving it stuck in edit mode until something else was clicked.
