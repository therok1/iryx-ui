---
'iryx-ui': patch
---

`IPasswordInput` hides Edge's native reveal and clear controls. Edge draws its own eye on `input[type=password]`, and its own clear cross once the field is revealed, so the field showed two of each in that browser.
