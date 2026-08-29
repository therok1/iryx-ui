---
'iryx-ui': patch
---

Controls inside an `IFormField` are wired to it properly.

`ISelect`, `ICheckbox`, `ISwitch` and `IPinInput` now take the id the field's
`<label for>` points at, so the label names the control instead of pointing at
an element that does not exist. `IRadioGroup` and `ISlider` cannot be targeted
by a `for` at all, so they take the field's label through `aria-labelledby` and
release the id — the field then renders no `for` rather than a dangling one.
`IFormField` publishes a `labelId` alongside `id` for that, and its `id` is now
writable, so a control with its own `id` writes it back.

`ISelect`, `ICheckbox`, `ISwitch` and `IRadioGroup` gain an `invalid` prop with
the border and ring treatment the text inputs already had, and report
`aria-invalid`. Like the other controls, they take the state from the enclosing
`IFormField` when the prop is omitted, so a failing field now looks and reads as
failing rather than only showing a message underneath.
