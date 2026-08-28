---
'iryx-ui': patch
---

`IIcon` renders Hugeicons data icons itself instead of delegating to
`<HugeiconsIcon>`. The upstream component marks `width` and `height` as dynamic
props on the `<svg>`, so Vue patched them as DOM properties — both are read-only
`SVGAnimatedLength` getters, which logged two console warnings per icon on every
hydration. They are set as attributes now and the warnings are gone.

`ISelect` takes an `id`, which lands on the trigger so a `<label for>` names the
control. It worked through attribute fallthrough before, but was neither typed
nor documented.

`ISelect`'s trigger truncates a value too long to fit instead of wrapping it out
of the control's fixed height.
