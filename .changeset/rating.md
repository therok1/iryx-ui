---
"iryx-ui": minor
---

Add `IRating` — a score out of five, read or set.

Read-only by default, because most ratings on a page are being shown rather than
collected. A fractional score is painted rather than rounded: the filled icon is
layered over the empty one and clipped, so 3.7 fills seven tenths of the fourth
icon and any icon works, not just a star.

`interactive` collects one instead. It is a single tab stop rather than one per
icon — arrow keys move by `step`, `Home` and `End` go to the ends, and a click
sets the value. `step` takes half stars or anything else.

The two modes announce differently because they are different things: read-only
is one image whose text alternative is the score, and interactive is a `slider`,
which is what the reader is actually setting and brings the arrow keys they
already expect. Both take a `label`.
