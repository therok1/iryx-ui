---
"iryx-ui": patch
---

`ILineChart` curves are now a monotone cubic: smooth through every reading, peaks and `flush` extensions included, and still never overshooting the data. Stacked bands also carry their base edge out to the plot edges under `flush`.
