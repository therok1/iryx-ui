---
"iryx-ui": minor
---

Add `IEditable`, text that becomes a field in place

For changing one value where it sits — a title, a table cell, a note — without a form or a dialog for a single line. Both states are plain text: no border, no box, just a caret, with a hover tint as the only chrome. `controls` adds edit, save and cancel buttons; `submitMode` decides what commits (`both` by default, so `Enter` works); `preview` re-renders the value however you like.
