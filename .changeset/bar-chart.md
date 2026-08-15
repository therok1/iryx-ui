---
'iryx-ui': minor
---

Add `IBarChart` — a categorical bar chart in plain SVG, with the axis layer the rest of the charts will share.

The axis picks the domain rather than the data: values snap outwards to a 1/2/5 step so ticks read `0 / 2,000 / 4,000` instead of `0 / 1,726.8`, and zero is always included because bars are compared by length. Bars cap at 24px with air between them, rounded at the data end and square at the baseline. Hovering dims the rest of the series and shows a tooltip clamped inside the chart; hit targets span the full band so short bars are no harder to hit than tall ones.

The SVG is `aria-hidden` and the data is exposed as a visually-hidden table, which renders even before the container is measured. Long category labels thin to every *n*th rather than rotating.

Adds `niceTicks` to the scale helpers and a `useElementSize` composable.
