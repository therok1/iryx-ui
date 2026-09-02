---
"iryx-ui": minor
---

Add `shape="circle"` to `IProgress` — the same value drawn as a ring, with the
readout in its middle.

Everything else carries over: `variant`, `size`, `formatValue`, `label` and the
indeterminate mode, which spins a quarter arc rather than animating a bar. The
ring is drawn in a 0-100 viewBox, so its stroke scales with the diameter and
every size keeps the same relative thickness.

An `angle` shortens the track to part of a circle — 180 for a half, 270 for a
gauge — centred at the top, with the value measured against that track rather
than the whole ring.

A ring ignores `segments`. A broken-up ring is a donut chart, and `IDonutChart`
already covers that.
