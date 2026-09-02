---
"iryx-ui": minor
---

Add `--iryx-radius`, a single token for the corner radius of the whole library.

Tailwind's radius scale is now derived from it — `rounded-lg` is the token
itself, and every other step is a multiple — so an app squares itself off with
`--iryx-radius: 0` or softens with `--iryx-radius: 1rem`, the same way
`--iryx-font-sans` swaps the typeface. At the default `0.5rem` every step
resolves to the value Tailwind already shipped, so nothing moves until the knob
is turned. `rounded-full` is untouched.
