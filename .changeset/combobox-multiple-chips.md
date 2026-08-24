---
"iryx-ui": minor
---

A `multiple` `ICombobox` now draws each chosen value as a removable chip inside the field instead of joining the labels into one comma-separated string. The input stays a query box and shares the chips’ line whenever there is room for it, chips are removed with their cross or with Backspace while the query is empty, and the field wraps and grows rather than clipping — matching `ITagsInput`, whose chip styling it shares.

A `tag` slot replaces a chip's contents, `removeLabel` names the remove button for non-English apps, and `ui.tag` / `ui.tagText` / `ui.tagDelete` style the parts.
