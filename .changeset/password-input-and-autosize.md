---
'iryx-ui': minor
---

Add `IPasswordInput` — `IInput` with a reveal toggle and an optional four-segment strength meter. The score is a transparent nudge (length, mixed case, digit, symbol), not a security control; every user-facing string is overridable via `showLabel`, `hideLabel` and `strengthLabels`.

`ITextarea` gains `autosize`: `true` grows without limit, `{ min, max }` bounds it in rows and scrolls past the cap. It shrinks as well as grows and re-measures on external model writes, so a reset or prefill resizes correctly.
