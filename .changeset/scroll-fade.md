---
"iryx-ui": minor
---

New component: `IScrollFade` — a scroll container whose edges fade while there is more to scroll, on either axis. It answers the question a cropped list always raises without waiting for a scrollbar to appear and say so.

The fade is a **mask**, not an overlaid gradient. An overlay has to be painted in the container's own background colour, which is a guess: on a card, a muted panel or an image the guess is visibly wrong. A mask removes pixels instead, so whatever is behind shows through and it is correct on every surface. The trade-off is that a mask applies to everything the element paints: a border on the component, its scrollbar and any `position: sticky` child fade with the content. Put the frame on a wrapper and keep sticky headers outside.

Edges are measured rather than assumed: `scroll` for position, a `ResizeObserver` on both the container and its children for extent, and a `MutationObserver` for rows added or removed, which changes the scroll extent without resizing anything already observed. There is a pixel of slack at both ends, because fractional layout leaves `scrollTop` a hair short of its maximum and an exact comparison paints a trailing fade on a list already scrolled to the bottom.

`fadeStart` / `fadeEnd` switch an edge off, `size` sets the length, and the default slot receives `{ atStart, atEnd, overflowing }` — also exposed on the root as `data-at-start`, `data-at-end` and `data-overflowing` so a "more below" hint can be pure CSS.
