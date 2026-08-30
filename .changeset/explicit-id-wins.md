---
"iryx-ui": patch
---

An explicit `id` on a control inside a `FormField` is now what the field's label points at. Previously only `Select`, `PinInput`, `Checkbox` and `Switch` wrote their id back to the field, so `<IInput id="login-email">` left the label pointing at the field's generated id and the control unlabelled for screen readers. `Editable` also renders its id on the input element rather than only on the root.
