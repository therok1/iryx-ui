---
'iryx-ui': patch
---

`ISparkline` keeps its marks inside its own box. Marks are centred on their data point, so the end dot sat exactly on the corner of the drawing and half its 12px ring painted outside the component — invisible inside a padded card, bleeding into the neighbour in a table cell. The plot is now inset by the mark's radius, taken out of the drawing rather than added around it, so the height a caller reserves is still the height the sparkline occupies.
