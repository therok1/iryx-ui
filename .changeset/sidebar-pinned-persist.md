---
"iryx-ui": minor
---

feat(sidebar): pinned bottom sections and a remembered collapsed state

- `pinned: true` on a section moves it to the bottom of the column, above the footer.
- `useSidebarCollapsed()` keeps the collapsed state in a cookie. The Nuxt module reads it on the server, so a collapsed sidebar renders collapsed with no flash.
- `IInput` and `ITextarea` accept `maxlength` as a string, so `maxlength="20"` works like the HTML attribute.
