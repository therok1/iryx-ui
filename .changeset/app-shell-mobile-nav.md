---
"iryx-ui": minor
---

`IAppShell` turns its sidebar into a drawer on small screens. Below `md` the sidebar column is hidden and the same `#sidebar` slot renders inside a left drawer, with a trigger the shell puts in the header itself — so an app gets usable navigation on a phone without wiring anything up. `mobileNav` turns it off, `navLabel` names the trigger, and the `#sidebar` slot receives `inDrawer` so a brand or footer can differ between the two. The `#header` slot now also receives `navOpen` and `toggleNav` for apps that would rather place the trigger themselves.

The breakpoint is CSS, not a media query read in script, so server-rendered markup and the first client frame agree.

**Note for custom themes:** the header slot is now wrapped in a row (`ui.headerRow`, `ui.headerContent`) to make room for that trigger, so the bar is one level deeper in the DOM than before.
