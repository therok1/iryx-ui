---
'iryx-ui': minor
---

`IBarChart` takes `stacked`, collapsing grouped series into one bar per category. The axis sizes against running totals, only the outermost segment is rounded so the cap still reads as the tip of the total, segments are separated by surface rather than a stroke, and the tooltip gains a `Total` row (`totalLabel` renames it).

Negatives stack away from zero independently of positives, so a mixed stack shows both sides at full length instead of netting into a shorter bar. Stacking is ignored for a single series, and works in both orientations.
