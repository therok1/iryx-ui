---
"iryx-ui": patch
---

Animate the focus ring on every component, not just the four that happened to.

The ring faded in on `IButton`, `IPagination`, `ISlider` and `IToggle` because
their transition property lists included `box-shadow`; everywhere else it
snapped on, since `transition-colors` excludes it. Every component that paints a
focus ring now transitions it at the same 150ms, so tabbing through a form no
longer mixes the two behaviours.
