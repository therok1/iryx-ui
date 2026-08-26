---
"iryx-ui": patch
---

`IAppShell` now passes `inDrawer: false` to the `sidebar` slot in the rail. It previously passed nothing there, which left the slot prop typed as `{}` and unusable.
