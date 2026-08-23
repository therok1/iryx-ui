---
"iryx-ui": patch
---

`IRadioGroup`'s `orientation` now changes the layout as well as the keyboard direction. It was forwarded to Reka, so the arrow keys already followed it, but the root stayed a single-column grid — `horizontal` now wraps the options into a row.
