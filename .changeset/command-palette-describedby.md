---
'iryx-ui': patch
---

`ICommandPalette` no longer warns about a missing description. Reka renders
`aria-describedby` on every dialog, pointing at an id that exists only when a
description was rendered — a palette has none, so the attribute is removed, the
same treatment `IDialog` already had.
