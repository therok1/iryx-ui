---
"iryx-ui": minor
---

`ICombobox` gains `clearable`. Once a value is set, the dropdown arrow becomes a clear button — clearing empties the query, returns focus to the input, and sets the model to `null`, or to `[]` when `multiple`. `clearLabel` renames it for non-English apps, and `ui.clear` styles it.

Multiple selection is now documented and covered by tests. It always worked, since `multiple` forwards to `ComboboxRoot` and the field already joined the chosen labels — but nothing said so, which made it invisible.
