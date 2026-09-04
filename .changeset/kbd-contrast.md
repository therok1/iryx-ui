---
'iryx-ui': patch
---

Fix `IKbd` failing WCAG AA contrast. The key text was drawn at 75% of `currentColor` over a `currentColor` fill, which measured 2.8:1 against a muted context in light mode. The text is now full strength and the fill is gone, so a chip no longer lowers the contrast of the text it sits in; the border carries the key-cap shape.
