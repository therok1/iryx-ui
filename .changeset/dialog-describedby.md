---
'iryx-ui': patch
---

`IDialog` stops warning about a missing description. Reka expects a dialog with no description to opt out explicitly via `aria-describedby="undefined"`; without it every description-less dialog logged a warning, which trains people to ignore the warnings that matter. Dialogs that do have a description are unaffected.
