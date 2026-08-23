---
"iryx-ui": minor
---

Add `ICollapsible` and `IColorPicker`, and give `ITree` counts.

`ICollapsible` is the bare disclosure behind `IAccordion` — one region that opens and closes, for when there are no siblings to coordinate with. It shares the accordion's height animation, so the two can never open at different speeds.

`IColorPicker` gives a saturation plane, a hue ramp, an optional opacity ramp, a hex field and optional presets. The model is a hex **string**, because a string is what goes into a stylesheet, a database column and a design token. The opacity ramp sits on a chequerboard, since transparent at one end is otherwise indistinguishable from white, and the thumbs are white rings rather than filled dots so the colour underneath stays visible.

`ITree` items take a `count`, shown against the row's trailing edge so the numbers line up in a column instead of stepping inward with every level. Rows also keep a small base inset, so a top-level chevron no longer sits flush against the tree's leading edge.
