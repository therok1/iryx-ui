---
"iryx-ui": minor
---

Add `ISlider` — a value or a range on one track, with an optional label, live value and min/max scale.

The model keeps whatever shape you give it: a plain number stays a number, an array stays an array, so a slider drops into an existing form without reshaping the model around it. `formatValue` drives the readout, the scale captions and each thumb's accessible label together, and `valueCommit` fires once when the drag ends for the value worth saving.
