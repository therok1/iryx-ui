---
"iryx-ui": patch
---

`IStat`'s `trend` no longer turns the arrow around. It is documented as a colour override — for the case where down is the good direction, like a falling overdue total — but it also flipped the arrow, so `:delta="-14" trend="up"` rendered "↑ -14%", an arrow contradicting the signed number printed beside it.

The arrow now follows the sign of `delta` and `trend` colours it, which is what the prop always said it did.
