---
"iryx-ui": patch
---

`ILineChart`'s `area` variant fills with a downward gradient rather than one flat tint, so the line stays the strongest thing in the plot and the wash reads as depth under it. The gradient id comes from `useId`, so two charts on a page cannot share one.
