---
"iryx-ui": patch
---

`ITimeField` now honours `minValue` and `maxValue`

They were decorative. Reka computes the out-of-range state and exposes it as `data-invalid`, but nothing styled that attribute and nothing set `aria-invalid`, so a time outside the range was accepted in silence. It now marks the field invalid the same way the `invalid` prop and `IFormField` do — and a caller's `invalid: false` cannot suppress it, since being out of range is a fact about the value.
