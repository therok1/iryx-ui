---
'iryx-ui': minor
---

Add `variant="stacked"` to `ILineChart`: each series sits on the one before it, so the bands abut instead of overlapping and the top edge reads as the total. The axis always includes zero and a gap counts as no contribution rather than breaking the band.

Fix the reveal animation never playing for `variant="line"`. Its clip path was rendered only alongside the area wash, so a plain line referenced an id that did not exist.
