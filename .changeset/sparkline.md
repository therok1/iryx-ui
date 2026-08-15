---
'iryx-ui': minor
---

Add `ISparkline` — a tiny inline trend chart, and the first piece of charting in the library. Plain SVG with no charting dependency: colour comes from `currentColor`, so it follows the theme preset and light/dark with no JavaScript, which a canvas chart cannot do.

`line` and `area` variants, an optional end dot, `min`/`max` to put several sparklines on one scale, and `null` for a genuine gap rather than a zero. Width is fluid without distorting the ink — the drawing stretches via `preserveAspectRatio="none"` while strokes use `vector-effect="non-scaling-stroke"`. Empty, flat and single-reading series all render sensibly.

Exports the scale helpers behind it (`extent`, `finiteValues`, `linearScale`) for building your own marks.
