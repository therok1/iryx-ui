---
"iryx-ui": minor
---

Add `ICombobox`, a searchable select for lists too long to scroll. It takes the same `items` as `ISelect`, filters them as you type, and shows the selected option's label while the model holds its value. Set `create` to offer a row for an unmatched query — choosing it emits `create` with the query rather than selecting it, so the caller decides what the new option's value is. `emptyText` and `createLabel` are props so no English string is baked in.

`ICheckbox` and `ISwitch` now show the focus ring on any focus, not just keyboard focus, matching what `IInput` does when clicked. `ISwitch`'s offset outline is replaced by that same ring.
