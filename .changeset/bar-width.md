---
'iryx-ui': patch
---

`IBarChart` sizes bars as a share of their band instead of the band minus a fixed gap. Subtracting a constant collapsed at narrow bands — 26 categories in a phone-width card left 2px hairlines. The bar and the space beside it now shrink together, as they do in every charting library, with the 24px cap unchanged.
