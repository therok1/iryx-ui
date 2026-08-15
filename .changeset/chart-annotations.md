---
'iryx-ui': minor
---

`IBarChart` and `ILineChart` take `#underlay` and `#overlay` scoped slots, both receiving the chart's `CartesianLayout` — `plot`, `value()`, `bandCentre()`, `bandWidth`, `ticks` and `orientation`. Reference lines, target bands and callouts are ordinary markup positioned by the chart's own scales.

This is the answer to "does it have plugins": no registry. Chart.js needs one because canvas is opaque and an imperative draw hook is the only way in; SVG has no such constraint, so a scoped slot does the job declaratively, reactively and with type-checking. Both slots sit below the hit targets, so hovering keeps working through whatever is drawn.
