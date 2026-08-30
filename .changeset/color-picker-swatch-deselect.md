---
"iryx-ui": patch
---

Fix `IColorPicker` breaking after the selected swatch is picked a second time. Reka reports that as an empty selection, which the picker forwarded as the string `"undefined"`; the colour field then threw while parsing it, aborting the render and leaving the controls without their element references, so every later drag threw too. A deselection is now ignored, and any unparseable model falls back to the picker's own colour.
