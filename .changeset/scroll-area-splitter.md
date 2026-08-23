---
"iryx-ui": minor
---

Add `IScrollArea` and `ISplitter`.

`IScrollArea` replaces the platform's scrollbar with a thin themed one — but only the *bar*. The viewport still scrolls natively, so wheel, trackpad, keyboard and touch behave exactly as the platform intends and none of the usual costs of hijacking scrolling apply. It is a different job from `IScrollFade`, which leaves the native bar alone and fades the content edges instead.

`ISplitter` divides resizable panes with a draggable handle, horizontally or vertically, with per-panel minimum and maximum sizes, collapsing, and an `auto-save-id` that remembers a reader's arrangement across reloads. The handle keeps a padded hit area larger than its visible rule, because a 1px target is unusable with a mouse and impossible on a trackpad.
