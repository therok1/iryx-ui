---
"iryx-ui": patch
---

`ICombobox`'s chips are Reka's `TagsInput`

The chips were hand-built markup, so the keyboard had only what was written for it: Backspace removed the last chip outright and nothing else worked. They are `TagsInput` items now, composed inside the anchor as Reka's own docs do — arrow keys move between chips, the first Backspace marks the last one and the next removes it, matching `ITagsInput`.

A multiple field also keeps its size's height as a floor. One chip is shorter than a line of text, so it used to sit 2px below every other field in its row.
