---
'iryx-ui': minor
---

Add `ILineChart` — line and area charts sharing `IBarChart`'s axis layer, with a crosshair and a single hover marker rather than a dot on every point. `null` breaks the line instead of bridging it, so a missing reading never draws a slope that didn't happen.

`zero` is off by default here and always on for bars: a bar is read by length and a truncated baseline lies about the comparison, while a line is read by its shape and a forced zero flattens a high, narrow series into a straight edge.

The shared plot maths moves into `cartesianLayout` — axis, gutter, plot rectangle, band spacing and label thinning — so the two charts cannot drift apart. It is a pure function, exported and testable without mounting anything.
