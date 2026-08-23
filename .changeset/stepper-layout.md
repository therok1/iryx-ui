---
"iryx-ui": patch
---

`IStepper` layout fixes. Vertical steps laid the separator out beside the trigger instead of below it, because the item stayed a flex row — the rule now runs down between the steps, aligned to the centre of the indicator. In horizontal steppers the last item no longer claims an equal share of the row: it has no separator to fill, so the track used to end in a step-wide gap that read as the whole stepper being shifted left.
