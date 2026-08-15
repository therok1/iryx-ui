---
'iryx-ui': patch
---

`IDialog` really does stop warning about a missing description now. Reka renders `aria-describedby` unconditionally, pointing at an id that only exists when a description was rendered, and its check tests whether the attribute is *present* — so the `aria-describedby="undefined"` its message suggests (React phrasing, where `undefined` omits the attribute) changed nothing. The attribute is now removed instead, and a dialog that does have a description keeps its wiring.
