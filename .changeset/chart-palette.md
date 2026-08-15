---
'iryx-ui': minor
---

Add eight categorical chart colours, `--iryx-chart-1` … `--iryx-chart-8`, exposed as Tailwind colours (`text-chart-3`, `fill-chart-5`). They encode series identity, never magnitude, and unblock multi-series charts.

The steps are computed rather than eyeballed: each clears a lightness band, a chroma floor of 0.10, protanopia/deuteranopia separation and contrast against its own surface. Light and dark are validated separately against their own backgrounds — dark is not a flip. Status colours are deliberately excluded, so a series in slot 4 can never read as a warning.

Documented caps: 8 series where only neighbours touch (bars, lines, stacks), 3 where any two marks can sit side by side (scatter, bubble, small multiples). Beyond those, fold into "Other" or facet — never generate a ninth hue.
