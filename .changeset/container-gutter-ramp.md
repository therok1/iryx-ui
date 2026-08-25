---
"iryx-ui": patch
---

`IContainer`'s gutters now respond to the viewport

Each gutter was a single value at every width — `md` was `px-6` on a 360px phone and on a 2560px monitor alike. A fixed gutter has to pick a side, and the middle is wrong at both ends: too much of a narrow screen spent on margins, too little breathing room on a wide one.

`sm` is now `px-3 sm:px-4`, `md` is `px-4 sm:px-6 lg:px-8`, and `lg` is `px-6 sm:px-8 lg:px-12`. `gutter="none"` is unchanged, and remains the way to set one fixed value of your own.
