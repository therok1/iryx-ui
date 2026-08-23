---
"iryx-ui": minor
---

Add `ISignaturePad` — a signature drawn with a pointer, or typed by anyone who cannot.

The first component here that is not a Reka wrapper: canvas and pointer events all the way down. The pen thins as the hand speeds up, because a constant width reads as a traced outline rather than handwriting; the canvas is backed at the device's pixel ratio, so a signature is not soft on a modern screen; and the surface sets `touch-action: none`, without which a finger signature scrolls the page instead of drawing.

The typed field is on by default and is not a nicety — a canvas cannot be drawn on with a keyboard, so without it the control is unusable for anyone who does not point. The typed name is rendered onto the same canvas in a script face, so the model is a PNG data URL either way and nothing downstream has to know which route was taken. `null` when unsigned, so `required` works in an `IForm` without a special case, and a one-point stroke does not count as a signature.
