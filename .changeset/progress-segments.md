---
"iryx-ui": minor
---

`IProgress` now takes `segments` — runs that share one track, for storage by file type, a budget by category, a release by status. Each carries its own value and variant; `modelValue` is ignored and the accessible value becomes their sum.

A run with a `label` gets a legend row beneath the track. That legend is text rather than a tooltip on purpose: the runs are hidden from assistive technology through the track, so it is the only place the breakdown can be read. A run with no `variant` takes the new `neutral` fill, which reads the same as the unclaimed remainder.

Segments can sum past `max` — a disk that grew, a budget overspent — so runs are clamped cumulatively rather than scaled. The bar fills and stops instead of painting outside the track, the last run to reach the end keeps the rounded corner, and the legend still reports what each run asked for.
