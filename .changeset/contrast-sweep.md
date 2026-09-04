---
'iryx-ui': patch
---

Fix five WCAG contrast failures found by sweeping every component for alpha-dimmed text and `currentColor` fills, the pattern behind the earlier `IKbd` bug. Measured against a muted context in light mode, which is the binding case:

- `ICode`'s inline chip drew `text-current/90` over a `bg-current/10` fill and measured 3.5:1. Like `IKbd`, it now has a border and no fill, because a fill derived from `currentColor` tints the chip toward its own text and can only subtract contrast.
- `IKbd`'s `+` separator was `text-current/60`, at 2.3:1.
- `ICalendar`'s outside-month days were `text-muted-foreground/50`, at 2.0:1. They stay dimmer than in-month days, which use the foreground colour.
- `IRating`'s empty icons were `text-muted-foreground/40`, at 1.7:1 against the 3:1 asked of a graphic that carries meaning — they are what show the scale the value is out of.
- `ITable`'s sort icon was `text-muted-foreground/70`, at 2.7:1 against the same 3:1 for a state indicator.
