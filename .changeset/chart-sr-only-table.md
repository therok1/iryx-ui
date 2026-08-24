---
"iryx-ui": patch
---

`ILineChart` and `IBarChart` no longer add their own height to the page's scroll area. The accessible data table carried `sr-only` directly, but a table treats a specified width as a *minimum* and refuses to shrink below its content — so the table stayed at full size, absolutely positioned and still measured. A page with two charts grew a second scrollbar behind the app. The class moves to a wrapping `div`, which honours the 1px box and clips the table inside it.
