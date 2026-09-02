---
"iryx-ui": minor
---

Add `ICarousel` — a row of slides you page through, with arrows, dots and the
arrow keys.

The track is a scroll container with CSS scroll snapping rather than a
transform-driven rail, so touch, trackpad, shift-scroll and a dragged scrollbar
all work with no code behind them, and they behave the way they do everywhere
else on the reader's machine. The arrows scroll it; they do not drive it. That
also means the active slide is measured from the scroll position rather than
remembered, so swiping by hand keeps the dots in step.

`perView` takes one to four across, or `'auto'` for slides that know their own
width. Below `sm` it is always one. The arrows disable at each end and are
dropped entirely when everything already fits.

`v-model:active` goes both ways: it reads back from the scroll position, and setting it from outside scrolls the track — so a timer, a thumbnail strip or a router can drive it.

There is deliberately no autoplay. Movement that starts on its own needs a pause
control to meet WCAG, has to stop for `prefers-reduced-motion`, and has to yield
the moment someone touches it — drive `v-model:active` from your own timer if a
page really needs it.
