---
"iryx-ui": patch
---

Give `ICard`'s title a real line box. It was set in `leading-none`, which clamps the line to the cap height and left the description crowding it; the header now uses `leading-snug` with a slightly wider gap.
