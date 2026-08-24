---
"iryx-ui": minor
---

`ILineChart` takes a `tension` from `0` to `1`, curving the line between readings. It stays `0` by default: a curve claims the readings run continuously into each other, which is true of a temperature trace and false of six monthly totals.

Control points are clamped to the pair of readings they sit between. An unclamped spline overshoots — between a low reading and a high one it swings past both, drawing values below the smallest number in the data and above the largest.

`flush` carries the line and its fill flat out to the left and right edges of the plot, while the readings, markers and labels stay put — so the chart fills its box without pretending to know a value it was never given.

Line charts also now span the plot rather than sitting half a category clear of each edge, keeping a quarter-category inset so the end markers have somewhere to sit.
