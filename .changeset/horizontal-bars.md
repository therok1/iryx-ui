---
'iryx-ui': minor
---

`IBarChart` takes `orientation="horizontal"`, running the categories down the side.

This is the answer to the limitation the vertical chart documents: colliding labels get thinned to every *n*th, which is fine for `Jan` / `Feb` and lossy for `Travel and accommodation`. Turned on its side, the names get real width and none are dropped. Grouped series, the tooltip and the zero-anchored axis all behave as before.

The tooltip is placed past the bar's tip rather than over it, flipping inside when a long bar leaves no room — the end of the bar is the reading, so covering it defeats the purpose.
