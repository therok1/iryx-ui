---
"iryx-ui": patch
---

`ISkeleton` now merges `class` onto its root. With `lines` above 1 the class landed on every line instead of the wrapper, so a width cap sized each line rather than the stack and the block could not be centred by its container.
