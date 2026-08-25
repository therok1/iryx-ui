---
"iryx-ui": patch
---

Clearing an `ICombobox` no longer changes the model's type

`ComboboxCancel` writes `null` — Reka's one empty value for every model it supports — so a caller holding a string was handed `null`. The next `.trim()` or `.toLowerCase()` on it threw, and when that call sat inside a validator the throw read as *valid*: the field the reader had just emptied showed no error at all.

A string model now clears to `''`. Arrays still clear to `[]` and everything else to `null`.
