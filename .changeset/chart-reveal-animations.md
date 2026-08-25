---
"iryx-ui": minor
---

Charts now reveal themselves on their first paint

`IBarChart`, `ILineChart` and `IDonutChart` animate in by default; `ISparkline` can, and does not by default — it usually sits in a stat tile or a table row, where a page of them moving at once is a distraction. Every one of them takes `animate`: `false` to switch it off, or `{ duration, easing }` to tune it, with `easing` one of `ease-out` (the default), `ease-in`, `ease-in-out` or `linear`.

The reveal plays once per instance, never again when the data changes underneath it, and is skipped entirely for a reader who has asked for reduced motion.

`ISparkline`'s `area` wash is now the same downward-fading gradient `ILineChart` draws, rather than a flat tint.
