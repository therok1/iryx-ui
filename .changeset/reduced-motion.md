---
"iryx-ui": minor
---

Every animation and transition now honours `prefers-reduced-motion`. The guard ships in `theme.css`, so importing it is all it takes.

Durations drop to `0.01ms` rather than the animation being removed: Reka unmounts a dialog, drawer, popover or toast when its exit animation raises `animationend`, and `animation: none` means that event never fires and the overlay stays mounted forever. The two looping indicators are handled separately, because running them once would leave them wherever their last keyframe lands — the indeterminate `IProgress` bar parks at the start of its track instead of sliding past the end of it, and `ITable`'s loading bar becomes a steady rule.

Also fixes the appearance-switch guard, which suppressed transitions during a light/dark switch and removed itself on the next animation frame. A background tab has no next frame — and a system appearance change fires there regardless — so the guard could outlive the switch and leave every transition and animation on the page dead until reload. It now clears on a timer as well, and shortens durations rather than setting `animation: none`.
