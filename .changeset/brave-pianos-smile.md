---
"iryx-ui": minor
---

Soften the shared corner radius. Buttons, fields, cards, alerts, dialogs, menus, tabs, toasts, tooltips and the rest move from `rounded-lg` to `rounded-xl`, so surfaces and the controls sitting on them agree. Purely visual — no API changes.

The `outline` button now sits on `--iryx-input` rather than `--iryx-background`, joining the fields as a recessed control. That token is flat in light mode and lifted in dark, where the lift is legible, which keeps mode-specific classes out of components.
