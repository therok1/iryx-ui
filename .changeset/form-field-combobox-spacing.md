---
"iryx-ui": patch
---

`IFormField` spaces its parts with a flex gap instead of `space-y`. Margin-based spacing puts the margin on the control element itself, and `ICombobox` renders its root as `display: contents` — a box margins do not apply to — so a combobox sat tight against its label while every other control cleared it by 8px.
