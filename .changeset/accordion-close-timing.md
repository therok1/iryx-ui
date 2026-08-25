---
"iryx-ui": patch
---

`IAccordion` closes at the speed it opens

Its panels move in pairs — one shutting while its sibling unrolls — and the close was 60ms quicker than the open, so the shrinking panel finished first. For those 60ms the page was shorter than either end state, and everything below the accordion rode up a few pixels and dropped back.

`ICollapsible` keeps the quicker close, where nothing is opening into the space it leaves.
