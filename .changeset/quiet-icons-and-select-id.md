---
'iryx-ui': patch
---

`ISelect` takes an `id`, which lands on the trigger so a `<label for>` names the
control. It worked through attribute fallthrough before, but was neither typed
nor documented.

`ISelect`'s trigger truncates a value too long to fit instead of wrapping it out
of the control's fixed height.
