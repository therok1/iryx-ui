---
"iryx-ui": minor
---

Add `card` and `tile` shapes to `IRadioGroup` and `ICheckbox` through a new
`variant` prop.

`card` makes the whole bordered surface the control, for options that carry a
description; `tile` centres an icon above the label, for a short row of choices
read at a glance. Items gain an `icon`, which the tile renders and the other
shapes ignore. The default stays the circle or box beside its label, unchanged.

Both new shapes put the text inside the control, so they are named through
`aria-labelledby` — naming them by content would read the description out as
part of the option's name.
