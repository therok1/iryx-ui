---
"iryx-ui": patch
---

`IAppShell` in `scroll="page"` mode now gives its sidebar the full height below the header instead of a maximum. `self-start` — which is what makes the sticky offset work — also collapsed the rail to the height of its own items, so a short navigation left the panel, its border and its background floating mid-page.
