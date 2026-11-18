---
'iryx-ui': minor
---

feat(app-shell)!: the shell is now a grey canvas with the sidebar sitting on it, and the header, page and footer in one rounded card beside it. The shell draws the rules between header, page and footer itself, and an `ISidebar` inside it drops its border and fill. Below `md` the card fills the screen. New `--iryx-canvas` token (`canvas` in `applyTheme`) and `ui.panel` slot. Remove the borders your own header and footer bars drew, and move a logo from the header into the sidebar's `#header` slot, since the header no longer spans the sidebar.
