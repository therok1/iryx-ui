---
"iryx-ui": minor
---

**Breaking (small):** `INumberInput`'s `class` now lands on the root rather than on the `<input>`.

The stepper is positioned against the root and the input fills it, so a width written through `class` narrowed the field while leaving the arrows pinned to the root's far edge — floating in space beside the control. Sizing the box that defines the field is the only placement where the two cannot come apart, and it matches `IInput`, whose `class` already goes to the element carrying the field chrome.

Reach the input itself with `ui.input`. Attributes are unaffected: they still go to the `<input>`, so `aria-label` continues to name the control. If you were working around the old behaviour with `:ui="{ root: 'max-w-xs' }"`, that still works — `class` now does the same thing.
